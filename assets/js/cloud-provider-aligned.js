(function(){
'use strict';

const S=window.CLOUD_SPEC;
const R=window.FIT_CLOUD_CONCEPTS;
if(!S||!R||!['aws','gcp','azure'].includes(S.id))return;

const P=R.providers[S.id];
const product=key=>R.product(key,S.id);
const primary=R.primary();

S.kicker=P.name.toUpperCase()+' FOR FINANCIAL IT 01–20 / CANONICAL CLOUD TRANSLATION';
S.hero='Cloud Fundamentalsの銀行Webを、<br>'+P.name+'で組み立てる。';
S.description='新しい20概念を覚える教材ではありません。Cloud Fundamentalsと同じ20 Labsを正本にし、各Labの共通Conceptへ'+P.name+'の代表的な製品名を重ねます。迷ったら同じLab番号のCloud Fundamentalsへ戻ればOKです。';
S.finish=P.name+'の構成図を見て、Customer → Entry → Network → App → Data → Core のどこを見ているかを共通Conceptへ戻して説明できる。';
S.groups=R.phases.slice(0,3).map(x=>x.title);
S.chips=['Cloud Fundamentalsの翻訳',P.name,'Concept → Product','Network','Compute','Data','Identity','Recovery'];
S.outcomes=primary.map(row=>row.term+' → '+product(row.key));
S.capstone='最終: '+P.name+' Financial War Room';

S.stage={
  title:'Cloud Fundamentalsで作った銀行Webを、'+P.name+'では何と呼ぶ？',
  intro:'Systemの役割は変わりません。Cloud Fundamentalsで理解した同じ箱へ、'+P.name+'の代表的な製品名を貼ります。製品名から覚えるのではなく、共通Concept → Productの順で見ます。',
  nodes:[
    ['📱 Customer','残高を見たい','利用者'],
    ['🚪 Entry',product('load-balancer'),'入口'],
    ['🌐 Network',product('virtual-network'),'Network'],
    ['🖥 App',product('compute-vm'),'App'],
    ['🗄 Data',product('managed-db'),'Data'],
    ['🏢 Core',product('hybrid-connectivity'),'Core']
  ],
  initialConsole:'①から順に押してみよう。新しい構造ではなく、Cloud Fundamentalsの同じSystemへ'+P.name+'名を対応づけます。',
  console:[
    '📱 Customer\n利用者の要求と業務目的はProviderが変わっても同じです。まず「何の業務か」から始めます。',
    '🚪 Entry\n'+product('load-balancer')+'\n\n利用者の要求を受け、正常なBackendへ届ける入口。',
    '🌐 Network\n'+product('virtual-network')+'\n\nCloud FundamentalsのVirtual Networkという共通Conceptに対する代表的な実装です。',
    '🖥 App / Compute\n'+product('compute-vm')+'\n\nApplicationを動かすVM系Compute。Container / Serverlessは別の実行方式としてCloud Mapで比較します。',
    '🗄 Data\n'+product('managed-db')+'\n\nManaged relational DBの代表例。正本・SQL・権限・業務整合性までProvider任せにはなりません。',
    '🏢 Core / Hybrid\n'+product('hybrid-connectivity')+'\n\n銀行内Network・勘定系等へ接続。Cloud側GreenでもEnd-to-Endで確認します。'
  ],
  roles:[
    ['前提','<b>Cloud Fundamentalsの20 Conceptsが正本</b>。ここでは'+P.name+'名へ翻訳する。'],
    ['最初に見るもの','製品名より <b>Network / Compute / Data / Identity / Operations / Hybrid</b> のどの役割か。'],
    ['覚え方','<b>共通Concept → '+P.name+'名 → Evidence</b> の順で覚える。'],
    ['ゴール',P.name+'の構成図を、製品名なしの共通構造へ戻して説明できる。']
  ]
};

if(!Array.isArray(S.topics)||S.topics.length!==20)return;

S.topics=S.topics.map((topic,i)=>{
  const row=primary[i];
  const t=topic.slice();
  const name=product(row.key);
  const originalScope=Array.isArray(t[4])?t[4]:[];

  t[1]=t[1]+' — '+name;
  t[2]=t[2]+' '+P.name+'では代表的に「'+name+'」として現れます。';
  // Keep canonical concept keywords first: cloud-lab-engine uses the leading scope
  // values as input-mode must tokens. Provider labels are display/context, not answer keys.
  t[4]=[...originalScope.filter(x=>x!==name),name];
  t[5]=t[5]+'。'+P.name+'では '+name+' をこのConceptの代表実装として確認します。';
  t[10]=t[10]+' '+P.name+'では「'+name+'」。製品間は完全互換ではなく、Concept上の対応です。';

  if(row.key==='failure-domain'){
    const fleet=product('ha-fleet');
    t[2]+=' なお '+name+' はFailure Domain、'+fleet+' はCompute台数・自動復旧の仕組みで、同じ分類ではありません。';
    t[4]=['failure domain','redundancy',name,fleet];
    t[10]+=' Failure DomainとAuto Healing / Fleetを同じ機能として扱わないことが重要です。';
  }

  if(row.key==='compute-vm'){
    t[10]+=' VM系ComputeとContainer / Serverlessは「処理を動かす」という目的は共通でも実行・運用モデルが異なります。';
  }

  if(row.key==='persistent-data'){
    t[10]+=' Lab03はまず「永続Dataと正本」のConcept。Managed DBやObject Storageの製品選択は後続Labで分けて扱います。';
  }

  return t;
});

S.providerExtras=(P.extras||[]).map(key=>R.get(key)).filter(Boolean);
})();
