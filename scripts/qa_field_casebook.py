#!/usr/bin/env python3
from pathlib import Path
import json
import re
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

cases_files=[f'field-casebook/cases-{i}.js' for i in range(1,6)]
cases_init=read('field-casebook/cases.js')
app=read('field-casebook/app.js')
index=read('field-casebook/index.html')
style=read('field-casebook/style.css')
links=read('assets/js/field-case-links.js')
link_css=read('assets/css/field-case-links.css')
home=read('index.html')
home_js=read('assets/js/home-v3.js')
sources=read('docs/FIELD_CASE_SOURCES.md')
readme=read('field-casebook/README.md')

try:
    import subprocess
    script="global.window={};require('./field-casebook/cases.js');"+''.join(f"require('./{x}');" for x in cases_files)+"process.stdout.write(JSON.stringify(window.FIELD_CASES));"
    out=subprocess.run(['node','-e',script],cwd=ROOT,text=True,capture_output=True,check=True).stdout
    cases=json.loads(out)
except Exception as e:
    cases=[]
    errors.append(f'field cases load failed: {e}')

expect(len(cases)==10,f'Field Incident Gate must have exactly 10 cases; got {len(cases)}')
expect([c.get('id') for c in cases]==list(range(1,11)),'Field case ids must be 1..10 in order')
for c in cases:
    cid=c.get('id')
    for key in ('title','brief','modules','hypotheses','root','contrib','evidence','actions','verifications','sources'):
        expect(bool(c.get(key)),f'case {cid}: missing {key}')
    expect(len(c.get('hypotheses',[]))>=4,f'case {cid}: at least four hypotheses required')
    expect(len(c.get('evidence',[]))>=5,f'case {cid}: at least five Evidence choices required')
    expect(len({e.get('layer') for e in c.get('evidence',[]) if e.get('layer')})>=3,f'case {cid}: Evidence must cover at least three layers')
    expect(any(a.get('safe') is True for a in c.get('actions',[])),f'case {cid}: safe recovery missing')
    expect(any(a.get('safe') is False for a in c.get('actions',[])),f'case {cid}: unsafe alternative missing')
    expect(any(v.get('correct') is True for v in c.get('verifications',[])),f'case {cid}: correct verification missing')
    expect(all(str(s.get('url','')).startswith('https://') for s in c.get('sources',[])),f'case {cid}: source URLs must be HTTPS')

kinds=' '.join(s.get('kind','') for c in cases for s in c.get('sources',[]))
expect('Official' in kinds or 'Regulator' in kinds,'Official/regulator sources required')
expect('Qiita' in kinds,'At least one Qiita source required')
expect('note' in kinds,'At least one note source required')
expect('Newspaper' in kinds,'At least one newspaper-operated source required')

for marker in (
    "const key=id=>'field_case_'+id+'_result'",
    'EVIDENCE BOARD',
    'HYPOTHESIS BOARD',
    'CAUSE DECLARATION',
    'Source reveal',
    'SOURCE REVEAL',
    "st.scores.eng>=80&&st.scores.con>=80&&st.scores.pm>=80",
    'function preview(c)',
    'function renderInvestigation()',
    'function renderResolution()',
):
    expect(marker in app,f'field-casebook app invariant missing: {marker}')

preview_segment=app.split('function preview(c)',1)[1].split('function start(c)',1)[0] if 'function preview(c)' in app else ''
expect('.sources' not in preview_segment and 'SOURCE REVEAL' not in preview_segment,'Preview must not expose source identity before result')

for marker in ('.fgCaseGrid{','.fgInvestigationGrid{','.fgEvidenceBoard{','.fgHypothesisBoard{','.fgSources{'):
    expect(marker in style,f'Field Case CSS missing: {marker}')
for marker in ('cases.js','app.js','style.css'):
    expect(marker in index,f'field-casebook/index.html missing {marker}')
expect('field-casebook/' in home,'Root home must link Field Incident Gate')
expect('data-route-step="field"' in home,'Root learning route must include Field Incident Gate')
expect('field_case_' in home_js,'Root progress script must track Field Incident Gate')
expect('Field Incident Gate' in readme and '10 Public-Report Reconstructions' in readme,'Field Case README incomplete')
expect('Case 10' in sources and 'Qiita' in sources and 'note' in sources,'Source register incomplete')

for module in ('sql','cobol','jcl','cloud','aws','gcp','azure'):
    body=read(f'{module}/index.html')
    expect('field-case-links.js' in body,f'{module}: War Room Link script missing')
linux_bridge=read('linux/integration-bridge.js')
expect('field-case-links.js' in linux_bridge,'Linux integration bridge must load War Room Link')
expect('field-casebook/' in links and 'cases-5.js' in links,'War Room Link must load the canonical Field Cases chunks')
expect('field-link-panel' in links and '.field-link-panel{' in link_css,'War Room Link UI missing')

if errors:
    print('Field Incident Gate QA FAILED')
    for e in errors: print(' - '+e)
    sys.exit(1)

print('Field Incident Gate QA PASSED')
print(' - 10 source-grounded reconstructed cases')
print(' - Official + Qiita + note + newspaper source mix')
print(' - free investigation / Evidence / Hypothesis / cause declaration')
print(' - tri-role 80-point sign-off and progress contract')
print(' - War Room Links across all learning modules')
