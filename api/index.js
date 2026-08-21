const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PI_API_URL = 'https://api.minepi.com/v2';
const PI_API_KEY = process.env.PI_API_KEY;

app.post('/api/pi/approve', async (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) {
    return res.status(400).json({ error: "paymentId requis" });
  }

  try {
    const response = await axios.post(
      `${PI_API_URL}/payments/${paymentId}/approve`,
      {},
      { headers: { 'Authorization': `Key ${PI_API_KEY}` } }
    );
    // Le SDK Pi requiert directement les données renvoyées par l'API Pi
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Erreur Approval Pi:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.post('/api/pi/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) {
    return res.status(400).json({ error: "paymentId et txid requis" });
  }

  try {
    const response = await axios.post(
      `${PI_API_URL}/payments/${paymentId}/complete`,
      { txid },
      { headers: { 'Authorization': `Key ${PI_API_KEY}` } }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Erreur Completion Pi:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = app;

