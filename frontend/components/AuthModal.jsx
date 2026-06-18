function AuthModal({mode, setMode, onClose, onAuth}) {
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [errors,setErrors]=useState({});
  const [loading,setLoading]=useState(false);
  const upd = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const iS = field => ({width:"100%",padding:"12px 14px",border:`1px solid ${errors[field]?"#e05555":"#e0d9ce"}`,background:"#fff",fontFamily:"sans-serif",fontSize:"13px",color:MID,borderRadius:"3px"});
  const lS = {display:"block",fontSize:"10px",letterSpacing:"2px",color:"#999",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",marginBottom:"6px"};

  useEffect(()=>{
    const fn = e => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return ()=>window.removeEventListener("keydown",fn);
  },[]);

  const validate = () => {
    const e={};
    if(mode==="signup" && !form.name.trim()) e.name="Required";
    if(!form.email.trim()) e.email="Required";
    else if(!/^\S+@\S+\.\S+$/.test(form.email)) e.email="Enter a valid email";
    if(!form.password.trim()) e.password="Required";
    else if(form.password.length<6) e.password="At least 6 characters";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const submit = async () => {
    if(!validate()) return;
    setLoading(true);
    const email = form.email.trim();
    const password = form.password;
    let result;
    if(mode==="signup") {
      result = await supabase.auth.signUp({ email, password, options: { data: { name: form.name.trim() } } });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    setLoading(false);
    if(result.error) { setErrors({form: result.error.message}); return; }
    if(mode==="signup" && !result.data.session) { setErrors({form: "Account created! Please check your email to confirm, then sign in."}); return; }
    onAuth();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"8px",maxWidth:"400px",width:"100%",padding:"40px 36px",boxShadow:"0 24px 80px rgba(0,0,0,0.4)",position:"relative"}}>
        <button className="modal-close" style={{position:"absolute",top:"14px",right:"14px",background:"rgba(0,0,0,0.06)",color:"#888"}} onClick={onClose} aria-label="Close dialog">✕</button>
        <p style={{color:GOLD,letterSpacing:"5px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",marginBottom:"10px",textAlign:"center"}}>✦ RAHUL FOODS ✦</p>
        <h2 style={{fontSize:"24px",fontWeight:"300",color:MID,marginBottom:"24px",textAlign:"center"}}>{mode==="signin" ? "Sign In" : "Create Account"}</h2>

        {mode==="signup" && (
          <div style={{marginBottom:"16px"}}>
            <label style={lS}>Full Name *</label>
            <input value={form.name} onChange={upd("name")} placeholder="Your full name" style={iS("name")} />
            {errors.name && <span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.name}</span>}
          </div>
        )}
        <div style={{marginBottom:"16px"}}>
          <label style={lS}>Email *</label>
          <input type="email" value={form.email} onChange={upd("email")} placeholder="your@email.com" style={iS("email")} />
          {errors.email && <span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.email}</span>}
        </div>
        <div style={{marginBottom:"24px"}}>
          <label style={lS}>Password *</label>
          <input type="password" value={form.password} onChange={upd("password")} placeholder="••••••••" style={iS("password")} onKeyDown={e=>e.key==="Enter"&&submit()} />
          {errors.password && <span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.password}</span>}
        </div>

        {errors.form && <p style={{color:"#e05555",fontSize:"12px",fontFamily:"sans-serif",marginBottom:"14px",textAlign:"center"}}>{errors.form}</p>}

        <button onClick={submit} disabled={loading} style={{width:"100%",padding:"14px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",borderRadius:"3px",marginBottom:"16px",opacity:loading?0.6:1}}>
          {loading ? "Please wait…" : mode==="signin" ? "Sign In" : "Create Account"}
        </button>

        <p style={{textAlign:"center",fontFamily:"sans-serif",fontSize:"12px",color:"#888"}}>
          {mode==="signin" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={()=>{setErrors({});setMode(mode==="signin"?"signup":"signin");}} style={{background:"none",border:"none",color:GOLD,fontWeight:"700",fontSize:"12px",fontFamily:"sans-serif",textDecoration:"underline"}}>
            {mode==="signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
