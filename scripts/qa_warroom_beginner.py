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
app=read('financial-war-room/app.js')
index=read('financial-war-room/index.html')
style=read('financial-war-room/style.css')
readme=read('financial-war-room/README.md')

ids={int(x) for x in re.findall(r'(?m)^\s{4}(\d+):\{',guide)}
expect(ids==set(range(1,13)),f'War Room beginner guide must cover case ids 1..12; got {sorted(ids)}')
expect('rootExplain' not in guide and 'root:' not in guide,'Beginner guide must not embed root-cause answers/spoilers')
for marker in ('glossary:[','flow:[','plain:','focus:','map:'):
    expect(marker in guide,f'Beginner guide missing: {marker}')

for marker in ('function preview(sc)','初見ガイド / まだ採点されません','状況は分かった → 挑戦を始める','#preview','まず「どれくらい困っているか」を決める','確認材料を取りに行く','本当に業務が戻ったか確認する','Primary cause / Contributing factor','wrLiveScore'):
    expect(marker in app,f'War Room beginner-first app missing: {marker}')

# Home cards must open the non-scored preview first, while challenge start remains explicit.
expect('href="#preview${String(x.id).padStart(2,\'0\')}"' in app,'War Room scenario cards must route to preview before challenge')
expect('href="#case${String(sc.id).padStart(2,\'0\')}"' in app,'War Room preview must provide explicit challenge start')

# Preserve existing scoring/sign-off and progress contracts.
expect("'financial_warroom_'+id+'_result'" in app,'War Room progress/result key changed unexpectedly')
expect('st.scores.eng>=85&&st.scores.con>=85&&st.scores.pm>=85' in app,'Tri-role 85/85/85 sign-off rule must remain unchanged')
expect('impactCorrect' in app and 'commCorrect' in app,'War Room scoring hooks must remain present')

# warroom-v16.js locates the cause card by this English label.
expect('Primary cause' in app,'Evidence Diversity Gate compatibility requires Primary cause text in challenge DOM')

try:
    order=[index.index('scenarios-2.js'),index.index('beginner-guide.js'),index.index('app.js')]
    expect(order==sorted(order),'War Room load order must be scenarios → beginner guide → app')
except ValueError:
    errors.append('War Room index missing scenarios / beginner guide / app wiring')

for marker in ('.wrFlow{','.wrPreviewGrid{','.wrSystemMap{','.wrCasePlain{','.wrSectionNo{'):
    expect(marker in style,f'War Room beginner UI CSS missing: {marker}')

expect('Beginner Entry / 覗いた人が状況を理解できる入口' in readme,'War Room README must document beginner entry')
expect('初見ガイド（採点なし）' in readme,'War Room README must state preview is not scored')

if errors:
    print('War Room beginner QA FAILED')
    for e in errors: print(' - '+e)
    sys.exit(1)
print('War Room beginner QA PASSED')
print(' - 12 preview guides')
print(' - preview-before-challenge routing')
print(' - no answer spoilers in guide')
print(' - tri-role scoring contract preserved')
print(' - Evidence Diversity DOM compatibility')
