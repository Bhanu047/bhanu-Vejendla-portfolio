const year=document.getElementById("year");
if(year)year.textContent=new Date().getFullYear();
const liveStates=["READING SOURCE EVENTS","ORCHESTRATING INGESTION","PROCESSING MICRO-BATCH","COMMITTING TRUSTED TABLES","SERVING DATA PRODUCTS"];
const liveState=document.getElementById("live-state");
const overviewStages=[...document.querySelectorAll(".console .pipeline article")];
let liveIndex=0;
const projects={
  "kingdom": {
    "label": "FLAGSHIP PRODUCTION PLATFORM",
    "title": "Kingdom846",
    "text": "A gaming community needed one dependable place for alliance information, live rosters, applications, rankings, voting and operational updates. I built Kingdom846 as a responsive platform used by real community members.",
    "decision": "I separated the React interface from an Express API, persisted operational data in SQLite and enforced role boundaries for administrators, alliance leaders and War Room users. Rate-limited authentication, version-aware updates and a server-side Royal Advisor make the platform practical to operate.",
    "flow": [
      {
        "step": "EXPERIENCE",
        "name": "React + Vite",
        "detail": "Responsive portal"
      },
      {
        "step": "SERVICES",
        "name": "Express API",
        "detail": "Role-based access"
      },
      {
        "step": "DATA",
        "name": "SQLite",
        "detail": "Live community state"
      },
      {
        "step": "OPERATE",
        "name": "Production site",
        "detail": "Real users + updates"
      }
    ],
    "signals": [
      "Role-based access",
      "Version-aware writes",
      "Responsive experience"
    ],
    "evidence": [
      "596 visitors in first 19 days",
      "3,298 pageviews across 49 countries",
      "4.4 pages per visit"
    ],
    "evidenceLabel": "REPORTED LAUNCH SNAPSHOT",
    "tags": [
      "React",
      "Express",
      "SQLite",
      "REST APIs"
    ],
    "url": "https://kingdom846.com",
    "action": "Visit live website ↗",
    "artifacts": []
  },
  "stream": {
    "label": "STREAMING DATA PLATFORM",
    "title": "Weblog Stream",
    "text": "Web events can arrive late, duplicated or malformed. This project shows how I keep a real-time pipeline useful when the input is imperfect and the job has to recover from interruption.",
    "decision": "I separated invalid events into a dead-letter path, used event-time watermarks for bounded state and checkpointed the stream. The Parquet writer keeps replayed micro-batches safe without erasing earlier batches.",
    "flow": [
      {
        "step": "SOURCE",
        "name": "Web events",
        "detail": "JSON events"
      },
      {
        "step": "INGEST",
        "name": "Kafka",
        "detail": "Durable stream"
      },
      {
        "step": "PROCESS",
        "name": "Spark",
        "detail": "Watermarks + state"
      },
      {
        "step": "STORE",
        "name": "Parquet",
        "detail": "Replay-safe batches"
      }
    ],
    "signals": [
      "Schema validation",
      "Checkpoint recovery",
      "Late-event handling"
    ],
    "evidence": [
      "Automated Python tests",
      "GitHub Actions CI",
      "Docker Compose environment"
    ],
    "tags": [
      "Kafka",
      "PySpark",
      "Parquet",
      "Docker"
    ],
    "url": "https://github.com/Bhanu047/weblog-stream",
    "action": "Explore repository ↗",
    "artifacts": [
      {
        "kind": "REGRESSION TEST",
        "title": "Replay a batch without duplicating rows",
        "text": "The sink test writes the same two-record batch twice and expects two stored rows. A separate case checks that later batches preserve earlier records.",
        "url": "https://github.com/Bhanu047/weblog-stream/blob/6e974e5371c089b8248de1742f139b57fc1b2478/tests/test_sinks.py",
        "action": "Read sink tests",
        "snippet": "sinks.write_batch(frame, path, \"event_date\", 7)\nsinks.write_batch(frame, path, \"event_date\", 7)\nassert spark.read.parquet(str(path)).count() == 2"
      },
      {
        "kind": "REGRESSION TEST",
        "title": "Keep malformed records individually traceable",
        "text": "Three different malformed payloads must survive deduplication as three records so the dead-letter path can inspect each one.",
        "url": "https://github.com/Bhanu047/weblog-stream/blob/6e974e5371c089b8248de1742f139b57fc1b2478/tests/test_transform.py",
        "action": "Read deduplication tests",
        "snippet": "frame = schema.parse(kafka_like([\"{broken one\", \"{broken two\", \"also bad\"]))\nassert transform.deduplicate(frame, \"10 minutes\").count() == 3"
      }
    ]
  },
  "taxi": {
    "label": "BATCH LAKEHOUSE",
    "title": "NYC Taxi Lakehouse",
    "text": "Monthly public taxi files can change shape, contain invalid records and create duplicate output when a failed load is repeated. This project treats those conditions as design inputs rather than cleanup work.",
    "decision": "I used declared schemas, bronze/silver/gold boundaries and manifest-driven loading. Quality rules stop bad data early, while salted aggregation handles skew without hiding it.",
    "flow": [
      {
        "step": "SOURCE",
        "name": "NYC TLC",
        "detail": "Monthly trip files"
      },
      {
        "step": "BRONZE",
        "name": "Raw + manifest",
        "detail": "Traceable ingestion"
      },
      {
        "step": "SILVER",
        "name": "PySpark",
        "detail": "Validated records"
      },
      {
        "step": "GOLD",
        "name": "Parquet marts",
        "detail": "Analytics-ready"
      }
    ],
    "signals": [
      "Idempotent reloads",
      "Schema enforcement",
      "Skew-aware aggregation"
    ],
    "evidence": [
      "Pytest suite",
      "GitHub Actions CI",
      "Documented backfill path"
    ],
    "tags": [
      "PySpark",
      "Parquet",
      "Data Quality",
      "Lakehouse"
    ],
    "url": "https://github.com/Bhanu047/nyc-taxi-lakehouse",
    "action": "Explore repository ↗",
    "artifacts": [
      {
        "kind": "BUNDLED SAMPLE DATA",
        "title": "A real zone lookup to inspect",
        "text": "The repository includes an offline subset of the taxi-zone dimension, including airport and Manhattan locations.",
        "url": "https://github.com/Bhanu047/nyc-taxi-lakehouse/blob/4077f5295d752b53672dfde739048ecac155c6c7/conf/taxi_zone_lookup.sample.csv",
        "action": "Open sample CSV",
        "snippet": "location_id,borough,zone,service_zone\n132,Queens,JFK Airport,Airports\n138,Queens,LaGuardia Airport,Airports\n161,Manhattan,Midtown Center,Yellow Zone"
      },
      {
        "kind": "CORRECTNESS TEST",
        "title": "Optimise skew without changing totals",
        "text": "The test compares salted and ordinary aggregation results, then checks that totals stay consistent across different bucket counts.",
        "url": "https://github.com/Bhanu047/nyc-taxi-lakehouse/blob/4077f5295d752b53672dfde739048ecac155c6c7/tests/test_skew.py",
        "action": "Read aggregation tests",
        "snippet": "assert salted == naive\nassert totals(1) == totals(4) == totals(32)"
      }
    ]
  },
  "retail": {
    "label": "ANALYTICS WAREHOUSE",
    "title": "Retail Warehouse",
    "text": "Retail reporting becomes unreliable when order totals, customer history and incremental loads are defined differently across models. This project creates one tested path from raw records to business-ready marts.",
    "decision": "I separated staging, intermediate and mart layers, kept money in integer cents until presentation, added a three-day incremental lookback and used an SCD Type 2 snapshot for product history.",
    "flow": [
      {
        "step": "SOURCE",
        "name": "Retail records",
        "detail": "Orders + products"
      },
      {
        "step": "STAGE",
        "name": "dbt staging",
        "detail": "Typed inputs"
      },
      {
        "step": "MODEL",
        "name": "Star schema",
        "detail": "Facts + dimensions"
      },
      {
        "step": "SERVE",
        "name": "Business marts",
        "detail": "Consistent metrics"
      }
    ],
    "signals": [
      "Revenue reconciliation",
      "Late-arriving records",
      "Historical dimensions"
    ],
    "evidence": [
      "dbt data tests",
      "GitHub Actions CI",
      "Documented lineage"
    ],
    "tags": [
      "SQL",
      "dbt",
      "DuckDB",
      "Dimensional Modeling"
    ],
    "url": "https://github.com/Bhanu047/retail-warehouse",
    "action": "Explore repository ↗",
    "artifacts": [
      {
        "kind": "RECONCILIATION SQL",
        "title": "Keep daily revenue tied to order facts",
        "text": "A dbt test returns discrepancies when daily revenue and revenue-eligible order totals differ by more than one cent.",
        "url": "https://github.com/Bhanu047/retail-warehouse/blob/8629c0ad2960c5e997e07a66312b3c605bb52607/tests/assert_daily_revenue_reconciles.sql",
        "action": "Read reconciliation test",
        "snippet": "select daily.revenue as daily_revenue, orders.revenue as order_revenue\nfrom daily\ncross join orders\nwhere abs(daily.revenue - orders.revenue) > 0.01"
      },
      {
        "kind": "ANALYTICS MODEL",
        "title": "Inspect the business-facing output",
        "text": "The daily mart defines order counts, cancellations, returns, customer counts, units, revenue and average order value from one order fact.",
        "url": "https://github.com/Bhanu047/retail-warehouse/blob/8629c0ad2960c5e997e07a66312b3c605bb52607/models/marts/fct_daily_revenue.sql",
        "action": "Read daily revenue model",
        "snippet": "ordered_date\norders_total, orders_revenue\norders_cancelled, orders_returned\ncustomers, units, revenue\navg_order_value, cancellation_rate_pct"
      }
    ]
  },
  "infra": {
    "label": "CLOUD FOUNDATION",
    "title": "Data Platform Terraform",
    "text": "Cloud data platforms become risky when environments drift and pipeline identities receive broad permissions. This project makes the platform repeatable, reviewable and constrained by design.",
    "decision": "I split the platform into reusable data-lake, catalog and identity modules, separated environment inputs and gave the pipeline only the S3 access its data path requires.",
    "flow": [
      {
        "step": "DEFINE",
        "name": "Terraform",
        "detail": "Reusable modules"
      },
      {
        "step": "CHECK",
        "name": "Plan + tests",
        "detail": "Validate changes"
      },
      {
        "step": "PROVISION",
        "name": "AWS",
        "detail": "S3 + Glue + IAM"
      },
      {
        "step": "OPERATE",
        "name": "Data platform",
        "detail": "Consistent environments"
      }
    ],
    "signals": [
      "Least-privilege IAM",
      "Environment separation",
      "Plan-time guardrails"
    ],
    "evidence": [
      "Terraform test suite",
      "GitHub Actions CI",
      "No live AWS account required"
    ],
    "tags": [
      "Terraform",
      "AWS",
      "S3",
      "Glue",
      "IAM"
    ],
    "url": "https://github.com/Bhanu047/data-platform-terraform",
    "action": "Explore repository ↗",
    "artifacts": [
      {
        "kind": "ACCESS-BOUNDARY TEST",
        "title": "Keep the raw layer read-only for pipelines",
        "text": "A plan-time assertion checks that raw is absent from the pipeline’s writable layers. Related checks verify the required read and curated-write access.",
        "url": "https://github.com/Bhanu047/data-platform-terraform/blob/ed0809d745b5964801e8eac561ded0e5604b33e1/tests/access_model.tftest.hcl",
        "action": "Read access-model tests",
        "snippet": "condition = !contains(output.pipeline_writable_layers, \"raw\")"
      },
      {
        "kind": "PRODUCTION GUARDRAIL",
        "title": "Refuse destructive bucket settings in production",
        "text": "The mocked-provider test requests force_destroy in production and expects the effective value to remain false. This checks configuration at plan time.",
        "url": "https://github.com/Bhanu047/data-platform-terraform/blob/ed0809d745b5964801e8eac561ded0e5604b33e1/tests/guardrails.tftest.hcl",
        "action": "Read guardrail tests",
        "snippet": "environment = \"prod\"\nforce_destroy_buckets = true\n\ncondition = output.force_destroy_effective == false"
      }
    ]
  }
};
const projectSlugs={kingdom:'kingdom846',stream:'weblog-stream',taxi:'nyc-taxi-lakehouse',retail:'retail-warehouse',infra:'data-platform-terraform'};
function projectHash(key){return '#project-'+projectSlugs[key];}
function projectKeyFromHash(){return Object.keys(projectSlugs).find(key=>projectHash(key)===location.hash);}
function canonicalProjectURL(key){const url=new URL(location.href);url.search='';url.hash=projectHash(key);return url.href;}
function renderFlagship(){return '<figure class="project-showcase"><a href="https://kingdom846.com" target="_blank" rel="noreferrer"><img src="assets/kingdom846-showcase.webp" width="1280" height="699" alt="Kingdom846 public homepage showing the royal portal, alliance navigation and community features" loading="lazy" decoding="async"></a><figcaption>Actual Kingdom846 public homepage · captured October 2026</figcaption></figure>';}
function renderProjectSharing(key){return '<div class="project-sharing"><a class="project-permalink" href="'+projectHash(key)+'">Direct project link ↗</a><button type="button" class="copy-project-link" hidden>Copy project link</button><span class="project-share-status" role="status" aria-live="polite"></span></div>';}
const detail=document.getElementById("project-detail");
function escapeHTML(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function renderArtifacts(project){
  if(!project.artifacts?.length)return "";
  return '<section class="project-artifacts" aria-label="Project evidence"><h4>Inspect the evidence</h4><div class="artifact-grid">'+(project.artifacts||[]).map(item=>
    '<article class="artifact-card"><span class="artifact-kind">'+escapeHTML(item.kind)+'</span><h5>'+escapeHTML(item.title)+'</h5><p>'+escapeHTML(item.text)+'</p>'+
    (item.snippet?'<details><summary>View excerpt</summary><pre><code>'+escapeHTML(item.snippet)+'</code></pre></details>':'')+
    '<a href="'+escapeHTML(item.url)+'" target="_blank" rel="noreferrer">'+escapeHTML(item.action)+' ↗</a></article>'
  ).join('')+'</div></section>';
}
function render(key){
  const p=projects[key];
  const workflow=p.flow.map((stage,index)=>`${index?'<div class="flow-link"><i></i></div>':''}<div class="flow-stage"><small>${String(index+1).padStart(2,'0')} · ${stage.step}</small><b>${stage.name}</b><em>${stage.detail}</em></div>`).join('');
  detail.innerHTML=`<div class="project-meta"><span class="label">${p.label}</span></div><h3 id="${projectHash(key).slice(1)}">${p.title}</h3><div class="project-overview ${key==='kingdom'?'is-flagship':''}">${key==='kingdom'?renderFlagship():''}<div class="project-brief"><section><small>PROBLEM</small><p>${p.text}</p></section><section><small>ENGINEERING DECISION</small><p>${p.decision}</p></section></div></div><div class="workflow-label"><span>ARCHITECTURE FLOW</span><b>ILLUSTRATED WORKFLOW</b></div><div class="architecture-flow">${workflow}</div><div class="project-signals" aria-label="Engineering focus">${p.signals.map(x=>'<span>'+x+'</span>').join('')}</div><div class="project-evidence"><small>${p.evidenceLabel||'REPOSITORY EVIDENCE'}</small><div>${p.evidence.map(x=>'<span><i>✓</i>'+x+'</span>').join('')}</div></div>${renderArtifacts(p)}<div class="project-footer"><div class="tags">${p.tags.map(x=>'<span>'+x+'</span>').join('')}</div><a href="${p.url}" target="_blank" rel="noreferrer">${p.action||'Explore project ↗'}</a></div>${renderProjectSharing(key)}`;
}
const projectList=document.querySelector(".project-list");
const projectButtons=[...document.querySelectorAll(".project-list button")];
if(projectList){
  projectList.hidden=false;
  projectList.setAttribute("role","tablist");
  projectList.setAttribute("aria-orientation","horizontal");
}
if(detail){detail.setAttribute("role","tabpanel");detail.setAttribute("aria-live","polite");}
function activateProject(btn,{historyMode='push'}={}){
  const key=btn.dataset.project;
  projectButtons.forEach(x=>{const active=x===btn;x.classList.toggle('active',active);x.setAttribute('aria-selected',String(active));x.tabIndex=active?0:-1});
  render(key);
  detail.setAttribute('aria-labelledby',btn.id);
  if(historyMode!=='none'&&location.hash!==projectHash(key)){
    history[historyMode==='replace'?'replaceState':'pushState'](null,'',projectHash(key));
  }
  const copy=detail.querySelector('.copy-project-link');
  const status=detail.querySelector('.project-share-status');
  if(copy&&status){
    copy.hidden=false;
    copy.addEventListener('click',async()=>{
      const url=canonicalProjectURL(key);
      try{await navigator.clipboard.writeText(url);status.textContent='Project link copied.';}
      catch{status.textContent='Copy this URL: '+url;}
    });
  }
}
projectButtons.forEach((btn,index)=>{
  btn.setAttribute("role","tab");
  btn.setAttribute("aria-controls","project-detail");
  btn.id="project-tab-"+btn.dataset.project;
  btn.addEventListener("click",()=>activateProject(btn));
  btn.addEventListener("keydown",event=>{
    let next=index;
    if(event.key==="ArrowDown"||event.key==="ArrowRight")next=(index+1)%projectButtons.length;
    else if(event.key==="ArrowUp"||event.key==="ArrowLeft")next=(index-1+projectButtons.length)%projectButtons.length;
    else if(event.key==="Home")next=0;
    else if(event.key==="End")next=projectButtons.length-1;
    else return;
    event.preventDefault();
    projectButtons[next].focus();
    activateProject(projectButtons[next],{historyMode:'replace'});
  });
});
function selectProjectFromLocation({scroll=false}={}){
  const key=projectKeyFromHash()||(location.hash.startsWith('#project-')?projectButtons[0]?.dataset.project:undefined);
  if(!key)return;
  const button=projectButtons.find(btn=>btn.dataset.project===key);
  if(button)activateProject(button,{historyMode:'none'});
  if(scroll)document.getElementById('work')?.scrollIntoView({block:'start',behavior:'instant'});
}
if(projectButtons.length){
  const requested=projectKeyFromHash();
  activateProject(projectButtons.find(btn=>btn.dataset.project===requested)||projectButtons[0],{historyMode:'none'});
  if(requested)requestAnimationFrame(()=>document.getElementById('work')?.scrollIntoView({block:'start',behavior:'instant'}));
}
addEventListener('hashchange',()=>selectProjectFromLocation({scroll:true}));

const motionPreference=matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion=motionPreference.matches;
const progressBar=document.querySelector(".scroll-progress i");
let progressTick=false;
function updateScrollProgress(){
  const available=document.documentElement.scrollHeight-innerHeight;
  const progress=available>0?Math.min(1,scrollY/available):0;
  if(progressBar)progressBar.style.width=`${progress*100}%`;
  progressTick=false;
}
addEventListener("scroll",()=>{if(!progressTick){requestAnimationFrame(updateScrollProgress);progressTick=true}},{passive:true});
updateScrollProgress();

const workflowStages=[...document.querySelectorAll(".workflow-track li")];
const workflowState=document.getElementById("workflow-state");
const workflowTrackWrap=document.querySelector(".workflow-track-wrap");
const workflowStates=["DISCOVERING SOURCES","DEFINING CONTRACTS","INGESTING DATA","TRANSFORMING MODELS","PUBLISHING PRODUCTS","MONITORING PIPELINE"];
let workflowIndex=0;
let overviewTimer;
let workflowTimer;
let workflowInteractionUntil=0;

function showOverviewStage(index){
  if(!overviewStages.length||!liveState)return;
  overviewStages.forEach((stage,stageIndex)=>stage.classList.toggle("active",stageIndex===index));
  liveState.textContent=liveStates[index];
}

function showWorkflowStage(index,{follow=false}={}){
  if(!workflowStages.length)return;
  workflowStages.forEach((stage,stageIndex)=>stage.classList.toggle("is-active",stageIndex===index));
  if(workflowState)workflowState.textContent=workflowStates[index];
  if(follow&&workflowTrackWrap&&innerWidth<=700&&Date.now()>workflowInteractionUntil){
    const stage=workflowStages[index];
    const left=stage.offsetLeft-(workflowTrackWrap.clientWidth-stage.offsetWidth)/2;
    workflowTrackWrap.scrollTo({left:Math.max(0,left),behavior:"smooth"});
  }
}

function stopMotionCycles(){
  clearInterval(overviewTimer);
  clearInterval(workflowTimer);
  overviewTimer=undefined;
  workflowTimer=undefined;
}

function startMotionCycles({restartVisuals=false}={}){
  stopMotionCycles();
  reducedMotion=motionPreference.matches;
  const canAnimate=!document.hidden&&!reducedMotion;
  document.body.classList.toggle("motion-paused",!canAnimate);
  document.body.classList.toggle("motion-enabled",canAnimate);
  if(!canAnimate)return;

  if(restartVisuals){
    document.body.classList.remove("motion-enabled");
    void document.body.offsetWidth;
    document.body.classList.add("motion-enabled");
  }

  if(overviewStages.length&&liveState){
    overviewTimer=setInterval(()=>{
      liveIndex=(liveIndex+1)%Math.min(liveStates.length,overviewStages.length);
      showOverviewStage(liveIndex);
    },1800);
  }

  if(workflowStages.length){
    workflowTimer=setInterval(()=>{
      workflowIndex=(workflowIndex+1)%Math.min(workflowStates.length,workflowStages.length);
      showWorkflowStage(workflowIndex,{follow:true});
    },3200);
  }
}

if(workflowTrackWrap){
  ["pointerdown","touchstart","wheel"].forEach(eventName=>workflowTrackWrap.addEventListener(eventName,()=>{
    workflowInteractionUntil=Date.now()+8000;
  },{passive:true}));
}

document.addEventListener("visibilitychange",()=>startMotionCycles({restartVisuals:!document.hidden}));
addEventListener("pageshow",()=>startMotionCycles({restartVisuals:true}));
if(motionPreference.addEventListener)motionPreference.addEventListener("change",()=>startMotionCycles({restartVisuals:true}));
else motionPreference.addListener(()=>startMotionCycles({restartVisuals:true}));
startMotionCycles({restartVisuals:true});

if(!reducedMotion&&"IntersectionObserver" in window){
  const els=document.querySelectorAll(".section-title,.career article,.stack-group");
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){
      if(e.target.animate)e.target.animate([{opacity:0,transform:"translateY(18px)"},{opacity:1,transform:"none"}],{duration:550,easing:"ease",fill:"both"});
      observer.unobserve(e.target);
    }
  }),{threshold:.15});
  els.forEach(x=>observer.observe(x));
}

const proof=document.querySelector(".proof");
if(proof&&!reducedMotion&&"IntersectionObserver" in window){
  const numbers=[...proof.querySelectorAll("strong")];
  const targetValues=numbers.map(el=>({el,value:Number.parseInt(el.textContent,10),suffix:el.textContent.includes("+")?"+":""}));
  const counterObserver=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    const start=performance.now();
    const duration=900;
    function frame(now){
      const t=Math.min(1,(now-start)/duration);
      const eased=1-Math.pow(1-t,3);
      targetValues.forEach(item=>item.el.textContent=`${Math.round(item.value*eased)}${item.suffix}`);
      if(t<1)requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    counterObserver.disconnect();
  },{threshold:.35});
  counterObserver.observe(proof);
}

if(!reducedMotion&&"IntersectionObserver" in window){
  const revealItems=document.querySelectorAll(".about-grid,.workflow-console,.project-layout,.cta h2");
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}
  }),{threshold:.12});
  revealItems.forEach(item=>{item.classList.add("reveal-ready");revealObserver.observe(item)});
}




// Explicit user action copies only the public professional contact address.
const copyEmailButton=document.getElementById('copy-email');
const copyEmailStatus=document.getElementById('copy-email-status');
if(copyEmailButton&&copyEmailStatus){
  copyEmailButton.hidden=false;
  copyEmailButton.addEventListener('click',async()=>{
    const email=document.querySelector('.contact-email a');
    if(!email)return;
    copyEmailButton.disabled=true;
    try{
      await navigator.clipboard.writeText(email.textContent.trim());
      copyEmailStatus.textContent='Copied!';
      clearTimeout(copyEmailButton.confirmationTimer);
      copyEmailButton.confirmationTimer=setTimeout(()=>{copyEmailStatus.textContent='';},2500);
    }catch{
      const selection=window.getSelection();
      if(selection){const range=document.createRange();range.selectNodeContents(email);selection.removeAllRanges();selection.addRange(range);}
      copyEmailStatus.textContent='Select the email below and copy it manually.';
    }finally{copyEmailButton.disabled=false;}
  });
}



