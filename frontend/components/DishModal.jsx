function ReviewsSection({dishName, user}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(()=>{
    supabase.from("reviews").select("*").eq("dish_name", dishName).order("created_at",{ascending:false}).then(({data})=>{
      if(data) setReviews(data);
      setLoading(false);
    });
  },[dishName]);

  const submitReview = async () => {
    if(!comment.trim()) return;
    setSubmitting(true);
    await supabase.from("reviews").insert({ dish_name:dishName, user_id:user.id, user_name:user.name, rating, comment:comment.trim() });
    setReviews(r=>[{dish_name:dishName,user_name:user.name,rating,comment:comment.trim(),created_at:new Date().toISOString()},...r]);
    setComment(""); setSubmitted(true); setSubmitting(false);
  };

  return (
    <div style={{borderTop:"1px solid #f0ece4",marginTop:"20px",paddingTop:"16px"}}>
      <h4 style={{fontFamily:"sans-serif",fontSize:"12px",fontWeight:"700",letterSpacing:"2px",color:MID,textTransform:"uppercase",marginBottom:"12px"}}>Customer Reviews</h4>
      {loading ? <p style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa"}}>Loading…</p> : (
        <>
          {reviews.length===0 && <p style={{fontFamily:"sans-serif",fontSize:"12px",color:"#bbb",marginBottom:"12px"}}>No reviews yet — be the first!</p>}
          {reviews.slice(0,3).map((r,i)=>(
            <div key={i} style={{marginBottom:"10px",paddingBottom:"10px",borderBottom:"1px solid #f8f5f0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                <span style={{fontFamily:"sans-serif",fontSize:"12px",fontWeight:"700",color:MID}}>{r.user_name}</span>
                <span style={{color:"#f5b400",fontSize:"11px"}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
              </div>
              <p style={{fontFamily:"sans-serif",fontSize:"12px",color:"#666",lineHeight:1.6}}>{r.comment}</p>
            </div>
          ))}
          {user && !submitted && (
            <div style={{marginTop:"12px",background:"#f9f8f5",padding:"14px",borderRadius:"6px"}}>
              <p style={{fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",color:MID,marginBottom:"8px",textTransform:"uppercase",letterSpacing:"1px"}}>Leave a Review</p>
              <div style={{display:"flex",gap:"4px",marginBottom:"8px"}}>
                {[1,2,3,4,5].map(s=>(
                  <button key={s} onClick={()=>setRating(s)} style={{background:"none",border:"none",fontSize:"20px",color:s<=rating?"#f5b400":"#ddd",padding:"0"}}>{s<=rating?"★":"☆"}</button>
                ))}
              </div>
              <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={2} placeholder="Share your experience…" style={{width:"100%",padding:"10px",border:"1px solid #e0d9ce",borderRadius:"4px",fontFamily:"sans-serif",fontSize:"12px",resize:"none",marginBottom:"8px"}} />
              <button onClick={submitReview} disabled={submitting||!comment.trim()} style={{padding:"9px 20px",background:DARK,color:"#fff",border:"none",borderRadius:"3px",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"1px"}}>
                {submitting?"Posting…":"Post Review"}
              </button>
            </div>
          )}
          {user && submitted && <p style={{fontFamily:"sans-serif",fontSize:"12px",color:"#3a7a3a",marginTop:"8px"}}>✅ Thanks for your review!</p>}
          {!user && <p style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa",marginTop:"8px"}}>Sign in to leave a review.</p>}
        </>
      )}
    </div>
  );
}

function DishModal({dish, cart, addToCart, updateQty, onClose, user}) {
  if(!dish) return null;
  const qty = cart[dish.name]?.qty || 0;
  useEffect(()=>{
    const fn = e => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return ()=>window.removeEventListener("keydown",fn);
  },[]);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-left">
          <img src={dish.img} alt={dish.name} onError={e=>e.target.src=FALLBACK} />
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">✕</button>
        </div>
        <div className="modal-right">
          {dish.tag && <span className="dish-tag" style={{marginBottom:"12px"}}>{dish.tag}</span>}
          <h2 style={{fontSize:"24px",fontWeight:"400",color:MID,marginBottom:"10px",lineHeight:1.3}}>{dish.name}</h2>
          <Stars rating={dish.rating} reviews={dish.reviews} />
          <div style={{fontSize:"11px",color:"#ff7a45",fontFamily:"sans-serif",fontWeight:"700",margin:"6px 0"}}>🔥 {popularityCount(dish.name)} ordered today</div>
          <p style={{color:"#888",fontFamily:"sans-serif",fontSize:"13px",lineHeight:2,margin:"16px 0 20px",fontStyle:"italic"}}>{dish.desc}</p>
          <div style={{flex:1}} />
          <div style={{borderTop:"1px solid #f0ece4",paddingTop:"20px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
              <span style={{fontSize:"28px",color:GOLD,fontFamily:"sans-serif",fontWeight:"700"}}>{dish.price}</span>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                {qty > 0 && <span style={{fontSize:"12px",fontFamily:"sans-serif",color:GOLD,background:"#fdf6ec",padding:"4px 12px",borderRadius:"20px",border:`1px solid ${GOLD}44`}}>{qty} in cart</span>}
                <button title="Share this dish" aria-label="Share this dish" onClick={()=>{
                  const text = `Check out ${dish.name} (${dish.price}) at Rahul Foods!`;
                  if(navigator.share) navigator.share({title:dish.name, text});
                  else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }} style={{width:"34px",height:"34px",borderRadius:"50%",border:"1px solid #e0d9ce",background:"#fff",fontSize:"15px",display:"flex",alignItems:"center",justifyContent:"center"}}>📤</button>
              </div>
            </div>
            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
              {qty === 0
                ? <button className="add-btn" style={{padding:"12px 0"}} onClick={()=>{ addToCart(dish); }}>+ Add to Cart</button>
                : <>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={()=>updateQty(dish.name,-1)}>−</button>
                      <span className="qty-num">{qty}</span>
                      <button className="qty-btn" onClick={()=>updateQty(dish.name,1)}>+</button>
                    </div>
                    <button className="del-btn" onClick={()=>{ updateQty(dish.name,-qty); onClose(); }}>🗑</button>
                  </>
              }
            </div>
          </div>
          <ReviewsSection dishName={dish.name} user={user} />
        </div>
      </div>
    </div>
  );
}

function PageBanner({tag, title}) {
  return (
    <div className="page-banner" style={{background:`linear-gradient(135deg,${DARK},${MID})`,padding:"130px 60px 80px",textAlign:"center"}}>
      <p style={{color:GOLD,letterSpacing:"5px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",marginBottom:"16px"}}>✦ {tag} ✦</p>
      <h1 className="page-banner-title" style={{color:"#fff",fontSize:"52px",fontWeight:"300",letterSpacing:"2px",margin:"0 0 20px"}}>{title}</h1>
      <div style={{width:"60px",height:"1px",background:GOLD,margin:"0 auto"}} />
    </div>
  );
}
