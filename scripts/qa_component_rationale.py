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
    'function conceptEntry(common,role,origin,why,choice)',
    'function expandedByDefault(module,lab)', 'cr-primary-details',
    'new MutationObserver(schedule)', 'window.FIT_COMPONENT_RATIONALE=',
):
    expect(marker in js,f'component rationale JS missing: {marker}')

for module in ('sql','cobol','jcl','cloud','aws','gcp','azure'):
    expect(f'{module}:' in js,f'home/component rationale missing module: {module}')

for marker in (
    'Ubuntuを入れただけではWeb Serverにはなりません',
    'nginxが無くても、NIC・DHCP・Route・DNS等が成立すればNetwork通信はできます',
    'nginxはLinux必須ではなく、Web Serverという役割を追加するApplicationです',
    'Linux OS ≠ Web Server role ≠ nginx',
    "1:e('nginx'", "2:e('Host Firewall'", "3:e('Network設定 / Resolver'",
    "4:e('OpenSSH Server'", "9:e('Package Manager'", "14:e('Container Runtime'",
    "17:e('Ansible'", "18:e('Hypervisor / Cloud Compute'",
):
    expect(marker in js,f'Linux need-before-tool rationale missing: {marker}')

for marker in (
    "sql:{\n    1:e('DBMS'", "'deployment'", "17:e('DB Driver / Precompiler'",
    "cobol:{\n    1:e('COBOL Compiler / Runtime'", "18:e('Db2 / CICS'",
    "jcl:{\n    1:e('JES'", "16:e('Enterprise Scheduler'",
):
    expect(marker in js,f'Core module rationale missing: {marker}')

for lab in range(1,21):
    expect(f"  {lab}:['" in js,f'Cloud component rationale missing Lab{lab:02}')

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
    "linux-kiban-lab-v17-component-rationale",
    '../assets/js/component-rationale.js?v=2',
    '../assets/css/component-rationale.css?v=2',
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
    'Linux OS ≠ Web Server role ≠ nginx',
    'nginxを入れる理由はNetworkへ接続するためではない',
    '多くのUbuntu環境ではDHCP等によりNetworkが自動設定されることがある',
    'Component Origin Model',
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
