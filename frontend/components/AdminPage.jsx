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
  useEffect(()=>{ loadOrders(); loadMenu(); loadReservations(); loadMessages(); loadSubscribers(); },[]);

  const updateStatus = async (id, status) => { await supabase.from("orders").update({status}).eq("id",id); loadOrders(); };
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
        {[["orders","📋 Orders"],["menu","🍽️ Menu"],["reservations","📅 Reservations"],["messages","✉️ Messages"],["subscribers","📧 Subscribers"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"16px 36px",border:"none",background:"none",fontFamily:"sans-serif",fontSize:"13px",fontWeight:tab===t?"700":"400",color:tab===t?DARK:"#aaa",borderBottom:tab===t?`3px solid ${DARK}`:"3px solid transparent",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>
      <div style={{background:"#f9f8f5",padding:"40px 60px",minHeight:"60vh"}}>
        <div style={{maxWidth:"900px",margin:"0 auto"}}>
          {tab==="orders" && <>
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
                {o.status!=="cancelled" && STATUS_NEXT[o.status||"placed"] && <button onClick={()=>updateStatus(o.id, STATUS_NEXT[o.status||"placed"])} style={{marginTop:"14px",padding:"10px 24px",background:MID,color:"#fff",border:"none",letterSpacing:"2px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>{STATUS_LABEL[o.status||"placed"]}</button>}
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
