const MAX_BODY_SIZE = 28 * 1024 * 1024;

function sendJson(res, status, payload){
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function readRawBody(req){
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if(total > MAX_BODY_SIZE){
        reject(new Error('Fichier trop lourd pour cette fonction. Coupe le fichier ou utilise un audio plus court.'));
        req.destroy();
        return;
      }
      chunks.push(Buffer.from(chunk));
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res){
  if(req.method === 'OPTIONS'){
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  if(req.method !== 'POST'){
    sendJson(res, 405, { error: 'Méthode non autorisée. Utilise POST.' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if(!apiKey){
    sendJson(res, 500, { error: 'Configuration manquante : ajoute GROQ_API_KEY dans Vercel, puis redéploie.' });
    return;
  }

  const contentType = req.headers['content-type'] || '';
  if(!contentType.includes('multipart/form-data')){
    sendJson(res, 400, { error: 'Format invalide : envoie un formulaire multipart avec le fichier audio.' });
    return;
  }

  try{
    const body = await readRawBody(req);
    const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': contentType
      },
      body
    });

    const text = await groqRes.text();
    if(!groqRes.ok){
      sendJson(res, groqRes.status, { error: 'Erreur Groq transcription', detail: text.slice(0, 2000) });
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(text);
  }catch(error){
    sendJson(res, 500, { error: error.message || 'Erreur serveur pendant la transcription.' });
  }
};
