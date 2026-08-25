#!/usr/bin/env python3
from pathlib import Path
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

guide=read('financial-war-room/beginner-guide.js')
core=read('financial-war-room/game-core.js')
investigation=read('financial-war-room/game-investigation.js')
resolution=read('financial-war-room/game-resolution.js')
entry=read('financial-war-room/game-entry.js')
index=read('financial-war-room/index.html')
style=read('financial-war-room/investigation-game.css')
readme=read('financial-war-room/README.md')
v16=read('assets/js/warroom-v16.js')
home=read('assets/js/home-v3.js')

ids={int(x) for x in re.findall(r'(?m)^\s{4}(\d+):\{',guide)}
expect(ids==set(range(1,13)),f'War Room guide must cover case ids 1..12; got {sorted(ids)}')
expect('rootExplain' not in guide and 'root:' not in guide,'Preview guide must not embed root-cause answers/spoilers')

for marker in ('W.preview=function(sc)','事件現場 / まだ採点されません','🔍 捜査を始める','どこから調べるかは、あなたが決める'):
    expect(marker in core,f'War Room core missing: {marker}')
expect('flowStrip(' not in core,'War Room preview/home must not show the old prescribed 7-step flow')

for marker in (
    'W.renderInvestigation=function()',
    'EVIDENCE BOARD',
    'HYPOTHESIS BOARD',
    'data-hyp-status="investigate"',
    'data-hyp-status="hot"',
    'data-hyp-status="ruledout"',
    '☝ 原因を指摘する',
    'data-layer="${W.esc(e.layer)}"',
    'data-layer-label="${W.esc(e.layerLabel)}"',
    'W.activeHypotheses().length>=3',
):
    expect(marker in investigation,f'Investigation module missing: {marker}')
expect('W.st.evidence.push(e.id)' in investigation,'Evidence collection state missing')
expect("v==='investigate'||v==='hot'" in investigation,'Tracked hypotheses must come from learner-managed board states')
expect('Primary cause / 原因を指摘する' in investigation,'Cause declaration DOM must retain Primary cause for gate compatibility')

for marker in ('W.renderResolution=function()','RECOVERY','VERIFY / RECONCILE','COMMUNICATION'):
    expect(marker in resolution,f'Resolution module missing: {marker}')
expect("W.st.scores.eng>=85&&W.st.scores.con>=85&&W.st.scores.pm>=85" in resolution,'Tri-role 85/85/85 sign-off rule must remain unchanged')
expect("const over=Math.max(0,W.st.evidence.length-4)" in resolution,'Evidence efficiency penalty must remain')
expect("W.key=id=>'financial_warroom_'+id+'_result'" in core,'War Room progress/result key changed unexpectedly')
expect('W.st.sc.impactCorrect' in investigation and 'W.st.sc.commCorrect' in resolution,'Impact/communication scoring hooks must remain')

expect('b.dataset.layer' in v16 and 'b.dataset.layerLabel' in v16,'Evidence Diversity Gate must read explicit layer metadata')
expect('primaryLayer(' not in v16,'Evidence Diversity Gate must not infer layers from button text regex')

try:
    names=['scenarios-2.js','beginner-guide.js','game-core.js','game-investigation.js','game-resolution.js','game-entry.js','warroom-v16.js']
    positions=[index.index(x) for x in names]
    expect(positions==sorted(positions),'War Room game script load order is invalid')
except ValueError:
    errors.append('War Room index missing game module wiring')
expect('investigation-game.css' in index,'War Room entrypoint must load investigation-game.css')
expect('app.js' not in index,'Superseded linear app.js must not be wired')
expect(not (ROOT/'financial-war-room/app.js').exists(),'Superseded linear financial-war-room/app.js should be removed')

for marker in ('.wrInvestigationGrid{','.wrEvidenceBoard{','.wrHypothesisBoard{','.wrAccuseBtn{','.wrResolutionPanel{'):
    expect(marker in style,f'Investigation-game CSS missing: {marker}')
expect('financial-war-room/#preview' in home,'Home Next Step must enter War Room preview before investigation')
expect('Investigation Game Model' in readme,'War Room README must document investigation game model')
expect('Evidence Board' in readme and 'Hypothesis Board' in readme,'War Room README must document evidence/hypothesis boards')
expect('#preview' in entry and '#case' in entry and 'W.start(s)' in entry,'Game router must preserve preview -> scored investigation flow')

if errors:
    print('War Room investigation QA FAILED')
    for e in errors: print(' - '+e)
    sys.exit(1)
print('War Room investigation QA PASSED')
print(' - non-spoiler incident preview')
print(' - free-order evidence investigation')
print(' - learner-managed hypothesis board')
print(' - explicit Evidence layer metadata')
print(' - recovery/verification/sign-off preserved')
