document.getElementById("year").textContent=new Date().getFullYear();
document.body.classList.add("motion-enabled");
const liveStates=["READING SOURCE EVENTS","ORCHESTRATING INGESTION","PROCESSING MICRO-BATCH","COMMITTING TRUSTED TABLES","SERVING DATA PRODUCTS"];
const overviewStages=[...document.querySelectorAll(".console .pipeline article")];
let liveIndex=0;
setInterval(()=>{const state=document.getElementById("live-state");if(state){overviewStages[liveIndex]?.classList.remove("active");liveIndex=(liveIndex+1)%liveStates.length;state.textContent=liveStates[liveIndex];overviewStages[liveIndex]?.classList.add("active")}},1800);
const projects={
 stream:{label:"STREAMING DATA PLATFORM",title:"Weblog Stream",text:"Web events can arrive late, duplicated or malformed. This project shows how I keep a real-time pipeline useful when the input is imperfect and the job has to recover from interruption.",decision:"I separated invalid events into a dead-letter path, used event-time watermarks for bounded state and checkpointed the stream so restart and replay behavior stay explicit.",flow:[{step:"SOURCE",name:"Web events",detail:"JSON events"},{step:"INGEST",name:"Kafka",detail:"Durable stream"},{step:"PROCESS",name:"Spark",detail:"Watermarks + state"},{step:"STORE",name:"Delta Lake",detail:"Idempotent writes"}],signals:["Schema validation","Checkpoint recovery","Late-event handling"],evidence:["Automated Python tests","GitHub Actions CI","Docker Compose environment"],tags:["Kafka","PySpark","Delta Lake","Docker"],url:"https://github.com/Bhanu047/weblog-stream"},
 taxi:{label:"BATCH LAKEHOUSE",title:"NYC Taxi Lakehouse",text:"Monthly public taxi files can change shape, contain invalid records and create duplicate output when a failed load is repeated. This project treats those conditions as design inputs rather than cleanup work.",decision:"I used declared schemas, bronze/silver/gold boundaries and manifest-driven loading. Quality rules stop bad data early, while salted aggregation handles skew without hiding it.",flow:[{step:"SOURCE",name:"NYC TLC",detail:"Monthly trip files"},{step:"BRONZE",name:"Raw + manifest",detail:"Traceable ingestion"},{step:"SILVER",name:"PySpark",detail:"Validated records"},{step:"GOLD",name:"Parquet marts",detail:"Analytics-ready"}],signals:["Idempotent reloads","Schema enforcement","Skew-aware aggregation"],evidence:["Pytest suite","GitHub Actions CI","Documented backfill path"],tags:["PySpark","Parquet","Data Quality","Lakehouse"],url:"https://github.com/Bhanu047/nyc-taxi-lakehouse"},
 retail:{label:"ANALYTICS WAREHOUSE",title:"Retail Warehouse",text:"Retail reporting becomes unreliable when order totals, customer history and incremental loads are defined differently across models. This project creates one tested path from raw records to business-ready marts.",decision:"I separated staging, intermediate and mart layers, kept money in integer cents until presentation, added a three-day incremental lookback and used an SCD Type 2 snapshot for product history.",flow:[{step:"SOURCE",name:"Retail records",detail:"Orders + products"},{step:"STAGE",name:"dbt staging",detail:"Typed inputs"},{step:"MODEL",name:"Star schema",detail:"Facts + dimensions"},{step:"SERVE",name:"Business marts",detail:"Consistent metrics"}],signals:["Revenue reconciliation","Late-arriving records","Historical dimensions"],evidence:["dbt data tests","GitHub Actions CI","Documented lineage"],tags:["SQL","dbt","DuckDB","Dimensional Modeling"],url:"https://github.com/Bhanu047/retail-warehouse"},
 infra:{label:"CLOUD FOUNDATION",title:"Data Platform Terraform",text:"Cloud data platforms become risky when environments drift and pipeline identities receive broad permissions. This project makes the platform repeatable, reviewable and constrained by design.",decision:"I split the platform into reusable data-lake, catalog and identity modules, separated environment inputs and gave the pipeline only the S3 access its data path requires.",flow:[{step:"DEFINE",name:"Terraform",detail:"Reusable modules"},{step:"CHECK",name:"Plan + tests",detail:"Validate changes"},{step:"PROVISION",name:"AWS",detail:"S3 + Glue + IAM"},{step:"OPERATE",name:"Data platform",detail:"Consistent environments"}],signals:["Least-privilege IAM","Environment separation","Plan-time guardrails"],evidence:["Terraform test suite","GitHub Actions CI","No live AWS account required"],tags:["Terraform","AWS","S3","Glue","IAM"],url:"https://github.com/Bhanu047/data-platform-terraform"}
};
const detail=document.getElementById("project-detail");
function render(key){const p=projects[key];const workflow=p.flow.map((stage,index)=>`${index?'<div class="flow-link"><i></i></div>':''}<div class="flow-stage"><small>${String(index+1).padStart(2,'0')} · ${stage.step}</small><b>${stage.name}</b><em>${stage.detail}</em></div>`).join('');detail.innerHTML=`<div class="project-meta"><span class="label">${p.label}</span><b>PERSONAL ENGINEERING PROJECT</b></div><h3>${p.title}</h3><div class="project-brief"><section><small>PROBLEM</small><p>${p.text}</p></section><section><small>ENGINEERING DECISION</small><p>${p.decision}</p></section></div><div class="workflow-label"><span>ARCHITECTURE FLOW</span><b><i></i> LIVE</b></div><div class="architecture-flow">${workflow}</div><div class="project-evidence"><small>REPOSITORY EVIDENCE</small><div>${p.evidence.map(x=>`<span><i>✓</i>${x}</span>`).join("")}</div></div><div class="project-signals">${p.signals.map(x=>`<span><i>↳</i>${x}</span>`).join("")}</div><div class="project-footer"><div class="tags">${p.tags.map(x=>`<span>${x}</span>`).join("")}</div><a href="${p.url}" target="_blank" rel="noreferrer">Explore repository ↗</a></div>`;}
const projectButtons=[...document.querySelectorAll(".project-list button")];
function activateProject(btn){
  projectButtons.forEach(x=>{const active=x===btn;x.classList.toggle("active",active);x.setAttribute("aria-selected",String(active));x.tabIndex=active?0:-1});
  render(btn.dataset.project);
  detail.setAttribute("aria-labelledby",btn.id);
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
    activateProject(projectButtons[next]);
  });
});
activateProject(projectButtons[0]);

if(!matchMedia("(prefers-reduced-motion: reduce)").matches){const els=document.querySelectorAll(".section-title,.career article,.stack-group");const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:0,transform:"translateY(18px)"},{opacity:1,transform:"none"}],{duration:550,easing:"ease",fill:"both"});observer.unobserve(e.target)}}),{threshold:.15});els.forEach(x=>observer.observe(x));}

const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
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
const workflowStates=["DISCOVERING SOURCES","DEFINING CONTRACTS","INGESTING DATA","TRANSFORMING MODELS","PUBLISHING PRODUCTS","MONITORING PIPELINE"];
let workflowIndex=0;
if(workflowStages.length&&!reducedMotion){
  setInterval(()=>{
    workflowStages[workflowIndex].classList.remove("is-active");
    workflowIndex=(workflowIndex+1)%workflowStages.length;
    workflowStages[workflowIndex].classList.add("is-active");
    if(workflowState)workflowState.textContent=workflowStates[workflowIndex];
  },1700);
}

const proof=document.querySelector(".proof");
if(proof&&!reducedMotion){
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

if(!reducedMotion){
  const revealItems=document.querySelectorAll(".about-grid,.workflow-console,.project-layout,.cta h2");
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}
  }),{threshold:.12});
  revealItems.forEach(item=>{item.classList.add("reveal-ready");revealObserver.observe(item)});
}
