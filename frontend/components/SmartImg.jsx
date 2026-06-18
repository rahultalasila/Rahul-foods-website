function SmartImg({src, alt, style, imgStyle, onClick}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{position:"relative",overflow:"hidden",...style}} onClick={onClick}>
      {!loaded && <div className="img-skeleton" />}
      <img src={src} alt={alt} loading="lazy" onLoad={()=>setLoaded(true)}
        onError={e=>{e.target.src=FALLBACK;setLoaded(true);}}
        style={{...imgStyle, opacity:loaded?1:0, transition:"opacity 0.35s ease"}} />
    </div>
  );
}
