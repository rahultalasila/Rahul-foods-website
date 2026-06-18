function ContactPage({setPage}) {
  const [cf,setCf]=useState({name:"",email:"",phone:"",message:""});
  const [cfSent,setCfSent]=useState(false);
  const [cfSending,setCfSending]=useState(false);
  const upd=k=>e=>setCf(f=>({...f,[k]:e.target.value}));
  const sendMsg=async()=>{
    if(!cf.name.trim()||!cf.message.trim())return;
    setCfSending(true);
    await supabase.from("contact_messages").insert({name:cf.name.trim(),email:cf.email.trim()||null,phone:cf.phone.trim()||null,message:cf.message.trim()});
    setCfSending(false);setCfSent(true);
  };
  const iS={width:"100%",padding:"12px 14px",border:"1px solid #e0d9ce",fontFamily:"sans-serif",fontSize:"13px",color:MID,boxSizing:"border-box"};
  const lS={display:"block",fontSize:"10px",letterSpacing:"2.5px",color:"#999",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",marginBottom:"8px"};
  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="VISIT US" title="Contact" />
      <section style={{padding:"90px 60px",background:"#f9f8f5"}}>
        <div className="rf-grid2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"24px",maxWidth:"900px",margin:"0 auto 64px"}}>
          {[["📍","Location","Kanuru, Vijayawada\nAndhra Pradesh, India"],["🕐","Hours","Monday – Friday: 12 PM – 10 PM\nSaturday – Sunday: 11:30 AM – 11 PM"],["📞","Phone","+91 70757 51105"],["✉️","Email","rahultalasila9@gmail.com"]].map(([icon,label,val])=>(
            <div key={label} style={{background:"#fff",padding:"36px 32px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",display:"flex",gap:"20px",alignItems:"flex-start"}}>
              <div style={{fontSize:"28px",flexShrink:0}}>{icon}</div>
              <div>
                <div style={{fontSize:"10px",letterSpacing:"3px",color:GOLD,fontFamily:"sans-serif",fontWeight:"700",marginBottom:"10px",textTransform:"uppercase"}}>{label}</div>
                <div style={{color:"#555",fontFamily:"sans-serif",fontSize:"13px",lineHeight:1.9,whiteSpace:"pre-line"}}>{val}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{maxWidth:"900px",margin:"0 auto 64px",borderRadius:"6px",overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
          <iframe
            title="Rahul Foods location"
            src="https://maps.google.com/maps?q=Kanuru,Vijayawada,Andhra+Pradesh,India&z=14&output=embed"
            width="100%" height="320" style={{border:0,display:"block"}} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <div style={{textAlign:"center",marginBottom:"40px"}}>
          <button onClick={()=>setPage("reserve")} style={{padding:"15px 52px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Reserve a Table</button>
        </div>
      </section>
      <div style={{height:"1px",background:"#eee"}} />
      <section style={{padding:"90px 60px",background:"#fff"}}>
        <div style={{maxWidth:"700px",margin:"0 auto 80px"}}>
          <div style={{textAlign:"center",marginBottom:"52px"}}>
            <p style={{color:GOLD,letterSpacing:"5px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",marginBottom:"14px"}}>✦ SEND A MESSAGE ✦</p>
            <h2 style={{fontSize:"42px",fontWeight:"300",margin:"0 0 20px"}}>Get in Touch</h2>
            <div style={{width:"60px",height:"1px",background:GOLD,margin:"0 auto"}} />
          </div>
          {cfSent ? (
            <div style={{textAlign:"center",padding:"40px"}}>
              <div style={{fontSize:"48px",marginBottom:"16px"}}>✅</div>
              <h3 style={{fontFamily:"sans-serif",fontSize:"22px",fontWeight:"300",color:MID,marginBottom:"10px"}}>Message Sent!</h3>
              <p style={{fontFamily:"sans-serif",fontSize:"14px",color:"#888"}}>We'll get back to you shortly.</p>
            </div>
          ) : (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"20px"}}>
                <div><label style={lS}>Your Name *</label><input value={cf.name} onChange={upd("name")} placeholder="Full name" style={iS} /></div>
                <div><label style={lS}>Email</label><input type="email" value={cf.email} onChange={upd("email")} placeholder="your@email.com" style={iS} /></div>
                <div style={{gridColumn:"1/-1"}}><label style={lS}>Phone</label><input type="tel" value={cf.phone} onChange={upd("phone")} placeholder="+91 00000 00000" style={iS} /></div>
              </div>
              <div style={{marginBottom:"28px"}}><label style={lS}>Message *</label><textarea value={cf.message} onChange={upd("message")} rows={5} placeholder="How can we help you?" style={{...iS,resize:"vertical",lineHeight:1.8}} /></div>
              <div style={{textAlign:"center"}}><button onClick={sendMsg} disabled={cfSending} style={{padding:"14px 52px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>{cfSending?"Sending…":"Send Message"}</button></div>
            </div>
          )}
        </div>
        <div style={{height:"1px",background:"#eee",marginBottom:"80px"}} />
        <div style={{textAlign:"center",marginBottom:"52px"}}>
          <p style={{color:GOLD,letterSpacing:"5px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",marginBottom:"14px"}}>✦ GOT QUESTIONS? ✦</p>
          <h2 style={{fontSize:"42px",fontWeight:"300",margin:"0 0 20px"}}>Frequently Asked Questions</h2>
          <div style={{width:"60px",height:"1px",background:GOLD,margin:"0 auto"}} />
        </div>
        <FaqAccordion />
      </section>
    </div>
  );
}
