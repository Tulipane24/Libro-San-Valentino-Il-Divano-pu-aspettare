// Funzione serverless Vercel: è il "cancello" del bonus.
// Il link del bonus vive SOLO nella variabile d'ambiente BONUS_DRIVE_URL (o BONUS_URL)
// e viene restituito al browser solo dopo che il Google Sheet ha confermato il salvataggio.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, '').trim().slice(0, max);

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Metodo non consentito.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // Honeypot: un bot che compila il campo nascosto riceve un errore generico e non viene salvato.
  if (clean(body.sito, 200) !== '') {
    return res.status(400).json({ ok: false, error: 'Richiesta non valida.' });
  }

  const nome = clean(body.nome, 60);
  const cognome = clean(body.cognome, 60);
  const email = clean(body.email, 120).toLowerCase();
  if (!nome || !cognome) return res.status(400).json({ ok: false, error: 'Scrivi nome e cognome.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: "Controlla l'indirizzo email." });

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  const bonusUrl = process.env.BONUS_DRIVE_URL || process.env.BONUS_URL;
  const libro = process.env.BOOK_TITLE || 'Il Divano Può Aspettare';
  if (!scriptUrl || !secret || !bonusUrl) {
    console.error('Variabili mancanti:', { GOOGLE_SCRIPT_URL: !!scriptUrl, APPS_SCRIPT_SECRET: !!secret, BONUS_URL: !!bonusUrl });
    return res.status(500).json({ ok: false, error: 'Servizio non configurato. Riprova più tardi.' });
  }

  try {
    const r = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ nome, cognome, email, libro, timestamp: new Date().toISOString(), secret }),
      redirect: 'follow',
    });
    const text = await r.text();
    let data = null;
    try { data = JSON.parse(text); } catch (e) { data = null; }
    if (!r.ok || !data || data.ok !== true) {
      console.error('Salvataggio non riuscito:', r.status, text.slice(0, 300));
      return res.status(502).json({ ok: false, error: 'Non siamo riusciti a salvare i dati. Riprova tra un momento.' });
    }
    return res.status(200).json({ ok: true, bonusUrl });
  } catch (e) {
    console.error('Errore di rete verso Google:', e && e.message);
    return res.status(502).json({ ok: false, error: 'Non siamo riusciti a salvare i dati. Riprova tra un momento.' });
  }
}

module.exports = handler;
