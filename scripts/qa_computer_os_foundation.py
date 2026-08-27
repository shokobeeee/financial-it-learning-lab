#!/usr/bin/env python3
from pathlib import Path
import re
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

js=read('assets/js/foundation-glossary.js')
css=read('assets/css/foundation-glossary.css')
bridge=read('linux/integration-bridge.js')
sw=read('linux/sw.js')
doc=read('docs/COMPUTER_OS_FOUNDATION.md')
linux_readme=read('linux/README.md')
home=read('index.html')
home_js=read('assets/js/home-v3.js')
workflow=read('.github/workflows/qa.yml')

for marker in (
    "LEVEL_KEY='fit_explanation_level_v1'",
    "FOUNDATION_COMPLETE_KEY='linux_computer_os_foundation_complete'",
    "beginner:{label:'完全未経験'",
    "standard:{label:'標準'",
    "compact:{label:'説明最小'",
    'const TERMS=[', 'const FOUNDATION_STEPS=[',
    "id:'kernel'", "plain:'OSの司令塔'",
    "id:'process'", "plain:'いま動いているProgram'",
    "id:'file'", "plain:'名前を付けて保存したData'",
    "id:'tcpip'", "plain:'通信ルールを処理するOS機能'",
    "id:'default-route'", "plain:'近所以外へ出る基本の出口'",
    "id:'port'", "plain:'Applicationごとの受付窓口'",
    'function decorateRoot(root)', 'function unwrapTerms(root)',
    'function renderFoundation(force)', 'function foundationQuiz(viewed,complete)',
    'function openFoundationAndScroll()', 'window.FIT_FOUNDATION_GLOSSARY=',
):
    expect(marker in js,f'foundation glossary JS missing: {marker}')

steps=re.findall(r"\{id:(\d+),title:'",js.split('const FOUNDATION_STEPS=[',1)[1].split('];',1)[0] if 'const FOUNDATION_STEPS=[' in js else '')
expect(steps==[str(i) for i in range(1,9)],f'Computer OS Foundation steps must be exactly 1..8; got {steps}')

for marker in (
    'Programを起動して、いま動いている状態は？',
    '同じNetwork外へ出る基本の出口は？',
    'nginxは何のために追加する？',
    "values.q1==='process'", "values.q2==='route'", "values.q3==='nginx'",
):
    expect(marker in js,f'foundation check missing: {marker}')

# 用語の説明文を本文の文中へ差し込むと、日本語の一文が読み取れなくなる。
# 行内は「印の付いた語」のみ、意味は scope 単位の用語メモ / tooltip 側へ置く。
expect('.fitb-term-plain' not in js and '.fitb-term-plain' not in css,
       'term definitions must not be re-introduced inline (.fitb-term-plain)')
# 「リソース」はLinux文脈ではCPU/Memory/Diskを指す。Cloud Resourceの別名にすると誤注釈になる。
expect("aliases:['Cloud Resource','クラウドリソース','Resource']" in js,
       'Cloud Resource must not claim the katakana リソース')
expect("{id:'system-resource'" in js,
       'the OS-level resource meaning needs its own glossary term')
expect('b.textContent=original;return b;' in js,
       'inline term marker must render only the original word')
# <button> は display:inline を指定しても inline-block になり、複数語の用語が行内で折り返せない。
expect("createElement('span');b.className='fitb-term'" in js,
       'inline term marker must be a span so multi-word terms can wrap')
expect("b.setAttribute('role','button')" in js and "b.setAttribute('tabindex','0')" in js,
       'the span marker must stay focusable and expose a button role')
expect('function handleTermKey(e)' in js,
       'the span marker needs Enter/Space handling that a button would give for free')
expect('function renderGloss(scope,terms)' in js and 'function showTip(btn)' in js,
       'per-scope gloss strip and hover tooltip must exist')
expect('.fitb-term{' in css and 'display:inline;' in css.split('.fitb-term{',1)[-1].split('}',1)[0],
       'inline term marker must stay inline so the sentence can wrap normally')

for marker in (
    "script,style,code,pre,kbd,samp,button,a,input,textarea,select,option",
    '.fitb-drawer,.fitb-launcher,.cosf-foundation',
    'if(level===\'compact\')unwrapTerms(document)',
    'if(level!==\'compact\')decorateAll()',
):
    expect(marker in js,f'glossary safety/adaptive-mode guard missing: {marker}')

for marker in (
    '.fitb-launcher{','.fitb-drawer{','.fitb-term{',
    'html[data-fitb-level="beginner"] .fitb-gloss{display:flex}',
    '.fitb-gloss{','.fitb-gloss-item{','.fitb-tip{',
    '.cosf-foundation{','.cosf-step-nav{','.cosf-stage{','.cosf-quiz{',
    '@media(max-width:620px)',
):
    expect(marker in css,f'foundation glossary CSS missing: {marker}')

entrypoints={
    'index.html':'assets/js/foundation-glossary.js?v=1',
    'sql/index.html':'../assets/js/foundation-glossary.js?v=1',
    'cobol/index.html':'../assets/js/foundation-glossary.js?v=1',
    'jcl/index.html':'../assets/js/foundation-glossary.js?v=1',
    'cloud/index.html':'../assets/js/foundation-glossary.js?v=1',
    'aws/index.html':'../assets/js/foundation-glossary.js?v=1',
    'gcp/index.html':'../assets/js/foundation-glossary.js?v=1',
    'azure/index.html':'../assets/js/foundation-glossary.js?v=1',
    'field-casebook/index.html':'../assets/js/foundation-glossary.js?v=1',
    'financial-war-room/index.html':'../assets/js/foundation-glossary.js?v=1',
}
for path,marker in entrypoints.items():
    expect(marker in read(path),f'{path}: shared foundation glossary wiring missing')

expect("foundation-glossary.js?v=1" in bridge,'Linux bridge must load shared foundation glossary')
expect('loadFoundationGlossary' in bridge,'Linux bridge foundation loader missing')
expect('loadFoundationGlossary();loadFinancialProfiles();' in bridge,'Linux load order must place glossary/foundation before profile UX handoff')

for marker in (
    'linux-kiban-lab-v21-evidence-and-boundaries',
    '../assets/js/foundation-glossary.js?v=1',
    '../assets/css/foundation-glossary.css?v=1',
):
    expect(marker in sw,f'Linux PWA cache missing foundation asset/version: {marker}')

for marker in (
    'Computer & OS Foundation — Zero-Assumption Learning Design',
    'STEP -2  Computer and OS Foundation',
    'Kernel', 'Default Route',
    '完全未経験 / Beginner', '説明最小 / Compact',
    'fit_explanation_level_v1', 'linux_computer_os_foundation_complete',
):
    expect(marker in doc,f'foundation design doc missing: {marker}')

for marker in (
    'Complete Package v19', 'STEP -2',
    'ComputerとOSは、どう動いている？',
    '普通の言葉 → 専門用語',
    'Kernel = OSの司令塔',
    'Default Route = 近所以外へ出る基本の出口',
    'docs/COMPUTER_OS_FOUNDATION.md',
):
    expect(marker in linux_readme,f'Linux README missing zero-assumption foundation: {marker}')

expect('コンピュータとOSの基本から' in home,'Root home Linux description must start before DNS/Port terminology')
expect('コンピュータ・OS・Networkの基本から' in home_js,'Home NEXT note must advertise the zero-assumption route')
expect('Computer / OS Foundation invariants' in workflow,'Repository workflow must execute foundation QA')
expect('python3 scripts/qa_computer_os_foundation.py' in workflow,'Foundation QA command missing from workflow')

if errors:
    print('Computer / OS Foundation QA FAILED')
    for e in errors:print(' - '+e)
    sys.exit(1)

print('Computer / OS Foundation QA PASSED')
print(' - 8-step zero-assumption Computer / OS / Network foundation')
print(' - Kernel / Process / File / TCP-IP / Default Route plain-language entries')
print(' - Beginner / Standard / Compact explanation levels')
print(' - inline decoration excludes code, commands, controls, and learning UI')
print(' - shared glossary is wired across learning, incidents, and War Room')
print(' - Linux PWA, docs, root route, and completion contracts are covered')
