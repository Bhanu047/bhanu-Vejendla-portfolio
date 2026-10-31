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
    "text": "A gaming community needed one place for alliance information, live rosters, applications, rankings, voting and updates. I built Kingdom846 for them, and real members use it.",
    "decision": "The React front end talks to an Express API, and the data lives in SQLite. Admins, alliance leaders and War Room users each get different permissions. Login is rate-limited, saves check the version first, and the Royal Advisor runs on the server.",
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
      "Conflict-safe writes",
      "Recoverable editing"
    ],
    "caseStudy": {
      "eyebrow": "ONE DESIGN DECISION",
      "title": "Preventing one teammate from silently overwriting another",
      "steps": [
        {
          "title": "The problem",
          "text": "Several War Room users can edit the same roster. With a plain last-write-wins save, one person could wipe out someone else’s newer changes without either of them noticing."
        },
        {
          "title": "The fix",
          "text": "Each save includes the version the editor started from. If that version is out of date, the API rejects the save with a conflict instead of overwriting."
        },
        {
          "title": "What the editor sees",
          "text": "The page shows who saved the latest version. The editor can load it, or choose to replace it on purpose."
        }
      ]
    },
    "evidence": [
      "1,719 visits",
      "5,968 pageviews",
      "58 countries",
      "3.5 pages per visit"
    ],
    "evidenceLabel": "SITE USAGE",
    "tags": [
      "React",
      "Express",
      "SQLite",
      "REST APIs"
    ],
    "url": "https://kingdom846.com",
    "action": "Visit live website ↗",
    "noteUrl": "/notes/conflict-safe-collaboration.html",
    "noteAction": "Read engineering note →",
    "artifacts": []
  },
  "stream": {
    "label": "STREAMING DATA PLATFORM",
    "title": "Weblog Stream",
    "text": "Web events show up late, twice, or broken. This project is about keeping a real-time pipeline correct when the input is messy and the job gets restarted.",
    "decision": "Bad events go to a dead-letter path. Event-time watermarks stop state from growing forever, and the stream is checkpointed. The Parquet writer can replay a micro-batch without wiping out earlier ones.",
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
    "noteUrl": "/notes/replay-safe-streaming.html",
    "noteAction": "Read engineering note →",
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
    "text": "The monthly NYC taxi files change shape, contain bad records, and can produce duplicates if a failed load is rerun. I designed for those problems from the start instead of cleaning up afterwards.",
    "decision": "Schemas are declared up front, data moves through bronze, silver and gold layers, and a manifest tracks what has been loaded. Quality rules stop bad rows early, and salted aggregation deals with skewed keys.",
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
    "noteUrl": "/notes/retry-safe-monthly-loads.html",
    "noteAction": "Read engineering note →",
    "artifacts": [
      {
        "kind": "BUNDLED SAMPLE DATA",
        "title": "Real taxi-zone sample data",
        "text": "The repository includes an offline subset of the taxi-zone dimension, including airport and Manhattan locations.",
        "url": "https://github.com/Bhanu047/nyc-taxi-lakehouse/blob/4077f5295d752b53672dfde739048ecac155c6c7/conf/taxi_zone_lookup.sample.csv",
        "action": "Open sample CSV",
        "snippet": "location_id,borough,zone,service_zone\n132,Queens,JFK Airport,Airports\n138,Queens,LaGuardia Airport,Airports\n161,Manhattan,Midtown Center,Yellow Zone"
      },
      {
        "kind": "CORRECTNESS TEST",
        "title": "Fixing skew without changing the totals",
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
    "text": "Retail numbers stop matching when different models calculate order totals, customer history or incremental loads in different ways. This project has one tested path from raw records to the reporting tables.",
    "decision": "Staging, intermediate and mart layers are kept separate. Money stays in integer cents until it’s displayed, incremental models look back three days, and product history uses an SCD Type 2 snapshot.",
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
    "noteUrl": "/notes/incremental-model-lookback.html",
    "noteAction": "Read engineering note →",
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
        "title": "The daily revenue model",
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
    "text": "Problems start when dev and prod drift apart, or when a pipeline has more permissions than it needs. This project builds the platform the same way every time and keeps permissions tight.",
    "decision": "The platform is split into reusable modules for the data lake, the catalog and identity. Each environment has its own inputs, and the pipeline only gets the S3 access it actually needs.",
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
    "noteUrl": "/notes/terraform-production-guardrails.html",
    "noteAction": "Read engineering note →",
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
        "text": "The mocked-provider test asks for force_destroy in production and expects the effective value to stay false, so the check happens at plan time.",
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
function renderFlagship(){return '<figure class="project-showcase"><a href="https://kingdom846.com" target="_blank" rel="noreferrer"><img src="assets/kingdom846-showcase.webp" width="1280" height="699" alt="Kingdom846 public homepage showing the royal portal, alliance navigation and community features" loading="lazy" decoding="async"></a></figure>';}
const detail=document.getElementById("project-detail");
function escapeHTML(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function renderArtifacts(project){
  if(!project.artifacts?.length)return "";
  return '<section class="project-artifacts" aria-label="Project evidence"><h4>Code and tests</h4><div class="artifact-grid">'+(project.artifacts||[]).map(item=>
    '<article class="artifact-card"><span class="artifact-kind">'+escapeHTML(item.kind)+'</span><h5>'+escapeHTML(item.title)+'</h5><p>'+escapeHTML(item.text)+'</p>'+
    (item.snippet?'<details><summary>View excerpt</summary><pre><code>'+escapeHTML(item.snippet)+'</code></pre></details>':'')+
    '<a href="'+escapeHTML(item.url)+'" target="_blank" rel="noreferrer">'+escapeHTML(item.action)+' ↗</a></article>'
  ).join('')+'</div></section>';
}
function renderEvidence(p){return `<div class="project-evidence"><small>${p.evidenceLabel||'REPOSITORY EVIDENCE'}</small><div>${p.evidence.map(x=>'<span><i>✓</i>'+x+'</span>').join('')}</div></div>`;}
function renderCaseStudy(project){
  if(!project.caseStudy)return "";
  const story=project.caseStudy;
  return '<section class="case-study-story" aria-label="Engineering decision"><div class="case-study-heading"><small>'+escapeHTML(story.eyebrow)+'</small><h4>'+escapeHTML(story.title)+'</h4></div><div class="case-study-steps">'+story.steps.map((step,index)=>
    '<article><span>'+String(index+1).padStart(2,'0')+'</span><h5>'+escapeHTML(step.title)+'</h5><p>'+escapeHTML(step.text)+'</p></article>'
  ).join('')+'</div></section>';
}
function renderProjectActions(project){
  return '<div class="project-actions">'+
    (project.noteUrl?'<a href="'+escapeHTML(project.noteUrl)+'">'+escapeHTML(project.noteAction||'Read engineering note →')+'</a>':'')+
    '<a href="'+escapeHTML(project.url)+'" target="_blank" rel="noreferrer">'+escapeHTML(project.action||'Explore project ↗')+'</a></div>';
}
function render(key){
  const p=projects[key];
  const workflow=p.flow.map((stage,index)=>`${index?'<div class="flow-link"><i></i></div>':''}<div class="flow-stage"><small>${String(index+1).padStart(2,'0')} · ${stage.step}</small><b>${stage.name}</b><em>${stage.detail}</em></div>`).join('');
  detail.innerHTML=`<div class="project-meta"><span class="label">${p.label}</span></div><h3 id="${projectHash(key).slice(1)}">${p.title}</h3><div class="project-overview ${key==='kingdom'?'is-flagship':''}">${key==='kingdom'?'<div class="flagship-media">'+renderFlagship()+renderEvidence(p)+'</div>':''}<div class="project-brief"><section><small>PROBLEM</small><p>${p.text}</p></section><section><small>ENGINEERING DECISION</small><p>${p.decision}</p></section></div></div>${renderCaseStudy(p)}<div class="workflow-label"><span>ARCHITECTURE FLOW</span><b>ILLUSTRATED WORKFLOW</b></div><div class="architecture-flow">${workflow}</div><div class="project-signals" aria-label="Engineering focus">${p.signals.map(x=>'<span>'+x+'</span>').join('')}</div>${key==='kingdom'?'':renderEvidence(p)}${renderArtifacts(p)}<div class="project-footer"><div class="tags">${p.tags.map(x=>'<span>'+x+'</span>').join('')}</div>${renderProjectActions(p)}</div>`;
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
    targetValues.forEach((item,index)=>{
      const delay=index*110;
      const start=performance.now()+delay;
      const duration=850;
      if(item.el.animate)item.el.animate(
        [{opacity:.3,transform:"translateY(8px) scale(.94)"},{opacity:1,transform:"translateY(0) scale(1)"}],
        {duration:520,delay,easing:"cubic-bezier(.2,.8,.2,1)",fill:"both"}
      );
      function frame(now){
        const t=Math.max(0,Math.min(1,(now-start)/duration));
        const eased=1-Math.pow(1-t,3);
        item.el.textContent=`${Math.round(item.value*eased)}${item.suffix}`;
        if(t<1)requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
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






