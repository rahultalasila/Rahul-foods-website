function Toast({toast}) {
  if(!toast) return null;
  const cls = toast.type==="error" ? "toast toast-error" : toast.type==="info" ? "toast toast-info" : "toast toast-success";
  const icon = toast.type==="error" ? "❌" : toast.type==="info" ? "ℹ️" : "✅";
  return <div className={cls} style={{pointerEvents:"none"}}>{icon} {toast.msg}</div>;
}
