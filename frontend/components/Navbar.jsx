function Navbar({page, setPage, scrolled, cartCount, user, onOpenAuth, onLogout}) {
  const light = !scrolled && page==="home";
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = id => { setPage(id); setMobileOpen(false); };
  const openAuth = m => { onOpenAuth(m); setMobileOpen(false); };
  const logout = () => { onLogout(); setMobileOpen(false); };
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"18px 50px",background:light&&!mobileOpen?"transparent":"rgba(255,255,255,0.97)",backdropFilter:light&&!mobileOpen?"none":"blur(12px)",boxShadow:light&&!mobileOpen?"none":"0 1px 24px rgba(0,0,0,0.09)",transition:"all 0.35s ease",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
      <button onClick={()=>go("home")} style={{background:"none",border:"none",fontSize:"18px",fontWeight:"bold",letterSpacing:"4px",color:(light&&!mobileOpen)?"#fff":MID,fontFamily:"Georgia,serif",transition:"color 0.35s"}}>RAHUL FOODS</button>

      <div className="navbar-links">
        {[["home","Home"],["menu","Menu"],["offers","Offers 🏷️"],["gallery","Gallery"],["about","About"],["contact","Contact"]].map(([id,label])=>(
          <button key={id} onClick={()=>go(id)} style={{background:"none",border:"none",color:page===id?GOLD:(light?"rgba(255,255,255,0.85)":"#555"),fontSize:"11px",letterSpacing:"2px",fontFamily:"sans-serif",fontWeight:page===id?"700":"600",textTransform:"uppercase",transition:"color 0.2s",borderBottom:page===id?`2px solid ${GOLD}`:"2px solid transparent",paddingBottom:"3px"}}>{label}</button>
        ))}
        <button onClick={()=>go("reserve")} style={{padding:"9px 16px",border:`1px solid ${light?"rgba(200,169,110,0.8)":GOLD}`,background:"transparent",color:light?"rgba(200,169,110,0.9)":GOLD,fontSize:"10px",letterSpacing:"2px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",transition:"all 0.25s"}}>Reserve</button>
        {user ? (
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <button onClick={()=>go("orders")} style={{background:"none",border:"none",color:page==="orders"?GOLD:(light?"rgba(255,255,255,0.85)":"#555"),fontSize:"11px",letterSpacing:"1px",fontFamily:"sans-serif",fontWeight:"600"}}>👤 {user.name}</button>
            {user.email===ADMIN_EMAIL && <button onClick={()=>go("admin")} style={{background:"none",border:"none",color:page==="admin"?GOLD:(light?"rgba(255,255,255,0.85)":"#555"),fontSize:"11px",letterSpacing:"1px",fontFamily:"sans-serif",fontWeight:"600"}}>🛠 Admin</button>}
            <button onClick={logout} style={{padding:"9px 14px",border:`1px solid ${light?"rgba(255,255,255,0.4)":"#ccc"}`,background:"transparent",color:light?"rgba(255,255,255,0.85)":"#888",fontSize:"10px",letterSpacing:"2px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",transition:"all 0.25s"}}>Logout</button>
          </div>
        ) : (
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <button onClick={()=>openAuth("signin")} style={{padding:"9px 16px",border:`1px solid ${light?"rgba(255,255,255,0.4)":"#ccc"}`,background:"transparent",color:light?"rgba(255,255,255,0.85)":"#555",fontSize:"10px",letterSpacing:"2px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",transition:"all 0.25s"}}>Sign In</button>
            <button onClick={()=>openAuth("signup")} style={{padding:"9px 16px",border:"none",background:GOLD,color:"#fff",fontSize:"10px",letterSpacing:"2px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",transition:"all 0.25s"}}>Sign Up</button>
          </div>
        )}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
        <button onClick={()=>go("cart")} aria-label={`Cart, ${cartCount} items`} style={{position:"relative",background:page==="cart"?GOLD:MID,border:"none",color:"#fff",width:"40px",height:"40px",borderRadius:"50%",fontSize:"17px",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s"}}>
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <button className="navbar-burger" onClick={()=>setMobileOpen(o=>!o)} aria-label={mobileOpen?"Close menu":"Open menu"} style={{background:"none",border:"none",width:"40px",height:"40px",alignItems:"center",justifyContent:"center",fontSize:"24px",color:(light&&!mobileOpen)?"#fff":MID}}>
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={`navbar-mobile-menu${mobileOpen?" open":""}`} style={{flexDirection:"column",width:"100%",paddingTop:"18px",gap:"4px"}}>
        {[["home","Home"],["menu","Menu"],["offers","Offers 🏷️"],["gallery","Gallery"],["about","About"],["contact","Contact"],["reserve","Reserve"]].map(([id,label])=>(
          <button key={id} onClick={()=>go(id)} style={{background:"none",border:"none",textAlign:"left",padding:"12px 4px",color:page===id?GOLD:"#555",fontSize:"13px",letterSpacing:"2px",fontFamily:"sans-serif",fontWeight:page===id?"700":"600",textTransform:"uppercase",borderBottom:"1px solid #f0ece4"}}>{label}</button>
        ))}
        {user ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 4px"}}>
            <button onClick={()=>go("orders")} style={{background:"none",border:"none",fontSize:"12px",fontFamily:"sans-serif",fontWeight:"600",color:page==="orders"?GOLD:"#555"}}>👤 {user.name} · My Orders</button>
            <button onClick={logout} style={{padding:"9px 16px",border:"1px solid #ccc",background:"transparent",color:"#888",fontSize:"10px",letterSpacing:"2px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Logout</button>
          </div>
        ) : (
          <div style={{display:"flex",gap:"10px",padding:"12px 4px"}}>
            <button onClick={()=>openAuth("signin")} style={{flex:1,padding:"11px 16px",border:"1px solid #ccc",background:"transparent",color:"#555",fontSize:"10px",letterSpacing:"2px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Sign In</button>
            <button onClick={()=>openAuth("signup")} style={{flex:1,padding:"11px 16px",border:"none",background:GOLD,color:"#fff",fontSize:"10px",letterSpacing:"2px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Sign Up</button>
          </div>
        )}
        {user && user.email===ADMIN_EMAIL && (
          <button onClick={()=>go("admin")} style={{background:"none",border:"none",textAlign:"left",padding:"12px 4px",fontSize:"12px",fontFamily:"sans-serif",fontWeight:"600",color:page==="admin"?GOLD:"#555",borderTop:"1px solid #f0ece4"}}>🛠 Admin Dashboard</button>
        )}
      </div>
    </nav>
  );
}
