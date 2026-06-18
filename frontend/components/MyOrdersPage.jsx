function MyOrdersPage({user, setPage}) {
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    if(!user) { setLoading(false); return; }
    supabase.from("orders").select("*").order("created_at",{ascending:false}).then(({data,error})=>{
      if(!error && data) {
        setOrders(data.map(o=>({ items:o.items, total:o.total, payLabel:o.pay_label, address:o.address, date:o.created_at })));
      }
      setLoading(false);
    });
  },[user]);

  if(!user) return (
    <div style={{paddingTop:"80px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <PageBanner tag="YOUR ACCOUNT" title="My Orders" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px",background:"#f9f8f5",flexDirection:"column",gap:"24px"}}>
        <div style={{fontSize:"64px"}}>🔒</div>
        <h2 style={{fontSize:"28px",fontWeight:"300",color:MID}}>Sign in to view your orders</h2>
        <button onClick={()=>setPage("home")} style={{padding:"14px 44px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Back to Home</button>
      </div>
    </div>
  );
  if(loading) return (
    <div style={{paddingTop:"80px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <PageBanner tag="YOUR ACCOUNT" title="My Orders" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px",background:"#f9f8f5"}}>
        <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading your orders…</p>
      </div>
    </div>
  );
  if(orders.length===0) return (
    <div style={{paddingTop:"80px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <PageBanner tag="YOUR ACCOUNT" title="My Orders" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px",background:"#f9f8f5",flexDirection:"column",gap:"24px"}}>
        <div style={{fontSize:"64px"}}>📋</div>
        <h2 style={{fontSize:"28px",fontWeight:"300",color:MID}}>No orders yet</h2>
        <button onClick={()=>setPage("menu")} style={{padding:"14px 44px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Browse Menu</button>
      </div>
    </div>
  );
  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="YOUR ACCOUNT" title="My Orders" />
      <div style={{background:"#f9f8f5",padding:"60px",minHeight:"60vh"}}>
        <div style={{maxWidth:"700px",margin:"0 auto"}}>
          {orders.map((o,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:"6px",padding:"24px 28px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexWrap:"wrap",gap:"8px"}}>
                <div style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa"}}>{new Date(o.date).toLocaleString()}</div>
                <div style={{fontFamily:"sans-serif",fontSize:"11px",color:"#3a7a3a",background:"#f0faf0",border:"1px solid #aadcaa",borderRadius:"4px",padding:"4px 10px",fontWeight:"700"}}>{o.payLabel}</div>
              </div>
              {o.items.map((it,j)=>(
                <div key={j} style={{display:"flex",justifyContent:"space-between",fontFamily:"sans-serif",fontSize:"13px",color:"#555",padding:"4px 0"}}>
                  <span>{it.name} × {it.qty}</span><span>{it.price}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:"10px",paddingTop:"10px",borderTop:"1px solid #f0ece4",fontFamily:"sans-serif"}}>
                <span style={{fontSize:"13px",fontWeight:"700",color:MID}}>Total</span>
                <span style={{fontSize:"15px",fontWeight:"700",color:GOLD}}>₹{Math.round(o.total)}</span>
              </div>
              <div style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa",marginTop:"8px"}}>📍 {o.address}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
