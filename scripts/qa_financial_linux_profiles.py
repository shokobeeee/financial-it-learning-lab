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

distro=read('linux/ui-distro.js')
distro_css=read('linux/ui-distro.css')
profile_ux=read('linux/ui-financial-profiles.js')
profile_css=read('linux/ui-financial-profiles.css')
bridge=read('linux/integration-bridge.js')
sw=read('linux/sw.js')
readme=read('linux/README.md')
doc=read('docs/FINANCIAL_LINUX_PROFILES.md')
standard=read('PACKAGE_STANDARD.md')

for marker in (
    "rhel:{id:'rhel'", "ubuntu:{id:'ubuntu'", "sles:{id:'sles'", "oracle:{id:'oracle'",
    "recommended:true", "ALIASES={debian:'ubuntu'}",
    "purpose:'金融・Enterpriseの基準Profile'",
    "pkg:'dnf / rpm'", "pkg:'apt / dpkg'", "pkg:'zypper / rpm'",
    "security:'SELinux'", "security:'AppArmor'", "kernel:'UEK / RHCK'",
    "function slesForward(input)", "function slesReverse(input)",
    "zypper --non-interactive install", "openSelector:openModal", "select:selectProfile",
):
    expect(marker in distro,f'Linux distro profile implementation missing: {marker}')

expect("debian:{id:'debian'" not in distro,'Debian/Ubuntu must not remain the only canonical profile id')
expect("['rhel','ubuntu','sles','oracle']" in distro,'Profile selector must present RHEL, Ubuntu, SLES, Oracle in the intended order')
expect('市場シェアを断定するためではなく' in distro,'RHEL standard must be framed as a curriculum design decision, not a market-share claim')
expect('Parrot OSはSecurity学習向け' in distro,'Parrot OS boundary must be explicit in selector')
expect('RHEL Subscription・Vendor Support・製品Certificationまで同一ではありません' in distro,'RHEL-compatible support boundary missing')

for marker in (
    '.linux-distro-card.rhel{','.linux-distro-card.ubuntu{','.linux-distro-card.sles{','.linux-distro-card.oracle{',
    '.linux-distro-card.recommended{','.linux-scope-chip.sles','.linux-scope-chip.oracle',
    '@media(max-width:820px)',
):
    expect(marker in distro_css,f'Linux distro profile CSS missing: {marker}')

for marker in (
    "ORDER=['rhel','ubuntu','sles','oracle']", 'FINANCIAL LINUX PROFILE',
    '金融ITのLinuxは、1種類ではない', 'COMMON LINUX', 'PROFILE DIFFERENCE',
    'RHEL系を標準Profile', 'Ubuntu LTS・SLES・Oracle Linux',
    'Parrot OSはどこ？', 'data-flp-profile', 'data-flp-current', 'data-flp-stage',
    'function installCommand(p)', 'function labFocus(lab,p)',
    'Web Serverという共通役割', 'Distribution Profile',
    "panel.querySelectorAll('button[data-flp-profile]')", 'e.stopPropagation()',
):
    expect(marker in profile_ux,f'Financial Linux profile UX missing: {marker}')
expect("panel.querySelectorAll('[data-flp-profile]')" not in profile_ux,'Profile click binding must not attach to the whole Step -1 container')

for marker in (
    '.flp-common-diff{','.flp-profile-grid{','.flp-profile-card.current{',
    '.flp-stage{','.flp-lab-context{','@media(max-width:620px)',
):
    expect(marker in profile_css,f'Financial Linux profile CSS missing: {marker}')

expect("s.onload=loadFinancialProfiles" in bridge,'Financial profile UX must load after component rationale')
expect("ui-financial-profiles.js?v=1" in bridge,'Linux bridge must load financial profile UX')
expect('RHEL系を教材標準にし、Ubuntu LTS・SLES・Oracle Linuxへ翻訳' in bridge,'Linux zero-based guide must state the four-profile model')

for marker in ('linux-kiban-lab-v18-financial-linux-profiles','ui-financial-profiles.js?v=1','ui-financial-profiles.css?v=1'):
    expect(marker in sw,f'Linux PWA cache missing profile asset/version: {marker}')

for marker in (
    'Financial Linux Profile Model','RHEL系を標準Profile','Ubuntu LTS / Debian',
    'SUSE Linux Enterprise Server','Oracle Linux','Parrot OSはSecurity / Forensics学習向け',
    'Linux OS ≠ Distribution固有操作 ≠ Web Server role ≠ nginx',
    'sudo zypper --non-interactive install nginx','RHEL Subscription、Vendor Support、製品Certificationまで同一ではない',
):
    expect(marker in readme,f'Linux README missing profile model: {marker}')

for marker in (
    'Common Linux Concept','Distribution Profile','RHEL / Rocky / AlmaLinux',
    'Ubuntu LTS / Debian','SLES','Oracle Linux','Why not Parrot OS as the baseline?',
    'What it does not claim','RHEL-compatible means command-compatible, binary-compatible, or vendor-supported?',
):
    expect(marker in doc,f'Financial Linux profile design doc missing: {marker}')

for marker in (
    '## Financial Linux Profile Model',
    'RHEL系を標準にするのは市場シェアの断定ではなく',
    'Common Linux + RHEL/Rocky/AlmaLinux（標準） / Ubuntu LTS/Debian / SLES / Oracle Linux',
    'RHEL互換操作とRHELのSupport / Subscription / Certificationを同一視していない',
):
    expect(marker in standard,f'Package Standard missing Financial Linux profile requirement: {marker}')

# Every Linux entry page should load the distro layer and the independent integration bridge.
for path in [Path('linux/index.html'),*sorted(Path('linux').glob('parrot_linux_lab*.html'))]:
    body=read(str(path))
    expect('ui-distro.js?v=16' in body,f'{path}: distro profile script missing')
    expect('integration-bridge.js?v=1' in body,f'{path}: integration bridge missing')

if errors:
    print('Financial Linux Profile QA FAILED')
    for e in errors:print(' - '+e)
    sys.exit(1)

print('Financial Linux Profile QA PASSED')
print(' - Common Linux and Distribution-specific layers are separated')
print(' - RHEL is the curriculum reference profile without a market-share claim')
print(' - Ubuntu, SLES, and Oracle Linux profiles are available')
print(' - RHEL-compatible support/certification boundary is explicit')
print(' - Parrot OS remains a security-learning environment, not the production baseline')
print(' - apt / dnf / zypper simulation paths and profile UI are wired')
print(' - profile-selection events do not bubble into page-wide reloads')
print(' - package standard, PWA cache, and mobile profile UX are covered')
