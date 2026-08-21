const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PI_API_URL = 'https://api.minepi.com/v2';
const PI_API_KEY = process.env.PI_API_KEY;

app.post('/api/pi/approve', async (req, res) => {
  const { paymentId } = req.body;
  try {
    const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/approve`, {}, {
      headers: { 'Authorization': `Key ${PI_API_KEY}` }
    });
    console.log("Succès API Pi:", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    // CECI EST LA LIGNE IMPORTANTE : Elle va écrire l'erreur réelle dans vos logs Vercel
    console.error("ERREUR API PI DETAIL:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.post('/api/pi/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  try {
    const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/complete`, { txid }, {
      headers: { 'Authorization': `Key ${PI_API_KEY}` }
    });
    console.log("Succès Complétion:", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("ERREUR API COMPLETION DETAIL:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = app;

