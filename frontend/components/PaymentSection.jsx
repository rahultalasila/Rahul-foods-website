function PaymentSection({payMethod, setPayMethod, payForm, setPayForm, payErrors}) {
  const updPay = k => e => setPayForm(f=>({...f,[k]:e.target.value}));
  const iS = field => ({width:"100%",padding:"11px 13px",border:`1px solid ${payErrors[field]?"#e05555":"#e0d9ce"}`,background:"#fff",fontFamily:"sans-serif",fontSize:"13px",color:MID,borderRadius:"3px"});
  const lS = {display:"block",fontSize:"10px",letterSpacing:"2px",color:"#999",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",marginBottom:"6px"};
  const options = [
    {id:"cod",   icon:"💵",title:"Cash on Delivery",      sub:"Pay when your order arrives"},
    {id:"card",  icon:"💳",title:"Credit / Debit Card",  sub:"Visa, Mastercard, RuPay, Amex"},
    {id:"upi",   icon:"📱",title:"UPI Payment",           sub:"GPay, PhonePe, Paytm, BHIM & more"},
    {id:"nb",    icon:"🏦",title:"Net Banking",           sub:"All major banks supported"},
    {id:"wallet",icon:"👛",title:"Mobile Wallet",         sub:"Paytm, Amazon Pay, MobiKwik & more"},
  ];
  return (
    <div style={{background:"#fff",borderRadius:"6px",padding:"28px 32px",boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
      <h3 style={{fontSize:"18px",fontWeight:"normal",marginBottom:"4px",color:MID}}>Payment Method</h3>
      <p style={{color:"#aaa",fontFamily:"sans-serif",fontSize:"12px",marginBottom:"22px"}}>Choose how you'd like to pay</p>
      {options.map(opt=>(
        <div key={opt.id} className={`pay-option${payMethod===opt.id?" selected":""}`} onClick={()=>setPayMethod(opt.id)}>
          <div className={`pay-radio${payMethod===opt.id?" checked":""}`}>{payMethod===opt.id&&<div className="pay-radio-dot"/>}</div>
          <div className="pay-icon">{opt.icon}</div>
          <div className="pay-label"><div className="pay-label-title">{opt.title}</div><div className="pay-label-sub">{opt.sub}</div></div>
        </div>
      ))}
      {payMethod==="card" && (
        <div className="pay-extra">
          <p style={{fontFamily:"sans-serif",fontSize:"11px",color:GOLD,fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"14px"}}>Card Details</p>
          <div style={{marginBottom:"12px"}}>
            <label style={lS}>Card Number *</label>
            <input value={payForm.cardNum||""} onChange={updPay("cardNum")} placeholder="1234  5678  9012  3456" maxLength={19} style={iS("cardNum")}
              onInput={e=>{let v=e.target.value.replace(/\D/g,"").slice(0,16);e.target.value=v.replace(/(.{4})/g,"$1 ").trim();setPayForm(f=>({...f,cardNum:e.target.value}));}} />
            {payErrors.cardNum&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{payErrors.cardNum}</span>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
            <div><label style={lS}>Name *</label><input value={payForm.cardName||""} onChange={updPay("cardName")} placeholder="Full name" style={iS("cardName")} />{payErrors.cardName&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{payErrors.cardName}</span>}</div>
            <div><label style={lS}>Expiry *</label><input value={payForm.expiry||""} onChange={updPay("expiry")} placeholder="MM / YY" maxLength={7} style={iS("expiry")}
              onInput={e=>{let v=e.target.value.replace(/\D/g,"").slice(0,4);if(v.length>=3)v=v.slice(0,2)+" / "+v.slice(2);e.target.value=v;setPayForm(f=>({...f,expiry:e.target.value}));}} />
              {payErrors.expiry&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{payErrors.expiry}</span>}</div>
            <div><label style={lS}>CVV *</label><input value={payForm.cvv||""} onChange={updPay("cvv")} placeholder="•••" maxLength={4} type="password" style={iS("cvv")} />{payErrors.cvv&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{payErrors.cvv}</span>}</div>
          </div>
          <div style={{marginTop:"12px",padding:"10px 14px",background:"#f0f7ff",border:"1px solid #c8dff8",borderRadius:"4px",display:"flex",gap:"8px",alignItems:"center"}}>
            <span>🔒</span><span style={{fontFamily:"sans-serif",fontSize:"11px",color:"#5b7fa8"}}>Your card details are encrypted and secure.</span>
          </div>
        </div>
      )}
      {payMethod==="upi" && (
        <div className="pay-extra">
          <p style={{fontFamily:"sans-serif",fontSize:"11px",color:GOLD,fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>UPI Details</p>
          <div style={{marginBottom:"12px"}}><label style={lS}>UPI ID *</label><input value={payForm.upiId||""} onChange={updPay("upiId")} placeholder="yourname@upi" style={iS("upiId")} />{payErrors.upiId&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{payErrors.upiId}</span>}</div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {[["🟢","Google Pay"],["🟣","PhonePe"],["🔵","Paytm"],["🟠","BHIM"],["🔴","Amazon Pay"]].map(([e,n])=>(
              <button key={n} onClick={()=>setPayForm(f=>({...f,upiApp:n}))} style={{padding:"6px 12px",border:`1px solid ${payForm.upiApp===n?GOLD:"#e0d9ce"}`,background:payForm.upiApp===n?"#fdf9f2":"#fff",borderRadius:"20px",fontSize:"11px",fontFamily:"sans-serif",color:payForm.upiApp===n?GOLD:"#888",fontWeight:payForm.upiApp===n?"700":"400"}}>{e} {n}</button>
            ))}
          </div>
        </div>
      )}
      {payMethod==="nb" && (
        <div className="pay-extra">
          <p style={{fontFamily:"sans-serif",fontSize:"11px",color:GOLD,fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Select Your Bank</p>
          <select value={payForm.bank||""} onChange={updPay("bank")} style={{width:"100%",padding:"11px 13px",border:`1px solid ${payErrors.bank?"#e05555":"#e0d9ce"}`,background:"#fff",fontFamily:"sans-serif",fontSize:"13px",color:MID,borderRadius:"3px",cursor:"pointer"}}>
            <option value="">Choose your bank</option>
            {["State Bank of India","HDFC Bank","ICICI Bank","Axis Bank","Kotak Mahindra Bank","Punjab National Bank","Bank of Baroda","Yes Bank","IndusInd Bank","Canara Bank"].map(b=><option key={b} value={b}>{b}</option>)}
          </select>
          {payErrors.bank&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif"}}>{payErrors.bank}</span>}
        </div>
      )}
      {payMethod==="wallet" && (
        <div className="pay-extra">
          <p style={{fontFamily:"sans-serif",fontSize:"11px",color:GOLD,fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px"}}>Select Wallet</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
            {[["🔵","Paytm"],["🟠","Amazon Pay"],["🟢","MobiKwik"],["🔴","Freecharge"],["🟣","Ola Money"],["⚫","JioMoney"]].map(([e,n])=>(
              <button key={n} onClick={()=>setPayForm(f=>({...f,wallet:n}))} style={{padding:"10px 6px",border:`1px solid ${payForm.wallet===n?GOLD:"#e0d9ce"}`,background:payForm.wallet===n?"#fdf9f2":"#fff",borderRadius:"6px",fontSize:"11px",fontFamily:"sans-serif",color:payForm.wallet===n?GOLD:"#888",fontWeight:payForm.wallet===n?"700":"400",textAlign:"center"}}>
                <div style={{fontSize:"18px",marginBottom:"3px"}}>{e}</div>{n}
              </button>
            ))}
          </div>
          {payErrors.wallet&&<span style={{color:"#e05555",fontSize:"11px",fontFamily:"sans-serif",display:"block",marginTop:"8px"}}>{payErrors.wallet}</span>}
        </div>
      )}
      {payMethod==="cod" && (
        <div className="pay-extra" style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
          <span style={{fontSize:"22px"}}>💵</span>
          <div style={{fontFamily:"sans-serif",fontSize:"13px",color:"#666",lineHeight:1.8}}>
            <strong style={{color:MID,display:"block",marginBottom:"4px"}}>Pay on Delivery</strong>
            Keep exact change ready. Our delivery partner will collect payment at your doorstep.
          </div>
        </div>
      )}
    </div>
  );
}
