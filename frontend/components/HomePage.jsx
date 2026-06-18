function HomePage({setPage, cart, addToCart, updateQty, onOpenModal, user}) {
  const orderCount = parseInt(localStorage.getItem("rf_orderCount"))||0;
  const REWARD_TARGET = 5;
  const remaining = REWARD_TARGET - (orderCount % REWARD_TARGET);

  const activeOrderId = localStorage.getItem("rf_activeOrderId");
  const [activeStatus, setActiveStatus] = useState(null);
  const statusMap = {placed:0, preparing:1, out_for_delivery:2, delivered:3};
  const statusLabels = ["Order Placed ✅","Being Prepared 🍳","Out for Delivery 🛵","Delivered! 🏠"];
  const statusColors = ["#a86a1c","#a86a1c","#1c6aa8","#3a7a3a"];
  const statusBg     = ["#fff6e8","#fff6e8","#e8f2ff","#f0faf0"];
  useEffect(()=>{
    if(!activeOrderId) return;
    const poll = async () => {
      const {data} = await supabase.from("orders").select("status").eq("id", activeOrderId).single();
      if(data?.status) setActiveStatus(data.status);
    };
    poll();
    const iv = setInterval(poll, 15000);
    return ()=>clearInterval(iv);
  },[activeOrderId]);

  const [couponIdx,setCouponIdx]=useState(0);
  const coupons = Object.entries(PROMO_CODES);
  useEffect(()=>{
    const t = setInterval(()=>setCouponIdx(i=>(i+1)%coupons.length), 4000);
    return ()=>clearInterval(t);
  },[]);
  const [code,promoInfo] = coupons[couponIdx];

  return (
    <>
      {activeOrderId && activeStatus && activeStatus!=="delivered" && (
        <div style={{background:"#1c1c1c",padding:"14px 24px",paddingTop:user?"14px":"84px",textAlign:"center",fontFamily:"sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:"16px",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{width:"8px",height:"8px",borderRadius:"50%",background:"#e05555",display:"inline-block",animation:"pulseDot 1.2s infinite"}} />
            <span style={{fontSize:"12px",color:"rgba(255,255,255,0.6)",letterSpacing:"2px",textTransform:"uppercase",fontWeight:"700"}}>Live Order</span>
          </div>
          <div style={{background:statusBg[statusMap[activeStatus]],border:`1px solid`,borderColor:statusColors[statusMap[activeStatus]]+"44",borderRadius:"20px",padding:"5px 16px"}}>
            <span style={{fontSize:"13px",fontWeight:"700",color:statusColors[statusMap[activeStatus]]}}>{statusLabels[statusMap[activeStatus]]}</span>
          </div>
          <button onClick={()=>setPage("orders")} style={{background:"none",border:`1px solid ${GOLD}`,color:GOLD,padding:"5px 14px",borderRadius:"20px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase"}}>Track →</button>
        </div>
      )}
      {user && (
        <div style={{background:"linear-gradient(135deg,#1f4e3f,#2e7d5b)",padding:"14px 24px",paddingTop:"84px",textAlign:"center",fontFamily:"sans-serif"}}>
          {orderCount===0
            ? <span style={{fontSize:"13px",fontWeight:"700",color:"#fff"}}>🎁 Welcome, {user.name}! Order {REWARD_TARGET} times to earn a free dessert.</span>
            : remaining===REWARD_TARGET
            ? <span style={{fontSize:"13px",fontWeight:"700",color:"#fff"}}>🎉 Congrats {user.name}, you've earned a free dessert! Mention it on your next order.</span>
            : <span style={{fontSize:"13px",fontWeight:"700",color:"#fff"}}>🎁 {orderCount} order{orderCount!==1?"s":""} placed — {remaining} more for a free dessert, {user.name}!</span>
          }
        </div>
      )}
      <section style={{minHeight:"100vh",background:`linear-gradient(135deg,${DARK} 0%,#8e1c14 100%)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-80px",right:"-80px",width:"400px",height:"400px",borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}} />
        <div style={{position:"absolute",bottom:"-60px",left:"-60px",width:"300px",height:"300px",borderRadius:"50%",background:"rgba(200,169,110,0.07)",pointerEvents:"none"}} />
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)",backgroundSize:"32px 32px",pointerEvents:"none"}} />
        <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"120px 40px 80px",maxWidth:"800px"}}>
          <div style={{display:"inline-block",background:"rgba(200,169,110,0.15)",border:`1px solid ${GOLD}44`,borderRadius:"30px",padding:"6px 20px",marginBottom:"28px"}}>
            <span style={{color:GOLD,letterSpacing:"4px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"700"}}>✦ FINE DINING & DELIVERY ✦</span>
          </div>
          <h1 style={{color:"#fff",fontSize:"64px",lineHeight:1.1,margin:"0 0 24px",fontWeight:"300",letterSpacing:"-0.5px"}}>
            Welcome to<br/><span style={{color:GOLD,fontWeight:"700"}}>Rahul Foods</span>
          </h1>
          <p style={{color:"rgba(255,255,255,0.65)",fontSize:"17px",lineHeight:1.9,marginBottom:"48px",fontFamily:"sans-serif",maxWidth:"540px",margin:"0 auto 48px"}}>
            An exquisite culinary journey — dine in or order delivery to your door.
          </p>
          <div style={{display:"flex",gap:"16px",flexWrap:"wrap",justifyContent:"center"}}>
            <button onClick={()=>setPage("menu")} style={{padding:"16px 48px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",borderRadius:"3px"}}>Order Now</button>
            <button onClick={()=>setPage("reserve")} style={{padding:"16px 40px",background:"transparent",border:"1px solid rgba(255,255,255,0.35)",color:"rgba(255,255,255,0.85)",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",textTransform:"uppercase",borderRadius:"3px"}}>Reserve a Table</button>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:"40px",marginTop:"60px",flexWrap:"wrap"}}>
            {[["🍽️","Fine Dining"],["🛵","Fast Delivery"],["⭐","5-Star Rated"]].map(([icon,label])=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontSize:"22px",marginBottom:"6px"}}>{icon}</div>
                <div style={{color:"rgba(255,255,255,0.5)",fontFamily:"sans-serif",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div style={{height:"1px",background:`linear-gradient(to right,transparent,${GOLD},transparent)`}} />
      <div style={{background:MID,padding:"10px 24px",textAlign:"center",fontFamily:"sans-serif",overflow:"hidden"}}>
        <span key={code} style={{display:"inline-block",fontSize:"12px",color:"#fff",letterSpacing:"1px",animation:"pageFadeIn 0.5s ease"}}>
          🏷️ Use code <strong style={{color:GOLD}}>{code}</strong> for {promoInfo.label} on your order!
        </span>
      </div>
      <div style={{background:"#fff",padding:"28px 60px",display:"flex",justifyContent:"center",gap:"70px",flexWrap:"wrap"}}>
        {[["🍴","Fine Dining"],["🛵","Fast Delivery"],["👨‍🍳","Michelin-Trained Chefs"],["🍷","Curated Wine List"]].map(([icon,label])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{fontSize:"18px"}}>{icon}</span>
            <span style={{fontSize:"12px",letterSpacing:"2px",fontFamily:"sans-serif",color:"#555",textTransform:"uppercase",fontWeight:"600"}}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{height:"1px",background:"#eee"}} />
      <section style={{padding:"90px 60px",background:"#f9f8f5"}}>
        <div style={{textAlign:"center",marginBottom:"56px"}}>
          <p style={{color:GOLD,letterSpacing:"5px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",marginBottom:"14px"}}>✦ FEATURED ✦</p>
          <h2 style={{fontSize:"42px",fontWeight:"300",margin:"0 0 20px"}}>Signature Dishes</h2>
          <div style={{width:"60px",height:"1px",background:GOLD,margin:"0 auto"}} />
        </div>
        <div className="rf-grid3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"28px",maxWidth:"1000px",margin:"0 auto 52px"}}>
          {[menuData["Main Course"][0], menuData["Main Course"][1], menuData.Desserts[0]].map((dish,i)=>(
            <DishCard key={dish.name} item={dish} cart={cart} addToCart={addToCart} updateQty={updateQty} onOpenModal={onOpenModal} delay={i*0.1} />
          ))}
        </div>
        <div style={{textAlign:"center"}}>
          <button onClick={()=>setPage("menu")} style={{padding:"14px 48px",border:`1px solid ${GOLD}`,color:GOLD,background:"transparent",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>View Full Menu</button>
        </div>
      </section>
      <div style={{height:"1px",background:`linear-gradient(to right,transparent,${GOLD},transparent)`}} />
      <section style={{padding:"90px 60px",background:"#fff"}}>
        <div style={{textAlign:"center",marginBottom:"56px"}}>
          <p style={{color:GOLD,letterSpacing:"5px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",marginBottom:"14px"}}>✦ TESTIMONIALS ✦</p>
          <h2 style={{fontSize:"42px",fontWeight:"300",margin:"0 0 20px"}}>What Our Guests Say</h2>
          <div style={{width:"60px",height:"1px",background:GOLD,margin:"0 auto"}} />
        </div>
        <div className="testimonial-grid">
          {[
            {name:"Aanya Sharma", role:"Food Blogger", text:"The Lobster Thermidor was out of this world. Service was impeccable and the ambiance felt like a Michelin-star restaurant.", rating:5},
            {name:"Rohan Mehta", role:"Regular Guest", text:"Delivery is always fast and the food arrives still hot. The Grilled Tenderloin Steak is my go-to order every time.", rating:5},
            {name:"Priya Nair", role:"Food Enthusiast", text:"Booked a table for our anniversary — the staff made it so special. The Chocolate Fondant dessert was the perfect finish.", rating:4.5},
          ].map((t,i)=>(
            <div key={t.name} style={{background:"#f9f8f5",borderRadius:"6px",padding:"32px 28px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",animation:"cardIn 0.5s ease both",animationDelay:`${i*0.1}s`}}>
              <div style={{color:"#f5b400",fontSize:"15px",marginBottom:"14px"}}>{"★".repeat(Math.floor(t.rating))}{t.rating%1!==0?"½":""}</div>
              <p style={{color:"#666",fontFamily:"sans-serif",fontSize:"13px",lineHeight:2,marginBottom:"22px",fontStyle:"italic"}}>"{t.text}"</p>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <div style={{width:"42px",height:"42px",borderRadius:"50%",background:GOLD,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif",fontWeight:"700",fontSize:"16px",flexShrink:0}}>{t.name[0]}</div>
                <div>
                  <div style={{fontFamily:"sans-serif",fontSize:"13px",fontWeight:"700",color:MID}}>{t.name}</div>
                  <div style={{fontFamily:"sans-serif",fontSize:"11px",color:"#aaa"}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div style={{height:"1px",background:"#eee"}} />
      <section style={{background:`linear-gradient(135deg,${DARK},${MID})`,padding:"80px 60px",textAlign:"center"}}>
        <p style={{color:GOLD,letterSpacing:"5px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"600",marginBottom:"14px"}}>✦ ORDER DELIVERY ✦</p>
        <h2 style={{color:"#fff",fontSize:"40px",fontWeight:"300",margin:"0 0 16px"}}>Craving Rahul Foods?</h2>
        <p style={{color:"rgba(255,255,255,0.5)",fontFamily:"sans-serif",fontSize:"15px",marginBottom:"36px"}}>Order from our full menu and get it delivered straight to your door.</p>
        <button onClick={()=>setPage("menu")} style={{padding:"15px 52px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Start Ordering 🛒</button>
      </section>
    </>
  );
}
