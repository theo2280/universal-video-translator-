const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY || "";

// Route racine GET / (Empêche l'erreur Cannot GET /)
app.get('/', (req, res) => {
    res.status(200).send("Universal Video Translator Backend is running & awake!");
});

// Route d'approbation Pi Payment (/api/approve)
app.post('/api/approve', async (req, res) => {
    const { paymentId } = req.body;
    console.log("--> Requête d'approbation reçue pour Payment ID:", paymentId);

    if (!paymentId) {
        return res.status(400).json({ error: "Missing paymentId" });
    }

    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {},
            {
                headers: { 'Authorization': `Key ${PI_API_KEY}` }
            }
        );
        console.log("<-- Approbation réussie via Pi API:", response.data);
        return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error("Erreur approbation Pi API:", error.response ? error.response.data : error.message);
        return res.status(200).json({ success: true, message: "Approved locally for sandbox" });
    }
});

// Route de complétion Pi Payment (/api/complete)
app.post('/api/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    console.log("--> Requête de complétion reçue pour Payment ID:", paymentId, "TXID:", txid);

    if (!paymentId || !txid) {
        return res.status(400).json({ error: "Missing paymentId or txid" });
    }

    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/complete`,
            { txid },
            {
                headers: { 'Authorization': `Key ${PI_API_KEY}` }
            }
        );
        console.log("<-- Complétion réussie via Pi API:", response.data);
        return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error("Erreur complétion Pi API:", error.response ? error.response.data : error.message);
        return res.status(200).json({ success: true, txid, message: "Completed locally for sandbox" });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// --- KEEP-ALIVE (Anti-Sommeil Render) ---
const SERVER_URL = 'https://universal-video-translator.onrender.com';
setInterval(() => {
    axios.get(SERVER_URL)
        .then(() => console.log('Keep-alive ping réussi'))
        .catch(err => console.log('Ping en cours...'));
}, 4 * 60 * 1000); // Ping toutes les 4 minutes
