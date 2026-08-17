(function(){
'use strict';

const PATH=(location.pathname||'').toLowerCase();
const MODULE_IDS=['financial-war-room','sql','cobol','jcl','cloud','aws','gcp','azure'];
const MOD=MODULE_IDS.find(x=>PATH.includes('/'+x+'/'))||null;
if(!MOD)return;

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,d)=>{try{return localStorage.getItem(k)||d}catch(e){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};

const CLOUD={
 common:{name:'Common Concept',chip:'☁️',network:'Virtual Network',compute:'Compute',database:'Managed / Self-managed Database',object:'Object Storage',iam:'Identity / Role / Policy',key:'Key / Secret service',observe:'Metrics / Logs / Audit',hybrid:'Private dedicated / VPN connectivity'},
 aws:{name:'AWS',chip:'🟧',network:'Amazon VPC',compute:'Amazon EC2 / ECS / EKS / Lambda',database:'Amazon RDS / Aurora',object:'Amazon S3',iam:'AWS IAM',key:'AWS KMS / Secrets Manager / ACM',observe:'CloudWatch / CloudTrail',hybrid:'Direct Connect / Site-to-Site VPN'},
 gcp:{name:'Google Cloud',chip:'🔵',network:'VPC',compute:'Compute Engine / GKE / Cloud Run',database:'Cloud SQL / AlloyDB',object:'Cloud Storage',iam:'Cloud IAM',key:'Cloud KMS / Secret Manager',observe:'Cloud Monitoring / Cloud Logging / Cloud Audit Logs',hybrid:'Cloud Interconnect / Cloud VPN'},
 azure:{name:'Microsoft Azure',chip:'🔷',network:'Virtual Network (VNet)',compute:'Virtual Machines / AKS / Functions',database:'Azure SQL / managed database options',object:'Blob Storage',iam:'Microsoft Entra ID + Azure RBAC',key:'Key Vault',observe:'Azure Monitor / Activity Log',hybrid:'ExpressRoute / VPN Gateway'},
 oci:{name:'Oracle Cloud Infrastructure (OCI)',chip:'🔴',network:'Virtual Cloud Network (VCN)',compute:'OCI Compute / OKE / Functions',database:'Base Database / Exadata Database Service / Autonomous AI Database',object:'Object Storage',iam:'OCI IAM',key:'OCI Vault',observe:'OCI Monitoring / OCI Audit',hybrid:'FastConnect / Site-to-Site VPN'}
};

const DB={
 db2:{name:'IBM Db2',chip:'🔵',catalog:'SYSCAT / catalog views',locks:'MON_GET_LOCKS + MON_GET_APPL_LOCKWAIT',plan:'EXPLAIN / Db2 explain facilities',limit:'FETCH FIRST n ROWS ONLY',audit:'Db2/site audit policy',cobol:'Enterprise COBOL embedded SQL with Db2 context'},
 oracle:{name:'Oracle Database',chip:'🔴',catalog:'USER_* / ALL_* / DBA_* dictionary views',locks:'V$LOCK + V$SESSION',plan:'EXPLAIN PLAN + DBMS_XPLAN',limit:'FETCH FIRST n ROWS ONLY (modern Oracle)',audit:'Unified Auditing / audit views',cobol:'Oracle Pro*COBOL precompiler + Oracle Database'},
 postgres:{name:'PostgreSQL',chip:'🐘',catalog:'information_schema + pg_catalog',locks:'pg_locks + pg_stat_activity',plan:'EXPLAIN / EXPLAIN ANALYZE',limit:'LIMIT n or FETCH FIRST',audit:'server logging / organization audit controls',cobol:'Connectivity is driver/tool specific; do not assume Db2-style precompiler'},
 sqlserver:{name:'Microsoft SQL Server',chip:'🟪',catalog:'sys.* + INFORMATION_SCHEMA',locks:'sys.dm_tran_locks',plan:'Actual/Estimated Execution Plan / SHOWPLAN',limit:'TOP(n) or OFFSET ... FETCH',audit:'SQL Server Audit / platform audit controls',cobol:'Connectivity is driver/vendor specific; do not assume Db2-style precompiler'}
};

const COBOL_PROFILE={
 ibm:{name:'IBM Enterprise COBOL / z/OS',chip:'🟦',compiler:'IBM Enterprise COBOL',runtime:'z/OS Language Environment',db:'Db2 embedded SQL',tp:'CICS',batch:'JCL / JES'},
 gnu:{name:'GnuCOBOL / Open Systems',chip:'🟢',compiler:'GnuCOBOL',runtime:'Open-system runtime / OS',db:'Driver or external integration varies',tp:'No CICS assumption',batch:'Shell / scheduler / OS tooling varies'},
 oracle:{name:'Oracle Pro*COBOL context',chip:'🔴',compiler:'COBOL compiler + Pro*COBOL precompiler',runtime:'Host OS / Oracle runtime libraries',db:'Oracle Database embedded SQL',tp:'Transaction monitor depends on architecture',batch:'Scheduler / OS tooling depends on environment'}
};

const SCHED={
 generic:{name:'Generic Enterprise Scheduler',chip:'📅',what:'Calendar / dependency / release / rerun orchestration'},
 controlm:{name:'BMC Control-M',chip:'🟠',what:'Enterprise workflow scheduling and job orchestration'},
 jp1:{name:'JP1/AJS3',chip:'🔷',what:'JP1/Automatic Job Management System 3 context'},
 ibmzws:{name:'IBM Z Workload Scheduler',chip:'🔵',what:'z/OS workload scheduling / dependency context'}
};

const LAYERS={
 sql:[['① SQL Language','SELECT / JOIN / UPDATE / DDLなど「何をしたいか」を表す言語。'],['② DBMS / Product','Db2 / Oracle / PostgreSQL / SQL Server。catalog・monitor・planの実装が変わる。'],['③ Schema / Object','Table / Index / Constraint / View。データ構造と物理設計。'],['④ Transaction / Concurrency','COMMIT / ROLLBACK / Lock / Isolation / Deadlock。整合性の層。'],['⑤ Application / Batch','COBOL / Java / API / BatchからDBを利用。業務完了はDBだけでは決まらない。']],
 cobol:[['① COBOL Language','PIC / MOVE / IF / PERFORM / READ / WRITE。業務ロジックの言語。'],['② Compiler / Runtime','IBM Enterprise COBOL / GnuCOBOL / Pro*COBOL precompile等。言語そのものと実装を分ける。'],['③ Host Platform','z/OS / Linux等の実行基盤。COBOL = mainframe ではない。'],['④ Integration','Db2 / Oracle / CICS / File / MQ等。EXEC SQL / EXEC CICSはCOBOL外部機能との境界。'],['⑤ Batch / Operation','JCL / JES / Scheduler / return code / downstream。運用完了まで追う。']],
 jcl:[['① Enterprise Scheduler','時刻・営業日・ジョブ間依存・再実行運用。JCLとは別レイヤ。'],['② JES','Jobの受付・実行・spool/output。JES messageはJCL文そのものではない。'],['③ JCL','JOB / EXEC / DD / DISP / PROC。何をどう実行するかを定義。'],['④ Program / Utility','COBOL / DFSORT / IDCAMS等。実際の処理ロジックやutility。'],['⑤ Dataset / DB / Downstream','入力・出力・Db2 commit・後続job。業務完了判定の層。']],
 cloud:[['① Business / SLO','重要業務・顧客影響・SLO・RTO/RPOを先に固定。'],['② Responsibility / Account','Shared responsibility / account-project-subscription-tenancy / owner。'],['③ Network','VPC / VNet / VCN / subnet / route / DNS / LB / private path。'],['④ Compute','VM / container / serverless。実行モデルとfailure domain。'],['⑤ Data / Messaging','RDB / object / queue / replication / consistency / idempotency。'],['⑥ Identity / Security','IAM / RBAC / key / secret / certificate / WAF。'],['⑦ Observe / Change / Hybrid / DR','metrics / logs / audit / IaC / dedicated link / backup / DR / reconciliation。']],
 aws:null,gcp:null,azure:null,
 'financial-war-room':[['① Business Impact','顧客・重要業務・件数・金額・締切。原因より先にSeverityを決める。'],['② Channel / Edge','DNS / TLS / WAF / Load Balancer / API入口。'],['③ Network / Compute','VPC/VNet/VCN・hybrid path・VM/container・release。'],['④ Data / Async','DB / replica / lock / queue / idempotency / authoritative source。'],['⑤ Core / Batch','COBOL / JCL / JES / scheduler / partial commit / dataset。'],['⑥ Control / Audit','IAM / key / secret / change / control-plane audit / rollback。'],['⑦ Reconcile / Communicate','technical SLI + financial reconciliation + status communication。']]
};
LAYERS.aws=LAYERS.cloud;LAYERS.gcp=LAYERS.cloud;LAYERS.azure=LAYERS.cloud;

const PROFILE_META={
 sql:{key:'fit_sql_profile',def:'db2',options:DB},
 cobol:{key:'fit_cobol_profile',def:'ibm',options:COBOL_PROFILE},
 jcl:{key:'fit_jcl_scheduler',def:'generic',options:SCHED},
 cloud:{key:'fit_cloud_provider',def:'common',options:CLOUD},
 'financial-war-room':{key:'fit_war_provider',def:'common',options:CLOUD}
};

function profileState(){
 if(MOD==='aws')return {id:'aws',item:CLOUD.aws,fixed:true};
 if(MOD==='gcp')return {id:'gcp',item:CLOUD.gcp,fixed:true};
 if(MOD==='azure')return {id:'azure',item:CLOUD.azure,fixed:true};
 const p=PROFILE_META[MOD];if(!p)return null;const id=read(p.key,p.def);return{id,item:p.options[id]||p.options[p.def],meta:p,fixed:false};
}

function uniq(a){const s=new Set;return a.filter(x=>{const k=x.kind+'|'+x.label;if(s.has(k))return false;s.add(k);return true})}
function chip(kind,label){return {kind,label}}

function classify(text,moduleId){
 const id=moduleId||MOD,t=String(text||''),u=t.toUpperCase(),out=[];
 if(id==='sql'){
   if(/EXEC\s+SQL/.test(u))out.push(chip('boundary','🔗 Embedded SQL / App boundary'));
   if(/\b(SELECT|INSERT|UPDATE|DELETE|MERGE|JOIN|WHERE|GROUP BY|HAVING|ORDER BY)\b/.test(u))out.push(chip('concept','🧾 SQL Language'));
   if(/\b(COMMIT|ROLLBACK|TRANSACTION|ISOLATION|LOCK|DEADLOCK|LOST UPDATE)\b/.test(u))out.push(chip('concept','🔒 Transaction / Concurrency'));
   if(/\b(INDEX|EXPLAIN|ACCESS PATH|QUERY PLAN)\b/.test(u))out.push(chip('concept','🧠 Optimizer / Physical access'));
   if(/SYSCAT|MON_GET|SQLCODE|\bDB2\b/.test(u))out.push(chip('product','🔵 IBM Db2'));
   if(/V\$LOCK|V\$SESSION|DBMS_XPLAN|\bORACLE\b|PRO\*COBOL/.test(u))out.push(chip('product','🔴 Oracle'));
   if(/PG_LOCKS|PG_STAT_ACTIVITY|PG_CATALOG|\bPOSTGRES/.test(u))out.push(chip('product','🐘 PostgreSQL'));
   if(/SYS\.DM_TRAN_LOCKS|SHOWPLAN|\bSQL SERVER\b/.test(u))out.push(chip('product','🟪 SQL Server'));
   if(/AUDIT|LOG|MONITOR|SQLCODE|ROWS? AFFECTED|ROWCOUNT/.test(u))out.push(chip('evidence','🧾 DB Evidence'));
 }
 if(id==='cobol'){
   if(/^\s*\/\//m.test(t)||/\b(JOB|EXEC PGM=|\bDD\s+DSN=)/.test(u))out.push(chip('boundary','⚙️ JCL / Batch boundary'));
   if(/EXEC\s+SQL|SQLCODE|DB2|ORACLE/.test(u))out.push(chip('boundary','💾 Database / Embedded SQL'));
   if(/EXEC\s+CICS|\bCICS\b/.test(u))out.push(chip('boundary','🔁 CICS / TP boundary'));
   if(/\b(PIC|MOVE|PERFORM|EVALUATE|IF|ADD|SUBTRACT|COMPUTE|OCCURS)\b/.test(u))out.push(chip('concept','🟩 COBOL Language'));
   if(/\b(READ|WRITE|OPEN|CLOSE|FILE STATUS|SELECT .* ASSIGN)\b/.test(u))out.push(chip('concept','📁 COBOL File I/O'));
   if(/S0C7|RETURN-CODE|ABEND|DISPLAY|FILE STATUS=/.test(u))out.push(chip('evidence','🧾 Runtime Evidence'));
 }
 if(id==='jcl'){
   if(/^\s*\/\/.*\b(JOB|EXEC|DD)\b/m.test(t)||/\b(DISP=|STEPLIB|RESTART=|COND=|\bPROC\b|\bGDG\b)/.test(u))out.push(chip('concept','⚙️ JCL'));
   if(/\b(JES|JOBID|IEF\d+|JCL ERROR|ABEND|RC=\d+)/.test(u))out.push(chip('evidence','🖥 JES / Runtime Evidence'));
   if(/SORT FIELDS|DFSORT|IDCAMS|IEFBR14|UTILITY/.test(u))out.push(chip('product','🔧 z/OS Utility'));
   if(/SCHEDULER|JOB_A|JOB_B|CALENDAR|DEPENDENCY|RELEASE JOB/.test(u))out.push(chip('boundary','📅 Enterprise Scheduler'));
   if(/SQLCODE|COMMIT|ACCTUPD|COBOL|ROWS PROCESSED/.test(u))out.push(chip('boundary','🟩 Program / DB side'));
   if(/DSN=|CATLG|DATASET|CHECKPOINT|OUTPUT/.test(u))out.push(chip('concept','📦 Dataset / Output'));
 }
 if(['cloud','aws','gcp','azure','financial-war-room'].includes(id)){
   if(/VPC|VNET|VCN|SUBNET|ROUTE|NAT|DNS|LOAD BALANCER|ALB|NLB|SECURITY GROUP|NACL|NETWORK|RESOLVER/.test(u))out.push(chip('concept','🌐 Network / Edge'));
   if(/EC2|COMPUTE ENGINE|VIRTUAL MACHINE|\bVM\b|CONTAINER|ECS|EKS|GKE|AKS|LAMBDA|FUNCTION|CLOUD RUN|OCI COMPUTE|CPU|MEMORY/.test(u))out.push(chip('concept','🖥 Compute'));
   if(/RDS|AURORA|CLOUD SQL|ALLOYDB|AZURE SQL|AUTONOMOUS|EXADATA|BASE DATABASE|DATABASE|\bDB\b|REPLICA|LOCK|LEDGER|COMMIT/.test(u))out.push(chip('concept','💾 Data'));
   if(/SQS|SNS|PUB\/SUB|SERVICE BUS|QUEUE|KAFKA|EVENTBRIDGE|CONSUMER|BACKLOG|DLQ|INGEST/.test(u))out.push(chip('concept','📨 Async / Messaging'));
   if(/IAM|RBAC|ENTRA|KMS|KEY VAULT|OCI VAULT|SECRET|CERTIFICATE|TLS|WAF|AUTH|CREDENTIAL/.test(u))out.push(chip('concept','🛡 Identity / Security'));
   if(/CLOUDWATCH|CLOUDTRAIL|CLOUD MONITORING|CLOUD LOGGING|AUDIT LOG|AZURE MONITOR|ACTIVITY LOG|OCI MONITORING|OCI AUDIT|METRIC|TRACE|LOG/.test(u))out.push(chip('evidence','📊 Observability / Audit'));
   if(/DIRECT CONNECT|INTERCONNECT|EXPRESSROUTE|FASTCONNECT|VPN|BGP|HYBRID|ON-PREM|CORE LINK/.test(u))out.push(chip('concept','🔗 Hybrid Connectivity'));
   if(/RPO|RTO|BACKUP|RESTORE|DR|MULTI-REGION|REGIONAL FAILURE|FAILOVER/.test(u))out.push(chip('concept','🛟 Resilience / DR'));
   if(/COST|BUDGET|FINOPS|TAGGING/.test(u))out.push(chip('boundary','💰 Cost / Governance'));
   if(/JCL|JES|S0C7|BATCH|DATASET|COBOL|STEP0\d|STEP\d/.test(u))out.push(chip('boundary','🏦 Core / Batch'));
   if(/COUNT|AMOUNT|DEBIT|CREDIT|RECONCIL|AUTHORITATIVE|DUPLICATE|CUSTOMER JOURNEY/.test(u))out.push(chip('evidence','✅ Financial Reconciliation'));
   if(/AWS|VPC|EC2|RDS|CLOUDWATCH|CLOUDTRAIL|DIRECT CONNECT/.test(u))out.push(chip('product','🟧 AWS'));
   if(/GOOGLE CLOUD|COMPUTE ENGINE|CLOUD SQL|CLOUD MONITORING|INTERCONNECT/.test(u))out.push(chip('product','🔵 Google Cloud'));
   if(/AZURE|VNET|ENTRA|EXPRESSROUTE|KEY VAULT/.test(u))out.push(chip('product','🔷 Azure'));
   if(/\bOCI\b|ORACLE CLOUD|VCN|FASTCONNECT|AUTONOMOUS AI DATABASE|EXADATA DATABASE SERVICE/.test(u))out.push(chip('product','🔴 OCI'));
 }
 if(!out.length)out.push(chip('concept','🟢 Common / Conceptual'));
 return uniq(out);
}

function cloudCategory(text){const u=String(text||'').toUpperCase();if(/VPC|VNET|VCN|SUBNET|ROUTE|NAT|DNS|LOAD BALANCER|NETWORK/.test(u))return'network';if(/EC2|COMPUTE ENGINE|VIRTUAL MACHINE|CONTAINER|ECS|EKS|GKE|AKS|LAMBDA|FUNCTION|CLOUD RUN|OCI COMPUTE/.test(u))return'compute';if(/RDS|AURORA|CLOUD SQL|ALLOYDB|AZURE SQL|AUTONOMOUS|EXADATA|BASE DATABASE|DATABASE/.test(u))return'database';if(/S3|CLOUD STORAGE|BLOB STORAGE|OBJECT STORAGE/.test(u))return'object';if(/IAM|RBAC|ENTRA/.test(u))return'iam';if(/KMS|KEY VAULT|VAULT|SECRET|CERTIFICATE|ACM/.test(u))return'key';if(/CLOUDWATCH|CLOUDTRAIL|MONITORING|AUDIT|AZURE MONITOR|ACTIVITY LOG/.test(u))return'observe';if(/DIRECT CONNECT|INTERCONNECT|EXPRESSROUTE|FASTCONNECT|VPN/.test(u))return'hybrid';return null}

function equivalent(text){
 const p=profileState();if(!p)return'';const u=String(text||'').toUpperCase();
 if(MOD==='sql'){
   const d=p.item;if(/LOCK|DEADLOCK|ISOLATION/.test(u))return `${d.chip} ${d.name}で同じ目的を見る代表例: ${d.locks}`;
   if(/EXPLAIN|INDEX|QUERY PLAN/.test(u))return `${d.chip} ${d.name}の実行計画/アクセス経路: ${d.plan}`;
   if(/FETCH FIRST|LIMIT|TOP\s*\(/.test(u))return `${d.chip} ${d.name}の行数制限: ${d.limit}`;
   if(/SYSCAT|CATALOG|INFORMATION_SCHEMA|TABLE/.test(u))return `${d.chip} ${d.name}のmetadata/catalog例: ${d.catalog}`;
   if(/EXEC\s+SQL|COBOL/.test(u))return `${d.chip} COBOL接続文脈: ${d.cobol}`;
   if(/AUDIT/.test(u))return `${d.chip} 監査文脈: ${d.audit}`;
 }
 if(MOD==='cobol'){
   const c=p.item;return `${c.chip} ${c.name}: Compiler=${c.compiler} / Runtime=${c.runtime} / DB=${c.db} / TP=${c.tp} / Batch=${c.batch}`;
 }
 if(MOD==='jcl'){
   const s=p.item;return `${s.chip} ${s.name}: ${s.what}。JCLのJOB/EXEC/DDとは別レイヤーとして扱います。`;
 }
 if(['cloud','aws','gcp','azure','financial-war-room'].includes(MOD)){
   const cat=cloudCategory(text);if(!cat)return'';const target=(p.item&&p.item[cat])||CLOUD.common[cat];return `${p.item.chip} ${p.item.name}: ${target}  ※共通概念との対応であり1:1同一サービスではありません。`;
 }
 return'';
}

function scopeHTML(scopes){return '<span class="fit-scope-row">'+scopes.map(x=>'<span class="fit-scope-chip '+esc(x.kind)+'">'+esc(x.label)+'</span>').join('')+'</span>'}
function decorateEl(el){
 if(!el||!el.textContent)return;const text=el.textContent.trim();if(!text)return;const sig=MOD+'|'+profileState()?.id+'|'+text.slice(0,500);if(el.dataset.fitContextSig===sig)return;el.dataset.fitContextSig=sig;
 el.querySelectorAll?.(':scope > .fit-scope-row,:scope > .fit-equivalent').forEach(x=>x.remove());
 const scopes=classify(text,MOD),eq=equivalent(text);
 if(el.matches('button,.choice,.action,.actionBtn,.evidenceBtn,.verifyBtn,.incident-command-choice')){
   el.insertAdjacentHTML('beforeend',scopeHTML(scopes));if(eq)el.insertAdjacentHTML('beforeend','<span class="fit-equivalent"><strong>Profile ≒</strong> '+esc(eq)+'</span>');
 }else{
   el.insertAdjacentHTML('beforebegin',scopeHTML(scopes));if(eq)el.insertAdjacentHTML('afterend','<div class="fit-equivalent"><strong>Profile ≒</strong> '+esc(eq)+'</div>');
 }
}
function decorate(root){
 const r=root&&root.querySelectorAll?root:document;
 r.querySelectorAll('pre,.terminal,.stage0Console,.stage0-console,.choice,.action,.actionBtn,.evidenceBtn,.verifyBtn,.incident-command-choice').forEach(decorateEl);
}

function currentTitle(){const h=document.querySelector('h1');return h?(h.textContent||''):''}
function expected(title){const u=(title||'').toUpperCase();
 if(MOD==='sql'){if(/LOCK|ISOLATION|DEADLOCK|TRANSACTION/.test(u))return['Transaction / Concurrency','Data'];if(/INDEX|EXPLAIN/.test(u))return['Optimizer','SQL Language'];if(/RECON|BALANCE|照合|残高/.test(title))return['Data','Financial Reconciliation'];return['SQL Language'];}
 if(MOD==='cobol'){if(/JCL/.test(u))return['JCL'];if(/DB2|CICS/.test(u))return['Database','CICS'];if(/S0C7|INCIDENT|障害/.test(u+title))return['Runtime','Database','COBOL File I/O'];return['COBOL Language'];}
 if(MOD==='jcl'){if(/SCHEDULER/.test(u))return['Scheduler'];if(/ABEND|JCL ERROR|INCIDENT/.test(u))return['JCL','JES'];if(/RESTART|RERUN/.test(u))return['JCL','Dataset','Program'];return['JCL'];}
 if(['cloud','aws','gcp','azure'].includes(MOD)){if(/IAM|KMS|SECRET|CERT|WAF|SECURITY/.test(u))return['Identity / Security'];if(/VPC|VNET|NETWORK|ROUTE|DNS|LOAD|HYBRID|DIRECT|INTERCONNECT|EXPRESS|FASTCONNECT/.test(u))return['Network','Hybrid'];if(/DATABASE|RDS|SQL|STORAGE|REPLICA/.test(u))return['Data'];if(/MONITOR|AUDIT|OBSERV/.test(u))return['Observability'];if(/DR|BACKUP|RPO|RTO/.test(u))return['Resilience'];return[];}
 return[];
}
function specialCoach(text,title){const u=String(text||'').toUpperCase(),t=String(title||'').toUpperCase();
 if(MOD==='sql'&&/LOCK|DEADLOCK|ISOLATION/.test(t)&&/EXPLAIN|INDEX/.test(u))return'EXPLAIN/IndexはOptimizer・物理アクセスのEvidenceです。いま見たいのがLock/Isolationなら、まず待ち・保持Lock・session/transactionを確認します。';
 if(MOD==='cobol'&&/S0C7|INCIDENT/.test(t)&&/^\s*\/\//m.test(text))return'S0C7はプログラム実行中のdata exception候補です。JCL文法と同じレイヤーではありません。まず入力データ・処理位置・runtime evidenceを確認します。';
 if(MOD==='jcl'&&/RESTART|RERUN/.test(t)&&/RC=0|RC=0000/.test(u))return'RC=0はstepの正常終了Evidenceで、再実行安全性の証明ではありません。既commit・catalog済みoutput・checkpoint・downstreamを確認します。';
 if(['cloud','aws','gcp','azure','financial-war-room'].includes(MOD)&&/SYSTEMCTL|VMSTAT|HOST FIREWALL|FIREWALL-CMD|UFW/.test(u)&&/SECURITY GROUP|VPC|VNET|VCN|WAF|IAM/.test(t))return'Host OSのEvidenceとCloud control-planeの設定は別レイヤーです。どちらを確認したい仮説かを分けてください。';
 return'';
}
let coachTimer=null;function showCoach(msg){if(!msg)return;document.querySelector('.fit-coach')?.remove();const d=document.createElement('div');d.className='fit-coach';d.innerHTML='<b>🧭 Wrong Layer Coach</b><br>'+esc(msg);document.body.appendChild(d);clearTimeout(coachTimer);coachTimer=setTimeout(()=>d.remove(),6500)}
function coachForClick(el){const text=el?.textContent||'',title=currentTitle(),sp=specialCoach(text,title);if(sp){showCoach(sp);return}const want=expected(title);if(!want.length)return;const got=classify(text,MOD).map(x=>x.label);const hit=want.some(w=>got.some(g=>g.toUpperCase().includes(w.toUpperCase())));if(!hit&&got.length&&got[0]!=='🟢 Common / Conceptual')showCoach(`その選択は「${got.join(' / ')}」の観点です。現在のLabは主に「${want.join(' / ')}」を確認したい場面。コマンドや文法が正しくても、目的のレイヤーが違うことがあります。`)}

function layerRows(){return (LAYERS[MOD]||[]).map((r,i)=>'<div class="fit-layer-row"><b>'+esc(r[0])+'</b><span>'+esc(r[1])+'</span></div>'+(i<(LAYERS[MOD]||[]).length-1?'<div class="fit-layer-arrow">↓</div>':'')).join('')}
function profileSelector(){const p=profileState();if(!p)return'';if(p.fixed)return '<div class="fit-profile-box"><label>Current provider</label><b>'+esc(p.item.chip+' '+p.item.name)+'</b><span class="fit-profile-note">この教材はprovider固有。下の比較表では共通概念から他provider/OCIへ翻訳できます。</span></div>';
 const m=p.meta;return '<div class="fit-profile-box"><label>Context profile</label><select id="fitProfileSelect">'+Object.entries(m.options).map(([k,v])=>'<option value="'+esc(k)+'" '+(k===p.id?'selected':'')+'>'+esc(v.chip+' '+v.name)+'</option>').join('')+'</select><span class="fit-profile-note">Labの正本シナリオは複製せず、選択profileの用語・Evidenceを「≒概念対応」として重ねます。</span></div>'}
function dbMatrix(){return '<table class="fit-context-matrix"><tr><th>Concept</th><th>Db2</th><th>Oracle</th><th>PostgreSQL</th><th>SQL Server</th></tr><tr><td>Lock evidence</td><td>'+esc(DB.db2.locks)+'</td><td>'+esc(DB.oracle.locks)+'</td><td>'+esc(DB.postgres.locks)+'</td><td>'+esc(DB.sqlserver.locks)+'</td></tr><tr><td>Plan</td><td>'+esc(DB.db2.plan)+'</td><td>'+esc(DB.oracle.plan)+'</td><td>'+esc(DB.postgres.plan)+'</td><td>'+esc(DB.sqlserver.plan)+'</td></tr><tr><td>Catalog</td><td>'+esc(DB.db2.catalog)+'</td><td>'+esc(DB.oracle.catalog)+'</td><td>'+esc(DB.postgres.catalog)+'</td><td>'+esc(DB.sqlserver.catalog)+'</td></tr></table>'}
function cloudMatrix(){return '<table class="fit-context-matrix"><tr><th>Concept</th><th>AWS</th><th>Google Cloud</th><th>Azure</th><th>OCI</th></tr>'+[['Network','network'],['Compute','compute'],['Database','database'],['Identity','iam'],['Key/Secret','key'],['Observe/Audit','observe'],['Hybrid','hybrid']].map(([n,k])=>'<tr><td>'+n+'</td><td>'+esc(CLOUD.aws[k])+'</td><td>'+esc(CLOUD.gcp[k])+'</td><td>'+esc(CLOUD.azure[k])+'</td><td>'+esc(CLOUD.oci[k])+'</td></tr>').join('')+'</table>'}
function contextExtra(){
 if(MOD==='sql')return '<div class="fit-context-card" style="grid-column:1/-1"><h3>DBMS translation matrix</h3>'+dbMatrix()+'<p>同じ目的でもmonitor view・catalog・plan確認方法は製品実装が異なります。完全互換ではありません。</p></div>';
 if(MOD==='cobol')return '<div class="fit-context-card"><h3>Platform profiles</h3><ul><li>IBM: Enterprise COBOL + z/OS + Db2/CICS + JCL</li><li>GnuCOBOL: Open systems learning/runtime context</li><li>Oracle: Pro*COBOL precompile + Oracle Database</li></ul></div><div class="fit-context-card"><h3>Boundary rule</h3><p>EXEC SQLはDB連携、EXEC CICSはTP基盤、//JOBはJCL。COBOL文法と外部基盤を同じ色にしません。</p></div>';
 if(MOD==='jcl')return '<div class="fit-context-card"><h3>Scheduler examples</h3><ul><li>BMC Control-M</li><li>JP1/Automatic Job Management System 3</li><li>IBM Z Workload Scheduler</li></ul></div><div class="fit-context-card"><h3>Boundary rule</h3><p>Schedulerは営業日・依存・release、JESはjob実行基盤、JCLはJOB/EXEC/DD、Program/Utilityが処理本体です。</p></div>';
 if(['cloud','aws','gcp','azure','financial-war-room'].includes(MOD))return '<div class="fit-context-card" style="grid-column:1/-1"><h3>Cross-provider conceptual map</h3>'+cloudMatrix()+'<p>OCIはCloud Fundamentals / War Roomの翻訳profileとして追加。必要になれば将来20-Lab packageへ分離可能です。</p></div>';
 return'';
}
function openContext(){document.querySelector('.fit-context-modal')?.remove();const d=document.createElement('div');d.className='fit-context-modal';d.innerHTML='<div class="fit-context-dialog" role="dialog" aria-modal="true"><div class="fit-context-head"><div><div class="fit-scope-chip concept">Concept → Product → Evidence</div><h2>🧭 Context / Layer Guide</h2></div><button class="fit-context-close" aria-label="閉じる">×</button></div><div class="fit-context-principle"><strong>同じ軸を混ぜない。</strong> 共通概念、製品実装、運用Evidenceを分離します。製品間の対応は <b>＝</b> ではなく <b>≒ conceptual mapping</b>。まず「何を確認したいか」を決め、その後で製品固有のコマンド/ビューへ降ります。</div>'+profileSelector()+'<div class="fit-layer-stack">'+layerRows()+'</div><div class="fit-context-grid"><div class="fit-context-card"><h3>使い方</h3><ul><li>緑: 共通概念</li><li>青/紫: 製品・境界</li><li>黄: Evidence</li><li>Wrong Layer Coach: 正しい操作でも目的レイヤが違うと通知</li></ul></div><div class="fit-context-card"><h3>Canonical + Adapter</h3><p>Lab本文は1つの正本を保ち、profileで言葉・診断Evidenceを翻訳します。製品ごとの教材コピーを作らず、差分だけを学びます。</p></div>'+contextExtra()+'</div></div>';document.body.appendChild(d);d.querySelector('.fit-context-close').onclick=()=>d.remove();d.addEventListener('click',e=>{if(e.target===d)d.remove()});const sel=d.querySelector('#fitProfileSelect');if(sel){sel.onchange=()=>{const meta=PROFILE_META[MOD];write(meta.key,sel.value);d.remove();refreshAll();openContext()}}}
function addButton(){if(document.querySelector('.fit-context-open'))return;const b=document.createElement('button');b.className='fit-context-open';b.type='button';b.textContent='🧭 Context';b.onclick=openContext;document.body.appendChild(b)}
function addStrip(){if(document.querySelector('.fit-profile-strip'))return;const p=profileState();if(!p)return;const top=document.querySelector('.topbar,.top');if(!top)return;const d=document.createElement('div');d.className='fit-profile-strip';d.innerHTML='<b>'+esc(p.item.chip+' '+p.item.name)+'</b><span>Concept ≒ Product ≒ Evidence</span><button type="button">Layer / Profileを見る</button>';d.querySelector('button').onclick=openContext;top.insertAdjacentElement('afterend',d)}
function refreshAll(){document.querySelectorAll('[data-fit-context-sig]').forEach(x=>delete x.dataset.fitContextSig);document.querySelector('.fit-profile-strip')?.remove();addStrip();decorate(document)}

addButton();addStrip();decorate(document);
document.addEventListener('click',e=>{const el=e.target.closest?.('.choice,.action,.actionBtn,.evidenceBtn,.verifyBtn,.incident-command-choice');if(el)setTimeout(()=>coachForClick(el),0)},true);
new MutationObserver(ms=>{let touched=false;for(const m of ms){for(const n of m.addedNodes||[]){if(n.nodeType===1){decorate(n);touched=true}}if(m.type==='characterData')touched=true}if(touched){addStrip();decorate(document)}}).observe(document.body,{subtree:true,childList:true,characterData:true});

window.FITContext={module:MOD,classify,profile:profileState,showCoach,open:openContext,cloud:CLOUD,db:DB};
})();
