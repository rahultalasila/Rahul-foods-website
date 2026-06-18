function Counter({end, suffix=""}) {
  const [val,setVal]=useState(0);
  const ref=useRef(null);
  const started=useRef(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting && !started.current){
        started.current=true;
        const duration=1400, steps=40, inc=end/steps;
        let cur=0,i=0;
        const t=setInterval(()=>{ i++; cur+=inc; setVal(i>=steps?end:Math.round(cur)); if(i>=steps) clearInterval(t); },duration/steps);
      }
    },{threshold:0.4});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);
  return <div ref={ref}>{val}{suffix}</div>;
}

function FaqAccordion() {
  const [open,setOpen]=useState(null);
  const faqs = [
    {q:"What are your delivery hours?", a:"We deliver every day from 11 AM to 11:30 PM. Orders placed after 11 PM will be processed the next morning."},
    {q:"How long does delivery take?", a:"Most orders arrive within 30–45 minutes depending on your location and order volume."},
    {q:"Do you offer vegetarian or vegan options?", a:"Yes! Look for the 'Veg' tag in our menu. We're happy to customize dishes for dietary needs — just add a note at checkout."},
    {q:"What is your refund / cancellation policy?", a:"Orders can be cancelled within 5 minutes of placing them from the cart page. Once preparation begins, refunds are evaluated case-by-case — contact us via WhatsApp."},
    {q:"Can I make a reservation for a large group?", a:"For groups of 8 or more, please call us directly at +91 70757 51105 so we can arrange the best seating for you."},
  ];
  return (
    <div style={{maxWidth:"760px",margin:"0 auto"}}>
      {faqs.map((f,i)=>(
        <div key={i} className="faq-item">
          <button className="faq-question" onClick={()=>setOpen(open===i?null:i)}>
            {f.q}
            <span className={`faq-icon${open===i?" open":""}`}>+</span>
          </button>
          {open===i && <div className="faq-answer">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="OUR STORY" title="About Us" />
      <section style={{padding:"90px",background:"#f9f8f5",display:"flex",gap:"80px",alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:"280px"}}>
          <p style={{color:GOLD,letterSpacing:"5px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",marginBottom:"16px"}}>✦ OUR PHILOSOPHY ✦</p>
          <h2 style={{fontSize:"40px",fontWeight:"300",margin:"0 0 28px",lineHeight:1.25}}>Crafted with<br/><span style={{color:GOLD}}>Passion</span></h2>
          <p style={{color:"#666",fontSize:"15px",lineHeight:2,fontFamily:"sans-serif",marginBottom:"20px"}}>At Rahul Foods, we believe that dining is the highest art form. Every plate is a canvas where we blend time-honoured tradition with bold innovation.</p>
          <p style={{color:"#666",fontSize:"15px",lineHeight:2,fontFamily:"sans-serif",marginBottom:"20px"}}>Our chefs personally source the finest local and imported ingredients, ensuring each dish meets our uncompromising standards of excellence.</p>
          <p style={{color:"#666",fontSize:"15px",lineHeight:2,fontFamily:"sans-serif"}}>Founded in 2011, Rahul Foods has grown into one of the city's most celebrated dining destinations.</p>
        </div>
        <div className="rf-grid2" style={{flex:1,minWidth:"280px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
          {[[15,"+","Years of Excellence"],[50,"+","Signature Dishes"],[10000,"+","Happy Guests"],[5," ★","Average Rating"]].map(([num,suffix,label])=>(
            <div key={label} style={{padding:"36px 24px",textAlign:"center",border:`1px solid ${GOLD}44`,background:"#fff",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
              <div style={{fontSize:"38px",color:GOLD,marginBottom:"10px",fontWeight:"300"}}><Counter end={num} suffix={suffix} /></div>
              <div style={{color:"#aaa",fontSize:"10px",letterSpacing:"3px",fontFamily:"sans-serif",fontWeight:"600",textTransform:"uppercase"}}>{label}</div>
            </div>
          ))}
        </div>
      </section>
      <div style={{height:"1px",background:`linear-gradient(to right,transparent,${GOLD},transparent)`}} />
      <section style={{padding:"90px 60px",background:`linear-gradient(135deg,${DARK},${MID})`}}>
        <div style={{textAlign:"center",marginBottom:"56px"}}>
          <p style={{color:GOLD,letterSpacing:"5px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",marginBottom:"14px"}}>✦ WHAT WE STAND FOR ✦</p>
          <h2 style={{fontSize:"40px",fontWeight:"300",color:"#fff",margin:0}}>Our Values</h2>
        </div>
        <div className="rf-grid3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"28px",maxWidth:"960px",margin:"0 auto"}}>
          {[["🌾","Quality","We source only the finest ingredients from local farms and trusted importers."],["🔥","Craft","Every dish is prepared with meticulous attention to technique and presentation."],["🤝","Hospitality","From arrival to farewell, we create an experience that exceeds every expectation."]].map(([icon,title,desc])=>(
            <div key={title} style={{padding:"44px 30px",border:"1px solid rgba(200,169,110,0.2)",background:"rgba(255,255,255,0.03)",textAlign:"center"}}>
              <div style={{fontSize:"38px",marginBottom:"18px"}}>{icon}</div>
              <h3 style={{color:GOLD,fontSize:"13px",letterSpacing:"3px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",marginBottom:"16px"}}>{title}</h3>
              <p style={{color:"rgba(255,255,255,0.45)",fontFamily:"sans-serif",fontSize:"13px",lineHeight:2}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
