function DishCard({item, cart, addToCart, updateQty, onOpenModal, delay=0}) {
  const qty = cart[item.name]?.qty || 0;
  return (
    <div className="dish-card" style={{animationDelay:`${delay}s`}}>
      <div className="dish-card-img-wrap" onClick={()=>onOpenModal(item)}>
        <SmartImg src={item.img} alt={item.name} imgStyle={{width:"100%",height:"200px",objectFit:"cover",display:"block",background:"#eee"}} />
        <div className="dish-card-img-overlay"><span>View Details</span></div>
      </div>
      <div className="dish-card-body">
        {item.tag && <span className="dish-tag">{item.tag}</span>}
        <div className="dish-card-name" onClick={()=>onOpenModal(item)}>{item.name}</div>
        <Stars rating={item.rating} reviews={item.reviews} />
        <div style={{fontSize:"10px",color:"#ff7a45",fontFamily:"sans-serif",fontWeight:"700",marginBottom:"6px"}}>🔥 {popularityCount(item.name)} ordered today</div>
        <div className="dish-card-desc">{item.desc}</div>
        <div className="dish-card-footer">
          <div className="dish-card-price-row">
            <span className="dish-card-price">{item.price}</span>
            {qty > 0 && <span style={{fontSize:"11px",fontFamily:"sans-serif",color:GOLD,fontWeight:"700",background:"#fdf6ec",padding:"3px 9px",borderRadius:"20px",border:`1px solid ${GOLD}44`}}>{qty} in cart</span>}
          </div>
          <div className="dish-card-btn-row">
            {qty === 0
              ? <button className="add-btn" onClick={()=>addToCart(item)}>+ Add to Cart</button>
              : <>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={()=>updateQty(item.name,-1)}>−</button>
                    <span className="qty-num">{qty}</span>
                    <button className="qty-btn" onClick={()=>updateQty(item.name,1)}>+</button>
                  </div>
                  <button className="del-btn" title="Remove" onClick={()=>updateQty(item.name,-qty)}>🗑</button>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
