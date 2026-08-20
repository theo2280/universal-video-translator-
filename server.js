const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/approve', (req, res) => {
    res.status(200).json({ success: true, message: "Approved locally" });
});

app.post('/api/complete', (req, res) => {
    res.status(200).json({ success: true, message: "Completed locally" });
});

app.listen(PORT, () => {
    console.log(`Serveur actif sur le port ${PORT}`);
});

// Auto-ping anti-mise en sommeil (toutes les 4 min)
const RENDER_URL = 'https://universal-video-translator.onrender.com';
setInterval(() => {
    axios.get(RENDER_URL)
        .then(() => console.log('Keep-alive ping réussi'))
        .catch(() => console.log('Keep-alive ping envoyé'));
}, 4 * 60 * 1000);
