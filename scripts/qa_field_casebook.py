#!/usr/bin/env python3
from pathlib import Path
from math import floor
import json
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[1]
errors=[]

def expect(ok,msg):
    if not ok: errors.append(msg)

def read(path):
    p=ROOT/path
    if not p.is_file():
        errors.append(f'missing file: {path}')
        return ''
    return p.read_text(encoding='utf-8')

def add_points(scores,points):
    for role in ('eng','con','pm'):
        scores[role]+=float((points or {}).get(role,0))

def js_round_nonnegative(value):
    return floor(max(0,value)+0.5)

def golden_path(case):
    """Brute-force Evidence subsets and safe actions using the same scoring contract as app.js."""
    evidence=case.get('evidence',[])
    safe_actions=[a for a in case.get('actions',[]) if a.get('safe') is True]
    correct_verifications=[v for v in case.get('verifications',[]) if v.get('correct') is True]
    required_layers=3 if case.get('id',0)>=7 else 2
    best=None

    for mask in range(1<<len(evidence)):
        picked=[e for i,e in enumerate(evidence) if mask&(1<<i)]
        time=24-sum(int(e.get('cost',0)) for e in picked)
        layers={e.get('layer') for e in picked if e.get('layer')}
        if time<0 or len(layers)<required_layers:
            continue
        picked_ids={e.get('id') for e in picked}

        for action in safe_actions:
            scores={'eng':20.0,'con':20.0,'pm':20.0}
            # Correct Impact decision.
            scores['con']+=10;scores['pm']+=10
            for e in picked:add_points(scores,e.get('points'))
            # Learner tracks and marks the correct hypothesis hot, then declares both causes correctly.
            scores['eng']+=8+5+18;scores['con']+=8+10;scores['pm']+=6
            add_points(scores,action.get('points'))
            if any(req not in picked_ids for req in action.get('need',[])):
                scores['eng']-=8;scores['pm']-=5
            for verification in correct_verifications:
                add_points(scores,verification.get('points'))
            # Correct status communication.
            scores['con']+=8;scores['pm']+=15
            over=max(0,len(picked)-4);low=max(0,7-time)
            scores['eng']-=over*3+low*0.5
            scores['con']-=over*1.5
            scores['pm']-=over*4+low
            rounded={k:min(100,js_round_nonnegative(v)) for k,v in scores.items()}
            candidate=(min(rounded.values()),sum(rounded.values()),time,rounded,sorted(picked_ids))
            if best is None or candidate[:3]>best[:3]:
                best=candidate
    return best

cases_files=[f'field-casebook/cases-{i}.js' for i in range(1,6)]
read('field-casebook/cases.js')
app=read('field-casebook/app.js')
index=read('field-casebook/index.html')
style=read('field-casebook/style.css')
links=read('assets/js/field-case-links.js')
link_css=read('assets/css/field-case-links.css')
home=read('index.html')
home_js=read('assets/js/home-v3.js')
sources=read('docs/FIELD_CASE_SOURCES.md')
readme=read('field-casebook/README.md')
package=read('PACKAGE_STANDARD.md')
curriculum=read('CURRICULUM.md')

try:
    script="global.window={};require('./field-casebook/cases.js');"+''.join(f"require('./{x}');" for x in cases_files)+"process.stdout.write(JSON.stringify(window.FIELD_CASES));"
    out=subprocess.run(['node','-e',script],cwd=ROOT,text=True,capture_output=True,check=True).stdout
    cases=json.loads(out)
except Exception as e:
    cases=[]
    errors.append(f'field cases load failed: {e}')

expect(len(cases)==10,f'Field Incident Gate must have exactly 10 cases; got {len(cases)}')
expect([c.get('id') for c in cases]==list(range(1,11)),'Field case ids must be 1..10 in order')
allowed_modules={'linux','sql','cobol','jcl','cloud','aws','gcp','azure','pm'}
golden_results=[]
for c in cases:
    cid=c.get('id')
    for required in ('title','brief','modules','hypotheses','root','contrib','evidence','actions','verifications','sources','recommended'):
        expect(bool(c.get(required)),f'case {cid}: missing {required}')
    expect(set(c.get('modules',[])).issubset(allowed_modules),f'case {cid}: unknown module id')
    expect(len(c.get('hypotheses',[]))>=4,f'case {cid}: at least four hypotheses required')
    expect(len(c.get('evidence',[]))>=5,f'case {cid}: at least five Evidence choices required')
    expect(len({e.get('layer') for e in c.get('evidence',[]) if e.get('layer')})>=3,f'case {cid}: Evidence must cover at least three layers')
    expect(any(a.get('safe') is True for a in c.get('actions',[])),f'case {cid}: safe recovery missing')
    expect(any(a.get('safe') is False for a in c.get('actions',[])),f'case {cid}: unsafe alternative missing')
    expect(any(v.get('correct') is True for v in c.get('verifications',[])),f'case {cid}: correct verification missing')
    expect(all(str(s.get('url','')).startswith('https://') for s in c.get('sources',[])),f'case {cid}: source URLs must be HTTPS')
    expect(any('Official' in s.get('kind','') or 'Regulator' in s.get('kind','') for s in c.get('sources',[])),f'case {cid}: official or regulator source required')
    for module,lab_ids in c.get('recommended',{}).items():
        expect(module in allowed_modules-{ 'pm' },f'case {cid}: recommended unknown module {module}')
        expect(all(isinstance(x,int) and 1<=x<=20 for x in lab_ids),f'case {cid}: recommended Labs must be 1..20')
    best=golden_path(c)
    expect(best is not None,f'case {cid}: no playable Evidence/action path')
    if best is not None:
        golden_results.append((cid,best[3]))
        expect(best[0]>=80,f'case {cid}: best verified path cannot reach 80x3; best={best[3]}, evidence={best[4]}')

kinds=' '.join(s.get('kind','') for c in cases for s in c.get('sources',[]))
expect('Qiita' in kinds,'At least one Qiita source required')
expect('note' in kinds,'At least one note source required')
expect('Newspaper' in kinds,'At least one newspaper-operated source required')

for marker in (
    "const key=id=>'field_case_'+id+'_result'",
    'EVIDENCE BOARD','HYPOTHESIS BOARD','CAUSE DECLARATION',
    'Source reveal','SOURCE REVEAL',
    "st.scores.eng>=80&&st.scores.con>=80&&st.scores.pm>=80",
    'function preview(c)','function renderInvestigation()','function renderResolution()',
):
    expect(marker in app,f'field-casebook app invariant missing: {marker}')

preview_segment=app.split('function preview(c)',1)[1].split('function start(c)',1)[0] if 'function preview(c)' in app else ''
expect('.sources' not in preview_segment and 'SOURCE REVEAL' not in preview_segment,'Preview must not expose source identity before result')
expect('c.confidence' not in preview_segment and 'c.recommended' not in preview_segment,'Preview must not expose confidence map or recommended Lab hints before result')

for marker in ('.fgCaseGrid{','.fgInvestigationGrid{','.fgEvidenceBoard{','.fgHypothesisBoard{','.fgSources{'):
    expect(marker in style,f'Field Case CSS missing: {marker}')
for marker in ('cases.js','cases-5.js','app.js','style.css'):
    expect(marker in index,f'field-casebook/index.html missing {marker}')
expect('field-casebook/' in home,'Root home must link Field Incident Gate')
expect('data-route-step="field"' in home,'Root learning route must include Field Incident Gate')
expect('field_case_' in home_js,'Root progress script must track Field Incident Gate')
expect('Field Incident Gate' in readme and '10 Public-Report Reconstructions' in readme,'Field Case README incomplete')
expect('Case 10' in sources and 'Qiita' in sources and 'note' in sources,'Source register incomplete')
expect('War Room Link / Public Incident Transfer' in package,'Package Standard must require public-incident transfer')
expect('Field Incident Gate' in curriculum and '80 / 100' in curriculum,'Curriculum must document Field Incident Gate sign-off')

for module in ('sql','cobol','jcl','cloud','aws','gcp','azure'):
    body=read(f'{module}/index.html')
    expect('field-case-links.js' in body,f'{module}: War Room Link script missing')
linux_bridge=read('linux/integration-bridge.js')
expect('field-case-links.js' in linux_bridge,'Linux integration bridge must load War Room Link')
expect('field-casebook/' in links and 'cases-5.js' in links,'War Room Link must load canonical Field Case chunks')
expect('const SKILL=' not in links,'War Room Link must not reveal solution-oriented skill summaries before challenge')
expect('c.subtitle' in links,'War Room Link should show neutral incident symptoms')
for forbidden in ('c.root','c.contrib','c.rootExplain','c.confidence','c.recommended'):
    expect(forbidden not in links,f'War Room Link leaks pre-result hint: {forbidden}')
expect('field-link-panel' in links and '.field-link-panel{' in link_css,'War Room Link UI missing')

if errors:
    print('Field Incident Gate QA FAILED')
    for e in errors: print(' - '+e)
    sys.exit(1)

print('Field Incident Gate QA PASSED')
print(' - 10 source-grounded reconstructed cases')
print(' - official source per case + Qiita/note/newspaper source mix')
print(' - no-spoiler Lab links and case previews')
print(' - free investigation / Evidence / Hypothesis / cause declaration')
print(' - verified golden path reaches tri-role 80 for every case')
for cid,scores in golden_results:print(f'   case {cid:02}: {scores}')
print(' - War Room Links across all learning modules')
