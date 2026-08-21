const https = require('https');

// Configurer la clé API Testnet et la clé privée Seed de l'app (S...)
const API_KEY = process.env.PI_API_KEY; 
const SEED_KEY = process.env.PI_APP_SEED; 

// Liste des 5 portefeuilles Testnet distincts (remplacez par de vrais G...)
const RECIPIENTS = [
  "GB7N2Z523E2H7U6X6J3Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R_TESTNET_1",
  "GDX3Z4Y5X6W7V8U9T0S1R2Q3P4O5N6M7L8K9J0I1H2G3F4E5D6C7B8A_TESTNET_2",
  "GC7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z_TESTNET_3",
  "GA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A_TESTNET_4",

"GB8C7B6A5F4E3D2C1B0A9Z8Y7X6W5V4U3T2S1R0Q9P8O7N6M5L4K3J_TESTNET_5",

"GDT0S1R2Q3P4O5N6M7L8K9J0I1H2G3F4E5D6C7B8A9Z8Y7X6W5V4U3_TESTNET_6",
  "GC5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L_TESTNET_7"
];

async function sendAppToUser(walletAddress) {
  const data = JSON.stringify({
    payment: {
      amount: 0.1,
      memo: "Testnet App-to-User verification",
      metadata: { type: "testnet_validation" },
      uid: "user_" + Date.now(),
      recipient: walletAddress
    }
  });

  const options = {
    hostname: 'api.minepi.com',
    path: '/v2/payments',
    method: 'POST',
    headers: {
      'Authorization': `Key ${API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  for (let i = 0; i < RECIPIENTS.length; i++) {
    console.log(`[${i+1}/5] Envoi vers ${RECIPIENTS[i]}...`);
    try {
      const res = await sendAppToUser(RECIPIENTS[i]);
      console.log(` Succès ! Payment ID:`, res.identifier || res);
    } catch (err) {
      console.error(` Échec:`, err.message);
    }
  }
}

run();

