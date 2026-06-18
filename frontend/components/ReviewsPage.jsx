function ReviewsPage({setPage}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(()=>{
    supabase.from("reviews").select("*").order("created_at",{ascending:false}).then(({data})=>{
      if(data) setReviews(data);
      setLoading(false);
    });
  },[]);

  const filtered = filter==="all" ? reviews : reviews.filter(r=>r.rating===parseInt(filter));
  const avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : "—";
  const dist = [5,4,3,2,1].map(s=>({ star:s, count:reviews.filter(r=>r.rating===s).length }));

  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="CUSTOMER REVIEWS" title="What Our Guests Say" />
      <section style={{padding:"80px 60px",background:"#f9f8f5"}}>
        <div style={{maxWidth:"860px",margin:"0 auto"}}>

          {/* Summary */}
          <div style={{background:"#fff",borderRadius:"8px",padding:"36px 40px",boxShadow:"0 2px 20px rgba(0,0,0,0.06)",marginBottom:"40px",display:"flex",gap:"48px",flexWrap:"wrap",alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"56px",fontWeight:"700",color:GOLD,fontFamily:"sans-serif",lineHeight:1}}>{avg}</div>
              <div style={{color:"#f5b400",fontSize:"22px",letterSpacing:"2px",margin:"6px 0"}}>{"★".repeat(Math.round(parseFloat(avg)||0))}</div>
              <div style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa"}}>{reviews.length} review{reviews.length!==1?"s":""}</div>
            </div>
            <div style={{flex:1,minWidth:"200px"}}>
              {dist.map(({star,count})=>{
                const pct = reviews.length ? Math.round(count/reviews.length*100) : 0;
                return (
                  <div key={star} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px"}}>
                    <span style={{fontFamily:"sans-serif",fontSize:"12px",color:"#888",width:"14px",textAlign:"right"}}>{star}</span>
                    <span style={{color:"#f5b400",fontSize:"12px"}}>★</span>
                    <div style={{flex:1,height:"6px",background:"#f0ece4",borderRadius:"3px",overflow:"hidden"}}>
                      <div style={{width:`${pct}%`,height:"100%",background:GOLD,borderRadius:"3px",transition:"width 0.5s"}} />
                    </div>
                    <span style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa",width:"28px"}}>{count}</span>
                  </div>
                );
              })}
            </div>
            <div style={{textAlign:"center"}}>
              <p style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa",marginBottom:"12px"}}>Try a dish and leave your review!</p>
              <button onClick={()=>setPage("menu")} style={{padding:"12px 28px",background:GOLD,color:"#fff",border:"none",letterSpacing:"2px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Browse Menu</button>
            </div>
          </div>

          {/* Filter */}
          <div style={{display:"flex",gap:"8px",marginBottom:"28px",flexWrap:"wrap"}}>
            {["all","5","4","3","2","1"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"8px 18px",border:`1px solid ${filter===f?GOLD:"#e0d9ce"}`,background:filter===f?GOLD:"#fff",color:filter===f?"#fff":"#888",borderRadius:"20px",fontFamily:"sans-serif",fontSize:"12px",fontWeight:"700"}}>
                {f==="all"?"All Reviews":`${f} ★`}
              </button>
            ))}
          </div>

          {loading && <p style={{color:"#aaa",fontFamily:"sans-serif"}}>Loading reviews…</p>}
          {!loading && filtered.length===0 && <p style={{color:"#aaa",fontFamily:"sans-serif",textAlign:"center",padding:"40px"}}>No reviews yet.</p>}

          {filtered.map((r,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:"6px",padding:"24px 28px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:"16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px",marginBottom:"10px"}}>
                <div>
                  <span style={{fontFamily:"sans-serif",fontSize:"14px",fontWeight:"700",color:MID}}>{r.user_name}</span>
                  <span style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa",marginLeft:"12px"}}>{r.dish_name}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <span style={{color:"#f5b400",fontSize:"14px"}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                  <span style={{fontFamily:"sans-serif",fontSize:"11px",color:"#ccc"}}>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <p style={{fontFamily:"sans-serif",fontSize:"13px",color:"#555",lineHeight:1.8,margin:0}}>{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
