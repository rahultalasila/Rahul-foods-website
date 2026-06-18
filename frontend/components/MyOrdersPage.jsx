function LiveTrackingCard({orderId}) {
  const [stage, setStage] = useState(0);
  const statusMap = {placed:0, preparing:1, out_for_delivery:2, delivered:3};
  const stages = ["Order Placed","Being Prepared","Out for Delivery","Delivered!"];
  const icons  = ["✅","🍳","🛵","🏠"];

  useEffect(()=>{
    if(!orderId) return;
    const poll = async () => {
      const {data} = await supabase.from("orders").select("status").eq("id", orderId).single();
      if(data?.status !== undefined) setStage(statusMap[data.status] ?? 0);
    };
    poll();
    const iv = setInterval(poll, 15000);
    return ()=>clearInterval(iv);
  },[orderId]);

  return (
    <div style={{background:"#fff",borderRadius:"6px",padding:"28px 32px",boxShadow:"0 2px 20px rgba(0,0,0,0.08)",marginBottom:"28px",border:`2px solid ${GOLD}`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px",flexWrap:"wrap",gap:"8px"}}>
        <h3 style={{fontFamily:"sans-serif",fontSize:"13px",fontWeight:"700",color:MID,letterSpacing:"2px",textTransform:"uppercase",margin:0}}>🔴 Live Tracking</h3>
        <span style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa"}}>Updates every 15 seconds</span>
      </div>
      <div style={{display:"flex",alignItems:"flex-start",gap:"0"}}>
        {stages.map((label,i)=>{
          const isDone=i<stage, isActive=i===stage;
          return (
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
              {i < stages.length-1 && (
                <div style={{position:"absolute",top:"20px",left:"50%",right:"-50%",height:"3px",background:isDone?GOLD:"#f0ece4",zIndex:0,transition:"background 0.4s"}} />
              )}
              <div style={{width:"40px",height:"40px",borderRadius:"50%",background:isDone||isActive?GOLD:"#f0ece4",color:isDone||isActive?"#fff":"#ccc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",zIndex:1,border:isActive?`3px solid ${GOLD}`:"3px solid transparent",boxSizing:"border-box",transition:"all 0.4s"}}>
                {isDone?"✓":icons[i]}
              </div>
              <div style={{marginTop:"8px",fontFamily:"sans-serif",fontSize:"10px",fontWeight:isActive?"700":"400",color:isDone||isActive?MID:"#ccc",textAlign:"center",letterSpacing:"0.5px",lineHeight:1.4}}>{label}</div>
            </div>
          );
        })}
      </div>
      {stage===3 && (
        <div style={{marginTop:"20px",textAlign:"center",fontFamily:"sans-serif",fontSize:"13px",color:"#3a7a3a",fontWeight:"600"}}>
          🏠 Your order has been delivered! Enjoy your meal!
        </div>
      )}
    </div>
  );
}

function MyOrdersPage({user, setPage}) {
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const activeOrderId = localStorage.getItem("rf_activeOrderId");

  useEffect(()=>{
    if(!user) { setLoading(false); return; }
    supabase.from("orders").select("*").order("created_at",{ascending:false}).then(({data,error})=>{
      if(!error && data) {
        setOrders(data.map(o=>({ id:o.id, items:o.items, total:o.total, payLabel:o.pay_label, address:o.address, date:o.created_at, status:o.status })));
      }
      setLoading(false);
    });
  },[user]);

  const statusInfo = {
    placed:            {label:"Order Placed",       color:"#a86a1c", bg:"#fff6e8", border:"#f0d9a8"},
    preparing:         {label:"Being Prepared 🍳",  color:"#a86a1c", bg:"#fff6e8", border:"#f0d9a8"},
    out_for_delivery:  {label:"Out for Delivery 🛵",color:"#1c6aa8", bg:"#e8f2ff", border:"#a8cff0"},
    delivered:         {label:"Delivered ✓",        color:"#3a7a3a", bg:"#f0faf0", border:"#aadcaa"},
  };

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
          {activeOrderId && <LiveTrackingCard orderId={activeOrderId} />}
          {orders.map((o,i)=>{
            const si = statusInfo[o.status] || statusInfo.placed;
            return (
              <div key={i} style={{background:"#fff",borderRadius:"6px",padding:"24px 28px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexWrap:"wrap",gap:"8px"}}>
                  <div style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa"}}>{new Date(o.date).toLocaleString()}</div>
                  <div style={{fontFamily:"sans-serif",fontSize:"11px",color:si.color,background:si.bg,border:`1px solid ${si.border}`,borderRadius:"4px",padding:"4px 10px",fontWeight:"700"}}>{si.label}</div>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
