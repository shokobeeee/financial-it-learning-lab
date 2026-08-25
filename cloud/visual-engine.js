(function(){
'use strict';

const S=window.CLOUD_SPEC;
const R=window.FIT_CLOUD_CONCEPTS;
if(!S||!R||S.id!=='cloud')return;

const store={
  get(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=id=>S.prefix+String(id).padStart(2,'0')+'_complete';
const hash=id=>'#lab'+String(id).padStart(2,'0');
const topics=S.topics.map((t,i)=>({
  id:i+1,
  group:t[0],title:t[1],subtitle:t[2],goal:t[3],scope:t[4],principle:t[5],
  q:t[6],correct:t[7],wrong1:t[8],wrong2:t[9],explain:t[10],
  concept:R.primary()[i]
}));

const LEARNING_META=[
  ['要求の流れが見えない','お客さんが「残高を見たい」と押してから、どこで処理され、どこから残高が返るのかを1本につなげます。','残高照会の流れをつなぐ'],
  ['アプリを動かす場所がない','銀行アプリもプログラムなので、どこかのコンピュータ上で動かす必要があります。','アプリを動かす場所を置く'],
  ['残高を覚えておく場所がない','アプリだけでは「100,000円」という残高を覚えておけません。消えてはいけないデータの置き場所が必要です。','残高データの置き場所を足す'],
  ['Cloudの中がひとまとまりで、通信範囲が分からない','AppとDBを「自分たちのシステムとして管理する通信範囲」で囲みたい。','自分たち用Networkで囲む'],
  ['入口とDBが同じ区画だと、公開範囲が広すぎる','利用者から見える入口と、直接見せたくないApp・DBを分けます。','公開側と内部側を分ける'],
  ['「外へ出る」と「外から入る」がごちゃごちゃ','内部Appが更新取得などで外へ出る通信と、Internetから入ってくる通信を分けて考えます。','通信の向きと道を足す'],
  ['Appが複数台になったら、利用者はどこへ行けばいい？','利用者にApp A/Bを選ばせず、1つの入口から正常なAppへ振り分けます。','1つの入口を置く'],
  ['DBへ広すぎる相手から通信できる','Networkがあるだけでは「誰からどのPortへ届いてよいか」は決まりません。必要な通信だけに絞ります。','通信相手を絞る'],
  ['1か所が壊れると全部止まる','同じ場所の障害でApp全部が止まらないよう、障害範囲を分けて配置します。','障害範囲を分ける'],
  ['保存先を全部「Storage」で一括りにしている','VMのDisk、共有File、Backup用Objectは読み書きの仕方が違います。用途で分けます。','Storageを用途で分ける'],
  ['DBの基盤運用を全部自分たちで抱えている','Patch・HA・Backupなどの一部をProviderへ任せても、Data・SQL・権限の責任は残ります。','DB運用の一部を任せる'],
  ['人もアプリも同じ強い権限を持っている','「誰が、何に、何をしてよいか」を分け、必要最小限にします。','権限を役割ごとに分ける'],
  ['Password・Key・Certificateの置き場所と更新が曖昧','秘密情報をコードへ直書きせず、保管・利用・期限・更新まで管理します。','秘密情報の管理場所を作る'],
  ['壊れても「何が起きたか」が分からない','数値、Log、処理経路、変更証跡を残して、推測ではなくEvidenceで見られるようにします。','観測できるようにする'],
  ['Dataを消した・壊した時に戻せない','Backupがあるだけでは不十分。必要な時点へ、必要時間内に戻せるかまで考えます。','戻す仕組みを作る'],
  ['1台や1Zoneではなく、Region規模で止まった','通常の冗長化より大きな障害を想定し、どこへどう切り替えるかを決めます。','DR判断に必要な証拠を集める'],
  ['Cloudは正常なのに、銀行Coreを使う処理だけ遅い','Cloud ↔ 社内Network ↔ Coreまでを1本の経路として確認します。','End-to-Endの経路を確認する'],
  ['AWS・Google Cloud・Azureで名前が変わるたびに別物に見える','製品名を共通Conceptへ戻し、同じ役割を見つけてから製品差分を確認します。','共通Conceptで比較する'],
  ['Consoleで直接変更していて、誰が何を変えたか追いにくい','変更をCode・Review・Auditで残し、差分と戻し方を説明できるようにします。','変更証跡を確認する'],
  ['複数レイヤで異常が起き、どこから見るか迷う','顧客影響を固定し、異なるレイヤのEvidenceから仮説を絞り、安全に戻して業務完了まで確認します。','War Roomを開始する']
];

const OPS_META={
  16:{evidence:'Impact: 残高照会がRegion Aで利用不可\nLast known good: 14:02\nData replication: target Regionへ追随中\nBusiness RTO/RPO: 定義済み',verify:'切替先のHealthだけでなく、残高照会・取引件数・金額・正本Dataを再照合する。'},
  17:{evidence:'Cloud内App/DB: normal\nCore呼出だけlatency上昇\nPrimary path: packet lossあり\nBackup path: normal',verify:'Cloud側のGreenだけで閉じず、Core応答・Route・顧客導線をEnd-to-Endで確認する。'},
  18:{evidence:'Common concept: Virtual Network\nAWS: VPC\nAzure: VNet\nOCI: VCN\n※ service constraints / SLA / operationは同一ではない',verify:'製品名を隠して役割を説明でき、その後に各Provider名へ戻せることを確認する。'},
  19:{evidence:'Recent change: Console manual update\nReviewer: none\nRollback: unclear\nAudit trail: partial\nConfig drift: detected',verify:'IaC差分・承認・Audit・Rollback・本番状態が一致していることを確認する。'},
  20:{evidence:'Customer impact: 残高照会が一部失敗\nEdge: healthy\nApp: error増加\nData: 正本は正常\nRecent change: あり\n※ まだ原因は確定しない',verify:'Technical SLI + Customer Journey + 件数/金額/正本照合をそろえて「業務復旧」を判定する。'}
};

function isDone(id){return store.get(key(id))==='true'}
function doneCount(){return topics.filter(x=>isDone(x.id)).length}
function phaseFor(id){return id<=7?'build':id<=15?'guided':'operate'}
function phaseLabel(id){return id<=7?'🏗 見て・作る':id<=15?'🧭 選んで・理解する':'🧾 Evidenceで判断する'}
function previousMap(id){
  if(id===1)return '📱 Customer\n   ↓\n   ？\n\n「残高を見たい」は、どこを通る？';
  return S.maps[id-2]||S.maps[0]||'';
}
function currentMap(id){return S.maps[id-1]||''}
function nextHref(id){return id<20?hash(id+1):'../financial-war-room/'}
function nextLabel(id){return id<20?'次のLabへ →':'Financial War Roomへ →'}

function topNav(lab){
  const n=document.getElementById('topNav');if(!n)return;
  if(!lab){n.innerHTML='<a href="#home">20 Labs</a><span>ゼロベース学習</span>';return}
  const prev=lab.id>1?'<a href="'+hash(lab.id-1)+'">← Lab '+String(lab.id-1).padStart(2,'0')+'</a>':'';
  const next=lab.id<20?'<a href="'+hash(lab.id+1)+'">Lab '+String(lab.id+1).padStart(2,'0')+' →</a>':'';
  n.innerHTML='<a href="#home">⌂ Labs</a>'+prev+next;
}

function phasePills(id){
  const active=phaseFor(id);
  return `<div class="vlPhaseBar"><span class="vlPhasePill ${active==='build'?'active':''}">01–07 見て・作る</span><span class="vlPhasePill ${active==='guided'?'active':''}">08–15 選んで・理解</span><span class="vlPhasePill ${active==='operate'?'active':''}">16–20 Evidenceで判断</span></div>`;
}

function home(){
  topNav(null);
  const done=doneCount();
  const cards=S.groups.map(group=>`<section class="group"><h2>${esc(group)}</h2><div class="labgrid">${topics.filter(x=>x.group===group).map(l=>`<a class="labcard ${isDone(l.id)?'complete':''}" href="${hash(l.id)}"><span class="done">✅</span><div class="num">LAB ${String(l.id).padStart(2,'0')}</div><h3>${esc(l.title)}</h3><div class="desc">${esc(l.subtitle)}</div><div class="vlLearningMode">${phaseLabel(l.id)}</div></a>`).join('')}</div></section>`).join('');
  const st=S.stage;
  document.getElementById('app').innerHTML=`
    <section class="card hero"><div class="heroGrid"><div><div class="kicker">${esc(S.kicker)}</div><h1>${S.hero}</h1><p class="muted">${esc(S.description)}</p><div class="chips">${S.chips.map(x=>'<span class="chip">'+esc(x)+'</span>').join('')}</div></div><div class="goal"><strong>修了ライン</strong>${esc(S.finish)}<div class="progress"><div style="width:${done/20*100}%"></div></div><div class="summary"><span class="pill">${done} / 20 COMPLETE</span><span class="pill">最終: Cloud War Room</span></div></div></div></section>
    <section class="vlHomeGuide"><h2>このCloud教材だけ、学び方が途中で変わります</h2><div class="vlHomePhases"><div class="vlHomePhase"><b>🏗 Lab01–07　見て・作る</b><span>問題を解く前に、銀行Webへ部品を1つずつ足して意味を理解。</span></div><div class="vlHomePhase"><b>🧭 Lab08–15　選んで・理解</b><span>困りごとに対して、どの考え方を使うかを3択で判断。</span></div><div class="vlHomePhase"><b>🧾 Lab16–20　Evidenceで判断</b><span>ここで初めてEvidence・復旧・業務検証を本格的に使う。</span></div></div></section>
    <section class="card stage0"><div class="stage0top"><div><div class="kicker">LEARNING STEP 0</div><h2 style="font-size:24px;margin-top:4px">${esc(st.title)}</h2><p class="muted">${esc(st.intro)}</p></div><a class="startBtn" href="#lab01">Lab01へ →</a></div><div class="stage0Grid"><div><div class="flow0">${st.nodes.map((n,i)=>'<div class="node0" id="s0n'+i+'"><b>'+n[0]+'</b><span>'+esc(n[1])+'</span></div>').join('')}</div><div class="stage0Btns">${st.nodes.map((n,i)=>'<button data-s0="'+i+'">'+(i+1)+' '+esc(n[2])+'</button>').join('')}</div></div><div><div class="stage0Console" id="s0console">${esc(st.initialConsole)}</div><div class="roles" style="margin-top:8px">${st.roles.map(r=>'<div class="role"><b>'+esc(r[0])+'</b><small>'+r[1]+'</small></div>').join('')}</div></div></div></section>
    ${cards}
    <section class="card outcome"><h2>修了時の到達像</h2><div class="layers">${R.primary().map(x=>'<span>'+esc(x.term)+'</span>').join('')}</div><p class="muted">最初から専門家のようにEvidenceを選ぶ必要はありません。まず部品の意味を理解し、次に判断し、最後に障害時の証拠へ進みます。</p></section>`;
  document.querySelectorAll('[data-s0]').forEach(b=>b.onclick=()=>{
    const i=Number(b.dataset.s0);
    document.querySelectorAll('.node0').forEach((e,n)=>e.classList.toggle('on',n<=i));
    document.getElementById('s0console').textContent=st.console[i];
  });
}

function commonHero(lab){
  return `<section class="card labHero vlLabHero"><div class="num">LAB ${String(lab.id).padStart(2,'0')} / 20</div><h1 style="font-size:clamp(28px,4vw,44px);margin-top:8px">${esc(lab.title)}</h1><p class="vlIntro">${esc(lab.subtitle)}</p><span class="vlLearningMode">${phaseLabel(lab.id)}</span>${phasePills(lab.id)}<div class="goal"><strong>今日できるようになること</strong>${esc(lab.goal)}</div></section>`;
}

function canvas(id,revealed){
  return `<section class="vlCanvasCard"><div class="vlCanvasHead"><div><strong>🏦 いま作っている銀行システム</strong><small>${revealed?'今回の部品を足した後':'まず「今どうなっているか」だけ見ればOK'}</small></div><span class="vlEyebrow">SYSTEM BUILDER</span></div><div class="vlBeforeAfter"><div class="vlMapPane"><div class="vlMapLabel">BEFORE</div><pre class="vlMap dim">${esc(previousMap(id))}</pre></div><div class="vlMapPane"><div class="vlMapLabel"><span class="new">AFTER / NEW</span></div>${revealed?`<pre class="vlMap">${esc(currentMap(id))}</pre>`:`<div class="vlMap hiddenAfter"><div><b>まだ部品を足していません</b>下のボタンを1回押すだけでOK。</div></div>`}</div></div></section>`;
}

function axisCompanion(lab){
  if(lab.concept.key==='failure-domain'){
    return `<div class="vlAxisCompare"><small>同じ「止めない設計」で一緒に使う。でも別の分類軸。</small><div class="vlAxisRows"><div><b>🧭 Failure Domain</b><span>Availability Zone / Zone = 「どこまで一緒に壊れるか」を分ける。</span></div><div><b>🖥 Compute管理 / Orchestration</b><span>Auto Scaling / MIG / VM Scale Sets = 台数・配置・置換・自動復旧を管理する。</span></div></div></div>`;
  }
  if(lab.concept.key==='managed-db'){
    return `<div class="vlAxisCompare"><small>ここも2つの話を混ぜない。</small><div class="vlAxisRows"><div><b>🗄 Managed DB</b><span>DataレイヤーのService。DB基盤運用の一部をProviderへ任せる。</span></div><div><b>🧭 Shared Responsibility</b><span>「Providerに任せた責任 / 自分たちに残る責任」を分ける考え方。</span></div></div></div>`;
  }
  return '';
}

function termReveal(lab){
  const row=lab.concept,layer=R.layers[row.layer],model=R.models[row.model];
  return `<div class="vlTermCard"><div class="vlTermIcon">${layer.icon}</div><div><small>今日の1語 / ${esc(layer.name)}</small><h3>${esc(row.term)}</h3><p>${esc(row.plain)}</p></div></div><div class="vlConceptNote">提供モデルの目安：<b>${esc(model.name)}</b>。まず共通Conceptを理解できれば十分です。</div>${axisCompanion(lab)}<details class="vlProviderDetails"><summary>↔ 各Cloudでは何て呼ぶ？（必要なら開く）</summary><div class="vlProviderMini"><div><small>AWS</small><b>${esc(row.products?.aws||'-')}</b></div><div><small>Google Cloud</small><b>${esc(row.products?.gcp||'-')}</b></div><div><small>Azure</small><b>${esc(row.products?.azure||'-')}</b></div><div><small>OCI</small><b>${esc(row.products?.oci||'-')}</b></div></div><div class="vlConceptNote">各社名は「同じ製品」という意味ではなく、<b>同じ共通Conceptを見る代表例</b>です。細かい違いはCloud Mapで後から確認できます。</div></details>`;
}

function choiceOrder(lab){
  const a=[lab.correct,lab.wrong1,lab.wrong2];
  const shift=lab.id%3;
  return a.slice(shift).concat(a.slice(0,shift));
}

function completeBox(lab){
  return `<div class="vlComplete ${isDone(lab.id)?'show':''}" data-complete><b>✅ Lab ${String(lab.id).padStart(2,'0')} COMPLETE</b><a href="${nextHref(lab.id)}">${nextLabel(lab.id)}</a></div>`;
}

function markComplete(lab){
  store.set(key(lab.id),'true');
  const box=document.querySelector('[data-complete]');if(box)box.classList.add('show');
}

function renderBuild(lab){
  const meta=LEARNING_META[lab.id-1],done=isDone(lab.id),choices=choiceOrder(lab);
  document.getElementById('app').innerHTML=commonHero(lab)+`<div id="vlCanvas">${canvas(lab.id,done)}</div><section class="vlProblem"><div class="vlProblemIcon">😵</div><div><strong>いま困っていること</strong><p>${esc(meta[0])}<br>${esc(meta[1])}</p></div></section><div class="vlActionZone"><button class="vlBuildBtn" id="vlBuild" ${done?'disabled':''}>${done?'✅ 体験済み':'＋ '+esc(meta[2])}</button><span class="vlHint">${done?'修了済み。BEFORE / AFTERを見返して復習できます。':'正解を知っている必要はありません。押して、何が変わるかを見るLabです。'}</span></div><section class="vlReveal ${done?'show':''}" id="vlReveal"><div class="vlRevealTitle">✅ こうなった。ここで初めて名前を覚える。</div>${termReveal(lab)}</section><section class="vlCheck" id="vlCheck" ${done?'':'hidden'}><h2>30秒だけ確認</h2><p class="vlQuestion">${esc(lab.q)}</p><div class="vlChoices">${choices.map((x,i)=>'<button class="vlChoice '+(done&&x===lab.correct?'correct':'')+'" data-answer="'+i+'" '+(done?'disabled':'')+'>'+esc(x)+'</button>').join('')}</div><div class="vlFeedback ${done?'ok':''}" id="vlFeedback">${done?'✅ '+esc(lab.explain):''}</div>${completeBox(lab)}</section>`;
  const build=document.getElementById('vlBuild');
  if(!done)build.onclick=()=>{
    document.getElementById('vlCanvas').innerHTML=canvas(lab.id,true);
    document.getElementById('vlReveal').classList.add('show');
    document.getElementById('vlCheck').hidden=false;
    build.disabled=true;build.textContent='✅ 部品を足しました';
    document.getElementById('vlReveal').scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  bindQuiz(lab,done);
}

function bindQuiz(lab,locked=false){
  if(locked)return;
  const choices=choiceOrder(lab);
  document.querySelectorAll('[data-answer]').forEach(btn=>btn.onclick=()=>{
    const selected=choices[Number(btn.dataset.answer)];
    const ok=selected===lab.correct;
    document.querySelectorAll('[data-answer]').forEach(b=>b.classList.remove('correct','wrong'));
    btn.classList.add(ok?'correct':'wrong');
    const fb=document.getElementById('vlFeedback');
    fb.className='vlFeedback '+(ok?'ok':'ng');
    fb.textContent=(ok?'✅ ':'△ ')+lab.explain;
    if(ok)markComplete(lab);
  });
}

function renderGuided(lab){
  const meta=LEARNING_META[lab.id-1],choices=choiceOrder(lab),done=isDone(lab.id);
  document.getElementById('app').innerHTML=commonHero(lab)+`<section class="vlGuidedLayout"><div class="vlSituation"><div class="vlEyebrow">SITUATION</div><h2>😵 いま困っていること</h2><p><b>${esc(meta[0])}</b><br>${esc(meta[1])}</p><pre class="vlMiniMap">${esc(previousMap(lab.id))}</pre></div><div class="vlDecision"><div class="vlEyebrow">GUIDED DECISION</div><h2>どう考える？</h2><p class="vlQuestion">${esc(lab.q)}</p><div class="vlChoices">${choices.map((x,i)=>'<button class="vlChoice '+(done&&x===lab.correct?'correct':'')+'" data-guided="'+i+'" '+(done?'disabled':'')+'>'+esc(x)+'</button>').join('')}</div><div class="vlFeedback ${done?'ok':''}" id="vlFeedback">${done?'✅ その考え方でOK。':''}</div><div class="vlWhyBox ${done?'show':''}" id="vlWhy">${done?'<b>なぜ？</b><br>'+esc(lab.explain):''}</div></div></section><section class="vlReveal ${done?'show':''}" id="vlReveal"><div class="vlRevealTitle">✅ 判断の意味をSystemに戻して見る</div><pre class="vlMap" style="margin-bottom:10px">${esc(currentMap(lab.id))}</pre>${termReveal(lab)}</section>${completeBox(lab)}`;
  if(done)return;
  document.querySelectorAll('[data-guided]').forEach(btn=>btn.onclick=()=>{
    const selected=choices[Number(btn.dataset.guided)];const ok=selected===lab.correct;
    document.querySelectorAll('[data-guided]').forEach(b=>b.classList.remove('correct','wrong'));
    btn.classList.add(ok?'correct':'wrong');
    const fb=document.getElementById('vlFeedback');fb.className='vlFeedback '+(ok?'ok':'ng');
    fb.textContent=ok?'✅ その考え方でOK。':'△ まだ違う。用語名ではなく「何を困っているか」へ戻ろう。';
    const why=document.getElementById('vlWhy');why.classList.add('show');why.innerHTML='<b>なぜ？</b><br>'+esc(lab.explain);
    if(ok){document.getElementById('vlReveal').classList.add('show');markComplete(lab)}
  });
}

function renderOperate(lab){
  const meta=LEARNING_META[lab.id-1],ops=OPS_META[lab.id],choices=choiceOrder(lab),done=isDone(lab.id);
  document.getElementById('app').innerHTML=commonHero(lab)+`<section class="vlProblem"><div class="vlProblemIcon">🚨</div><div><strong>運用シナリオ</strong><p>${esc(meta[0])}<br>${esc(meta[1])}</p></div></section><section class="vlOperateFlow"><div class="vlOperateStep ${done?'done':'active'}" id="vlStep1"><div class="vlOperateNum">STEP 1 / EVIDENCE</div><h3>まず事実を固定する</h3><p>原因を決める前に、影響・直近正常・経路・Dataなどを確認します。</p><div class="vlEvidenceBox" id="vlEvidence">${done?esc(ops.evidence):'まだEvidenceを取得していません。'}</div><button class="vlStepBtn" id="vlEvidenceBtn" ${done?'disabled':''}>${done?'✅ Evidence確認済み':'🧾 Evidenceを見る'}</button></div><div class="vlOperateStep ${done?'done':''}" id="vlStep2"><div class="vlOperateNum">STEP 2 / DECISION</div><h3>Evidenceを見て判断する</h3><p>${esc(lab.q)}</p><div class="vlChoices">${choices.map((x,i)=>'<button class="vlChoice '+(done&&x===lab.correct?'correct':'')+'" data-ops-answer="'+i+'" '+(done?'disabled':'disabled')+'>'+esc(x)+'</button>').join('')}</div><div class="vlFeedback ${done?'ok':''}" id="vlFeedback">${done?'✅ '+esc(lab.explain):''}</div></div><div class="vlOperateStep ${done?'done':''}" id="vlStep3"><div class="vlOperateNum">STEP 3 / VERIFY</div><h3>「直った」で終わらせない</h3><p>${esc(ops.verify)}</p><button class="vlStepBtn" id="vlVerify" disabled>${done?'✅ 業務検証済み':'✅ 業務まで検証する'}</button></div></section><section class="vlOpsSummary ${done?'show':''}" id="vlSummary"><strong>💡 このLabの判断軸</strong><p>${esc(lab.explain)}</p><pre class="vlMiniMap">${esc(currentMap(lab.id))}</pre>${termReveal(lab)}</section>${completeBox(lab)}`;
  if(done)return;
  document.getElementById('vlEvidenceBtn').onclick=()=>{
    document.getElementById('vlEvidence').textContent=ops.evidence;
    document.getElementById('vlStep1').classList.remove('active');document.getElementById('vlStep1').classList.add('done');
    document.getElementById('vlStep2').classList.add('active');
    document.querySelectorAll('[data-ops-answer]').forEach(b=>b.disabled=false);
  };
  document.querySelectorAll('[data-ops-answer]').forEach(btn=>btn.onclick=()=>{
    const selected=choices[Number(btn.dataset.opsAnswer)];const ok=selected===lab.correct;
    document.querySelectorAll('[data-ops-answer]').forEach(b=>b.classList.remove('correct','wrong'));
    btn.classList.add(ok?'correct':'wrong');
    const fb=document.getElementById('vlFeedback');fb.className='vlFeedback '+(ok?'ok':'ng');fb.textContent=(ok?'✅ ':'△ ')+lab.explain;
    if(ok){
      document.getElementById('vlStep2').classList.remove('active');document.getElementById('vlStep2').classList.add('done');
      document.getElementById('vlStep3').classList.add('active');document.getElementById('vlVerify').disabled=false;
    }
  });
  document.getElementById('vlVerify').onclick=()=>{
    document.getElementById('vlStep3').classList.remove('active');document.getElementById('vlStep3').classList.add('done');
    document.getElementById('vlSummary').classList.add('show');
    markComplete(lab);
    document.getElementById('vlSummary').scrollIntoView({behavior:'smooth',block:'nearest'});
  };
}

function renderLab(lab){
  topNav(lab);
  if(lab.id<=7)renderBuild(lab);
  else if(lab.id<=15)renderGuided(lab);
  else renderOperate(lab);
}

function route(){
  const m=(location.hash||'').match(/^#lab(\d{1,2})$/i);
  if(m){const lab=topics.find(x=>x.id===Number(m[1]));if(lab){renderLab(lab);return}}
  home();
}

window.addEventListener('hashchange',route);
if(!location.hash)location.hash='#home';
route();
})();