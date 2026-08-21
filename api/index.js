const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PI_API_URL = 'https://api.minepi.com/v2';
const PI_API_KEY = process.env.PI_API_KEY;

// DIAGNOSTIC : Vérifier si la clé est chargée
console.log("PI_API_KEY est chargée : " + (PI_API_KEY ? "OUI" : "NON"));

app.post('/api/pi/approve', async (req, res) => {
  const { paymentId } = req.body;
  console.log("Tentative d'approbation pour :", paymentId);
  
  try {
    const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/approve`, {}, {
      headers: { 'Authorization': `Key ${PI_API_KEY}` }
    });
    console.log("Succès API Pi:", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    // Ceci va afficher l'erreur détaillée dans les logs Vercel
    const errorDetails = error.response ? error.response.data : error.message;
    console.error("ERREUR CRITIQUE API PI:", errorDetails);
    return res.status(500).json({ error: errorDetails });
  }
});

app.post('/api/pi/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  try {
    const response = await axios.post(`${PI_API_URL}/payments/${paymentId}/complete`, { txid }, {
      headers: { 'Authorization': `Key ${PI_API_KEY}` }
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("ERREUR CRITIQUE COMPLETION:", error.response ? error.response.data : error.message);
    return res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

module.exports = app;

