function AdminPage({user, setPage}) {
  const [tab, setTab]         = useState("orders");
  const [orders, setOrders]   = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
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
  useEffect(()=>{ loadOrders(); loadMenu(); },[]);

  const markDelivered = async (id) => { await supabase.from("orders").update({status:"delivered"}).eq("id",id); loadOrders(); };

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
        {[["orders","📋 Orders"],["menu","🍽️ Menu Management"]].map(([t,l])=>(
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
                  <div style={{fontFamily:"sans-serif",fontSize:"11px",color:o.status==="delivered"?"#3a7a3a":"#a86a1c",background:o.status==="delivered"?"#f0faf0":"#fff6e8",border:`1px solid ${o.status==="delivered"?"#aadcaa":"#f0d9a8"}`,borderRadius:"4px",padding:"4px 10px",fontWeight:"700",textTransform:"uppercase"}}>{o.status||"placed"}</div>
                </div>
                {o.items.map((it,j)=>(<div key={j} style={{display:"flex",justifyContent:"space-between",fontFamily:"sans-serif",fontSize:"13px",color:"#555",padding:"4px 0"}}><span>{it.name} × {it.qty}</span><span>{it.price}</span></div>))}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:"10px",paddingTop:"10px",borderTop:"1px solid #f0ece4",fontFamily:"sans-serif"}}>
                  <span style={{fontSize:"13px",fontWeight:"700",color:MID}}>Total</span>
                  <span style={{fontSize:"15px",fontWeight:"700",color:GOLD}}>₹{Math.round(o.total)}</span>
                </div>
                <div style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa",marginTop:"8px"}}>📍 {o.address} · {o.pay_label}</div>
                {o.status!=="delivered" && <button onClick={()=>markDelivered(o.id)} style={{marginTop:"14px",padding:"10px 24px",background:MID,color:"#fff",border:"none",letterSpacing:"2px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Mark Delivered</button>}
              </div>
            ))}
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
