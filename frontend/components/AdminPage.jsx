function AdminPage({user, setPage}) {
  const [tab, setTab]         = useState("orders");
  const [orders, setOrders]   = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [subLoading, setSubLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(true);
  const [promos, setPromos] = useState([]);
  const [promoLoading, setPromoLoading] = useState(true);
  const [promoForm, setPromoForm] = useState({code:"",type:"percent",value:"",label:""});
  const [promoSaving, setPromoSaving] = useState(false);
  const [orderingEnabled, setOrderingEnabled] = useState(true);
  const [togglingOrdering, setTogglingOrdering] = useState(false);
  const [riders, setRiders] = useState([]);
  const [ridersLoading, setRidersLoading] = useState(true);
  const [riderForm, setRiderForm] = useState({name:"",phone:"",pin:"1234"});
  const [riderSaving, setRiderSaving] = useState(false);
  const CATS = Object.keys(menuData);
  const emptyForm = {name:"",category:"Starters",description:"",price:"",image_url:"",tag:"",is_veg:false};
  const [form, setForm]       = useState(emptyForm);
  const [editId, setEditId]   = useState(null);
  const [saving, setSaving]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadOrders = () => {
    setOrdersLoading(true);
    supabase.from("orders").select("*").order("created_at",{ascending:false}).then(({data})=>{ if(data) setOrders(data); setOrdersLoading(false); });
  };
  const loadMenu = () => {
    setMenuLoading(true);
    supabase.from("menu_items").select("*").order("created_at",{ascending:true}).then(({data})=>{ if(data) setMenuItems(data); setMenuLoading(false); });
  };
  const loadReservations = () => { setResLoading(true); supabase.from("reservations").select("*").order("created_at",{ascending:false}).then(({data})=>{ if(data) setReservations(data); setResLoading(false); }); };
  const loadMessages = () => { setMsgLoading(true); supabase.from("contact_messages").select("*").order("created_at",{ascending:false}).then(({data})=>{ if(data) setMessages(data); setMsgLoading(false); }); };
  const loadSubscribers = () => { setSubLoading(true); supabase.from("newsletter_subscribers").select("*").order("created_at",{ascending:false}).then(({data})=>{ if(data) setSubscribers(data); setSubLoading(false); }); };
  const loadReviews = () => { setRevLoading(true); supabase.from("reviews").select("*").order("created_at",{ascending:false}).then(({data})=>{ if(data) setReviews(data); setRevLoading(false); }); };
  const loadPromos = () => { setPromoLoading(true); supabase.from("promo_codes").select("*").order("created_at",{ascending:true}).then(({data})=>{ if(data) setPromos(data); setPromoLoading(false); }); };
  const loadRiders = () => { setRidersLoading(true); supabase.from("delivery_boys").select("*").order("created_at",{ascending:true}).then(({data})=>{ if(data) setRiders(data); setRidersLoading(false); }); };
  const saveRider = async () => {
    if(!riderForm.name.trim()||!riderForm.phone.trim()||!riderForm.pin.trim()) return;
    setRiderSaving(true);
    await supabase.from("delivery_boys").insert({name:riderForm.name.trim(),phone:riderForm.phone.replace(/\D/g,"").slice(-10),pin:riderForm.pin.trim()});
    setRiderForm({name:"",phone:"",pin:"1234"}); setRiderSaving(false); loadRiders();
  };
  const deleteRider = async (id) => { if(window.confirm("Remove this delivery boy?")) { await supabase.from("delivery_boys").delete().eq("id",id); loadRiders(); } };
  const deleteReview = async (id) => { if(window.confirm("Delete this review?")) { await supabase.from("reviews").delete().eq("id",id); loadReviews(); } };
  const savePromo = async () => {
    if(!promoForm.code.trim()||!promoForm.value) return;
    setPromoSaving(true);
    const auto = promoForm.type==="percent"?`${promoForm.value}% off`:promoForm.type==="flat"?`₹${promoForm.value} flat off`:"Free delivery";
    await supabase.from("promo_codes").insert({code:promoForm.code.trim().toUpperCase(),type:promoForm.type,value:parseFloat(promoForm.value),label:promoForm.label.trim()||auto,active:true});
    setPromoForm({code:"",type:"percent",value:"",label:""});
    setPromoSaving(false); loadPromos();
  };
  const togglePromo = async (id,active) => { await supabase.from("promo_codes").update({active:!active}).eq("id",id); loadPromos(); };
  const deletePromo = async (id) => { if(window.confirm("Delete this promo code?")) { await supabase.from("promo_codes").delete().eq("id",id); loadPromos(); } };
  const loadOrderingStatus = () => { supabase.from("settings").select("value").eq("key","ordering_enabled").single().then(({data})=>{ if(data) setOrderingEnabled(data.value==="true"); }); };
  const toggleOrdering = async () => {
    setTogglingOrdering(true);
    const newVal = !orderingEnabled;
    await supabase.from("settings").update({value: newVal?"true":"false"}).eq("key","ordering_enabled");
    setOrderingEnabled(newVal);
    setTogglingOrdering(false);
  };
  useEffect(()=>{ loadOrders(); loadMenu(); loadReservations(); loadMessages(); loadSubscribers(); loadReviews(); loadPromos(); loadOrderingStatus(); loadRiders(); },[]);

  const updateStatus = async (id, status) => {
    const update = {status};
    if(status === "out_for_delivery") {
      const {data:onlineRiders} = await supabase.from("delivery_boys").select("*").eq("is_online",true);
      if(onlineRiders && onlineRiders.length > 0) {
        const {data:busyOrders} = await supabase.from("orders").select("assigned_to").eq("status","out_for_delivery").not("assigned_to","is",null);
        const busyIds = (busyOrders||[]).map(o=>o.assigned_to);
        const freeRider = onlineRiders.find(r=>!busyIds.includes(r.id)) || onlineRiders[0];
        update.assigned_to = freeRider.id;
      }
    }
    if(status === "delivered") { update.assigned_to = null; }
    await supabase.from("orders").update(update).eq("id",id); loadOrders();
  };
  const STATUS_NEXT = {placed:"preparing", preparing:"out_for_delivery", out_for_delivery:"delivered"};
  const STATUS_LABEL = {placed:"Mark Preparing 🍳", preparing:"Mark Out for Delivery 🛵", out_for_delivery:"Mark Delivered 🏠"};

  const saveItem = async () => {
    if(!form.name.trim()||!form.price) return;
    setSaving(true);
    const payload = { name:form.name.trim(), category:form.category, description:form.description.trim(), price:parseFloat(form.price), image_url:form.image_url.trim()||null, tag:form.tag.trim()||null, is_veg:form.is_veg, active:true };
    if(editId) await supabase.from("menu_items").update(payload).eq("id",editId);
    else await supabase.from("menu_items").insert(payload);
    setSaving(false); setForm(emptyForm); setEditId(null); setShowForm(false); loadMenu();
  };

  const deleteItem = async (id) => { if(window.confirm("Delete this dish?")) { await supabase.from("menu_items").delete().eq("id",id); loadMenu(); } };
  const toggleActive = async (id, active) => { await supabase.from("menu_items").update({active:!active}).eq("id",id); loadMenu(); };
  const startEdit = (item) => { setForm({name:item.name,category:item.category,description:item.description||"",price:String(item.price),image_url:item.image_url||"",tag:item.tag||"",is_veg:item.is_veg||false}); setEditId(item.id); setShowForm(true); };

  const iStyle = {width:"100%",padding:"10px 12px",border:"1px solid #e0d9ce",borderRadius:"4px",fontFamily:"sans-serif",fontSize:"13px",color:MID,marginBottom:"12px"};

  if(!user || user.email !== ADMIN_EMAIL) return (
    <div style={{paddingTop:"80px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <PageBanner tag="ADMIN" title="Dashboard" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px",background:"#f9f8f5",flexDirection:"column",gap:"24px"}}>
        <div style={{fontSize:"64px"}}>🔒</div>
        <h2 style={{fontSize:"28px",fontWeight:"300",color:MID}}>Access denied</h2>
        <button onClick={()=>setPage("home")} style={{padding:"14px 44px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="ADMIN" title="Dashboard" />
      <div style={{background:"#fff",borderBottom:"1px solid #f0ece4",display:"flex",justifyContent:"center",gap:"0"}}>
        {[["orders","📋 Orders"],["riders","🛵 Delivery"],["menu","🍽️ Menu"],["reservations","📅 Reservations"],["messages","✉️ Messages"],["subscribers","📧 Subscribers"],["reviews","⭐ Reviews"],["promos","🏷️ Promo Codes"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"16px 36px",border:"none",background:"none",fontFamily:"sans-serif",fontSize:"13px",fontWeight:tab===t?"700":"400",color:tab===t?DARK:"#aaa",borderBottom:tab===t?`3px solid ${DARK}`:"3px solid transparent",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>
      <div style={{background:"#f9f8f5",padding:"40px 60px",minHeight:"60vh"}}>
        <div style={{maxWidth:"900px",margin:"0 auto"}}>
          {tab==="orders" && <>
            {/* Pause ordering toggle */}
            <div style={{background: orderingEnabled?"#f0faf0":"#fff5f5", border:`1px solid ${orderingEnabled?"#aadcaa":"#fcc"}`, borderRadius:"8px", padding:"18px 24px", marginBottom:"24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px"}}>
              <div>
                <div style={{fontFamily:"sans-serif", fontSize:"14px", fontWeight:"700", color: orderingEnabled?"#3a7a3a":"#e05555", marginBottom:"3px"}}>{orderingEnabled ? "✅ Kitchen is Open — Accepting Orders" : "🔴 Kitchen is Closed — Orders Paused"}</div>
                <div style={{fontFamily:"sans-serif", fontSize:"12px", color:"#888"}}>{orderingEnabled ? "Customers can place orders right now." : "Customers will see a 'closed' message and cannot order."}</div>
              </div>
              <button onClick={toggleOrdering} disabled={togglingOrdering} style={{padding:"10px 24px", background: orderingEnabled?"#e05555":"#3a7a3a", color:"#fff", border:"none", borderRadius:"4px", fontFamily:"sans-serif", fontSize:"12px", fontWeight:"700", letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer"}}>
                {togglingOrdering ? "Saving…" : orderingEnabled ? "⏸ Pause Orders" : "▶ Resume Orders"}
              </button>
            </div>
            {/* Daily summary */}
            {(()=>{
              const today = new Date(); today.setHours(0,0,0,0);
              const todayOrders = orders.filter(o=>new Date(o.created_at)>=today);
              const todayRevenue = todayOrders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.total,0);
              const byStatus = todayOrders.reduce((acc,o)=>{ acc[o.status]=(acc[o.status]||0)+1; return acc; },{});
              return todayOrders.length>0 && (
                <div style={{background:"#fff",borderRadius:"8px",padding:"20px 24px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",marginBottom:"24px"}}>
                  <div style={{fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:"#aaa",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"14px"}}>Today's Summary</div>
                  <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>
                    <div style={{textAlign:"center",minWidth:"80px"}}>
                      <div style={{fontSize:"28px",fontWeight:"700",color:GOLD,fontFamily:"sans-serif"}}>{todayOrders.length}</div>
                      <div style={{fontSize:"11px",color:"#aaa",fontFamily:"sans-serif"}}>Total Orders</div>
                    </div>
                    <div style={{textAlign:"center",minWidth:"80px"}}>
                      <div style={{fontSize:"28px",fontWeight:"700",color:"#3a7a3a",fontFamily:"sans-serif"}}>₹{Math.round(todayRevenue)}</div>
                      <div style={{fontSize:"11px",color:"#aaa",fontFamily:"sans-serif"}}>Revenue</div>
                    </div>
                    <div style={{borderLeft:"1px solid #f0ece4",paddingLeft:"20px",display:"flex",gap:"14px",flexWrap:"wrap",alignItems:"center"}}>
                      {Object.entries(byStatus).map(([s,c])=>{
                        const colors={placed:"#a86a1c",preparing:"#a86a1c",out_for_delivery:"#1c6aa8",delivered:"#3a7a3a",cancelled:"#e05555"};
                        return <div key={s} style={{textAlign:"center"}}>
                          <div style={{fontSize:"18px",fontWeight:"700",color:colors[s]||"#888",fontFamily:"sans-serif"}}>{c}</div>
                          <div style={{fontSize:"10px",color:"#aaa",fontFamily:"sans-serif",textTransform:"capitalize"}}>{s.replace("_"," ")}</div>
                        </div>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
            {ordersLoading && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading orders…</p>}
            {!ordersLoading && orders.length===0 && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>No orders yet.</p>}
            {orders.map((o)=>(
              <div key={o.id} style={{background:"#fff",borderRadius:"6px",padding:"24px 28px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexWrap:"wrap",gap:"8px"}}>
                  <div style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa"}}>{new Date(o.created_at).toLocaleString()}</div>
                  {(()=>{const s=o.status||"placed";const si={placed:{c:"#a86a1c",bg:"#fff6e8",b:"#f0d9a8"},preparing:{c:"#a86a1c",bg:"#fff6e8",b:"#f0d9a8"},out_for_delivery:{c:"#1c6aa8",bg:"#e8f2ff",b:"#a8cff0"},delivered:{c:"#3a7a3a",bg:"#f0faf0",b:"#aadcaa"},cancelled:{c:"#e05555",bg:"#fff5f5",b:"#fcc"}}[s]||{c:"#aaa",bg:"#f9f8f5",b:"#eee"};return <div style={{fontFamily:"sans-serif",fontSize:"11px",color:si.c,background:si.bg,border:`1px solid ${si.b}`,borderRadius:"4px",padding:"4px 10px",fontWeight:"700",textTransform:"uppercase"}}>{s.replace("_"," ")}</div>;})()}
                </div>
                {o.items.map((it,j)=>(<div key={j} style={{display:"flex",justifyContent:"space-between",fontFamily:"sans-serif",fontSize:"13px",color:"#555",padding:"4px 0"}}><span>{it.name} × {it.qty}</span><span>{it.price}</span></div>))}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:"10px",paddingTop:"10px",borderTop:"1px solid #f0ece4",fontFamily:"sans-serif"}}>
                  <span style={{fontSize:"13px",fontWeight:"700",color:MID}}>Total</span>
                  <span style={{fontSize:"15px",fontWeight:"700",color:GOLD}}>₹{Math.round(o.total)}</span>
                </div>
                <div style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa",marginTop:"8px"}}>📍 {o.address} · {o.pay_label}</div>
                {o.assigned_to && (()=>{const r=riders.find(x=>x.id===o.assigned_to); return r ? <div style={{fontFamily:"sans-serif",fontSize:"11px",color:"#1c6aa8",marginTop:"4px"}}>🛵 Assigned to: <strong>{r.name}</strong> ({r.phone})</div> : null;})()}
                {o.status!=="cancelled" && STATUS_NEXT[o.status||"placed"] && <button onClick={()=>updateStatus(o.id, STATUS_NEXT[o.status||"placed"])} style={{marginTop:"14px",padding:"10px 24px",background:MID,color:"#fff",border:"none",letterSpacing:"2px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>{STATUS_LABEL[o.status||"placed"]}</button>}
              </div>
            ))}
          </>}

          {tab==="riders" && <>
            <div style={{background:"#fff",borderRadius:"6px",padding:"24px 28px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"24px"}}>
              <h3 style={{fontFamily:"sans-serif",fontSize:"13px",fontWeight:"700",color:MID,marginBottom:"18px",textTransform:"uppercase",letterSpacing:"1px"}}>Add Delivery Boy</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px",marginBottom:"12px"}}>
                <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>NAME *</label><input value={riderForm.name} onChange={e=>setRiderForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Ravi" style={iStyle} /></div>
                <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>PHONE *</label><input value={riderForm.phone} onChange={e=>setRiderForm(f=>({...f,phone:e.target.value}))} placeholder="10-digit number" style={iStyle} /></div>
                <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>PIN *</label><input value={riderForm.pin} onChange={e=>setRiderForm(f=>({...f,pin:e.target.value}))} placeholder="e.g. 1234" maxLength={6} style={iStyle} /></div>
              </div>
              <button onClick={saveRider} disabled={riderSaving} style={{padding:"10px 24px",background:MID,color:"#fff",border:"none",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"1px",borderRadius:"3px"}}>{riderSaving?"Saving…":"+ Add Delivery Boy"}</button>
            </div>
            {ridersLoading && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading…</p>}
            {!ridersLoading && <p style={{fontFamily:"sans-serif",fontSize:"13px",color:"#666",marginBottom:"20px"}}>{riders.length} delivery boy{riders.length!==1?"s":""}</p>}
            {riders.map(r=>(
              <div key={r.id} style={{background:"#fff",borderRadius:"6px",padding:"20px 24px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                  <div style={{width:"40px",height:"40px",borderRadius:"50%",background:r.is_online?"#f0faf0":"#f9f8f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",border:`2px solid ${r.is_online?"#3a7a3a":"#e0d9ce"}`}}>🛵</div>
                  <div>
                    <div style={{fontFamily:"sans-serif",fontSize:"14px",fontWeight:"700",color:MID}}>{r.name}</div>
                    <div style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa"}}>📞 {r.phone} · PIN: {r.pin}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                  <span style={{fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:r.is_online?"#3a7a3a":"#e05555",background:r.is_online?"#f0faf0":"#fff5f5",padding:"5px 12px",borderRadius:"12px",border:`1px solid ${r.is_online?"#aadcaa":"#fcc"}`}}>
                    {r.is_online?"🟢 Online":"🔴 Offline"}
                  </span>
                  <button onClick={()=>deleteRider(r.id)} style={{padding:"7px 12px",border:"1px solid #fcc",borderRadius:"4px",background:"#fff5f5",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:"#e05555"}}>🗑</button>
                </div>
              </div>
            ))}
          </>}

          {tab==="reviews" && <>
            {revLoading && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading…</p>}
            {!revLoading && <p style={{fontFamily:"sans-serif",fontSize:"13px",color:"#666",marginBottom:"20px"}}>{reviews.length} review{reviews.length!==1?"s":""}</p>}
            {reviews.map(r=>(
              <div key={r.id} style={{background:"#fff",borderRadius:"6px",padding:"20px 24px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:"12px",display:"flex",gap:"16px",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"6px",marginBottom:"6px"}}>
                    <div style={{display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{fontFamily:"sans-serif",fontSize:"13px",fontWeight:"700",color:MID}}>{r.user_name}</span>
                      <span style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa"}}>on {r.dish_name}</span>
                      <span style={{color:"#f5b400",fontSize:"12px"}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                    </div>
                    <span style={{fontFamily:"sans-serif",fontSize:"11px",color:"#ccc"}}>{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                  <p style={{fontFamily:"sans-serif",fontSize:"13px",color:"#555",lineHeight:1.7,margin:0}}>{r.comment}</p>
                </div>
                <button onClick={()=>deleteReview(r.id)} style={{padding:"7px 12px",border:"1px solid #fcc",borderRadius:"4px",background:"#fff5f5",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:"#e05555",flexShrink:0}}>🗑</button>
              </div>
            ))}
          </>}

          {tab==="promos" && <>
            <div style={{background:"#fff",borderRadius:"6px",padding:"24px 28px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"24px"}}>
              <h3 style={{fontFamily:"sans-serif",fontSize:"13px",fontWeight:"700",color:MID,marginBottom:"18px",textTransform:"uppercase",letterSpacing:"1px"}}>Add New Promo Code</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
                <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>CODE *</label><input value={promoForm.code} onChange={e=>setPromoForm(f=>({...f,code:e.target.value.toUpperCase()}))} placeholder="e.g. SAVE20" style={iStyle} /></div>
                <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>TYPE *</label>
                  <select value={promoForm.type} onChange={e=>setPromoForm(f=>({...f,type:e.target.value}))} style={iStyle}>
                    <option value="percent">Percentage off</option>
                    <option value="flat">Flat amount off</option>
                    <option value="freeship">Free delivery</option>
                  </select>
                </div>
                <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>VALUE * {promoForm.type==="percent"?"(%)":promoForm.type==="flat"?"(₹)":"(ignored)"}</label><input type="number" value={promoForm.value} onChange={e=>setPromoForm(f=>({...f,value:e.target.value}))} placeholder={promoForm.type==="percent"?"e.g. 15":promoForm.type==="flat"?"e.g. 200":"0"} disabled={promoForm.type==="freeship"} style={{...iStyle,opacity:promoForm.type==="freeship"?0.5:1}} /></div>
                <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>LABEL (optional)</label><input value={promoForm.label} onChange={e=>setPromoForm(f=>({...f,label:e.target.value}))} placeholder="Auto-generated if empty" style={iStyle} /></div>
              </div>
              <button onClick={savePromo} disabled={promoSaving} style={{padding:"11px 28px",background:GOLD,color:"#fff",border:"none",borderRadius:"4px",fontFamily:"sans-serif",fontSize:"12px",fontWeight:"700",letterSpacing:"1px"}}>{promoSaving?"Saving…":"Add Promo Code"}</button>
            </div>
            {promoLoading && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading…</p>}
            {promos.map(p=>(
              <div key={p.id} style={{background:"#fff",borderRadius:"6px",padding:"18px 24px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:"12px",display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px",flexWrap:"wrap"}}>
                    <span style={{fontFamily:"monospace",fontSize:"15px",fontWeight:"700",color:MID,letterSpacing:"1px"}}>{p.code}</span>
                    <span style={{fontSize:"9px",background:p.active?"#f0faf0":"#fff0f0",color:p.active?"#3a7a3a":"#e05555",padding:"2px 8px",borderRadius:"2px",fontFamily:"sans-serif",fontWeight:"700",border:`1px solid ${p.active?"#aadcaa":"#f0aaaa"}`}}>{p.active?"ACTIVE":"DISABLED"}</span>
                  </div>
                  <span style={{fontFamily:"sans-serif",fontSize:"12px",color:"#888"}}>{p.label} · {p.type==="percent"?`${p.value}% off`:p.type==="flat"?`₹${p.value} off`:"Free delivery"}</span>
                </div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={()=>togglePromo(p.id,p.active)} style={{padding:"8px 14px",border:"1px solid #e0d9ce",borderRadius:"4px",background:"#fff",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:"#888"}}>{p.active?"Disable":"Enable"}</button>
                  <button onClick={()=>deletePromo(p.id)} style={{padding:"8px 12px",border:"1px solid #fcc",borderRadius:"4px",background:"#fff5f5",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:"#e05555"}}>🗑</button>
                </div>
              </div>
            ))}
          </>}

          {tab==="reservations" && <>
            {resLoading && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading…</p>}
            {!resLoading && reservations.length===0 && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>No reservations yet.</p>}
            {reservations.map(r=>(
              <div key={r.id} style={{background:"#fff",borderRadius:"6px",padding:"22px 28px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"8px",marginBottom:"10px"}}>
                  <span style={{fontFamily:"sans-serif",fontWeight:"700",fontSize:"15px",color:MID}}>{r.name}</span>
                  <span style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa"}}>{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <div style={{display:"flex",gap:"24px",flexWrap:"wrap",fontFamily:"sans-serif",fontSize:"13px",color:"#555"}}>
                  <span>📅 {r.date} at {r.time}</span>
                  <span>👥 {r.guests} guest{r.guests!==1?"s":""}</span>
                  {r.email&&<span>✉️ {r.email}</span>}
                  {r.phone&&<span>📞 {r.phone}</span>}
                </div>
                {r.requests&&<div style={{marginTop:"8px",fontFamily:"sans-serif",fontSize:"12px",color:"#888",fontStyle:"italic"}}>"{r.requests}"</div>}
              </div>
            ))}
          </>}

          {tab==="messages" && <>
            {msgLoading && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading…</p>}
            {!msgLoading && messages.length===0 && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>No messages yet.</p>}
            {messages.map(m=>(
              <div key={m.id} style={{background:"#fff",borderRadius:"6px",padding:"22px 28px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"8px",marginBottom:"8px"}}>
                  <span style={{fontFamily:"sans-serif",fontWeight:"700",fontSize:"15px",color:MID}}>{m.name}</span>
                  <span style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa"}}>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <div style={{display:"flex",gap:"20px",flexWrap:"wrap",fontFamily:"sans-serif",fontSize:"12px",color:"#888",marginBottom:"10px"}}>
                  {m.email&&<span>✉️ {m.email}</span>}
                  {m.phone&&<span>📞 {m.phone}</span>}
                </div>
                <div style={{fontFamily:"sans-serif",fontSize:"13px",color:"#555",lineHeight:1.7}}>{m.message}</div>
              </div>
            ))}
          </>}

          {tab==="subscribers" && <>
            {subLoading && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading…</p>}
            {!subLoading && <p style={{fontFamily:"sans-serif",fontSize:"13px",color:"#666",marginBottom:"20px"}}>{subscribers.length} subscriber{subscribers.length!==1?"s":""}</p>}
            <div style={{background:"#fff",borderRadius:"6px",padding:"24px 28px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
              {subscribers.map((s,i)=>(
                <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<subscribers.length-1?"1px solid #f0ece4":"none",fontFamily:"sans-serif"}}>
                  <span style={{fontSize:"13px",color:MID}}>{s.email}</span>
                  <span style={{fontSize:"11px",color:"#aaa"}}>{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </>}

          {tab==="menu" && <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
              <p style={{fontFamily:"sans-serif",fontSize:"13px",color:"#666"}}>{menuItems.length} custom dish{menuItems.length!==1?"es":""} added</p>
              <button onClick={()=>{setForm(emptyForm);setEditId(null);setShowForm(s=>!s);}} style={{padding:"11px 24px",background:DARK,color:"#fff",border:"none",borderRadius:"4px",fontFamily:"sans-serif",fontSize:"12px",fontWeight:"700",letterSpacing:"1px"}}>
                {showForm?"✕ Cancel":"+ Add New Dish"}
              </button>
            </div>
            {showForm && (
              <div style={{background:"#fff",borderRadius:"6px",padding:"28px",boxShadow:"0 2px 16px rgba(0,0,0,0.07)",marginBottom:"28px"}}>
                <h3 style={{fontFamily:"sans-serif",fontSize:"14px",fontWeight:"700",color:MID,marginBottom:"20px",textTransform:"uppercase",letterSpacing:"1px"}}>{editId?"Edit Dish":"Add New Dish"}</h3>
                <div className="rf-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                  <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>DISH NAME *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Butter Chicken" style={iStyle} /></div>
                  <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>CATEGORY *</label>
                    <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={iStyle}>
                      {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>PRICE ($) *</label><input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="e.g. 18" style={iStyle} /></div>
                  <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>TAG (optional)</label><input value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))} placeholder="e.g. Chef's Pick, Best Seller" style={iStyle} /></div>
                </div>
                <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>DESCRIPTION</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} placeholder="Short description of the dish…" style={{...iStyle,resize:"vertical"}} /></div>
                <div><label style={{fontFamily:"sans-serif",fontSize:"10px",fontWeight:"700",color:"#aaa",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>IMAGE URL (optional)</label><input value={form.image_url} onChange={e=>setForm(f=>({...f,image_url:e.target.value}))} placeholder="https://..." style={iStyle} /></div>
                <label style={{display:"flex",alignItems:"center",gap:"10px",fontFamily:"sans-serif",fontSize:"13px",color:MID,marginBottom:"20px",cursor:"pointer"}}>
                  <input type="checkbox" checked={form.is_veg} onChange={e=>setForm(f=>({...f,is_veg:e.target.checked}))} />
                  🌿 Vegetarian dish
                </label>
                <button onClick={saveItem} disabled={saving} style={{padding:"12px 32px",background:GOLD,color:"#fff",border:"none",borderRadius:"4px",fontFamily:"sans-serif",fontSize:"12px",fontWeight:"700",letterSpacing:"1px"}}>
                  {saving?"Saving…":editId?"Update Dish":"Add Dish"}
                </button>
              </div>
            )}
            {menuLoading && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading menu…</p>}
            {!menuLoading && menuItems.length===0 && <p style={{color:"#aaa",fontFamily:"sans-serif",textAlign:"center",padding:"40px"}}>No custom dishes yet. Click "Add New Dish" to get started.</p>}
            {menuItems.map(item=>(
              <div key={item.id} style={{background:"#fff",borderRadius:"6px",padding:"18px 24px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:"12px",display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"}}>
                {item.image_url && <img src={item.image_url} alt={item.name} style={{width:"60px",height:"60px",objectFit:"cover",borderRadius:"4px",flexShrink:0}} onError={e=>e.target.style.display="none"} />}
                <div style={{flex:1,minWidth:"180px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px",flexWrap:"wrap"}}>
                    <span style={{fontFamily:"sans-serif",fontSize:"14px",fontWeight:"700",color:MID}}>{item.name}</span>
                    {item.tag && <span style={{fontSize:"9px",background:GOLD,color:"#fff",padding:"2px 8px",borderRadius:"2px",fontFamily:"sans-serif",fontWeight:"700"}}>{item.tag}</span>}
                    {item.is_veg && <span style={{fontSize:"9px",background:"#f0faf0",color:"#3a7a3a",padding:"2px 8px",borderRadius:"2px",fontFamily:"sans-serif",fontWeight:"700",border:"1px solid #aadcaa"}}>VEG</span>}
                    <span style={{fontSize:"9px",background:item.active?"#f0faf0":"#fff0f0",color:item.active?"#3a7a3a":"#e05555",padding:"2px 8px",borderRadius:"2px",fontFamily:"sans-serif",fontWeight:"700",border:`1px solid ${item.active?"#aadcaa":"#f0aaaa"}`}}>{item.active?"ACTIVE":"HIDDEN"}</span>
                  </div>
                  <div style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa"}}>{item.category} · ${item.price}</div>
                  {item.description && <div style={{fontFamily:"sans-serif",fontSize:"11px",color:"#bbb",marginTop:"2px"}}>{item.description}</div>}
                </div>
                <div style={{display:"flex",gap:"8px",flexShrink:0}}>
                  <button onClick={()=>startEdit(item)} style={{padding:"8px 14px",border:"1px solid #e0d9ce",borderRadius:"4px",background:"#fff",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:MID}}>✏️ Edit</button>
                  <button onClick={()=>toggleActive(item.id,item.active)} style={{padding:"8px 14px",border:"1px solid #e0d9ce",borderRadius:"4px",background:"#fff",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:"#888"}}>{item.active?"Hide":"Show"}</button>
                  <button onClick={()=>deleteItem(item.id)} style={{padding:"8px 14px",border:"1px solid #fcc",borderRadius:"4px",background:"#fff5f5",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:"#e05555"}}>🗑</button>
                </div>
              </div>
            ))}
          </>}
        </div>
      </div>
    </div>
  );
}
