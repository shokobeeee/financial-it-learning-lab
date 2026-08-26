#!/usr/bin/env python3
from pathlib import Path
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
    if not ok: errors.append(msg)

js=read('assets/js/component-rationale.js')
css=read('assets/css/component-rationale.css')
field_links=read('assets/js/field-case-links.js')
linux_bridge=read('linux/integration-bridge.js')
linux_sw=read('linux/sw.js')
standard=read('PACKAGE_STANDARD.md')
linux_readme=read('linux/README.md')

for marker in (
    'function ensureCss()', "component-rationale.css?v=2",
    "const ORIGINS=", "builtin:['OS / Platformに含まれる'",
    "configured:['既存機能を設定・有効化'", "package:['Packageとして追加'",
    "deployment:['Self-managed Package / Managed Service'",
    "runtime:['Compiler / Runtimeを追加'", "provisioned:['Cloud上にResourceを作成'",
    "external:['別Platformで提供'", "client:['操作する側へToolを追加'",
    'function entryFor(module,lab)', 'function cloudEntry(module,lab)',
    'function conceptEntry(common,role,origin,why,choice,problem,capability,evidence)',
    'function expandedByDefault(module,lab)', 'cr-primary-details',
    'new MutationObserver(schedule)', 'window.FIT_COMPONENT_RATIONALE=',
):
    expect(marker in js,f'component rationale JS missing: {marker}')

for module in ('sql','cobol','jcl','cloud','aws','gcp','azure'):
    expect(f'{module}:' in js,f'home/component rationale missing module: {module}')

# 「何に困る？」へ目的文をそのまま流用すると、問いと答えがずれる。
# CLOUD_META は purpose(why) と problem を別の要素として持ち、Problem 欄には problem を使う。
expect('const [common,role,origin,why,problem,capability,evidence]=m;' in js,
       'cloudEntry must read a dedicated problem text from CLOUD_META')
expect('problem:why' not in js,
       'Problem step must not reuse the purpose sentence (problem:why)')
for label in ('01 もともと何がある？','02 無いと何に困る？','03 どんな機能が必要？','04 なぜこれを選ぶ？'):
    expect(label in js,f'component rationale step label missing: {label}')

# 「どんな機能が必要？」に役割バッジを流用すると、問いに答えていない文になる。
for bad in ('capability:`${role}を、Cloud上のResourceとして用意できること。`',
            'capability:`${role}を整理し、製品名ではなく役割で説明・判断できること。`',
            'capability:`${common}の役割を、${p.name}上のserviceとして提供できること。`'):
    expect(bad not in js,f'capability must not restate the role badge: {bad}')

# 「A ≠ B ≠ C」だけでは互いに違うことしか伝わらず、
# 「nginx ≠ Web Server role」は「nginxはWeb Serverではない」とも読めて役割バッジと矛盾する。
# 境界欄は、差異ではなく三者の関係（土台／役割の名／担う製品）を書く。
expect('Linux OS ≠ Web Server role ≠ nginx' not in js,
       'boundary must state the relationship between OS / role / product, not just inequality')
expect('土台であるLinuxというOS、そこへ足すWeb Serverという役割の名、その役割を実際に担う製品であるnginx' in js,
       'linux Lab01 boundary must name the three layers explicitly')
expect('COBOL ≠ Mainframe ≠ JCL ≠ Db2 ≠ CICS' not in js,
       'cobol boundary must assign each name to a layer instead of chaining ≠')

for marker in (
    'Ubuntuを入れただけではWeb Serverにはなりません',
    'nginxが無くても、NIC・DHCP・Route・DNS等が成立すればNetwork通信はできます',
    'nginxはLinux必須ではなく、Web Serverという役割を追加するApplicationです',
    "1:e('nginx'", "2:e('Host Firewall'", "3:e('Network設定 / Resolver'",
    "4:e('OpenSSH Server'", "9:e('Package Manager'", "14:e('Container Runtime'",
    "17:e('Ansible'", "18:e('Hypervisor / Cloud Compute'",
):
    expect(marker in js,f'Linux need-before-tool rationale missing: {marker}')

for marker in (
    "sql:{\n    1:e('DBMS'", "'deployment'", "17:e('DB Driver / Precompiler'",
    "cobol:{\n    1:e('COBOL Compiler / Runtime'", "18:e('Db2 / CICS'",
    "jcl:{\n    1:e('JES'", "17:e('Enterprise Scheduler'",
):
    expect(marker in js,f'Core module rationale missing: {marker}')

for lab in range(1,21):
    expect(f"  {lab}:['" in js,f'Cloud component rationale missing Lab{lab:02}')

# CLOUD_META は [common, role, origin, purpose, problem, capability, evidence[]] の7要素。
# 要素が欠けると Problem / Capability / Evidence 欄が空で描画され、画面上は静かに壊れる。
import re
cloud_evidence=[]
for lab in range(1,21):
    m=re.search(r"^  %d:\[(.*)\],?$"%lab,js,re.M)
    if not m:
        errors.append(f'Cloud component rationale Lab{lab:02} row not parseable')
        continue
    row=m.group(1)
    ev=re.search(r",(\[[^\]]*\])$",row)
    expect(bool(ev),f'Lab{lab:02} must end with its own evidence array')
    if not ev: continue
    scalars=re.findall(r"'((?:[^'\\]|\\.)*)'",row[:ev.start()])
    expect(len(scalars)==6,
           f'Lab{lab:02} must define [common, role, origin, purpose, problem, capability]; found {len(scalars)}')
    expect(all(f.strip() for f in scalars),f'Lab{lab:02} has an empty field')
    items=re.findall(r"'((?:[^'\\]|\\.)*)'",ev.group(1))
    expect(len(items)>=3 and all(i.strip() for i in items),
           f'Lab{lab:02} needs at least 3 non-empty evidence items')
    cloud_evidence.append(tuple(items))

# Cloudだけ全Labが同じEvidenceだと、「Evidenceで判断する」という教材の核が空洞になる。
expect(len(set(cloud_evidence))==len(cloud_evidence),
       'each Cloud Lab must have its own evidence, not one shared template')

# linux/ui-financial-profiles.js は component rationale の本文を文字列一致で置換する。
# 置換元の文が書き換わると Profile 切替の反映が黙って止まるため、両者を突き合わせる。
profiles=read('linux/ui-financial-profiles.js')
anchors=re.findall(r"\['((?:[^'\\]|\\.)*)',(?:p\.|'|\+|\s)",profiles[profiles.find('function replaceText('):profiles.find('var w=document.createTreeWalker')])
expect(len(anchors)>=6,'profile text replacement anchors could not be extracted')
for anchor in anchors:
    expect(anchor in js,f'profile replacement anchor no longer present in component rationale: {anchor}')
# 用語注釈がtext nodeを分割すると、置換元の文が存在していても split() が一致しない。
# 置換の直前に注釈を外していることまで確認する。
expect('FIT_FOUNDATION_GLOSSARY.unwrap(panel)' in profiles,
       'profile text replacement must unwrap glossary markers before matching literals')
# BEFORE/AFTERを部品chipへ分けると、文字列一致の対象text nodeも分割される。
# chip単位の置換が無いと、Profileを切り替えてもBEFOREだけUbuntuのまま残る。
expect(".cr-parts li" in profiles and "li.textContent.trim()==='Ubuntu'" in profiles,
       'profile replacement must also cover the split BEFORE/AFTER part chips')

# 部品chipは ' + ' で区切る。service名の中に ' + ' があると名前が途中で割れる。
import re as _re
for _m in _re.finditer(r"services:\{([^}]*)\}",js):
    for _v in _re.findall(r"'((?:[^'\\]|\\.)*)'",_m.group(1)):
        expect(' + ' not in _v,f'provider service name must not contain the part separator: {_v}')

# Zone/AZは利用者が作るResourceではない。由来まで分けないとバッジと本文が矛盾する。
expect("placement:['Providerが用意した区分から選ぶ'" in js,
       'a placement origin must exist for Provider-defined zones/regions')
expect("  9:['Failure Domain','一緒に壊れる範囲を分けて配置する仕組み','placement'," in js,
       'Lab09 must use the placement origin, not provisioned')
expect('const placed=' not in js,'the lab===9 special case must not come back')
expect(profiles.index('FIT_FOUNDATION_GLOSSARY.unwrap(panel)')<profiles.index('replaceText(panel,p);'),
       'glossary markers must be unwrapped before replaceText runs')

for marker in (
    'CLIをdownloadすることと、Cloud service本体を作ることは別です',
    'CLIは操作用Tool、Resource本体はProvider側です',
    'このLabは新しいResourceをdownload/provisionするLabではなく',
    'IaC/CLI Toolを管理端末へinstallすることと、Cloud Resource本体をProvider側へprovisionすることは別です',
    "aws:{name:'AWS'", "gcp:{name:'Google Cloud'", "azure:{name:'Azure'",
):
    expect(marker in js,f'Cloud provision/download boundary missing: {marker}')

for marker in (
    'data-cr-linux-step', 'crLinuxMap', 'crLinuxConsole', 'aria-live="polite"',
    'このサイトはBrowser内Learning Simulatorです。実機へSoftware/Cloud Resourceを自動導入しません。',
):
    expect(marker in js,f'beginner interaction/simulation guard missing: {marker}')

for marker in (
    '.cr-card{','.cr-flow{','.cr-before-after{','.cr-linux-controls{',
    '.cr-origin-legend{','.cr-card-compact{','.cr-primary-details{',
    '@media(max-width:620px)',
):
    expect(marker in css,f'component rationale CSS missing: {marker}')

for module in ('sql','cobol','jcl','cloud','aws','gcp','azure'):
    entry=read(f'{module}/index.html')
    expect('component-rationale.js?v=2' in entry,f'{module}: component rationale must be wired directly')

expect('component-rationale.js?v=2' in linux_bridge,'Linux integration bridge must load component rationale directly')
expect('loadComponentRationale();' in linux_bridge,'Linux integration bridge must initialize component rationale')
expect('component-rationale' not in field_links,'Field Incident links must not own component-rationale loading')

for marker in (
    "linux-kiban-lab-v21-evidence-and-boundaries",
    '../assets/js/component-rationale.js?v=2',
    '../assets/css/component-rationale.css?v=2',
    '../assets/js/foundation-glossary.js?v=1',
    '../assets/css/foundation-glossary.css?v=1',
    './ui-financial-profiles.js?v=1',
    './ui-financial-profiles.css?v=1',
):
    expect(marker in linux_sw,f'Linux PWA cache missing: {marker}')

for marker in (
    'Need before Tool / Component Origin',
    'もともと何がある？',
    'Cloud上にResourceを作成',
    'OS標準 / 設定 / Package / Runtime / Cloud provision / 外部Platform',
):
    expect(marker in standard,f'Package Standard missing component-origin rule: {marker}')

for marker in (
    'Financial Linux Profile Model',
    'Linux OS ≠ Distribution固有操作 ≠ Web Server role ≠ nginx',
    'nginxを入れる理由はNetworkへ接続するためではない',
    'Linuxを入れただけでInternet接続が保証されるわけではない',
    'Need before Tool / Component Origin',
):
    expect(marker in linux_readme,f'Linux README missing root explanation: {marker}')

if errors:
    print('Component rationale QA FAILED')
    for e in errors:print(' - '+e)
    sys.exit(1)

print('Component rationale QA PASSED')
print(' - Linux OS / Network / server role / nginx are separated')
print(' - Need -> capability -> component -> origin -> Evidence is explicit')
print(' - Core and Cloud modules distinguish install/config/runtime/provision/external')
print(' - Cloud knowledge/control-tool Labs are not mislabeled as provisioned resources')
print(' - progressive disclosure limits cognitive load')
print(' - Browser simulator and PWA cache boundaries are explicit')
print(' - component rationale is independently wired across all modules')
