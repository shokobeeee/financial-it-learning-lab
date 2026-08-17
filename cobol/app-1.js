const GROUP_ORDER = ["基礎","処理","ファイル/業務","発展/金融"];
const safeStorage = {
  get(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
};
let runtime = null;

function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}
function labKey(id){return "cobol_lab"+String(id).padStart(2,"0")+"_complete"}
function hashFor(id){return "#lab"+String(id).padStart(2,"0")}
function currentLabFromHash(){
  const m = location.hash.match(/^#lab(\d{1,2})$/i);
  if(!m) return null;
  return LABS.find(x=>x.id===Number(m[1])) || null;
}
function renderTopNav(lab){
  const n=document.getElementById("topNav");
  if(!lab){
    n.innerHTML='<a class="navbtn" href="#home">20 Labs</a><span class="chip">学習用シミュレーター</span>';
    return;
  }
  const prev=LABS.find(x=>x.id===lab.id-1), next=LABS.find(x=>x.id===lab.id+1);
  n.innerHTML=
    '<a class="navbtn" href="#home">⌂ Labs</a>'+ 
    (prev?'<a class="navbtn" href="'+hashFor(prev.id)+'">← Lab '+String(prev.id).padStart(2,"0")+'</a>':'')+
    (next?'<a class="navbtn" href="'+hashFor(next.id)+'">Lab '+String(next.id).padStart(2,"0")+' →</a>':'');
}
function renderHome(){
  runtime=null; renderTopNav(null);
  let done=0;
  const groups={};
  GROUP_ORDER.forEach(g=>groups[g]=[]);
  LABS.forEach(l=>{(groups[l.group]||(groups[l.group]=[])).push(l); if(safeStorage.get(labKey(l.id))==="true") done++;});
  const cards = GROUP_ORDER.map(g => `
    <section class="group">
      <h2>${esc(g)}</h2>
      <div class="labgrid">
        ${groups[g].map(l=>{
          const complete=safeStorage.get(labKey(l.id))==="true";
          return `<a class="labcard ${complete?"complete":""}" href="${hashFor(l.id)}">
            <span class="done">✅</span>
            <div class="num">LAB ${String(l.id).padStart(2,"0")}</div>
            <h3>${esc(l.title)}</h3>
            <div class="desc">${esc(l.subtitle)}</div>
          </a>`
        }).join("")}
      </div>
    </section>`).join("");
  document.getElementById("app").innerHTML=`
    <section class="card hero">
      <div class="hero-grid">
        <div>
          <div class="kicker">COBOL 01–20 / INTERACTIVE LEARNING</div>
          <h1>COBOL 業務システム学習ラボ</h1>
          <p class="muted">目標は「文法暗記」ではなく、<strong>COBOLのコードと業務データの流れを追い、金融・基幹系の会話で処理・ファイル・バッチ・障害の位置関係を説明できる</strong>こと。基本 → 選択 → 入力の3モードで、読む・選ぶ・書くを段階的に進めます。</p>
          <div class="progress"><div style="width:${done/LABS.length*100}%"></div></div>
          <div class="summary">
            <span class="pill"><strong>${done}</strong> / 20 COMPLETE</span>
            <span class="pill">推奨：Step 0 → Lab01から順番</span>
            <span class="pill">最終：Bank Night Batch War Room</span>
          </div>
        </div>
        <div class="goalbox">
          <strong>この教材の学び方</strong>
          <div class="muted">① 基本で動きを見る<br>② 選択で正しい構文を選ぶ<br>③ 入力で自分で書く<br>④ 状態DIFFと処理フローを見る<br>⑤ 最後に業務の言葉で説明する</div>
        </div>
      </div>
    </section>
    <section class="card stage0-entry">
      <div class="stage0-cta">
        <div>
          <div class="zero">LEARNING STEP 0 / START HERE</div>
          <h2 style="font-size:24px;margin:6px 0">COBOLって、そもそも何をするの？</h2>
          <div class="muted">コードを覚える前に、銀行の取引データが <strong>COBOLでどう処理されるか</strong> を1本の流れで体験します。</div>
        </div>
        <a class="startbtn" href="#stage0">▶ 学習ステップ0を始める</a>
      </div>
    </section>
    ${cards}
    <section class="card outcome">
      <h2>修了時の到達像</h2>
      <div class="layer-row">
        <span>DIVISION / PIC</span><span>MOVE / IF / PERFORM</span><span>OCCURS</span><span>Sequential File</span>
        <span>FILE STATUS</span><span>SORT</span><span>COPY / CALL</span><span>Control Break</span>
        <span>JCL</span><span>DB2 / CICS</span><span>Incident / S0C7</span><span>War Room</span>
      </div>
      <p class="muted">「夜間バッチが落ちた」に対して、いきなり“COBOLが悪い”と決めず、プログラム・入力データ・ファイルI/O・JCL・DBのどこに証拠があるかを分けて考え、復旧後の件数・金額・RCまで確認して説明できる状態を修了ラインにします。</p>
    </section>
    <div class="references">
      技術参照：IBM Enterprise COBOL for z/OS 6.4 Language Reference / Programming Guide、GnuCOBOL Manual。<br>
      本ページは学習用シミュレーターです。JCL、DB2、CICSの設定・構文は実環境の標準・製品バージョン・サイト規約に合わせて確認してください。
    </div>`;
}
function renderStage0(){
  runtime=null;
  const n=document.getElementById("topNav");
  n.innerHTML='<a class="navbtn" href="#home">⌂ Labs</a><a class="navbtn" href="#lab01">Lab 01 →</a>';
  document.getElementById("app").innerHTML=`
    <section class="card lab-hero">
      <div class="lab-number">LEARNING STEP 0 / WHAT COBOL DOES</div>
      <h1 style="font-size:clamp(30px,5vw,48px)">COBOLって、何をするの？</h1>
      <p class="muted">まず文法は置いておいて、<strong>COBOLが会社の中でどんな仕事をしているか</strong>を掴みます。</p>
      <div class="goalbox">
        <strong>ひとことで言うと</strong>
        <div><strong style="font-size:19px;color:#e9f8f0">大量の業務データを読み、決められた業務ルールで判定・計算し、結果を正確に書き出す。</strong></div>
        <div class="muted" style="margin-top:7px">銀行・カード・保険・会計・公共など、「件数が多い」「金額や状態を間違えられない」業務でこの考え方が特に分かりやすく現れます。</div>
      </div>
    </section>

    <section class="card" style="margin-top:14px">
      <h2>まず、COBOLの仕事を1本で見る</h2>
      <div class="stage0-flow" id="stage0Flow">
        <div class="stage0-node" data-s0="0"><div>📥</div><strong>① 受け取る</strong><div class="mini">今日の取引データ<br>口座・種別・金額</div></div>
        <div class="stage0-node" data-s0="1"><div>📖</div><strong>② 読む</strong><div class="mini">1件ずつ READ<br>データ項目へ入れる</div></div>
        <div class="stage0-node" data-s0="2"><div>⚙️</div><strong>③ 判断・計算</strong><div class="mini">IF / ADD / SUBTRACT<br>業務ルールを実行</div></div>
        <div class="stage0-node" data-s0="3"><div>📤</div><strong>④ 結果を出す</strong><div class="mini">更新データ・エラー<br>帳票・次の処理へ</div></div>
      </div>
      <div class="stage0-actions">
        <button data-s0action="0">① 取引データを受け取る</button>
        <button data-s0action="1">② 1件ずつ読む</button>
        <button data-s0action="2">③ ルールで処理する</button>
        <button data-s0action="3">④ 結果を書き出す</button>
      </div>
      <div class="stage0-state">
        <div><span class="k">INPUT</span><span class="v" id="s0Input">待機中</span></div>
        <div><span class="k">READ</span><span class="v" id="s0Read">未実行</span></div>
        <div><span class="k">BUSINESS RULE</span><span class="v" id="s0Rule">未実行</span></div>
        <div><span class="k">OUTPUT</span><span class="v" id="s0Output">なし</span></div>
      </div>
    </section>

    <section class="stage0-grid">
      <div class="card">
        <h2>🏦 銀行の夜間処理で体験</h2>
        <p class="muted">3件だけのミニデータで動きを見ます。実際の基幹処理では、同じ考え方をもっと大量のレコードに対して繰り返します。</p>
        <div class="stage0-console" id="stage0Console">ready&gt; まだ処理していません。\n\n上の①から順番に押してみよう。</div>
      </div>
      <div class="card">
        <h2>💡 ここで覚えること</h2>
        <div id="stage0Lesson" class="muted">COBOLは「画面を作る言語」というより、まず<strong>業務データをルール通り処理する言語</strong>として捉えると分かりやすいです。</div>
        <div class="mission" style="margin-top:12px">
          <div class="small">イメージ</div>
          <pre style="white-space:pre-wrap;margin:4px 0 0;font:13px/1.6 ui-monospace,monospace;color:#e9f0f7">取引データ
   ↓ READ
COBOLプログラム
   ├─ IF / EVALUATE  判定
   ├─ ADD / SUBTRACT 計算
   └─ WRITE           出力
   ↓
更新結果 / エラー / 帳票 / 次ジョブ</pre>
        </div>
      </div>
    </section>

    <section class="card" style="margin-top:14px">
      <h2>COBOLと、その周りは別物</h2>
      <p class="muted">ここを最初に分けておくと、メインフレームの話が急に分かりやすくなります。</p>
      <div class="stage0-what">
        <div><strong>🟩 COBOL</strong><div class="muted">業務処理を書く<strong>プログラミング言語</strong>。読む・判定する・計算する・書き出す。</div></div>
        <div><strong>🖥️ メインフレーム / z/OS</strong><div class="muted">COBOLプログラムなどが動く<strong>コンピュータ／OS側の基盤</strong>。COBOLそのものではありません。</div></div>
        <div><strong>📋 JCL</strong><div class="muted">バッチで「どのプログラムを、どの入力・出力で動かすか」を指定する<strong>ジョブ実行定義</strong>。</div></div>
      </div>
      <div class="stage0-what">
        <div><strong>🗄️ DB2</strong><div class="muted">データベース。COBOLからSQLを使って参照・更新する構成があります。</div></div>
        <div><strong>🔁 CICS</strong><div class="muted">オンライン取引処理を支える基盤。COBOLと組み合わせて使われる代表例です。</div></div>
        <div><strong>🌐 ATM・窓口・アプリ</strong><div class="muted">利用者が触る入口。COBOLはその裏側の業務処理を担当することがあります。</div></div>
      </div>
    </section>

    <section class="card stage0-quiz" style="margin-top:14px">
      <h2>理解チェック</h2>
      <div>COBOLの役割として、いちばん近いものは？</div>
      <button data-s0quiz="0">A. Web画面のデザインを作ることが主目的</button>
      <button data-s0quiz="1">B. 業務データを読み、ルールで判定・計算し、結果を出力する</button>
      <button data-s0quiz="2">C. メインフレームというコンピュータそのもの</button>
      <div class="quiz-result" id="stage0QuizResult"></div>
    </section>

    <section class="card" style="margin-top:14px;border-color:#3e7e69">
      <h2>次は Lab 01 へ</h2>
      <p class="muted">ここまでで「何のための言語か」が見えたので、次はその処理をCOBOLコードのどこへ書くのか、<strong>DIVISIONとDISPLAY</strong>から触ります。</p>
      <a class="startbtn" href="#lab01">Lab 01：Program Structure / DISPLAY →</a>
    </section>
  `;
  initStage0();
}
function initStage0(){
  const steps=[
    {
      console:"INPUT FILE: BANK.TXN.TODAY\n\n001,A001,DEPOSIT,10000\n002,A002,WITHDRAW,5000\n003,A003,WITHDRAW,20000\n\n3 records ready.",
      lesson:"最初にあるのは『業務データ』。COBOLは口座番号・取引種別・金額など、決まった形のデータを処理していきます。",
      values:["3 records","未実行","未実行","なし"]
    },
    {
      console:"READ TXN-FILE INTO TXN-REC\n\n#001 ACCOUNT=A001 TYPE=DEPOSIT  AMOUNT=10000\n#002 ACCOUNT=A002 TYPE=WITHDRAW AMOUNT= 5000\n#003 ACCOUNT=A003 TYPE=WITHDRAW AMOUNT=20000\n\nREAD: 3 records",
      lesson:"READでレコードを1件ずつ読みます。『ファイル全部を魔法のように処理』ではなく、レコードを読み、項目を見て、順番に処理するイメージが基本です。",
      values:["3 records","3 records read","未実行","なし"]
    },
    {
      console:"BUSINESS RULE\n\n#001  A001  50,000 + 10,000 = 60,000  -> OK\n#002  A002  30,000 -  5,000 = 25,000  -> OK\n#003  A003  15,000 - 20,000            -> NG insufficient balance\n\nOK=2 / NG=1",
      lesson:"ここがCOBOLの中心。IF/EVALUATEで条件を判定し、ADD/SUBTRACT/COMPUTEなどで業務ルールを実行します。『残高以上は引き出せない』もコード化された業務ルールです。",
      values:["3 records","3 records read","OK 2 / NG 1","未出力"]
    },
    {
      console:"OUTPUT\n\nUPDATED BALANCE\nA001 = 60,000\nA002 = 25,000\nA003 = 15,000\n\nERROR FILE\n#003 A003 WITHDRAW 20,000 / INSUFFICIENT BALANCE\n\nREPORT: INPUT=3 OK=2 NG=1  RC=0",
      lesson:"処理結果は更新データ、エラーファイル、帳票、DB、次のバッチなどへ渡されます。つまりCOBOLは『入力 → 業務処理 → 出力』を支える一員です。",
      values:["3 records","3 records read","OK 2 / NG 1","更新 + error + report"]
    }
  ];
  const done=new Set();
  document.querySelectorAll("[data-s0action]").forEach(btn=>btn.addEventListener("click",()=>{
    const i=Number(btn.dataset.s0action), x=steps[i];
    for(let j=0;j<=i;j++) done.add(j);
    document.querySelectorAll("[data-s0action]").forEach((b,j)=>b.classList.toggle("done0",done.has(j)));
    document.querySelectorAll("[data-s0]").forEach((node,j)=>node.classList.toggle("on",j<=i));
    document.getElementById("stage0Console").textContent=x.console;
    document.getElementById("stage0Lesson").textContent=x.lesson;
    ["s0Input","s0Read","s0Rule","s0Output"].forEach((id,j)=>document.getElementById(id).textContent=x.values[j]);
  }));
  document.querySelectorAll("[data-s0quiz]").forEach(btn=>btn.addEventListener("click",()=>{
    const ok=Number(btn.dataset.s0quiz)===1;
    document.querySelectorAll("[data-s0quiz]").forEach(b=>b.classList.remove("good0","bad0"));
    btn.classList.add(ok?"good0":"bad0");
    const r=document.getElementById("stage0QuizResult");
    r.style.color=ok?"var(--ok)":"var(--warn)";
    r.textContent=ok?"✅ 正解。まず『業務データをルール通り処理する言語』と掴めればOK。":"惜しい。COBOLはコンピュータ本体でも画面デザイン専用でもなく、業務処理を書くプログラミング言語です。";
  }));
}
