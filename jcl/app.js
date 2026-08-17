const GROUPS=['基礎','運用・データ','金融バッチ実務'];
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let runtime=null;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function key(id){return 'jcl_batch_lab'+String(id).padStart(2,'0')+'_complete'}
function hash(id){return '#lab'+String(id).padStart(2,'0')}
function curLab(){const m=location.hash.match(/^#lab(\d{1,2})$/i);return m?LABS.find(x=>x.id===Number(m[1])):null}
function topNav(lab){
 const n=document.getElementById('topNav');
 if(!lab){n.innerHTML='<a href="#home">20 Labs</a><span>z/OS Batch 学習シミュレーター</span>';return}
 const p=LABS.find(x=>x.id===lab.id-1),q=LABS.find(x=>x.id===lab.id+1);
 n.innerHTML='<a href="#home">⌂ Labs</a>'+(p?'<a href="'+hash(p.id)+'">← Lab '+String(p.id).padStart(2,'0')+'</a>':'')+(q?'<a href="'+hash(q.id)+'">Lab '+String(q.id).padStart(2,'0')+' →</a>':'')
}
function home(){
 runtime=null;topNav(null);
 let done=LABS.filter(x=>store.get(key(x.id))==='true').length;
 let groups=GROUPS.map(g=>{
  let cards=LABS.filter(x=>x.group===g).map(x=>'<a class="labcard '+(store.get(key(x.id))==='true'?'complete':'')+'" href="'+hash(x.id)+'"><span class="done">✅</span><div class="num">LAB '+String(x.id).padStart(2,'0')+'</div><h3>'+esc(x.title)+'</h3><div class="desc">'+esc(x.subtitle)+'</div></a>').join('');
  return '<section class="group"><h2>'+esc(g)+'</h2><div class="labgrid">'+cards+'</div></section>'
 }).join('');
 document.getElementById('app').innerHTML=`<section class="card hero"><div class="heroGrid"><div><div class="kicker">FINANCIAL JCL / BATCH OPERATIONS LAB 01–20</div><h1>夜間バッチを、<br>流して・止めて・復旧する。</h1><p class="muted">目標はJCL暗記ではありません。<strong>JOBを投入する → STEPを追う → DD/データセットを読む → RC/ABENDを分類する → 安全にrestartする → 朝までに業務復旧する</strong>20 Labsです。</p><div class="chips"><span class="chip">JOB / EXEC / DD</span><span class="chip">JES / Spool</span><span class="chip">DISP / GDG</span><span class="chip">Restart</span><span class="chip">Night War Room</span></div></div><div class="goal"><strong>修了ライン</strong><div>「夜間バッチがSTEP03で止まった」に対し、JOB ID・JES出力・RC/ABEND・データ副作用を確認し、再実行範囲と検証項目を説明できる。</div><div class="progress"><div style="width:${done/20*100}%"></div></div><div class="summary"><span class="pill"><b>${done}</b> / 20 COMPLETE</span><span class="pill">最終: Night Batch War Room</span></div></div></div></section>
<section class="card stage0" id="stage0"><div class="stage0top"><div><div class="kicker">LEARNING STEP 0</div><h2 style="font-size:24px;margin-top:4px">JCLって、そもそも何をするの？</h2><p class="muted" style="margin-bottom:0">COBOLが「業務処理を書く言語」なら、JCLはz/OSへ<strong>どのジョブで・どのプログラムを・どのデータを使って・どの順番で動かすか</strong>を伝える側。まず夜間バッチ1本の流れを動かそう。</p></div><a class="startBtn" href="#lab01">Lab01へ →</a></div>
<div class="stage0Grid"><div><div class="flow0"><div class="node0" id="s0n0"><b>🗓 Scheduler</b><span>営業日・時刻・依存</span></div><div class="node0" id="s0n1"><b>📥 JES</b><span>ジョブ受付</span></div><div class="node0" id="s0n2"><b>📜 JCL</b><span>JOB/STEP/DD</span></div><div class="node0" id="s0n3"><b>🟩 Program</b><span>COBOL等を実行</span></div><div class="node0" id="s0n4"><b>🗃 Data</b><span>入力/出力</span></div><div class="node0" id="s0n5"><b>✅ Spool</b><span>RC/ログ/出力</span></div></div>
<div class="stage0Btns"><button onclick="stage0(0)">① バッチ時刻</button><button onclick="stage0(1)">② JESへ投入</button><button onclick="stage0(2)">③ JCLを読む</button><button onclick="stage0(5)">④ 結果を見る</button></div><div class="stage0Console" id="s0console">まだ何もしていません。①から押してみよう。</div></div>
<div class="roles"><div class="role"><b>JCL</b><small>z/OSへジョブ、実行ステップ、データセットや出力などの実行条件を伝えるJob Control Language。</small></div><div class="role"><b>COBOL</b><small>口座計算・照合などの業務ロジックを書くプログラミング言語。JCLとは役割が違う。</small></div><div class="role"><b>JES</b><small>ジョブを受け取り、z/OSでの処理へ渡し、ジョブ出力を管理するJob Entry Subsystem。</small></div><div class="role"><b>Scheduler</b><small>ジョブ間依存・時刻・営業日などを管理する外側のワークロード管理。JCLと同じものではない。</small></div><div class="role"><b>まず覚える3つ</b><small><b>JOB = ジョブ全体 / EXEC = 1ステップで何を動かす / DD = どのデータ・出力を使う</b></small></div></div></div></section>
${groups}<section class="card outcome"><h2>修了時の到達像</h2><div class="layers"><span>JOB / EXEC / DD</span><span>JES / Spool</span><span>RC / CC</span><span>DISP</span><span>SYSIN / SYSOUT</span><span>PROC / Symbol</span><span>STEPLIB</span><span>Temporary DS</span><span>GDG</span><span>DFSORT</span><span>Scheduler</span><span>ABEND</span><span>Restart</span></div><p class="muted">「JCLを書ける人」だけでなく、金融ITの会議で『どのJOB ID？どのSTEP？RCかABENDか？前回出力は残っている？GDGは？DBはcommit済み？どこから安全に再実行する？』と具体的に確認できる状態を狙います。</p></section><p class="footer">※ 学習用シミュレーターです。CLASS/MSGCLASS、データセット規約、Scheduler、PROC、Db2接続、restart/cleanup等はサイト標準で異なります。本番環境では所属組織のRunbook・権限・変更管理・監査ルールを優先してください。</p>`
}
function stage0(i){
 document.querySelectorAll('.node0').forEach((e,n)=>e.classList.toggle('on',n<=i));
 const t=[
 "🗓 00:30 EOD chain start\nScheduler: business-day calendar OK\nDependency: daytime close complete",
 "📥 SUBMIT BANKEOD\nJES: BANKEOD(JOB10688) accepted\n\nJESがジョブを受け取りました。",
 "📜 JCL\n//BANKEOD JOB ...\n//STEP01 EXEC PGM=IMPORT\n//INFILE DD DSN=BANK.TXN.DAILY,DISP=SHR\n\nJOB=全体 / EXEC=動かすもの / DD=使うデータ",
 "🟩 STEP01 IMPORT\n→ INFILEを読む\n→ 処理する\n→ RCを返す",
 "🗃 Input BANK.TXN.DAILY\n→ Program\n→ Output / DB / Report",
 "✅ JES spool\nSTEP01 RC=0000\nSTEP02 RC=0000\nJOB BANKEOD ENDED\n\nここから『何が実行され、どう終わったか』を追えます。"
 ];
 document.getElementById('s0console').textContent=t[i]||t[5]
}
function renderLab(lab){
 topNav(lab);
 runtime={lab,mode:'basic',selected:0,state:Object.assign({},lab.initial),diff:['まだ状態変更はありません。'],doneActions:[],lastFlow:0,lastStatement:'',lastOutput:'JCL>'};
 drawLab()
}
function drawLab(){
 const r=runtime,l=r.lab;
 document.getElementById('app').innerHTML=`<section class="card labHero"><div class="num">LAB ${String(l.id).padStart(2,'0')} / ${esc(l.group)}</div><h1 style="font-size:clamp(28px,4vw,44px);margin-top:8px">${esc(l.title)}</h1><p class="muted">${esc(l.subtitle)}</p><div class="goal"><strong>このLabのゴール</strong>${esc(l.goal)}</div><div class="chips scope">${l.scope.map(x=>'<span class="chip">'+esc(x)+'</span>').join('')}</div><div class="process" id="process"></div><div class="dash"><div><h2>いまの状態</h2><div class="statusGrid" id="statusGrid"></div></div><div><h2>状態DIFF — 何が変わった？</h2><div class="diff" id="diff"></div></div></div></section>
<section class="card workspace"><div class="modebar"><button class="mode" data-mode="basic">基本</button><button class="mode" data-mode="select">選択</button><button class="mode" data-mode="input">入力</button></div><p class="modeNote" id="modeNote"></p><div class="workgrid"><div class="pane"><div class="ptitle">ミッション / 操作</div><div class="actionList" id="actions"></div></div><div class="pane"><div class="ptitle">JCL / 運用判断を考える</div><div id="challenge"></div></div><div class="pane"><div class="ptitle">実行結果 / JES・Batchコンソール</div><div class="terminal" id="terminal">JCL&gt;</div></div></div><div class="lesson"><div class="lessonBadge">💡 ここがポイント</div><div id="lesson">操作すると、JCL・結果・状態変化の意味をここに表示します。</div></div><div class="breakdown"><h2>1行分解 / 証拠分解</h2><div id="tokens"><div class="muted">まだ操作していません。</div></div></div></section>
<section class="card quiz"><h2>理解チェック</h2><p>${esc(l.quiz.q)}</p><div class="quizOpts" id="quizOpts"></div><div class="quizResult" id="quizResult"></div></section><p class="footer">※ 学習用シミュレーター。実環境のJCL変更・再実行・データセット操作は承認済みRunbookと運用手順に従ってください。</p>`;
 bind();updateAll()
}
function bind(){
 document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{runtime.mode=b.dataset.mode;updateAll()});
 document.getElementById('quizOpts').innerHTML=runtime.lab.quiz.options.map((o,i)=>'<button class="quizOpt" data-q="'+i+'">'+esc(o)+'</button>').join('');
 document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>quiz(Number(b.dataset.q)))
}
function updateAll(){
 const r=runtime,l=r.lab;
 document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===r.mode));
 const notes={basic:'基本：操作すると、裏で使うJCL/運用情報と結果を見ながら理解します。',select:'選択：ミッションに合うJCL/判断を3択から選びます。',input:'入力：自分でJCLまたは確認文を書きます。空白・改行の違いはある程度許容します。'};
 document.getElementById('modeNote').textContent=notes[r.mode];
 updateStatus();
 document.getElementById('actions').innerHTML=l.actions.map((a,i)=>'<button class="action '+(r.doneActions.includes(i)?'doneAction':'')+'" data-a="'+i+'"><span class="idx">'+String(i+1).padStart(2,'0')+'</span>'+esc(a.label)+'</button>').join('');
 document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{r.selected=Number(b.dataset.a);if(r.mode==='basic')execute(r.selected);else updateChallenge()});
 updateChallenge()
}
function updateStatus(){
 const r=runtime,l=r.lab;
 document.getElementById('process').innerHTML=l.flow.map((x,i)=>'<div class="step '+(i<r.lastFlow?'done ':'')+(i===r.lastFlow?'active':'')+'">'+esc(x)+'</div>').join('');
 document.getElementById('statusGrid').innerHTML=Object.entries(r.state).map(([k,v])=>'<div class="status"><div class="k">'+esc(k)+'</div><div class="v">'+esc(v)+'</div></div>').join('');
 document.getElementById('diff').innerHTML=r.diff.map(x=>'<div>'+x+'</div>').join('')
}
function updateChallenge(){
 const r=runtime,a=r.lab.actions[r.selected],c=document.getElementById('challenge');
 if(r.mode==='basic'){
   c.innerHTML='<div class="mission"><small>操作</small><b>'+esc(a.label)+'</b><p class="muted">'+esc(a.prompt)+'</p><pre style="white-space:pre-wrap;color:#f7e8bd;background:#05070b;border:1px solid #313845;border-radius:9px;padding:10px">'+esc(a.statement)+'</pre><div class="muted" style="font-size:13px">左の操作ボタンを押すと実行します。</div></div>';return
 }
 if(r.mode==='select'){
   const shift=(r.lab.id+r.selected)%a.choices.length;
   r.currentChoices=a.choices.slice(shift).concat(a.choices.slice(0,shift));
   c.innerHTML='<div class="mission"><small>ミッション</small><b>'+esc(a.prompt)+'</b></div><div class="choiceList">'+r.currentChoices.map((x,i)=>'<button class="choice" data-c="'+i+'">'+esc(x)+'</button>').join('')+'</div><div class="feedback" id="feedback"></div>';
   document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.c)));return
 }
 c.innerHTML='<div class="mission"><small>ミッション</small><b>'+esc(a.prompt)+'</b></div><textarea class="codeinput" id="jclInput" placeholder="JCL / 確認内容を入力"></textarea><button class="run" id="runJcl">▶ 判定して実行</button><div class="feedback" id="feedback"></div>';
 document.getElementById('runJcl').onclick=runInput
}
function norm(s){return String(s).trim().replace(/\s+/g,' ').toUpperCase()}
function choose(i){
 const r=runtime,a=r.lab.actions[r.selected],chosen=r.currentChoices[i],ok=norm(chosen)===norm(a.statement);
 [...document.querySelectorAll('[data-c]')].forEach((b,n)=>{b.classList.remove('good','bad');if(n===i)b.classList.add(ok?'good':'bad')});
 const f=document.getElementById('feedback');f.className='feedback '+(ok?'ok':'ng');f.textContent=ok?'✅ 正解。実行します。':'△ 惜しい。JOB/EXEC/DD、対象STEP、データ副作用をもう一度見よう。';
 if(ok)execute(r.selected)
}
function runInput(){
 const r=runtime,a=r.lab.actions[r.selected],v=document.getElementById('jclInput').value,N=norm(v);
 const must=a.must||[a.statement];
 const ok=must.every(t=>N.includes(norm(t)));
 const f=document.getElementById('feedback');f.className='feedback '+(ok?'ok':'ng');
 f.textContent=ok?'✅ 必要な要素が入っています。実行します。':'△ 必要な要素が足りません。ヒント: '+must.join(' / ');
 if(ok)execute(r.selected)
}
function execute(i){
 const r=runtime,a=r.lab.actions[i],before=Object.assign({},r.state);
 Object.assign(r.state,a.changes||{});
 r.lastFlow=Math.max(r.lastFlow,a.flow||0);
 if(!r.doneActions.includes(i))r.doneActions.push(i);
 let diffs=[];
 Object.keys(r.state).forEach(k=>{if(String(before[k])!==String(r.state[k]))diffs.push('<b>'+esc(k)+'</b>: '+esc(before[k])+' → '+esc(r.state[k]))});
 r.diff=diffs.length?diffs:['状態値は同じ。証拠/理解を更新しました。'];
 document.getElementById('terminal').textContent=a.statement+'\n\n'+a.output;
 document.getElementById('lesson').textContent=a.lesson;
 document.getElementById('tokens').innerHTML=a.tokens.map(x=>'<div class="tokenRow"><div class="token">'+esc(x[0])+'</div><div class="explain">'+esc(x[1])+'</div></div>').join('');
 updateStatus();
 document.querySelectorAll('[data-a]').forEach((b,n)=>b.classList.toggle('doneAction',r.doneActions.includes(n)));
 if(r.doneActions.length===r.lab.actions.length){store.set(key(r.lab.id),'true')}
}
function quiz(i){
 const l=runtime.lab,ok=i===l.quiz.answer;
 document.querySelectorAll('[data-q]').forEach((b,n)=>{b.classList.remove('correct','wrong');if(n===i)b.classList.add(ok?'correct':'wrong')});
 const x=document.getElementById('quizResult');x.textContent=(ok?'✅ 正解。':'△ 惜しい。')+l.quiz.explain;
 if(ok){store.set(key(l.id),'true')}
}
function route(){const l=curLab();if(l)renderLab(l);else home();window.scrollTo({top:0,behavior:'instant'})}
window.addEventListener('hashchange',route);
if(!location.hash)location.hash='#home';else route();
