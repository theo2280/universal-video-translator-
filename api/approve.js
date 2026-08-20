export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { paymentId } = req.body || {};
  console.log("Approbation Vercel pour paymentId:", paymentId);

  // Validation Pi Platform API
  const PI_API_KEY = process.env.PI_API_KEY || "";
  if (paymentId && PI_API_KEY) {
    try {
      await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Key ${PI_API_KEY}` }
      });
    } catch(e) {
      console.error("Erreur API Pi:", e);
    }
  }

  return res.status(200).json({ success: true, message: "Approved" });
}
