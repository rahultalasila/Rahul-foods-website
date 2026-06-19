export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, message } = req.body || {};
  if (!phone || !message) return res.status(400).json({ error: "Missing phone or message" });

  const key = process.env.FAST2SMS_KEY;
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${key}&variables_values=${encodeURIComponent(message)}&route=p&numbers=${phone}`;

  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "SMS failed" });
  }
}
