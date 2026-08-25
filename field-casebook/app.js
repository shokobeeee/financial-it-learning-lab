(function(){
'use strict';
const CASES=window.FIELD_CASES||[];
const MODULE_NAMES={
  linux:'Linux / OS',sql:'SQL / Database',cobol:'COBOL / Business Logic',
  jcl:'JCL / Batch',cloud:'Cloud / Architecture',aws:'AWS',gcp:'Google Cloud',
  azure:'Azure',pm:'PM / Governance'
};
const IMPACT_OPTIONS=[
  'SEV1：社会・決済・多数顧客へ重大影響。危機対応と経営判断が必要',
  'SEV2：重要業務が部分劣化。限定的な顧客影響または代替手段あり',
  'SEV3：内部限定。顧客・決済影響はほぼない'
];
const store={
  get(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
};
const key=id=>'field_case_'+id+'_result';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let st=null;

function saved(id){try{return JSON.parse(store.get(key(id))||'null')}catch(e){return null}}
function cls(n){return n>=80?'good':n>=65?'warn':'bad'}
function minLayers(c){return c.id>=7?3:2}
function moduleLinks(c){
  return c.modules.filter(x=>x!=='pm').map(id=>`<a href="../${id}/">${esc(MODULE_NAMES[id]||id)}</a>`).join('');
}
function completedCount(){return CASES.filter(c=>saved(c.id)?.passed).length}
function bestScores(){
  const best={eng:0,con:0,pm:0};
  CASES.forEach(c=>{const r=saved(c.id);if(r){best.eng=Math.max(best.eng,r.eng||0);best.con=Math.max(best.con,r.con||0);best.pm=Math.max(best.pm,r.pm||0)}});
  return best;
}
function home(){
  st=null;
  const completed=completedCount(),best=bestScores();
  document.getElementById('app').innerHTML=`
    <section class="fgHero">
      <div class="fgKicker">PUBLIC INCIDENT RECONSTRUCTION / 10 CASES</div>
      <h1>📰 Field Incident Gate</h1>
      <p class="fgLead">教材で覚えた知識を、<b>公開された障害報告・技術記事・新聞記事を基に再構成した10事件</b>で使う。</p>
      <p class="fgMuted">実在事例の文章を再現する教材ではありません。公開情報から「どのレイヤーを見るか」「何をEvidenceにするか」「どう安全に戻すか」を抽出し、金融IT向けに匿名化・再構成しています。元事例と出典は答え合わせ後に公開します。</p>
      <div class="fgChips"><span>10 Cases</span><span>Free Investigation</span><span>Source reveal after result</span><span>${completed}/10 PASS</span></div>
    </section>
    <section class="fgCard fgRoute">
      <div>
        <div class="fgKicker">WHY THIS GATE EXISTS</div>
        <h2>知識を「知っている」から「事故で使える」へ。</h2>
        <p class="fgMuted">Linux・SQL・COBOL・JCL・Cloudを別々の科目で終わらせず、事故の症状から必要な教材知識を引き出します。合格はEngineer / Consultant / PMが各80点以上。次のFinancial War Roomでは各85点以上を狙います。</p>
      </div>
      <div class="fgScoreGrid">
        <div><span>Engineer best</span><b class="${cls(best.eng)}">${best.eng}</b></div>
        <div><span>Consultant best</span><b class="${cls(best.con)}">${best.con}</b></div>
        <div><span>PM best</span><b class="${cls(best.pm)}">${best.pm}</b></div>
        <div><span>Passed</span><b>${completed}/10</b></div>
      </div>
    </section>
    <section class="fgCard">
      <div class="fgSectionHead"><div><div class="fgKicker">FINAL PRACTICE</div><h2>10の公開事例ベースCase</h2></div><span>初めてなら Case 01</span></div>
      <div class="fgCaseGrid">
        ${CASES.map(c=>{
          const r=saved(c.id);
          return `<a class="fgCase ${r?.passed?'complete':''}" href="#preview${String(c.id).padStart(2,'0')}">
            <div class="fgCaseTop"><span>CASE ${String(c.id).padStart(2,'0')}</span><span>${esc(c.difficulty)}</span></div>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.subtitle)}</p>
            <div class="fgModuleTags">${c.modules.map(x=>`<span>${esc(MODULE_NAMES[x]||x)}</span>`).join('')}</div>
            <div class="fgCaseMeta">${r?`E ${r.eng} / C ${r.con} / P ${r.pm}`:'事件現場を見る →'}</div>
          </a>`;
        }).join('')}
      </div>
    </section>
    <section class="fgCard fgPolicy">
      <h2>Source policy</h2>
      <div class="fgPolicyGrid">
        <div><b>一次情報を軸にする</b><span>企業・規制当局・公式postmortemをFactの基準にします。</span></div>
        <div><b>Qiita / note / 新聞も読む</b><span>技術の翻訳や社会・顧客影響の見え方を補助線として使います。</span></div>
        <div><b>答えは先に見せない</b><span>出典名と実在事故はResultまで隠し、Evidenceから自分で推理します。</span></div>
        <div><b>完全再現ではない</b><span>複雑な実事故を学習用に匿名化・簡略化。運用Runbookではありません。</span></div>
      </div>
    </section>`;
}

function preview(c){
  st=null;
  document.getElementById('app').innerHTML=`
    <section class="fgCard fgPreview">
      <div class="fgPreviewNav"><a href="#home">← 10 Cases</a><span>事件現場 / まだ採点されません</span></div>
      <div class="fgKicker">CASE ${String(c.id).padStart(2,'0')} / ${esc(c.difficulty)}</div>
      <h1>${esc(c.title)}</h1>
      <p class="fgLead">${esc(c.subtitle)}</p>
      <p class="fgMuted">${esc(c.brief)}</p>
      <div class="fgModuleTags big">${c.modules.map(x=>`<span>${esc(MODULE_NAMES[x]||x)}</span>`).join('')}</div>
    </section>
    <section class="fgPreviewGrid">
      <div class="fgCard">
        <div class="fgKicker">KNOWN FACTS</div><h2>今わかっていること</h2>
        <div class="fgFacts">${c.facts.map(([k,v])=>`<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>
        <div class="fgUnknown"><b>❓ まだ分からない</b><span>原因・安全な復旧方法・本当の完了条件は未確定です。出典の実在事故もResultまで隠します。</span></div>
      </div>
      <div class="fgCard">
        <div class="fgKicker">READINESS</div><h2>どの教材知識を使う？</h2>
        <p class="fgMuted">${esc(c.confidence)}</p>
        <div class="fgModuleLinks">${moduleLinks(c)}</div>
        <details class="fgRecommended"><summary>推奨Lab番号を見る</summary>${Object.entries(c.recommended||{}).map(([m,ids])=>`<div><b>${esc(MODULE_NAMES[m]||m)}</b><span>${ids.map(x=>'Lab'+String(x).padStart(2,'0')).join(' / ')}</span></div>`).join('')}</details>
      </div>
    </section>
    <section class="fgCard fgStart">
      <div><div class="fgKicker">NO SPOILER MODE</div><h2>どこから調べるかは、あなたが決める。</h2><p class="fgMuted">最初に顧客・業務影響だけ固定。その後はEvidenceを好きな順で取得し、仮説を「調査中 / 有力 / 除外」に動かします。</p></div>
      <a class="fgPrimary" href="#case${String(c.id).padStart(2,'0')}">🔍 捜査を始める</a>
    </section>`;
}

function start(c){
  st={
    c,time:24,scores:{eng:20,con:20,pm:20},impact:null,evidence:[],
    hyp:{},root:null,contrib:null,causeLocked:false,action:null,
    verify:[],verifyLocked:false,comm:null,commLocked:false,log:[]
  };
  renderInvestigation();
}
function addPoints(p){for(const k of ['eng','con','pm'])st.scores[k]+=Number(p?.[k]||0)}
function evidenceLayers(){return new Set(st.evidence.map(id=>st.c.evidence.find(e=>e.id===id)?.layer).filter(Boolean))}
function activeHypotheses(){return Object.entries(st.hyp).filter(([,v])=>v==='investigate'||v==='hot').map(([k])=>k)}
function statusLabel(v){return v==='hot'?'🔥 有力':v==='investigate'?'🟡 調査中':v==='ruledout'?'✕ 除外':'未整理'}

function renderInvestigation(){
  const c=st.c,layers=evidenceLayers(),gate=layers.size>=minLayers(c);
  document.getElementById('app').innerHTML=`
    <section class="fgCard fgIncident">
      <div class="fgPreviewNav"><a href="#preview${String(c.id).padStart(2,'0')}">← 事件現場</a><span>INVESTIGATION / 採点中</span></div>
      <div class="fgKicker">CASE ${String(c.id).padStart(2,'0')}</div><h1>${esc(c.title)}</h1>
      <div class="fgTimer">⏱ Evidence budget <b>${st.time} min</b></div>
      <div class="fgFacts compact">${c.facts.map(([k,v])=>`<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>
    </section>
    ${st.impact===null?impactPanel(c):investigationWorkspace(c,gate,layers)}
    <details class="fgCard fgMemo"><summary>📓 行き詰まったら捜査メモを開く</summary>
      <div class="fgMemoGrid">
        <div>事実と推測を分けた？</div><div>その仮説が正しければ何が見える？</div>
        <div>その仮説を消せるEvidenceは？</div><div>同じレイヤーばかり見ていない？</div>
        <div>「直りそう」ではなく副作用は？</div><div>技術Green以外に件数・金額・顧客導線は？</div>
      </div>
    </details>`;
  bindInvestigation();
}
function impactPanel(c){
  return `<section class="fgCard fgImpact"><div class="fgKicker">FIRST DECISION</div><h2>まず、どれくらい困っている？</h2><p class="fgMuted">技術原因を当てる前に、顧客・決済・締切への影響を固定します。</p><div class="fgChoices">${IMPACT_OPTIONS.map((x,i)=>`<button data-impact="${i}">${esc(x)}</button>`).join('')}</div></section>`;
}
function investigationWorkspace(c,gate,layers){
  const evidenceCards=st.evidence.length?st.evidence.map(id=>{
    const e=c.evidence.find(x=>x.id===id);return `<article class="fgEvidenceCard"><div><span>${esc(e.layerLabel)}</span><span>-${e.cost}m</span></div><h3>${esc(e.label)}</h3><p>${esc(e.text)}</p></article>`;
  }).join(''):'<div class="fgEmpty">まだEvidenceはありません。左から調べる場所を選びます。</div>';
  return `
  <section class="fgInvestigationGrid">
    <div class="fgCard">
      <div class="fgKicker">INVESTIGATE</div><h2>どこを調べる？</h2>
      <p class="fgMuted">全部を見ると時間を失います。仮説を残す／消すために必要なものを選びます。</p>
      <div class="fgEvidenceButtons">${c.evidence.map(e=>`<button class="${st.evidence.includes(e.id)?'used':''}" data-evidence="${esc(e.id)}" ${st.evidence.includes(e.id)?'disabled':''}><b>${esc(e.label)}</b><span>${esc(e.layerLabel)} / -${e.cost} min</span></button>`).join('')}</div>
    </div>
    <div class="fgCard">
      <div class="fgKicker">EVIDENCE BOARD</div><h2>集めた事実</h2><div class="fgEvidenceBoard">${evidenceCards}</div>
    </div>
  </section>
  <section class="fgInvestigationGrid">
    <div class="fgCard">
      <div class="fgKicker">HYPOTHESIS BOARD</div><h2>原因候補を自分で整理</h2>
      <p class="fgMuted">追う仮説は最大3つ。「Evidenceを読んだ自分」が状態を動かします。Boardは答えを自動判定しません。</p>
      <div class="fgHypothesisBoard">${c.hypotheses.map(([id,label])=>`<article class="fgHyp ${esc(st.hyp[id]||'')}"><h3>${esc(label)}</h3><div class="fgHypStatus">${statusLabel(st.hyp[id])}</div><div><button data-hyp="${esc(id)}" data-status="investigate">調査中</button><button data-hyp="${esc(id)}" data-status="hot">有力</button><button data-hyp="${esc(id)}" data-status="ruledout">除外</button></div></article>`).join('')}</div>
    </div>
    <div class="fgCard fgCause">
      <div class="fgKicker">CAUSE DECLARATION</div><h2>☝ 原因を指摘する</h2>
      <div class="fgGate ${gate?'ready':''}"><b>Evidence Diversity ${layers.size} / ${minLayers(c)} layers</b><span>${gate?'異なる観点が揃いました。':'同じ種類のEvidenceだけで決めつけない。'}</span></div>
      <label>Primary cause<select id="rootSelect"><option value="">選択してください</option>${c.hypotheses.map(([id,label])=>`<option value="${esc(id)}" ${st.root===id?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <label>Contributing factor<select id="contribSelect"><option value="">選択してください</option>${c.contribOptions.map(([id,label])=>`<option value="${esc(id)}" ${st.contrib===id?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <button class="fgAccuse" id="lockCause" ${!gate?'disabled':''}>☝ この原因で指摘する</button>
      <p class="fgMuted small">指摘後は戻せません。Recoveryへ進みます。</p>
    </div>
  </section>`;
}
function bindInvestigation(){
  document.querySelectorAll('[data-impact]').forEach(b=>b.onclick=()=>{
    st.impact=Number(b.dataset.impact);
    if(st.impact===st.c.impactCorrect){st.scores.con+=10;st.scores.pm+=10}else{st.scores.con-=6;st.scores.pm-=8}
    renderInvestigation();
  });
  document.querySelectorAll('[data-evidence]').forEach(b=>b.onclick=()=>{
    const e=st.c.evidence.find(x=>x.id===b.dataset.evidence);
    if(!e||st.evidence.includes(e.id))return;
    if(st.time<e.cost){alert('Evidence budgetが足りません。');return}
    st.time-=e.cost;st.evidence.push(e.id);addPoints(e.points);st.log.push(e.id);renderInvestigation();
  });
  document.querySelectorAll('[data-hyp]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.hyp,status=b.dataset.status;
    const active=activeHypotheses(),current=st.hyp[id];
    if((status==='investigate'||status==='hot')&&!['investigate','hot'].includes(current)&&active.length>=3){
      alert('同時に追う仮説は最大3つです。1つを除外してから追加します。');return;
    }
    st.hyp[id]=current===status?'':status;renderInvestigation();
  });
  const root=document.getElementById('rootSelect'),contrib=document.getElementById('contribSelect');
  if(root)root.onchange=()=>{st.root=root.value||null};
  if(contrib)contrib.onchange=()=>{st.contrib=contrib.value||null};
  document.getElementById('lockCause')?.addEventListener('click',()=>{
    if(!st.root||!st.contrib){alert('Primary causeとContributing factorを選びます。');return}
    if(evidenceLayers().size<minLayers(st.c)){alert('別レイヤーのEvidenceを追加します。');return}
    const active=activeHypotheses();
    if(active.includes(st.c.root))st.scores.eng+=8;
    if(st.hyp[st.c.root]==='hot')st.scores.eng+=5;
    if(st.root===st.c.root){st.scores.eng+=18;st.scores.con+=8}else{st.scores.eng-=15;st.scores.con-=10}
    if(st.contrib===st.c.contrib){st.scores.con+=10;st.scores.pm+=6}else{st.scores.con-=6;st.scores.pm-=4}
    st.causeLocked=true;renderResolution();
  });
}
function renderResolution(){
  const c=st.c;
  const rootLabel=c.hypotheses.find(x=>x[0]===st.root)?.[1]||st.root;
  const contribLabel=c.contribOptions.find(x=>x[0]===st.contrib)?.[1]||st.contrib;
  document.getElementById('app').innerHTML=`
    <section class="fgCard fgDeclared"><div class="fgKicker">CAUSE DECLARED</div><h1>${esc(c.title)}</h1>
      <div class="fgDeclaredGrid"><div><span>Primary cause</span><b>${esc(rootLabel)}</b></div><div><span>Contributing factor</span><b>${esc(contribLabel)}</b></div></div>
      <details><summary>🧩 取得したEvidence ${st.evidence.length}件</summary><div class="fgEvidenceBoard">${st.evidence.map(id=>{const e=c.evidence.find(x=>x.id===id);return `<article class="fgEvidenceCard"><div><span>${esc(e.layerLabel)}</span></div><h3>${esc(e.label)}</h3><p>${esc(e.text)}</p></article>`}).join('')}</div></details>
    </section>
    ${recoveryPanel(c)}
    ${verificationPanel(c)}
    ${communicationPanel(c)}
    <details class="fgCard fgLive"><summary>📊 現在の採点を見る</summary>${scoreGrid()}</details>`;
  bindResolution();
}
function recoveryPanel(c){
  return `<section class="fgCard"><div class="fgKicker">RECOVERY</div><h2>🛠 どう安全に戻す？</h2><p class="fgMuted">最初に選んだActionが評価対象です。</p><div class="fgChoices">${c.actions.map(a=>`<button data-action="${esc(a.id)}" ${st.action!==null?'disabled':''} class="${st.action===a.id?(a.safe?'safe':'unsafe'):''}">${esc(a.label)}</button>`).join('')}</div>${st.action?`<div class="fgEffect">${esc(c.actions.find(a=>a.id===st.action)?.effect)}</div>`:''}</section>`;
}
function verificationPanel(c){
  if(st.action===null)return '';
  return `<section class="fgCard"><div class="fgKicker">VERIFY / RECONCILE</div><h2>✅ 本当に業務は戻った？</h2><p class="fgMuted">技術Greenだけでなく、顧客導線・件数・金額・正本・後続処理を選びます。</p><div class="fgChoices">${c.verifications.map(v=>`<button data-verify="${esc(v.id)}" class="${st.verify.includes(v.id)?'selected':''}" ${st.verifyLocked?'disabled':''}>${esc(v.label)}</button>`).join('')}</div><button class="fgPrimary button" id="lockVerify" ${st.verifyLocked?'disabled':''}>検証項目を確定</button></section>`;
}
function communicationPanel(c){
  if(!st.verifyLocked)return '';
  return `<section class="fgCard"><div class="fgKicker">COMMUNICATION</div><h2>📣 関係者へ何を伝える？</h2><div class="fgChoices">${c.commOptions.map((x,i)=>`<button data-comm="${i}" class="${st.comm===i?'selected':''}" ${st.commLocked?'disabled':''}>${esc(x)}</button>`).join('')}</div><button class="fgPrimary button" id="finish">Score / Source reveal</button></section>`;
}
function bindResolution(){
  document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{
    if(st.action!==null)return;const a=st.c.actions.find(x=>x.id===b.dataset.action);
    st.action=a.id;addPoints(a.points);
    const missing=(a.need||[]).filter(x=>!st.evidence.includes(x));
    if(missing.length){st.scores.eng-=8;st.scores.pm-=5}
    renderResolution();
  });
  document.querySelectorAll('[data-verify]').forEach(b=>b.onclick=()=>{
    if(st.verifyLocked)return;const id=b.dataset.verify;
    st.verify=st.verify.includes(id)?st.verify.filter(x=>x!==id):[...st.verify,id];renderResolution();
  });
  document.getElementById('lockVerify')?.addEventListener('click',()=>{
    if(st.verifyLocked)return;st.verifyLocked=true;
    st.verify.forEach(id=>{const v=st.c.verifications.find(x=>x.id===id);if(v.correct)addPoints(v.points);else{st.scores.eng-=3;st.scores.con-=3;st.scores.pm-=2}});
    renderResolution();
  });
  document.querySelectorAll('[data-comm]').forEach(b=>b.onclick=()=>{
    if(st.commLocked)return;st.comm=Number(b.dataset.comm);st.commLocked=true;
    if(st.comm===st.c.commCorrect){st.scores.con+=8;st.scores.pm+=15}else{st.scores.con-=8;st.scores.pm-=12}
    renderResolution();
  });
  document.getElementById('finish')?.addEventListener('click',finish);
}
function scoreGrid(){
  return `<div class="fgScoreGrid"><div><span>Engineer</span><b class="${cls(st.scores.eng)}">${Math.round(st.scores.eng)}</b></div><div><span>Consultant</span><b class="${cls(st.scores.con)}">${Math.round(st.scores.con)}</b></div><div><span>PM</span><b class="${cls(st.scores.pm)}">${Math.round(st.scores.pm)}</b></div><div><span>Time</span><b>${st.time}</b></div></div>`;
}
function finish(){
  if(st.action===null||!st.verifyLocked||st.comm===null){alert('Recovery・Verification・Communicationまで確定します。');return}
  const over=Math.max(0,st.evidence.length-4),low=Math.max(0,7-st.time);
  st.scores.eng-=over*3+low*0.5;st.scores.pm-=over*4+low;st.scores.con-=over*1.5;
  for(const k of ['eng','con','pm'])st.scores[k]=Math.max(0,Math.min(100,Math.round(st.scores[k])));
  const passed=st.scores.eng>=80&&st.scores.con>=80&&st.scores.pm>=80;
  const result={...st.scores,passed,time:st.time,date:new Date().toISOString()};
  store.set(key(st.c.id),JSON.stringify(result));
  const c=st.c;
  document.getElementById('app').innerHTML=`
    <section class="fgCard fgResult"><div class="fgKicker">CASE ${String(c.id).padStart(2,'0')} RESULT</div><h1>${passed?'✅ FIELD SIGN-OFF':'🟡 REVIEW REQUIRED'}</h1>
      <p class="fgLead">${esc(c.rootExplain)}</p>${scoreGrid()}
      <p class="${passed?'good':'warn'} fgSign">${passed?'公開事例を、3つの視点で安全に読み解けました。':'80点未満の視点があります。Evidence・顧客影響・安全な復旧・照合を見直そう。'}</p>
    </section>
    <section class="fgCard"><div class="fgKicker">SOURCE REVEAL</div><h2>このCaseの着想元</h2>
      <p class="fgMuted">以下の公開情報を読んだ上で、学習用に匿名化・簡略化・再構成しました。元事故を完全再現するものではありません。</p>
      <div class="fgSources">${c.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(s.kind)} / ${esc(s.date)}</span><b>${esc(s.title)}</b><small>${esc(s.publisher)}</small></a>`).join('')}</div>
    </section>
    <section class="fgCard"><div class="fgKicker">CONFIDENCE MAP</div><h2>どの教材知識を使えた？</h2><p class="fgMuted">${esc(c.confidence)}</p><div class="fgModuleLinks">${moduleLinks(c)}</div></section>
    <section class="fgCard fgActions"><button class="fgPrimary button" id="retry">↻ Retry</button><a class="fgSecondary" href="#home">10 Casesへ</a><a class="fgSecondary" href="../financial-war-room/">Financial War Roomへ →</a></section>`;
  document.getElementById('retry').onclick=()=>start(c);
}
function route(){
  const p=location.hash.match(/^#preview(\d{1,2})$/i);
  if(p){const c=CASES.find(x=>x.id===Number(p[1]));if(c){preview(c);return}}
  const q=location.hash.match(/^#case(\d{1,2})$/i);
  if(q){const c=CASES.find(x=>x.id===Number(q[1]));if(c){start(c);return}}
  home();
}
window.addEventListener('hashchange',route);
if(!location.hash)location.hash='#home';
route();
})();
