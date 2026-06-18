function OrderTracking({form, total, payLabel, setPage, clearCart, orderId}) {
  const [stage, setStage] = useState(0);
  const [cancelled, setCancelled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CANCEL_WINDOW);
  const [cancelling, setCancelling] = useState(false);
  const stages = [
    { icon:"✅", title:"Order Placed",    sub:"We've received your order"       },
    { icon:"🍳", title:"Being Prepared",  sub:"Our chefs are cooking your meal" },
    { icon:"🛵", title:"Out for Delivery",sub:"On the way to your address"      },
    { icon:"🏠", title:"Delivered!",      sub:"Enjoy your meal — bon appétit!"  },
  ];
  const statusMap = {placed:0, preparing:1, out_for_delivery:2, delivered:3};

  useEffect(()=>{
    if(!orderId) return;
    const poll = async () => {
      const {data} = await supabase.from("orders").select("status").eq("id", orderId).single();
      if(data?.status === "cancelled") { setCancelled(true); return; }
      if(data?.status !== undefined) setStage(statusMap[data.status] ?? 0);
    };
    poll();
    const iv = setInterval(poll, 15000);
    return ()=>clearInterval(iv);
  },[orderId]);

  useEffect(()=>{
    if(timeLeft <= 0 || stage > 0 || cancelled) return;
    const t = setTimeout(()=>setTimeLeft(s=>s-1), 1000);
    return ()=>clearTimeout(t);
  },[timeLeft, stage, cancelled]);

  const cancelOrder = async () => {
    if(!orderId || stage > 0) return;
    setCancelling(true);
    await supabase.from("orders").update({status:"cancelled"}).eq("id", orderId);
    localStorage.removeItem("rf_activeOrderId");
    setCancelling(false);
    setCancelled(true);
  };

  const canCancel = orderId && timeLeft > 0 && stage === 0 && !cancelled;
  const mins = String(Math.floor(timeLeft/60)).padStart(2,"0");
  const secs = String(timeLeft%60).padStart(2,"0");

  if(cancelled) return (
    <div style={{paddingTop:"80px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <PageBanner tag="ORDER CANCELLED" title="Order Cancelled" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px",background:"#f9f8f5",flexDirection:"column",gap:"20px",textAlign:"center"}}>
        <div style={{fontSize:"64px"}}>❌</div>
        <h2 style={{fontSize:"28px",fontWeight:"300",color:MID}}>Your order has been cancelled</h2>
        <p style={{fontFamily:"sans-serif",fontSize:"14px",color:"#888",maxWidth:"400px",lineHeight:1.8}}>No charges have been made. We hope to serve you again soon!</p>
        <div style={{display:"flex",gap:"14px",flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={()=>{clearCart();setPage("menu");}} style={{padding:"14px 36px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Order Again</button>
          <button onClick={()=>{clearCart();setPage("home");}} style={{padding:"14px 36px",background:"transparent",border:"1px solid #ccc",color:"#888",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Back to Home</button>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{paddingTop:"80px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <PageBanner tag="ORDER PLACED" title="Tracking Your Order" />
      <div style={{flex:1,background:"#f9f8f5",padding:"60px"}}>
        <div style={{maxWidth:"680px",margin:"0 auto"}}>
          <div style={{background:"#fff",borderRadius:"6px",padding:"28px 32px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"24px",textAlign:"center"}}>
            <div style={{fontSize:"52px",marginBottom:"12px"}}>🎉</div>
            <h2 style={{fontSize:"26px",fontWeight:"300",color:MID,marginBottom:"8px"}}>Order Confirmed, {form.name}!</h2>
            <p style={{fontFamily:"sans-serif",fontSize:"14px",color:"#888",lineHeight:1.8,marginBottom:"6px"}}>Delivering to: <strong style={{color:MID}}>{form.address}, {form.city} – {form.pincode}</strong></p>
            <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"#f0faf0",border:"1px solid #aadcaa",borderRadius:"6px",padding:"8px 18px",margin:"10px 0"}}>
              <span style={{fontSize:"15px"}}>✅</span><span style={{fontFamily:"sans-serif",fontSize:"13px",color:"#3a7a3a",fontWeight:"600"}}>Payment via {payLabel}</span>
            </div>
            <div style={{fontSize:"22px",fontWeight:"700",color:GOLD,fontFamily:"sans-serif",marginTop:"6px"}}>Total: ₹{Math.round(total)}</div>
          </div>
          <div style={{background:"#fff",borderRadius:"6px",padding:"32px 36px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"24px"}}>
            <h3 style={{fontSize:"15px",fontWeight:"700",color:MID,letterSpacing:"2px",textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:"28px"}}>Live Tracking</h3>
            {stages.map((s,i)=>{
              const isDone=i<stage, isActive=i===stage, isPending=i>stage;
              return (
                <div key={i} className="track-step">
                  <div className="track-line-wrap">
                    <div className={`track-dot ${isDone?"done":isActive?"active":"pending"}`}>{isDone?"✓":s.icon}</div>
                    {i < stages.length-1 && <div className={`track-connector${isDone?" done":""}`} />}
                  </div>
                  <div className="track-info">
                    <div className={`track-title ${isDone?"":isActive?"active":"pending"}`}>{s.title}</div>
                    <div className="track-sub">{isActive?"In progress…":isDone?"Done ✓":s.sub}</div>
                  </div>
                </div>
              );
            })}
            {stage < 3
              ? <p style={{fontFamily:"sans-serif",fontSize:"12px",color:"#aaa",marginTop:"8px"}}>🛵 Estimated delivery: 30–45 minutes</p>
              : <p style={{fontFamily:"sans-serif",fontSize:"13px",color:"#3a7a3a",fontWeight:"600",marginTop:"8px"}}>🏠 Your order has been delivered! Enjoy!</p>
            }
            {canCancel && (
              <div style={{marginTop:"20px",padding:"16px 20px",background:"#fff5f5",border:"1px solid #fcc",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
                <div style={{fontFamily:"sans-serif"}}>
                  <div style={{fontSize:"12px",color:"#e05555",fontWeight:"700",marginBottom:"2px"}}>⏱ Cancel window closes in</div>
                  <div style={{fontSize:"22px",fontWeight:"700",color:MID,fontVariantNumeric:"tabular-nums"}}>{mins}:{secs}</div>
                </div>
                <button onClick={cancelOrder} disabled={cancelling} style={{padding:"10px 24px",background:"#e05555",color:"#fff",border:"none",borderRadius:"4px",fontFamily:"sans-serif",fontSize:"12px",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase"}}>
                  {cancelling?"Cancelling…":"Cancel Order"}
                </button>
              </div>
            )}
            {!canCancel && stage === 0 && !cancelled && timeLeft <= 0 && (
              <div style={{marginTop:"16px",padding:"12px 16px",background:"#f9f8f5",border:"1px solid #e0d9ce",borderRadius:"6px",fontFamily:"sans-serif",fontSize:"12px",color:"#aaa",textAlign:"center"}}>
                ⏱ Cancellation window has closed. Contact us to make changes.
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:"14px"}}>
            <button onClick={()=>window.print()} style={{flex:1,padding:"14px",background:"transparent",border:"1px solid #ccc",color:"#888",letterSpacing:"2px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",borderRadius:"3px"}}>🖨 Print Receipt</button>
            <button onClick={()=>{clearCart();setPage("menu");}} style={{flex:1,padding:"14px",background:"transparent",border:`1px solid ${GOLD}`,color:GOLD,letterSpacing:"2px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",borderRadius:"3px"}}>Order Again</button>
            <button onClick={()=>{clearCart();setPage("home");}} style={{flex:1,padding:"14px",background:GOLD,color:"#fff",border:"none",letterSpacing:"2px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",borderRadius:"3px"}}>Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({cart, updateQty, setPage, showToast, clearCart, onOrderPlaced, user}) {
  const cartItems = Object.values(cart);
  const subtotal  = cartItems.reduce((s,{item,qty})=>s+getPrice(item)*qty, 0);

  const [form,     setForm]     = useState({name:"",phone:"",address:"",city:"",pincode:"",instructions:""});
  const [errors,   setErrors]   = useState({});
  const [payMethod,setPayMethod]= useState("cod");
  const [payForm,  setPayForm]  = useState({});
  const [payErrors,setPayErrors]= useState({});
  const [ordered,  setOrdered]  = useState(false);
  const [orderId,  setOrderId]  = useState(null);
  const [promoInput, setPromoInput] = useState("");
  const [promo,      setPromo]      = useState(null);
  const [promoErr,   setPromoErr]   = useState("");

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if(PROMO_CODES[code]) {
      setPromo({code, ...PROMO_CODES[code]});
      setPromoErr("");
      showToast(`${PROMO_CODES[code].label} applied! 🎉`, "success");
    } else {
      setPromoErr("Invalid promo code. Try RAHUL10, WELCOME20, FREESHIP or FEAST50.");
      setPromo(null);
    }
  };

  const discount = promo
    ? promo.type==="percent" ? (subtotal * promo.value / 100)
    : promo.type==="flat"    ? Math.min(promo.value, subtotal)
    : DELIVERY_FEE
    : 0;
  const delivery = promo?.type==="freeship" ? 0 : DELIVERY_FEE;
  const total    = subtotal - (promo?.type==="flat"||promo?.type==="percent" ? discount : 0) + delivery;

  const upd = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const validate = () => {
    const e={};
    if(!form.name.trim())    e.name="Required";
    if(!form.phone.trim())   e.phone="Required";
    if(!form.address.trim()) e.address="Required";
    if(!form.city.trim())    e.city="Required";
    if(!form.pincode.trim()) e.pincode="Required";
    setErrors(e);
    const pe={};
    if(payMethod==="card"){
      if(!(payForm.cardNum||"").replace(/\s/g,"").match(/^\d{16}$/)) pe.cardNum="Enter valid 16-digit number";
      if(!(payForm.cardName||"").trim()) pe.cardName="Required";
      if(!(payForm.expiry||"").match(/^\d{2}\s\/\s\d{2}$/)) pe.expiry="MM / YY";
      if(!(payForm.cvv||"").match(/^\d{3,4}$/)) pe.cvv="3-4 digits";
    }
    if(payMethod==="upi" && !(payForm.upiId||"").includes("@")) pe.upiId="Enter valid UPI ID";
    if(payMethod==="nb"  && !(payForm.bank||"")) pe.bank="Please select a bank";
    if(payMethod==="wallet" && !(payForm.wallet||"")) pe.wallet="Please select a wallet";
    setPayErrors(pe);
    return Object.keys(e).length===0 && Object.keys(pe).length===0;
  };

  const iStyle = field => ({width:"100%",padding:"13px 15px",border:`1px solid ${errors[field]?"#e05555":"#e0d9ce"}`,background:"#fff",fontFamily:"sans-serif",fontSize:"14px",color:MID,borderRadius:"3px"});
  const lStyle = {display:"block",fontSize:"10px",letterSpacing:"2px",color:"#999",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",marginBottom:"7px"};
  const payLabel = {cod:"Cash on Delivery",card:"Credit / Debit Card",upi:"UPI Payment",nb:"Net Banking",wallet:"Mobile Wallet"}[payMethod];

  if(ordered) return <OrderTracking form={form} total={total} payLabel={payLabel} setPage={setPage} clearCart={clearCart} orderId={orderId} />;

  if(cartItems.length===0) return (
    <div style={{paddingTop:"80px",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <PageBanner tag="YOUR ORDER" title="Cart" />
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px",background:"#f9f8f5",flexDirection:"column",gap:"24px"}}>
        <div style={{fontSize:"64px"}}>🛒</div>
        <h2 style={{fontSize:"28px",fontWeight:"300",color:MID}}>Your cart is empty</h2>
        <p style={{color:"#aaa",fontFamily:"sans-serif",fontSize:"14px"}}>Add some delicious dishes from our menu!</p>
        <button onClick={()=>setPage("menu")} style={{padding:"14px 44px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase"}}>Browse Menu</button>
      </div>
    </div>
  );

  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="YOUR ORDER" title="Cart & Checkout" />
      <div style={{background:"#f9f8f5",padding:"60px"}} className="cart-page-pad">
        <div className="cart-grid" style={{maxWidth:"1100px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 420px",gap:"40px",alignItems:"start"}}>
          <div>
            <div style={{background:"#fff",borderRadius:"6px",padding:"28px 32px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"24px"}}>
              <h3 style={{fontSize:"18px",fontWeight:"normal",marginBottom:"4px",color:MID}}>Your Items</h3>
              <p style={{color:"#aaa",fontFamily:"sans-serif",fontSize:"12px",marginBottom:"20px"}}>{cartItems.length} item{cartItems.length!==1?"s":""} selected</p>
              {cartItems.map(({item,qty})=>(
                <div key={item.name} className="cart-item">
                  <img src={item.img} alt={item.name} onError={e=>e.target.src=FALLBACK} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:"15px",color:MID,marginBottom:"4px"}}>{item.name}</div>
                    <Stars rating={item.rating} reviews={item.reviews} />
                    <div style={{display:"flex",alignItems:"center",gap:"10px",marginTop:"8px"}}>
                      <div className="qty-control" style={{maxWidth:"110px"}}>
                        <button className="qty-btn" onClick={()=>updateQty(item.name,-1)}>−</button>
                        <span className="qty-num">{qty}</span>
                        <button className="qty-btn" onClick={()=>updateQty(item.name,1)}>+</button>
                      </div>
                      <span style={{color:"#ccc",fontSize:"12px",fontFamily:"sans-serif"}}>× {item.price}</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"10px"}}>
                    <div style={{fontSize:"18px",color:GOLD,fontFamily:"sans-serif",fontWeight:"700"}}>₹{Math.round(getPrice(item)*qty)}</div>
                    <button className="del-btn-full" onClick={()=>updateQty(item.name,-qty)}>🗑 Delete</button>
                  </div>
                </div>
              ))}
              <div style={{display:"flex",gap:"10px",marginTop:"16px",flexWrap:"wrap"}}>
                <button onClick={()=>setPage("menu")} style={{background:"none",border:`1px solid ${GOLD}`,color:GOLD,padding:"9px 18px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",borderRadius:"3px"}}>← Back to Menu</button>
                <button onClick={()=>{ if(window.confirm("Cancel your entire order? All items will be removed from the cart.")) { clearCart(); setPage("menu"); } }} style={{background:"none",border:"1px solid #e05555",color:"#e05555",padding:"9px 18px",fontSize:"11px",fontFamily:"sans-serif",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",borderRadius:"3px"}}>🗑 Cancel Order</button>
              </div>
            </div>

            <div style={{background:"#fff",borderRadius:"6px",padding:"28px 32px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",marginBottom:"24px"}}>
              <h3 style={{fontSize:"18px",fontWeight:"normal",marginBottom:"4px",color:MID}}>Delivery Details</h3>
              <p style={{color:"#aaa",fontFamily:"sans-serif",fontSize:"12px",marginBottom:"22px"}}>Where should we deliver your order?</p>
              <div className="rf-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"18px",marginBottom:"18px"}}>
                <div><label style={lStyle}>Full Name *</label><input value={form.name} onChange={upd("name")} placeholder="Your full name" style={iStyle("name")} />{errors.name&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.name}</span>}</div>
                <div><label style={lStyle}>Phone *</label><input type="tel" value={form.phone} onChange={upd("phone")} placeholder="+91 00000 00000" style={iStyle("phone")} />{errors.phone&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.phone}</span>}</div>
              </div>
              <div style={{marginBottom:"18px"}}>
                <label style={lStyle}>Full Address *</label>
                <textarea value={form.address} onChange={upd("address")} rows={3} placeholder="House/flat no., building name, street, area..." style={{...iStyle("address"),resize:"vertical",lineHeight:1.7}} />
                {errors.address&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.address}</span>}
              </div>
              <div className="rf-grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"18px",marginBottom:"18px"}}>
                <div><label style={lStyle}>City *</label><input value={form.city} onChange={upd("city")} placeholder="e.g. Vijayawada" style={iStyle("city")} />{errors.city&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.city}</span>}</div>
                <div><label style={lStyle}>Pincode *</label><input type="number" value={form.pincode} onChange={upd("pincode")} placeholder="e.g. 400001" style={iStyle("pincode")} />{errors.pincode&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{errors.pincode}</span>}</div>
              </div>
              {form.pincode && form.pincode.length>=5 && (
                <div style={{display:"flex",alignItems:"center",gap:"10px",background:"#fdf9f2",border:`1px solid ${GOLD}44`,borderRadius:"4px",padding:"10px 14px",marginBottom:"18px"}}>
                  <span style={{fontSize:"18px"}}>🛵</span>
                  <span style={{fontFamily:"sans-serif",fontSize:"12px",color:"#666"}}>
                    Estimated delivery to <strong style={{color:MID}}>{form.pincode}</strong>: <strong style={{color:GOLD}}>{25 + (parseInt(form.pincode.slice(-2))||0) % 25}–{40 + (parseInt(form.pincode.slice(-2))||0) % 25} minutes</strong>
                  </span>
                </div>
              )}
              <div><label style={lStyle}>Delivery Instructions (optional)</label><textarea value={form.instructions} onChange={upd("instructions")} rows={2} placeholder="Landmark, floor number, gate code, etc..." style={{...iStyle("instructions"),resize:"vertical",lineHeight:1.7}} /></div>
            </div>

            <PaymentSection payMethod={payMethod} setPayMethod={setPayMethod} payForm={payForm} setPayForm={setPayForm} payErrors={payErrors} />
          </div>

          <div style={{position:"sticky",top:"100px"}}>
            <div className="summary-box">
              <h3 style={{fontSize:"18px",fontWeight:"normal",marginBottom:"20px",color:MID,paddingBottom:"16px",borderBottom:"1px solid #f0ece4"}}>Order Summary</h3>
              {cartItems.map(({item,qty})=>(
                <div key={item.name} className="summary-row">
                  <span style={{fontSize:"13px"}}>{item.name} × {qty}</span>
                  <span style={{color:MID,fontWeight:"600"}}>₹{Math.round(getPrice(item)*qty)}</span>
                </div>
              ))}
              <div style={{borderTop:"1px solid #f0ece4",marginTop:"8px",paddingTop:"14px",marginBottom:"4px"}}>
                <div style={{display:"flex",gap:"8px",marginBottom:"6px"}}>
                  <input value={promoInput} onChange={e=>setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Promo code" maxLength={12}
                    style={{flex:1,padding:"10px 12px",border:"1px solid #e0d9ce",borderRadius:"3px",fontFamily:"sans-serif",fontSize:"12px",color:MID,textTransform:"uppercase",letterSpacing:"1px"}}
                    onKeyDown={e=>e.key==="Enter"&&applyPromo()} />
                  <button onClick={applyPromo} style={{padding:"10px 14px",background:MID,color:"#fff",border:"none",fontFamily:"sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"1px",borderRadius:"3px"}}>Apply</button>
                </div>
                {promoErr && <p style={{fontFamily:"sans-serif",fontSize:"11px",color:"#e05555",marginBottom:"6px"}}>{promoErr}</p>}
                {promo && <p style={{fontFamily:"sans-serif",fontSize:"11px",color:"#3a7a3a",marginBottom:"4px"}}>✅ <strong>{promo.code}</strong> — {promo.label}</p>}
                <p style={{fontFamily:"sans-serif",fontSize:"10px",color:"#ccc"}}>Try: RAHUL10 · WELCOME20 · FREESHIP · FEAST50</p>
              </div>
              <div style={{borderTop:"1px solid #f0ece4",paddingTop:"8px"}}>
                <div className="summary-row"><span>Subtotal</span><span style={{color:MID}}>₹{Math.round(subtotal)}</span></div>
                {promo && (promo.type==="percent"||promo.type==="flat") && (
                  <div className="summary-row"><span style={{color:"#3a7a3a"}}>Discount ({promo.label})</span><span style={{color:"#3a7a3a",fontWeight:"700"}}>−₹{Math.round(discount)}</span></div>
                )}
                <div className="summary-row">
                  <span>Delivery {promo?.type==="freeship"?"(FREE)":""}</span>
                  <span style={{color:MID,textDecoration:promo?.type==="freeship"?"line-through":"none"}}>₹{DELIVERY_FEE}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0 8px",borderTop:"2px solid #f0ece4",marginTop:"8px"}}>
                  <span style={{fontSize:"14px",fontWeight:"700",color:MID,fontFamily:"sans-serif"}}>Total Amount</span>
                  <span style={{fontSize:"22px",fontWeight:"700",color:GOLD}}>₹{Math.round(total)}</span>
                </div>
              </div>
              <div style={{background:"#f9f8f5",border:"1px solid #f0ece4",borderRadius:"5px",padding:"10px 14px",marginBottom:"14px",display:"flex",alignItems:"center",gap:"10px"}}>
                <span style={{fontSize:"18px"}}>{{"cod":"💵","card":"💳","upi":"📱","nb":"🏦","wallet":"👛"}[payMethod]}</span>
                <div style={{fontFamily:"sans-serif"}}>
                  <div style={{fontSize:"11px",color:"#aaa",letterSpacing:"1px",textTransform:"uppercase"}}>Payment via</div>
                  <div style={{fontSize:"13px",fontWeight:"700",color:MID}}>{payLabel}</div>
                </div>
              </div>
              <button onClick={()=>{if(validate()){
                const orderData = {items:cartItems.map(({item,qty})=>({name:item.name,qty,price:item.price})), total, payLabel, address:`${form.address}, ${form.city} – ${form.pincode}`};
                const itemsText = cartItems.map(({item,qty})=>(item.name+" x"+qty+" - Rs."+Math.round(getPrice(item)*qty))).join(", ");
                sendOrderEmails(form, orderData, itemsText, total, payLabel, user?.email||"");
                setOrdered(true);
                onOrderPlaced(orderData).then(id=>{ if(id) setOrderId(id); });
              }}}
                style={{width:"100%",padding:"16px",background:GOLD,color:"#fff",border:"none",letterSpacing:"3px",fontSize:"12px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",borderRadius:"3px"}}>
                {payMethod==="cod"?`Place Order · ₹${Math.round(total)}`:`Pay ₹${Math.round(total)} Now`}
              </button>
              <p style={{textAlign:"center",color:"#ccc",fontFamily:"sans-serif",fontSize:"11px",marginTop:"10px"}}>🔒 Secure checkout · 🛵 30–45 min delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
