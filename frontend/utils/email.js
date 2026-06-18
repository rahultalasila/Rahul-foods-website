const FAST2SMS_KEY = "YOUR_FAST2SMS_API_KEY"; // replace after signing up at fast2sms.com

function sendOrderSMS(phone, name, total, items) {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if(cleanPhone.length !== 10) return;
  const msg = `Hi ${name}! Your Rahul Foods order has been placed. Items: ${items}. Total: Rs.${Math.round(total)}. Track at rahul-foods-website.vercel.app. Call us: 7075751105`;
  fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_KEY}&message=${encodeURIComponent(msg)}&language=english&route=q&numbers=${cleanPhone}`)
    .catch(()=>{});
}

function sendCancellationSMS(phone, name) {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if(cleanPhone.length !== 10) return;
  const msg = `Hi ${name}, your Rahul Foods order has been cancelled as per your request. We hope to serve you again soon! Call: 7075751105`;
  fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_KEY}&message=${encodeURIComponent(msg)}&language=english&route=q&numbers=${cleanPhone}`)
    .catch(()=>{});
}

function sendCancellationEmail(customerName, total, orderId) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: "service_jpem2rb",
      user_id: "F3yhH_TVKN_Sw1io8",
      template_id: "template_cancel",
      template_params: {
        customer_name: customerName || "Customer",
        order_total: `₹${Math.round(total)}`,
        cancel_time: now,
        order_id: orderId || "N/A",
      }
    })
  }).catch(() => {});
}

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
