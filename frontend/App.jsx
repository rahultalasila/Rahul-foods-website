function RahulFoods() {
  const [page,setPage]          = useState("home");
  const [scrolled,setScrolled]  = useState(false);
  const [cart,setCart]          = useState({});
  const [toast,setToast]        = useState(null);
  const [modalDish,setModalDish]= useState(null);
  const [user,setUser]          = useState(null);
  const [authMode,setAuthMode]  = useState(null);
  const [darkMode,setDarkMode]  = useState(false);
  const toastTimer = useRef(null);

  useEffect(()=>{
    const theme = localStorage.getItem("rf_theme");
    if(theme==="dark") setDarkMode(true);

    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user) setUser({ id:session.user.id, name: session.user.user_metadata?.name || session.user.email.split("@")[0], email: session.user.email });
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session)=>{
      if(session?.user) setUser({ id:session.user.id, name: session.user.user_metadata?.name || session.user.email.split("@")[0], email: session.user.email });
      else setUser(null);
    });
    return ()=>listener.subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    const root = document.getElementById("root");
    root.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("rf_theme", darkMode?"dark":"light");
  },[darkMode]);

  const handleAuth = () => { setAuthMode(null); showToast(`Welcome!`); };
  const handleLogout = async () => { await supabase.auth.signOut(); showToast("Signed out", "info"); };

  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>60);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  useEffect(()=>{window.scrollTo({top:0});setScrolled(false);},[page]);

  const showToast = (msg, type="success") => {
    clearTimeout(toastTimer.current);
    setToast({msg,type});
    toastTimer.current = setTimeout(()=>setToast(null), 2800);
  };

  const addToCart = item => {
    setCart(c=>({...c,[item.name]:c[item.name]?{...c[item.name],qty:c[item.name].qty+1}:{item,qty:1}}));
    showToast(`${item.name.length>30?item.name.slice(0,28)+"…":item.name} added to cart!`);
  };

  const updateQty = (name, delta) => setCart(c=>{
    if(!c[name]) return c;
    const nq=c[name].qty+delta;
    if(nq<=0){const n={...c};delete n[name];return n;}
    return {...c,[name]:{...c[name],qty:nq}};
  });

  const clearCart = () => setCart({});

  const recordOrder = async (orderDetails) => {
    const count = (parseInt(localStorage.getItem("rf_orderCount"))||0) + 1;
    localStorage.setItem("rf_orderCount", count);
    if(!user) return null;
    const {data} = await supabase.from("orders").insert({
      user_id: user.id,
      items: orderDetails.items,
      total: orderDetails.total,
      pay_label: orderDetails.payLabel,
      address: orderDetails.address,
      status: "placed",
    }).select("id").single();
    if(data?.id) localStorage.setItem("rf_activeOrderId", data.id);
    return data?.id || null;
  };

  const cartCount = Object.values(cart).reduce((s,{qty})=>s+qty,0);

  return (
    <div>
      <Navbar page={page} setPage={setPage} scrolled={scrolled} cartCount={cartCount} user={user} onOpenAuth={setAuthMode} onLogout={handleLogout} />
      <div key={page} className="page-animate">
        {page==="home"    && <HomePage    setPage={setPage} cart={cart} addToCart={addToCart} updateQty={updateQty} onOpenModal={setModalDish} user={user} />}
        {page==="menu"    && <MenuPage    setPage={setPage} cart={cart} addToCart={addToCart} updateQty={updateQty} onOpenModal={setModalDish} />}
        {page==="cart"    && <CartPage    setPage={setPage} cart={cart} updateQty={updateQty} showToast={showToast} clearCart={clearCart} onOrderPlaced={recordOrder} user={user} />}
        {page==="gallery" && <GalleryPage />}
        {page==="about"   && <AboutPage />}
        {page==="contact" && <ContactPage setPage={setPage} />}
        {page==="reserve" && <ReservePage setPage={setPage} />}
        {page==="orders"  && <MyOrdersPage user={user} setPage={setPage} />}
        {page==="admin"   && <AdminPage user={user} setPage={setPage} />}
        {page==="offers"  && <OffersPage setPage={setPage} />}
        {page==="reviews" && <ReviewsPage setPage={setPage} />}
      </div>
      <Footer setPage={setPage} />

      <Toast toast={toast} />

      {modalDish && <DishModal dish={modalDish} cart={cart} addToCart={addToCart} updateQty={updateQty} onClose={()=>setModalDish(null)} user={user} />}

      {authMode && <AuthModal mode={authMode} setMode={setAuthMode} onClose={()=>setAuthMode(null)} onAuth={handleAuth} />}

      {page!=="reserve" && page!=="cart" && (
        <div className="sticky-reserve">
          <span style={{color:"#fff",fontFamily:"sans-serif",fontSize:"13px"}}>🍽️ Book your table now</span>
          <button onClick={()=>setPage("reserve")} style={{padding:"10px 22px",background:GOLD,color:"#fff",border:"none",letterSpacing:"2px",fontSize:"10px",fontFamily:"sans-serif",fontWeight:"700",textTransform:"uppercase",borderRadius:"3px"}}>Reserve</button>
        </div>
      )}

      <button className="theme-toggle" onClick={()=>setDarkMode(d=>!d)} title="Toggle dark mode" aria-label="Toggle dark mode">
        {darkMode ? "☀️" : "🌙"}
      </button>

      <a href="https://wa.me/917075751105?text=Hello%21+I%27d+like+to+know+more+about+Rahul+Foods." target="_blank" rel="noopener noreferrer" className="whatsapp-btn" title="Chat with us on WhatsApp" aria-label="Chat with us on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L0 24l6.335-1.506A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.732.888.936-3.637-.235-.375A9.818 9.818 0 1112 21.818z"/>
        </svg>
      </a>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<RahulFoods />);
