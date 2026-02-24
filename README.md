# Student Onboarding App

AI chatbot that onboards new coding school students and emails collected data.

**Stack:** React 18 + Vite · Styled Components · Claude API (via Netlify Function) · EmailJS

---

## Project Structure

```
student-onboarding/
├── netlify.toml                  ← build + redirect config
├── netlify/
│   └── functions/
│       └── chat.js               ← serverless function (holds API key)
├── src/
│   ├── main.jsx
│   └── App.jsx                   ← all UI + EmailJS logic
├── index.html
├── vite.config.js
└── package.json
```

---

## Local Development

### 1. Install dependencies
```bash
npm install
npm install -g netlify-cli      # if not already installed
```

### 2. Add your Anthropic API key to a local env file
Create `.env` in the project root (git-ignored):
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run locally with Netlify Dev (required to use functions)
```bash
netlify dev
```
This starts Vite + the serverless function together at http://localhost:8888

> ⚠️ `npm run dev` alone won't proxy `/api/chat` — always use `netlify dev` locally.

---

## EmailJS Setup (free, ~5 min)

1. Sign up at https://www.emailjs.com
2. **Add a Service** → connect Gmail (free4m@gmail.com) → note the **Service ID**
3. **Create a Template** with this body:

```
New Student Onboarding — {{student_name}}

Name:             {{student_name}}
Email:            {{student_email}}
City:             {{city}}
Discord:          {{discord}}
Technical Skills: {{skills}}
Prior Projects:   {{projects}}
Study Goal:       {{goal}}
Level:            {{level}}
Hours/Day:        {{hours_per_day}}
```

Set **To Email** → `{{to_email}}` · Set **Reply To** → `{{student_email}}`

4. **Account → API Keys** → copy your **Public Key**

5. Open `src/App.jsx` and fill in:
```js
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'
```

---

## Deploy to Netlify

### Option A — Netlify CLI
```bash
netlify login
netlify init        # link to a new or existing site
netlify deploy --prod
```

### Option B — GitHub → Netlify UI
1. Push this repo to GitHub
2. Go to https://app.netlify.com → "Add new site" → Import from Git
3. Build command: `npm run build` · Publish directory: `dist`
4. Netlify auto-detects `netlify.toml`

### Set the API key in Netlify Dashboard
**Site → Configuration → Environment Variables → Add variable**
```
Key:   ANTHROPIC_API_KEY
Value: sk-ant-...
```
Redeploy after adding the variable. The key is never in your code or git history.

---

## How It Works

```
Student types → App.jsx
                  ↓ POST /api/chat (no key exposed)
             netlify/functions/chat.js
                  ↓ forwards with ANTHROPIC_API_KEY env var
             Anthropic API
                  ↓ AI response
             App.jsx displays message

When all 9 fields collected:
  App.jsx → EmailJS → free4m@gmail.com
```
