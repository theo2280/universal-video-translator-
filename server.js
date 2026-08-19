const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS globale sans restriction
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Route Health Check pour vérifier que Render répond
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Render opérationnel' });
});

// Routes API des fonctionnalités
app.post('/api/translate', (req, res) => {
  const { targetLang } = req.body || {};
  res.json({ 
    result: `[IA Agent] Traduction générée avec succès pour la langue : ${targetLang || 'fr'}.` 
  });
});

app.post('/api/dubbing', (req, res) => {
  const { targetLang } = req.body || {};
  res.json({ 
    result: `[Doublage Vocal] Audio généré avec succès en langue : ${targetLang || 'fr'}.` 
  });
});

app.post('/api/subtitles', (req, res) => {
  const { targetLang } = req.body || {};
  res.json({ 
    result: `[Sous-titres] Fichier VTT généré en : ${targetLang || 'fr'}.\n1\n00:00:00,000 --> 00:00:03,000\nSous-titres générés via Universal Video Translator.` 
  });
});

// Enpoints de paiement Pi Network
app.post('/api/pi/approve', (req, res) => {
  const { paymentId } = req.body || {};
  console.log("Approbation Pi Payment ID:", paymentId);
  res.json({ approved: true, paymentId });
});

app.post('/api/pi/complete', (req, res) => {
  const { paymentId, txid } = req.body || {};
  console.log("Finalisation Pi Payment ID:", paymentId, "TxID:", txid);
  res.json({ completed: true, txid });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
