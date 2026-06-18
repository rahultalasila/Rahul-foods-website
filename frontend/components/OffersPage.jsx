const OFFER_COLORS = ["#c8a96e","#e07b54","#5a9e6f","#7b68c8","#e05555","#3a7a3a"];
const OFFER_ICONS  = ["🎉","👋","🛵","🍽️","🏷️","✨"];

function OffersPage({setPage}) {
  const [copied, setCopied] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    supabase.from("promo_codes").select("*").eq("active",true).order("created_at",{ascending:true}).then(({data})=>{
      if(data && data.length>0) {
        setOffers(data.map((p,i)=>({
          code: p.code,
          label: p.label,
          color: OFFER_COLORS[i % OFFER_COLORS.length],
          icon: OFFER_ICONS[i % OFFER_ICONS.length],
          desc: p.type==="percent"?`Get ${p.value}% off on your entire order!`:p.type==="flat"?`Save ₹${p.value} flat on your order!`:"Free delivery on your order!",
          min: p.type==="flat"?"Minimum order may apply.":"No minimum order.",
        })));
      }
      setLoading(false);
    });
  },[]);

  const copy = (code) => {
    navigator.clipboard.writeText(code).catch(()=>{});
    setCopied(code);
    setTimeout(()=>setCopied(null), 2000);
  };

  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="SPECIAL OFFERS" title="Deals & Promo Codes" />
      <section style={{padding:"80px 60px",background:"#f9f8f5"}}>
        <div style={{maxWidth:"900px",margin:"0 auto"}}>
          <p style={{textAlign:"center",color:"#aaa",fontFamily:"sans-serif",fontSize:"13px",marginBottom:"56px",fontStyle:"italic"}}>Copy a code and paste it at checkout to save on your order</p>
          {loading && <p style={{textAlign:"center",color:"#aaa",fontFamily:"sans-serif"}}>Loading offers…</p>}
          {!loading && offers.length===0 && <p style={{textAlign:"center",color:"#aaa",fontFamily:"sans-serif",padding:"40px"}}>No active offers right now. Check back soon!</p>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"28px"}}>
            {offers.map(o=>(
              <div key={o.code} style={{background:"#fff",borderRadius:"8px",boxShadow:"0 2px 20px rgba(0,0,0,0.07)",overflow:"hidden"}}>
                <div style={{background:o.color,padding:"28px 32px",display:"flex",alignItems:"center",gap:"16px"}}>
                  <span style={{fontSize:"36px"}}>{o.icon}</span>
                  <div>
                    <div style={{color:"rgba(255,255,255,0.7)",fontSize:"10px",letterSpacing:"3px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",marginBottom:"4px"}}>Save</div>
                    <div style={{color:"#fff",fontSize:"28px",fontWeight:"700",fontFamily:"sans-serif"}}>{o.label}</div>
                  </div>
                </div>
                <div style={{padding:"24px 32px"}}>
                  <p style={{fontFamily:"sans-serif",fontSize:"13px",color:"#666",lineHeight:1.8,marginBottom:"16px"}}>{o.desc}</p>
                  <p style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa",marginBottom:"20px"}}>ℹ️ {o.min}</p>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{flex:1,background:"#f9f8f5",border:`2px dashed ${o.color}`,borderRadius:"4px",padding:"12px 16px",fontFamily:"monospace",fontSize:"16px",fontWeight:"700",color:o.color,letterSpacing:"2px",textAlign:"center"}}>{o.code}</div>
                    <button onClick={()=>copy(o.code)} style={{padding:"12px 20px",background:copied===o.code?"#3a7a3a":o.color,color:"#fff",border:"none",borderRadius:"4px",fontFamily:"sans-serif",fontSize:"12px",fontWeight:"700",letterSpacing:"1px",transition:"background 0.2s",whiteSpace:"nowrap"}}>
                      {copied===o.code?"✓ Copied!":"Copy Code"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:"60px",background:"#fff",borderRadius:"8px",padding:"36px 40px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
            <h3 style={{fontSize:"18px",fontWeight:"300",color:MID,marginBottom:"20px",textAlign:"center"}}>How to Use a Promo Code</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px",textAlign:"center"}}>
              {[["🛒","Add to Cart","Browse our menu and add your favourite dishes"],["✂️","Enter Code","Paste the promo code in the cart summary box"],["🎉","Save!","Your discount is applied automatically to the total"]].map(([icon,title,desc])=>(
                <div key={title}>
                  <div style={{fontSize:"36px",marginBottom:"10px"}}>{icon}</div>
                  <div style={{fontFamily:"sans-serif",fontSize:"13px",fontWeight:"700",color:MID,marginBottom:"6px"}}>{title}</div>
                  <div style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa",lineHeight:1.7}}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{textAlign:"center",marginTop:"48px"}}>
            <button onClick={()=>setPage("menu")} style={{padding:"16px 52px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Order Now →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
