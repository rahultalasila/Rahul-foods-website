function sendOrderEmails(form, orderData, itemsText, total, payLabel, userEmail) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const payload = {
    service_id: "service_jpem2rb",
    user_id: "F3yhH_TVKN_Sw1io8",
    template_params: {
      customer_name: form.name,
      customer_phone: form.phone,
      customer_address: orderData.address,
      order_items: itemsText,
      order_total: `₹${Math.round(total)}`,
      payment_method: payLabel,
      order_time: now,
      customer_email: userEmail || "",
    }
  };
  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, template_id: "template_uq7eflu" })
  }).catch(() => {});
  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, template_id: "template_xn0ebyn" })
  }).catch(() => {});
}
