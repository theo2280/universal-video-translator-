const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const PI_API_URL = 'https://api.minepi.com/v2';
const PI_API_KEY = process.env.PI_API_KEY;

// Route 1 : Approbation instantanée du paiement
app.post('/api/pi/approve', async (req, res) => {
  const { paymentId } = req.body;
  try {
    const response = await axios.post(
      `${PI_API_URL}/payments/${paymentId}/approve`,
      {},
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Erreur approval:", error.response?.data || error.message);
    return res.status(500).json({ error: "Échec d'approbation" });
  }
});

// Route 2 : Validation finale du paiement
app.post('/api/pi/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  try {
    const response = await axios.post(
      `${PI_API_URL}/payments/${paymentId}/complete`,
      { txid },
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Erreur completion:", error.response?.data || error.message);
    return res.status(500).json({ error: "Échec de complétion" });
  }
});

module.exports = app;

