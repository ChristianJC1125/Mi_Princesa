require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const path = require('path');
const fs = require('fs'); // 👈 Herramienta para guardar archivos

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Archivo donde se guardarán las suscripciones
const DB_FILE = path.join(__dirname, 'suscripciones.json');

// Función para leer las suscripciones guardadas
function leerSuscripciones() {
  if (!fs.existsSync(DB_FILE)) return [];
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data || '[]');
}

// Función para guardar las suscripciones
function guardarSuscripciones(subs) {
  fs.writeFileSync(DB_FILE, JSON.stringify(subs, null, 2));
}

app.get('/api/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

app.post('/api/suscribir', (req, res) => {
  const sub = req.body;
  if (!sub || !sub.endpoint) return res.status(400).json({ error: 'Inválida' });
  
  let suscripciones = leerSuscripciones();
  const existe = suscripciones.find(s => s.endpoint === sub.endpoint);
  
  if (!existe) {
    suscripciones.push(sub);
    guardarSuscripciones(suscripciones); // 👈 Guarda en el archivo
    console.log('💖 Nueva suscripción guardada. Total:', suscripciones.length);
  } else {
    console.log('✅ Suscripción ya existía.');
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
  let suscripciones = leerSuscripciones();

  if (suscripciones.length === 0) {
    return res.json({ mensaje: 'No hay dispositivos suscritos aún.' });
  }

  const resultados = await Promise.allSettled(
    suscripciones.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => {
        // Si el celular ya no existe o borró la página, lo eliminamos de la lista
        if (err.statusCode === 410 || err.statusCode === 404) {
          suscripciones = suscripciones.filter(s => s.endpoint !== sub.endpoint);
          guardarSuscripciones(suscripciones);
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
  res.json({ total: leerSuscripciones().length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`💘 Servidor en http://localhost:${PORT}`);
});