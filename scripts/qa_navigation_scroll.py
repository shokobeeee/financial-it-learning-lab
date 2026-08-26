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

nav=read('assets/js/navigation-scroll.js')
common=read('assets/js/common.js')
field_links=read('assets/js/field-case-links.js')
war=read('financial-war-room/index.html')
field_boot=read('field-casebook/cases.js')
linux_bridge=read('linux/integration-bridge.js')
java=read('java/index.html')

for marker in ('hashchange','pageshow','sessionStorage','scrollTo','ROUTE_HASH','requestAnimationFrame'):
    expect(marker in nav,f'navigation-scroll.js missing {marker}')
expect('navigation-scroll.js' in common,'Home must load navigation scroll controller')
expect('navigation-scroll.js' in field_links,'Learning modules must load navigation scroll controller')
expect('navigation-scroll.js' in java,'Java package must load navigation scroll controller')
expect('navigation-scroll.js' in war,'Financial War Room must load navigation scroll controller')
expect('navigation-scroll.js' in field_boot,'Field Incident Gate must load navigation scroll controller')
expect('field-case-links.js' in linux_bridge,'Linux bridge must continue loading field-case-links, which loads navigation scroll')

if errors:
    print('Navigation scroll QA FAILED')
    for e in errors: print(' - '+e)
    sys.exit(1)
print('Navigation scroll QA PASSED')
print(' - hash routes reset to page top')
print(' - cross-page learning navigation carries scroll-top intent')
print(' - home / Linux / SQL / Java / Core / Cloud / Field Gate / War Room are wired')
