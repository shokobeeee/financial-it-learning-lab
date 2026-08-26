#!/usr/bin/env python3
from pathlib import Path
import json
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[1]
errors=[]

def read(path):
    p=ROOT/path
    if not p.is_file():
        errors.append(f'missing file: {path}')
        return ''
    return p.read_text(encoding='utf-8')

def expect(ok,msg):
    if not ok:errors.append(msg)

index=read('java/index.html')
style=read('java/style.css')
app='\n'.join(read(x) for x in ('java/app-core.js','java/app-warroom.js','java/app-entry.js'))
labs_src='\n'.join(read(f'java/labs-{i}.js') for i in range(1,6))
readme=read('java/README.md')
doc=read('docs/ENTERPRISE_JAVA_APPLICATION.md')
home=read('index.html')
home_js=read('assets/js/home-v3.js')
field_links=read('assets/js/field-case-links.js')
workflow=read('.github/workflows/qa.yml')
repo_readme=read('README.md')
curriculum=read('CURRICULUM.md')
standard=read('PACKAGE_STANDARD.md')
references=read('REFERENCES.md')

try:
    script="global.window={};require('./java/labs.js');"+''.join(f"require('./java/labs-{i}.js');" for i in range(1,6))+"process.stdout.write(JSON.stringify(window.JAVA_LABS));"
    out=subprocess.run(['node','-e',script],cwd=ROOT,text=True,capture_output=True,check=True).stdout
    labs=json.loads(out)
except Exception as e:
    labs=[];errors.append(f'Java labs load failed: {e}')

expect(len(labs)==20,f'Java package must contain exactly 20 Labs; got {len(labs)}')
expect([x.get('id') for x in labs]==list(range(1,21)),'Java Lab ids must be exactly 1..20')
expected_phases={1:'build',5:'build',6:'guided',10:'guided',11:'diagnose',15:'diagnose',16:'operate',19:'operate',20:'warroom'}
for lab_id,phase in expected_phases.items():
    if len(labs)>=lab_id:expect(labs[lab_id-1].get('phase')==phase,f'Java Lab{lab_id:02} phase must be {phase}')

for lab in labs:
    i=lab.get('id')
    for key in ('title','subtitle','already','problem','capability','choice','boundary','before','after','code','codeNotes','evidence','expert','financial','roles','questions'):
        expect(bool(lab.get(key)),f'Java Lab{i:02}: missing {key}')
    expect(len(lab.get('evidence',[]))>=3,f'Java Lab{i:02}: at least 3 Evidence items required')
    expect(len({e.get('layer') for e in lab.get('evidence',[])})>=2,f'Java Lab{i:02}: Evidence must span at least 2 layers')
    if i<20:
        d=lab.get('decision',{})
        expect(bool(d.get('prompt')),f'Java Lab{i:02}: decision prompt missing')
        expect(sum(1 for o in d.get('options',[]) if o.get('correct'))==1,f'Java Lab{i:02}: exactly one correct decision required')
        expect(d.get('minEvidence',0)>=1,f'Java Lab{i:02}: Evidence gate required')
    else:
        expect(len(lab.get('hypotheses',[]))>=4,'Java Lab20: hypotheses missing')
        expect(bool(lab.get('correctCause')),'Java Lab20: correctCause missing')
        expect(any(x.get('correct') for x in lab.get('recoveries',[])),'Java Lab20: safe recovery missing')
        expect(any(not x.get('correct') for x in lab.get('recoveries',[])),'Java Lab20: unsafe alternatives missing')
        expect(sum(1 for x in lab.get('verifications',[]) if x.get('correct'))>=4,'Java Lab20: business verification set too shallow')

for marker in (
    "PREFIX='java_app_lab'", "WAR_KEY='java_app_warroom_result'",
    'REQUEST JOURNEY','NEED BEFORE TOOL','EVIDENCE SELECTOR','EVIDENCE BOARD','DECISION GATE',
    'TRI-ROLE LENS','Expert Lens','Financial Context',
    'function normalLab(l)','function render(l)','function workspace(l)',
    "war.scores.eng>=85&&war.scores.con>=85&&war.scores.pm>=85",
    'Free Investigation','CAUSE DECLARATION','SAFE RECOVERY','VERIFY / RECONCILE',
):expect(marker in app,f'Java app invariant missing: {marker}')

for marker in (
    '.j-home-hero{','.j-system-line{','.j-need-grid{','.j-before-after{',
    '.j-evidence-layout{','.j-lens-grid{','.j-modal{','.j-war-layout{',
    '@media(max-width:720px)','@media(prefers-reduced-motion:reduce)',':focus-visible',
):expect(marker in style,f'Java CSS invariant missing: {marker}')

for marker in ('labs.js?v=1','labs-5.js?v=1','app-core.js?v=1','app-warroom.js?v=1','app-entry.js?v=1','foundation-glossary.js?v=1','field-case-links.js?v=1','navigation-scroll.js?v=1'):
    expect(marker in index,f'java/index.html missing wiring: {marker}')

for marker in (
    'Java = Programming Language','JVM = Class Fileを実行するRuntime','Spring Boot = Applicationを構築・運転するFramework',
    'Connection Pool','Virtual Thread','JFR','JMS / IBM MQ','Engineer / Consultant / PMが各85点以上',
):expect(marker in readme,f'Java README missing boundary/depth: {marker}')

for marker in (
    'Enterprise Application / Java — Learning Architecture','Common Application Concept','Java Profile',
    'Evidence before judgment','Capstone is an investigation game','Official reference baseline',
):expect(marker in doc,f'Java design doc missing: {marker}')

expect('data-module-card="java"' in home,'Root Home Java card missing')
expect('180 Labs' in home,'Root Home total must be 180 Labs')
expect("id:'java'" in home_js and "prefix:'java_app_lab'" in home_js,'Home progress Java contract missing')
expect('/180' in home_js or '180' in home_js,'Home progress denominator must include Java')
expect("'java'" in field_links and 'java:[' in field_links,'Java War Room Link mapping missing')
expect('Enterprise Java Application invariants' in workflow and 'python3 scripts/qa_java_application.py' in workflow,'Java QA must run in Repository Quality Gate')

for body,name in ((repo_readme,'README'),(curriculum,'CURRICULUM'),(standard,'PACKAGE_STANDARD')):
    expect('Enterprise Application / Java' in body,f'{name}: Java package missing')
    expect('180 Labs' in body,f'{name}: 180 Labs total missing')
expect('Oracle Java SE Support Roadmap' in references and 'Spring Boot Reference Documentation' in references,'REFERENCES: Java official sources missing')

# Key technical boundaries that should survive future edits.
joined='\n'.join(l.get('boundary','')+' '+l.get('expert','') for l in labs)
for marker in (
    'JavaはProgramming Language、JVMは実行基盤、Spring BootはApplicationを組み立てるFramework',
    'Virtual Thread', '@Transactional', 'self-invocation',
    'Timeout', 'Idempotency', 'Health Check',
):expect(marker in joined,f'Java technical boundary missing: {marker}')
for marker in ('ACK','COMMIT','JMSRedelivered','Connection Pool','Downstream Capacity'):
    expect(marker in labs_src,f'Java runtime/integration evidence missing: {marker}')

if errors:
    print('Enterprise Java Application QA FAILED')
    for e in errors:print(' - '+e)
    sys.exit(1)

print('Enterprise Java Application QA PASSED')
print(' - 20 progressive Labs and Java War Room')
print(' - Java/JVM/JDK/Spring/JDBC/JMS boundaries')
print(' - Evidence-gated decisions and tri-role 85 sign-off')
print(' - responsive Request Journey / Stack Map / Expert Lens UI')
print(' - Root Home, curriculum, sources, progress and incident transfer wiring')
