export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { paymentId } = req.body || {};
  const PI_API_KEY = process.env.PI_API_KEY || "";

  if (paymentId && PI_API_KEY) {
    try {
      await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Key ${PI_API_KEY}` }
      });
    } catch(err) {
      console.error("Approve error:", err);
    }
  }

  return res.status(200).json({ success: true, paymentId });
}
