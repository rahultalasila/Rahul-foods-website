function Footer({setPage}) {
  const socials = [
    { icon:"📸", label:"Instagram", href:"https://instagram.com" },
    { icon:"👥", label:"Facebook",  href:"https://facebook.com" },
    { icon:"🍽️", label:"Zomato",   href:"https://zomato.com" },
    { icon:"🛵", label:"Swiggy",   href:"https://swiggy.com" },
  ];
  const [email,setEmail]=useState("");
  const [subscribed,setSubscribed]=useState(false);
  const subscribe = () => {
    if(!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return;
    setSubscribed(true); setEmail("");
  };
  return (
    <footer style={{background:DARK,padding:"52px 60px 36px",fontFamily:"sans-serif"}}>
      <div style={{textAlign:"center",marginBottom:"32px"}}>
        <div style={{color:GOLD,fontSize:"20px",letterSpacing:"5px",fontFamily:"Georgia,serif",marginBottom:"6px",fontWeight:"bold"}}>RAHUL FOODS</div>
        <div style={{color:"rgba(255,255,255,0.25)",fontSize:"11px",letterSpacing:"3px",marginBottom:"28px"}}>EST. 2011 · FINE DINING & DELIVERY</div>
        <div style={{maxWidth:"380px",margin:"0 auto"}}>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",letterSpacing:"2px",marginBottom:"12px",textTransform:"uppercase"}}>Subscribe for offers & updates</p>
          {subscribed ? (
            <p style={{color:"#7ddb7d",fontSize:"13px",fontWeight:"600"}}>✅ Thanks for subscribing!</p>
          ) : (
            <div style={{display:"flex"}}>
              <input className="newsletter-input" type="email" placeholder="Your email address" value={email}
                onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&subscribe()} />
              <button className="newsletter-btn" onClick={subscribe}>Subscribe</button>
            </div>
          )}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:"24px",flexWrap:"wrap",marginBottom:"28px"}}>
        {[["home","Home"],["menu","Menu"],["gallery","Gallery"],["cart","🛒 Order"],["about","About"],["contact","Contact"],["reserve","Reserve"]].map(([id,label])=>(
          <button key={id} onClick={()=>setPage(id)} style={{color:"rgba(255,255,255,0.3)",background:"none",border:"none",textTransform:"uppercase",letterSpacing:"2px",fontSize:"10px"}}>{label}</button>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:"14px",marginBottom:"32px",flexWrap:"wrap"}}>
        {socials.map(s=>(
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{display:"flex",alignItems:"center",gap:"7px",padding:"8px 16px",border:"1px solid rgba(200,169,110,0.25)",borderRadius:"20px",color:"rgba(255,255,255,0.5)",textDecoration:"none",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",letterSpacing:"1px",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.color=GOLD;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(200,169,110,0.25)";e.currentTarget.style.color="rgba(255,255,255,0.5)";}}>
            <span style={{fontSize:"14px"}}>{s.icon}</span>{s.label}
          </a>
        ))}
      </div>
      <div style={{height:"1px",background:"rgba(255,255,255,0.06)",marginBottom:"20px"}} />
      <div style={{color:"rgba(255,255,255,0.15)",fontSize:"11px",letterSpacing:"2px",textAlign:"center"}}>© 2026 RAHUL FOODS · ALL RIGHTS RESERVED · MUMBAI, INDIA</div>
    </footer>
  );
}
