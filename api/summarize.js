const SUMMARY_MODELS = [
  'openai/gpt-oss-20b',
  'llama-3.1-8b-instant'
];

function sendJson(res, status, payload){
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function readJsonBody(req){
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if(total > 1024 * 1024){
        reject(new Error('Transcription trop longue pour le résumé. Coupe le texte en deux parties.'));
        req.destroy();
        return;
      }
      chunks.push(Buffer.from(chunk));
    });
    req.on('end', () => {
      try{
        const raw = Buffer.concat(chunks).toString('utf8') || '{}';
        resolve(JSON.parse(raw));
      }catch(error){
        reject(new Error('JSON invalide.'));
      }
    });
    req.on('error', reject);
  });
}

function summaryPrompt(){
  return `Tu aides à retenir l'essentiel d'un cours (danse, musique, langue, travail, réunion, etc.) à partir d'une transcription brute, en français.

Ta réponse doit suivre EXACTEMENT cette structure en texte brut, sans markdown :

RÉSUMÉ
3 à 5 phrases précises sur ce qui a été concrètement expliqué. Reste fidèle au contenu.

POINTS CLÉS
- Un point concret par ligne.
- Mentionne les consignes, corrections, idées importantes ou décisions entendues.
- N'invente rien si la transcription ne le dit pas.

À RETENIR / À FAIRE
1 à 3 actions simples ou éléments à revoir.

Si la transcription est trop courte, confuse ou incomplète, dis-le clairement au lieu de compléter avec des suppositions.`;
}

function extractGroqMessage(raw){
  try{
    const data = JSON.parse(raw);
    return data?.error?.message || data?.message || raw;
  }catch(e){
    return raw;
  }
}

async function summarizeWithGroq(apiKey, transcript){
  const errors = [];
  const cleanTranscript = transcript.slice(0, 18000);

  for(const model of SUMMARY_MODELS){
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: summaryPrompt() },
          { role: 'user', content: cleanTranscript }
        ],
        temperature: 0.2,
        max_tokens: 900
      })
    });

    const raw = await groqRes.text();
    if(groqRes.ok){
      let data;
      try{ data = JSON.parse(raw); }catch(error){ data = null; }
      const content = data?.choices?.[0]?.message?.content?.trim();
      if(content) return { content, model };
      errors.push(`${model}: réponse vide`);
      continue;
    }

    const message = extractGroqMessage(raw).slice(0, 320);
    errors.push(`${model}: HTTP ${groqRes.status} — ${message}`);

    // Clé invalide/interdite : inutile d'essayer un autre modèle.
    if(groqRes.status === 401 || groqRes.status === 403){
      break;
    }
  }

  throw new Error(errors.join(' | '));
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
    sendJson(res, 500, { error: 'Configuration manquante : ajoute GROQ_API_KEY dans Vercel en Production, puis redéploie.' });
    return;
  }

  try{
    const body = await readJsonBody(req);
    const transcript = String(body.transcript || '').trim();
    if(!transcript){
      sendJson(res, 400, { error: 'Transcription vide.' });
      return;
    }
    const result = await summarizeWithGroq(apiKey, transcript);
    sendJson(res, 200, result);
  }catch(error){
    sendJson(res, 500, { error: error.message || 'Erreur serveur pendant le résumé.' });
  }
};
