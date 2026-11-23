import { kv } from '@vercel/kv';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    // Buscamos TODAS las suscripciones guardadas en la base de datos
    const keys = await kv.keys('sub:*');
    if (keys.length === 0) {
      return res.json({ mensaje: 'No hay dispositivos suscritos.' });
    }

    const subscriptions = await Promise.all(keys.map(key => kv.get(key)));
    const payload = JSON.stringify({
      title: req.body.title || '💖 Mi princesa, hay algo nuevo',
      body: req.body.body || 'Entra a ver la sorpresa 🥰',
      url: '/'
    });

    const results = await Promise.allSettled(
      subscriptions.map(sub => 
        webpush.sendNotification(sub, payload).catch(async (err) => {
          // Si la suscripción ya no es válida, la borramos
          if (err.statusCode === 410 || err.statusCode === 404) {
            await kv.del(`sub:${sub.endpoint}`);
          }
          throw err;
        })
      )
    );

    return res.json({
      enviadas: results.filter(r => r.status === 'fulfilled').length,
      fallidas: results.filter(r => r.status === 'rejected').length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al enviar notificaciones' });
  }
}