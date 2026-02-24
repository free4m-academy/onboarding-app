// Netlify serverless function — uses Groq API (genuinely free, no credit card)
// Sign up at: https://console.groq.com
// Get your key at: https://console.groq.com/keys

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const GROQ = process.env.GROQ;
  if (!GROQ) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const messages = [
    { role: 'system', content: body.system },
    ...(body.messages || []),
  ]

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      statusCode: res.status,
      body: JSON.stringify({ error: data.error?.message || 'Groq API error' }),
    }
  }

  const text = data.choices?.[0]?.message?.content
  if (!text) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Empty response from Groq' }) }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }
}