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
    if not ok:errors.append(msg)

sql=read('sql/index.html')
bridge=read('assets/js/java-route-bridge.js')
polish=read('java/app-polish.js')
java_index=read('java/index.html')
home=read('assets/js/home-v3.js')

expect('java-route-bridge.js?v=1' in sql,'SQL entrypoint must load Java curriculum bridge')
for marker in ('patchSqlNextPath','href=\'../java/\'','Enterprise Application / Java'):
    expect(marker in bridge,f'Java route bridge missing: {marker}')
for marker in ('function polishNextPath()','href=\'../cobol/\'','次は COBOL / Business Systems'):
    expect(marker in polish,f'Java completion path missing: {marker}')
expect('app-polish.js?v=1' in java_index,'Java entrypoint must load UI review fixes')
expect('data-fit-nav-scroll="1"' in java_index,'Java entrypoint must mark one navigation controller')
expect("{id:'java',prefix:'java_app_lab'" in home,'Root curriculum order must include Java after SQL')

if errors:
    print('Java curriculum route QA FAILED')
    for e in errors:print(' - '+e)
    sys.exit(1)
print('Java curriculum route QA PASSED')
print(' - SQL → Java → COBOL learning path')
print(' - Java review polish and single navigation controller')
