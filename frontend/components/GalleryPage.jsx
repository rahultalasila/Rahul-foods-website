function GalleryPage() {
  const photos = [
    { id:"photo-1414235077428-338989a2e8c0", caption:"Private Dining Room",  tall:true  },
    { id:"photo-1559339352-11d035aa65de",    caption:"Lobster Thermidor",     tall:false },
    { id:"photo-1544025162-d76538645703",    caption:"Rack of Lamb",          tall:false },
    { id:"photo-1578985545062-69928b1d9587", caption:"Chocolate Fondant",     tall:false },
    { id:"photo-1551218808-94e220e084d2",    caption:"Our Open Kitchen",      tall:true  },
    { id:"photo-1504674900247-0877df9cc836", caption:"Chef's Table Spread",   tall:false },
    { id:"photo-1530554764233-e79e16c91d08", caption:"The Main Dining Hall",  tall:false },
    { id:"photo-1424847651672-bf20a4b0982b", caption:"The Bar Lounge",        tall:false },
    { id:"photo-1466978913421-dad2ebd01d17", caption:"Evening Ambiance",      tall:false },
    { id:"photo-1558030006-450675393462",    caption:"Tenderloin Steak",      tall:false },
    { id:"photo-1432139555190-58524dae6a55", caption:"Signature Cocktails",   tall:false },
    { id:"photo-1484980972926-edee96e0960d", caption:"Weekend Brunch",        tall:false },
  ];
  return (
    <div style={{paddingTop:"80px",minHeight:"100vh"}}>
      <PageBanner tag="OUR SPACE & FOOD" title="Gallery" />
      <section style={{padding:"70px 60px 90px",background:"#f9f8f5"}}>
        <p style={{textAlign:"center",color:"#aaa",fontFamily:"sans-serif",fontSize:"13px",marginBottom:"52px",fontStyle:"italic"}}>A glimpse into the Rahul Foods experience</p>
        <div className="gallery-grid">
          {photos.map((p,i)=>(
            <div key={i} className={`gallery-item${p.tall?" tall":""}`} style={{animationDelay:`${i*0.05}s`}}>
              <SmartImg src={`https://images.unsplash.com/${p.id}?auto=format&fit=crop&w=700&q=80`} alt={p.caption}
                imgStyle={{width:"100%",height:p.tall?"380px":"260px",objectFit:"cover",display:"block"}} />
              <div className="gallery-overlay">
                <span className="gallery-caption">{p.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
