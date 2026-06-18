function ReservePage({setPage}) {
  const [form,setForm]=useState({name:"",email:"",phone:"",date:"",time:"",guests:"2",requests:""});
  const [submitted,setSubmitted]=useState(false);
  const [errors,setErrors]=useState({});
  const upd=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const [submitting,setSubmitting]=useState(false);
  const validate=()=>{const e={};if(!form.name.trim())e.name="Required";if(!form.email.trim())e.email="Required";if(!form.date)e.date="Required";if(!form.time)e.time="Select a time";setErrors(e);return Object.keys(e).length===0;};
  const iS=field=>({width:"100%",padding:"14px 16px",border:`1px solid ${errors[field]?"#e05555":"#e0d9ce"}`,background:"#fff",fontFamily:"sans-serif",fontSize:"14px",color:MID});
  const lS={display:"block",fontSize:"10px",letterSpacing:"2.5px",color:"#999",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",marginBottom:"8px"};

  if(submitted) return (
    <div style={{paddingTop:"80px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <PageBanner tag="RESERVATION" title="Reserve a Table" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px",background:"#f9f8f5"}}>
        <div style={{textAlign:"center",maxWidth:"540px"}}>
          <div style={{width:"72px",height:"72px",borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px",fontSize:"32px",color:"#fff"}}>✓</div>
          <h2 style={{fontSize:"36px",fontWeight:"300",marginBottom:"18px",color:MID}}>Reservation Confirmed!</h2>
          <p style={{color:"#888",fontFamily:"sans-serif",fontSize:"15px",lineHeight:2,marginBottom:"36px"}}>Thank you, <strong style={{color:MID}}>{form.name}</strong>. We look forward to welcoming you on <strong style={{color:MID}}>{form.date}</strong> at <strong style={{color:MID}}>{form.time}</strong>.</p>
          <button onClick={()=>setPage("home")} style={{padding:"14px 44px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Back to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="RESERVATION" title="Reserve a Table" />
      <section style={{padding:"80px 60px 100px",background:"#f9f8f5"}}>
        <div style={{maxWidth:"700px",margin:"0 auto"}}>
          <p style={{textAlign:"center",color:"#aaa",fontFamily:"sans-serif",fontSize:"13px",marginBottom:"52px",fontStyle:"italic"}}>For same-day bookings or groups of 8+, please call +91 70757 51105</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px",marginBottom:"24px"}}>
            <div><label style={lS}>Full Name *</label><input value={form.name} onChange={upd("name")} placeholder="Your full name" style={iS("name")} />{errors.name&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.name}</span>}</div>
            <div><label style={lS}>Email *</label><input type="email" value={form.email} onChange={upd("email")} placeholder="your@email.com" style={iS("email")} />{errors.email&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.email}</span>}</div>
            <div><label style={lS}>Phone</label><input type="tel" value={form.phone} onChange={upd("phone")} placeholder="+91 00000 00000" style={iS("phone")} /></div>
            <div><label style={lS}>Guests *</label><select value={form.guests} onChange={upd("guests")} style={{...iS("guests"),cursor:"pointer"}}>{["1","2","3","4","5","6","7","8"].map(n=><option key={n} value={n}>{n} Guest{n!=="1"?"s":""}</option>)}</select></div>
            <div><label style={lS}>Date *</label><input type="date" value={form.date} onChange={upd("date")} min={new Date().toISOString().split("T")[0]} style={iS("date")} />{errors.date&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.date}</span>}</div>
            <div><label style={lS}>Time *</label><select value={form.time} onChange={upd("time")} style={{...iS("time"),cursor:"pointer"}}><option value="">Select a time</option>{["12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","10:00 PM"].map(t=><option key={t} value={t}>{t}</option>)}</select>{errors.time&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.time}</span>}</div>
          </div>
          <div style={{marginBottom:"40px"}}><label style={lS}>Special Requests</label><textarea value={form.requests} onChange={upd("requests")} rows={4} placeholder="Dietary requirements, allergies, occasion details..." style={{...iS("requests"),resize:"vertical",lineHeight:1.8}} /></div>
          <div style={{textAlign:"center"}}><button onClick={async()=>{if(!validate())return;setSubmitting(true);await supabase.from("reservations").insert({name:form.name.trim(),email:form.email.trim(),phone:form.phone.trim()||null,date:form.date,time:form.time,guests:parseInt(form.guests),requests:form.requests.trim()||null});setSubmitting(false);setSubmitted(true);}} disabled={submitting} style={{padding:"16px 64px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>{submitting?"Confirming…":"Confirm Reservation"}</button></div>
        </div>
      </section>
    </div>
  );
}
