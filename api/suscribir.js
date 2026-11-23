import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Suscripción inválida' });
  }

  try {
    // Guardamos la suscripción en la base de datos KV usando el endpoint como clave única
    await kv.set(`sub:${subscription.endpoint}`, subscription);
    return res.status(201).json({ ok: true, mensaje: 'Suscripción guardada' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al guardar la suscripción' });
  }
}