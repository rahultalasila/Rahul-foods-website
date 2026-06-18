function MenuPage({cart, addToCart, updateQty, setPage, onOpenModal}) {
  const [cat, setCat]         = useState("All");
  const [query, setQuery]     = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dbDishes, setDbDishes] = useState([]);
  const categories            = ["All", ...Object.keys(menuData)];
  const cartCount             = Object.values(cart).reduce((s,{qty})=>s+qty,0);
  const cartTotal             = Object.values(cart).reduce((s,{item,qty})=>s+getPrice(item)*qty,0);

  useEffect(()=>{
    supabase.from("menu_items").select("*").eq("active",true).then(({data})=>{
      if(data) setDbDishes(data.map(d=>({ name:d.name, desc:d.description||"", price:`$${d.price}`, img:d.image_url||FALLBACK, tag:d.tag||"", rating:d.rating||4.5, reviews:d.reviews_count||0, is_veg:d.is_veg, category:d.category })));
    });
  },[]);

  const hardcodedDishes = Object.values(menuData).flat();
  const allDishes = [...hardcodedDishes, ...dbDishes];
  const VEG_TAGS = ["Veg","veg"];
  const VEG_KEYWORDS = ["vegetarian","veg","mushroom","tomato","bruschetta","panna cotta","cheese","apple","mango","tarte"];

  let filtered = cat==="All" ? allDishes : [...(menuData[cat]||[]), ...dbDishes.filter(d=>d.category===cat)];
  if(query.trim()) filtered = filtered.filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || d.desc.toLowerCase().includes(query.toLowerCase()));
  if(vegOnly) filtered = filtered.filter(d => d.is_veg || VEG_TAGS.includes(d.tag) || VEG_KEYWORDS.some(k=>d.name.toLowerCase().includes(k)||d.desc.toLowerCase().includes(k)));
  if(priceFilter==="low")  filtered = filtered.filter(d => getPrice(d) < 1500);
  if(priceFilter==="mid")  filtered = filtered.filter(d => getPrice(d) >= 1500 && getPrice(d) <= 3500);
  if(priceFilter==="high") filtered = filtered.filter(d => getPrice(d) > 3500);

  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="OUR OFFERINGS" title="The Menu" />
      <div style={{background:"#f9f8f5",padding:"60px 60px 140px"}}>
        <div className="search-wrap">
          <input className="search-input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="🔍  Search dishes — e.g. steak, chocolate, lobster..." />
          {query && <button className="search-clear" onClick={()=>setQuery("")}>✕</button>}
        </div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:"24px"}}>
          <div style={{display:"flex",border:"1px solid #e0d9ce",overflow:"hidden",borderRadius:"4px",flexWrap:"wrap"}}>
            {categories.map((c,i)=>(
              <button key={c} onClick={()=>setCat(c)} style={{padding:"13px 26px",border:"none",borderRight:i<categories.length-1?"1px solid #e0d9ce":"none",background:cat===c?DARK:"transparent",color:cat===c?"#fff":"#888",letterSpacing:"2px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",transition:"all 0.25s"}}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"12px",marginBottom:"36px",alignItems:"center",flexWrap:"wrap"}}>
          <div style={{position:"relative"}}>
            <button onClick={()=>setFilterOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:"6px",padding:"10px 18px",border:`1px solid ${priceFilter!=="all"?"#c0392b":"#e0d9ce"}`,borderRadius:"4px",background:priceFilter!=="all"?DARK:"#fff",color:priceFilter!=="all"?"#fff":"#888",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"1px"}}>
              💰 {priceFilter==="all"?"Price":"Price: "+{"low":"<₹1500","mid":"₹1500–₹3500","high":"₹3500+"}[priceFilter]} {filterOpen?"▲":"▼"}
            </button>
            {filterOpen && (
              <div style={{position:"absolute",top:"44px",left:0,zIndex:100,background:"#fff",border:"1px solid #e0d9ce",borderRadius:"6px",boxShadow:"0 8px 24px rgba(0,0,0,0.1)",padding:"12px",minWidth:"180px"}}>
                {[["all","All Prices"],["low","Under ₹1500"],["mid","₹1500 – ₹3500"],["high","Above ₹3500"]].map(([v,l])=>(
                  <button key={v} onClick={()=>{setPriceFilter(v);setFilterOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"10px 14px",border:"none",background:priceFilter===v?"#fdf3f2":"transparent",color:priceFilter===v?DARK:"#555",fontFamily:"sans-serif",fontSize:"12px",fontWeight:priceFilter===v?"700":"400",borderRadius:"4px"}}>{l}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={()=>setVegOnly(v=>!v)} style={{padding:"10px 16px",border:`1px solid ${vegOnly?"#3a7a3a":"#e0d9ce"}`,borderRadius:"4px",background:vegOnly?"#f0faf0":"#fff",color:vegOnly?"#3a7a3a":"#888",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",letterSpacing:"1px"}}>🌿 Veg Only</button>
          {(priceFilter!=="all"||vegOnly) && <button onClick={()=>{setPriceFilter("all");setVegOnly(false);}} style={{padding:"10px 14px",border:"1px solid #e0d9ce",borderRadius:"4px",background:"#fff",color:"#e05555",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700"}}>✕ Clear</button>}
        </div>
        <p style={{textAlign:"center",color:"#aaa",fontFamily:"sans-serif",fontSize:"12px",marginBottom:"36px"}}>
          {filtered.length} dish{filtered.length!==1?"es":""} {query?`for "${query}"`:""}
        </p>
        {filtered.length > 0 ? (
          <div className="menu-grid">
            {filtered.map((item,i)=>(
              <DishCard key={item.name} item={item} cart={cart} addToCart={addToCart} updateQty={updateQty} onOpenModal={onOpenModal} delay={i*0.06} />
            ))}
          </div>
        ) : (
          <div style={{textAlign:"center",padding:"60px",color:"#aaa",fontFamily:"sans-serif"}}>
            <div style={{fontSize:"48px",marginBottom:"16px"}}>🍽️</div>
            <p style={{fontSize:"15px"}}>No dishes match your filters.</p>
            <button onClick={()=>{setQuery("");setCat("All");setVegOnly(false);setPriceFilter("all");}} style={{marginTop:"20px",padding:"10px 28px",background:GOLD,color:"#fff",border:"none",borderRadius:"3px",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"2px"}}>Clear Filters</button>
          </div>
        )}
      </div>
      {cartCount > 0 && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:150,background:MID,padding:"14px 60px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 -4px 24px rgba(0,0,0,0.2)"}}>
          <div style={{color:"#fff",fontFamily:"sans-serif"}}>
            <span style={{fontSize:"13px",opacity:0.7}}>{cartCount} item{cartCount!==1?"s":""} in cart</span>
            <span style={{fontSize:"18px",fontWeight:"700",color:GOLD,marginLeft:"16px"}}>₹{Math.round(cartTotal)}</span>
          </div>
          <button onClick={()=>setPage("cart")} style={{padding:"11px 32px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",borderRadius:"2px"}}>View Cart & Checkout →</button>
        </div>
      )}
    </div>
  );
}
