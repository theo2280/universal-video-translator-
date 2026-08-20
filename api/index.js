const { exec } = require('child_process');
const path = require('path');

app.post('/api/pi/complete', async (req, res) => {
  const { paymentId, txid, targetLang } = req.body;

  try {
    // 1. Validation de la transaction auprès de Pi Core Team
    const piResponse = await completePiPayment(paymentId, txid);
    if (!piResponse.ok) {
      return res.status(400).json({ error: "Paiement Pi non validé." });
    }

    // 2. Exécution du moteur de traitement gratuit local
    const inputAudio = path.join(__dirname, '../uploads/input.wav');
    const outputAudio = path.join(__dirname, '../public/output.mp3');

    exec(`python3 translator_engine.py ${inputAudio} ${targetLang} ${outputAudio}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur d'exécution IA: ${error.message}`);
        return res.status(500).json({ error: "Échec du traitement média." });
      }

      // 3. Renvoi du résultat réel au Pi Browser
      return res.status(200).json({
        success: true,
        downloadUrl: "/output.mp3",
        message: "Traduction et doublage terminés !"
      });
    });

  } catch (err) {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

