require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const path = require('path');

const app = express();
app.use(express.json());

// Sirve TODOS tus archivos estáticos (html, imágenes, etc.)
app.use(express.static(path.join(__dirname, '.')));

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

let suscripciones = [];

app.get('/api/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

app.post('/api/suscribir', (req, res) => {
  const sub = req.body;
  if (!sub || !sub.endpoint) return res.status(400).json({ error: 'Inválida' });
  const existe = suscripciones.find(s => s.endpoint === sub.endpoint);
  if (!existe) {
    suscripciones.push(sub);
    console.log('💖 Nueva suscripción:', sub.endpoint);
  }
  res.status(201).json({ ok: true });
});

app.post('/api/notificar', async (req, res) => {
  const {
    title = '💖 Mi princesa, hay algo nuevo para ti',
    body = 'Entra a ver la sorpresa que te dejé 🥰',
    url = './index.html',
    icon = './icons/corazon-192.png'
  } = req.body || {};

  const payload = JSON.stringify({ title, body, url, icon });

  const resultados = await Promise.allSettled(
    suscripciones.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          suscripciones = suscripciones.filter(s => s.endpoint !== sub.endpoint);
        }
        throw err;
      })
    )
  );

  res.json({
    enviadas: resultados.filter(r => r.status === 'fulfilled').length,
    fallidas: resultados.filter(r => r.status === 'rejected').length,
    total: suscripciones.length
  });
});

app.get('/api/suscripciones', (req, res) => {
  res.json({ total: suscripciones.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`💘 Servidor en http://localhost:${PORT}`);
});