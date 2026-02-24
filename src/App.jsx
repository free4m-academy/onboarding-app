import React, { useState, useRef, useEffect } from 'react'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import emailjs from '@emailjs/browser'

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE  = 'service_tebuol7';
const EMAILJS_TEMPLATE = 'template_zul43jb';
const EMAILJS_PUBLIC  = 'A54zutvmcdJmWIihh';
const RECIPIENT_EMAIL     = 'free4m@gmail.com';

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a warm, encouraging onboarding assistant for a coding school.
Your job is to have a natural, friendly conversation with a new student, while using minimal amount of sentences to collect information and assess them.
Each of assistant prompts to the student should be no more than one paragraph long consisting of no more than 100 words.

PHASE 1 — COLLECT BASIC INFO (ask 1-2 questions at a time):
1. email – their email address
2. name – their full name
3. city – their current city
4. discord – their Discord username
5. skills – current technical skills (can be "none")
6. projects – prior projects (can be "none")
7. goal – their study goal
8. level – self-assessed level: must be exactly one of: Beginner, Intermediate, or Expert
9. hoursPerDay – hours per day willing to study (must be a number)

PHASE 2 — ASSESS DETERMINATION AND EXPERIENCE:
Ask 1-2 questions to genuinely understand how serious and motivated they are.
Example themes: why coding specifically, what sacrifices they're willing to make, 
what happens in their life if they succeed. Be compassionate, not interrogating.

PHASE 3 — LOGIC ASSESSMENT:
Ask 5 logic IQ questions in sequence, keep questions short and no more than 20 words long.
Do not ask questions that require full grasp of the English language.
Ask math, logic, or visual pattern questions only.
Use number sequences, visual patterns described in text, or simple spatial reasoning.
Keep question language simple, but range logic in the questions from easy to complex.
Note their answers and reasoning.
Example types:
"What comes next: 2, 4, 8, 16, ?" or
"▲ ■ ▲ ■ ▲ – What comes next?" or
"4 : 16
5 : 25
6 : ?"
These are just examples, use other types of logic questions that are not language-based.

RULES:
- Flow naturally — don't make it feel like a form. Except in the logic question section. 
– In the logic questions section ask logic question only, do not engage in conversation in that section. Prepare student for logic section by announcing that.
- Be warm, human, and encouraging throughout, but keep answers simple and not too wordy.
- After all 5 logic questions are answered, wrap up warmly.
- Then invite the student to book their onboarding call with a mentor as the next step.
- Be warm and encouraging.
- Explain the value of booking a human call - students will receive expert mentor guidance and study curriculum in the mentor call.
– Explain that the mentor onboarding call opens up student's access to ongoing platform projects, which will offer real world experience that student can use on their resumes.
- Share this exact link: https://cal.com/free4m-academy/onboarding-interview-student-standard
- After presenting the booking link, output ONLY the following JSON block with nothing after it:

<COLLECTED>
{
  "email": "...",
  "name": "...",
  "city": "...",
  "discord": "...",
  "skills": "...",
  "projects": "...",
  "goal": "...",
  "level": "...",
  "hoursPerDay": ...,
  "determinationSummary": "2-3 sentences summarizing the student's expressed motivation and seriousness",
  "logicQ1": "first logic question asked",
  "logicA1": "student's answer to question 1",
  "logicQ2": "second logic question asked",
  "logicA2": "student's answer to question 2",
  "logicQ3": "third logic question asked",
  "logicA3": "student's answer to question 3",
  "logicQ4": "fourth logic question asked",
  "logicA4": "student's answer to question 4",
  "logicQ5": "fifth logic question asked",
  "logicA5": "student's answer to question 5",
  "logicAssessment": "2-3 sentences assessing their logical aptitude and problem-solving approach based on all 5 answers",
  "conversationSynopsis": "1-3 paragraphs summarizing the full onboarding conversation naturally, as if briefing a teacher about this student",
  "studentAssessment": "1-2 paragraphs assessing the student's overall seriousness, enthusiasm, readiness to learn coding, and predicted likelihood of success"
}
</COLLECTED>

- Do NOT output the JSON block until ALL phases are complete.
- Start by warmly greeting the student and asking for their name and email.`

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #111111;
    color: #ececec;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    height: 100vh;
    overflow: hidden;
  }
  #root { height: 100vh; display: flex; flex-direction: column; }
`

// ─── ANIMATIONS ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`
const blink = keyframes`
  0%, 100% { opacity: 1; } 50% { opacity: 0; }
`

// ─── SVG BACKGROUND ───────────────────────────────────────────────────────────
// Vector background: dark grey/black base with pink and teal streak accents
const SvgBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  svg {
    width: 100%;
    height: 100%;
  }
`

function Background() {
  return (
      <SvgBackground>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bg" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#1e1e1e"/>
              <stop offset="100%" stopColor="#0a0a0a"/>
            </radialGradient>
            {/* Pink glow top-right */}
            <radialGradient id="pink1" cx="85%" cy="10%" r="40%">
              <stop offset="0%" stopColor="#ff2d7a" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#ff2d7a" stopOpacity="0"/>
            </radialGradient>
            {/* Teal glow bottom-left */}
            <radialGradient id="teal1" cx="10%" cy="90%" r="40%">
              <stop offset="0%" stopColor="#00e5c0" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#00e5c0" stopOpacity="0"/>
            </radialGradient>
            {/* Subtle pink glow bottom-right */}
            <radialGradient id="pink2" cx="90%" cy="95%" r="30%">
              <stop offset="0%" stopColor="#ff2d7a" stopOpacity="0.10"/>
              <stop offset="100%" stopColor="#ff2d7a" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Base */}
          <rect width="1440" height="900" fill="url(#bg)"/>

          {/* Glow blobs */}
          <rect width="1440" height="900" fill="url(#pink1)"/>
          <rect width="1440" height="900" fill="url(#teal1)"/>
          <rect width="1440" height="900" fill="url(#pink2)"/>

          {/* Pink streaks */}
          <line x1="1100" y1="0" x2="750" y2="900" stroke="#ff2d7a" strokeWidth="1.2" strokeOpacity="0.25"/>
          <line x1="1180" y1="0" x2="900" y2="900" stroke="#ff2d7a" strokeWidth="0.6" strokeOpacity="0.13"/>
          <line x1="1300" y1="0" x2="1050" y2="900" stroke="#ff2d7a" strokeWidth="0.4" strokeOpacity="0.08"/>

          {/* Teal streaks */}
          <line x1="200" y1="900" x2="550" y2="0" stroke="#00e5c0" strokeWidth="1.0" strokeOpacity="0.20"/>
          <line x1="80"  y1="900" x2="380" y2="0" stroke="#00e5c0" strokeWidth="0.5" strokeOpacity="0.10"/>

          {/* Fine grid overlay for depth */}
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeWidth="0.15" strokeOpacity="0.04"/>
          </pattern>
          <rect width="1440" height="900" fill="url(#grid)"/>
        </svg>
      </SvgBackground>
  )
}

// ─── STYLED COMPONENTS ────────────────────────────────────────────────────────
const Layout = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
`
const Header = styled.header`
  padding: 12px 24px;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  background: rgba(10,10,10,0.6);
  backdrop-filter: blur(8px);
`
const LogoImg = styled.img`
  height: 36px;
  width: auto;
  display: block;
  object-fit: contain;
`
const HeaderTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #ececec;
`
const HeaderSub = styled.span`
  font-size: 13px;
  color: #666;
  margin-left: auto;
`
const MessagesArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 24px 24px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  scroll-behavior: smooth;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
`
const MessageRow = styled.div`
  display: flex;
  justify-content: ${p => p.$role === 'user' ? 'flex-end' : 'flex-start'};
  animation: ${fadeUp} 0.25s ease;
  margin-bottom: 12px;
`
const BubbleWrapper = styled.div`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: ${p => p.$role === 'user'
    ? '18px 18px 4px 18px'
    : '18px 18px 18px 4px'};
  background: ${p => p.$role === 'user' ? '#ececec' : '#2a2a2a'};
  color: ${p => p.$role === 'user' ? '#1a1a1a' : '#ececec'};
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  a {
    color: #00e5c0;
    text-decoration: underline;
    &:hover { color: #ff2d7a; }
  }
`

// Renders message text with URLs converted to clickable links
function Bubble({ $role, children }) {
  const parts = String(children).split(/(https?:\/\/[^\s]+)/g)
  return (
      <BubbleWrapper $role={$role}>
        {parts.map((part, i) =>
            /^https?:\/\//.test(part)
                ? <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
                : part
        )}
      </BubbleWrapper>
  )
}
const TypingDot = styled.span`
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #666;
  margin: 0 2px;
  animation: ${blink} 1.2s infinite;
  animation-delay: ${p => p.$i * 0.2}s;
`
const TypingIndicator = styled(BubbleWrapper)`
  display: flex; align-items: center; gap: 2px;
  padding: 12px 16px;
`
const InputArea = styled.form`
  padding: 16px 24px 20px;
  border-top: 1px solid #2a2a2a;
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  background: rgba(10,10,10,0.6);
  backdrop-filter: blur(8px);
`
const TextInput = styled.textarea`
  flex: 1;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
  color: #ececec;
  font-size: 14px;
  font-family: inherit;
  padding: 10px 14px;
  resize: none;
  outline: none;
  min-height: 44px;
  max-height: 120px;
  line-height: 1.5;
  transition: border-color 0.15s;
  &::placeholder { color: #555; }
  &:focus { border-color: #555; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`
const SendBtn = styled.button`
  background: tomato;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  width: 44px; height: 44px;
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, transform 0.1s;
  align-self: flex-end;
  &:hover:not(:disabled) { background: #e0392d; }
  &:active:not(:disabled) { transform: scale(0.95); }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`
const StatusBanner = styled.div`
  margin: 0 24px 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${p => p.$ok ? '#1a3a1a' : '#3a1a1a'};
  color: ${p => p.$ok ? '#6fcf6f' : '#cf6f6f'};
  font-size: 13px;
  animation: ${fadeUp} 0.3s ease;
`

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function parseCollected(text) {
  const match = text.match(/<COLLECTED>([\s\S]*?)<\/COLLECTED>/)
  if (!match) return null
  try { return JSON.parse(match[1].trim()) } catch { return null }
}

function stripCollected(text) {
  return text.replace(/<COLLECTED>[\s\S]*?<\/COLLECTED>/, '').trim()
}

async function callClaude(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: SYSTEM_PROMPT, messages }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  const data = await res.json()
  return data.text
}

async function sendEmail(data) {
  await emailjs.send(
      EMAILJS_SERVICE,
      EMAILJS_TEMPLATE,
      {
        to_email:              RECIPIENT_EMAIL,
        student_email:         data.email,
        student_name:          data.name,
        city:                  data.city,
        discord:               data.discord,
        skills:                data.skills,
        projects:              data.projects,
        goal:                  data.goal,
        level:                 data.level,
        hours_per_day:         data.hoursPerDay,
        determination_summary: data.determinationSummary,
        logic_q1:              data.logicQ1,
        logic_a1:              data.logicA1,
        logic_q2:              data.logicQ2,
        logic_a2:              data.logicA2,
        logic_q3:              data.logicQ3,
        logic_a3:              data.logicA3,
        logic_q4:              data.logicQ4,
        logic_a4:              data.logicA4,
        logic_q5:              data.logicQ5,
        logic_a5:              data.logicA5,
        logic_assessment:      data.logicAssessment,
        conversation_synopsis: data.conversationSynopsis,
        student_assessment:    data.studentAssessment,
      },
      EMAILJS_PUBLIC
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [status, setStatus]     = useState(null)
  const [done, setDone]         = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { startConversation() }, [])
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function startConversation() {
    setLoading(true)
    try {
      const reply = await callClaude([])
      setMessages([{ role: 'assistant', content: reply }])
    } catch (e) {
      setStatus({ ok: false, text: `Could not reach server: ${e.message}` })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading || done) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStatus(null)

    try {
      const aiText      = await callClaude(newMessages)
      const collected   = parseCollected(aiText)
      const displayText = stripCollected(aiText)

      setMessages(prev => [...prev, { role: 'assistant', content: displayText }])

      if (collected) {
        setDone(true)
        try {
          await sendEmail(collected)
          setStatus({ ok: true, text: `✓ Onboarding complete! Data sent to ${RECIPIENT_EMAIL}` })
        } catch {
          setStatus({ ok: false, text: 'Onboarding complete, but email failed. Check your EmailJS config.' })
        }
      }
    } catch (e) {
      setStatus({ ok: false, text: `Error: ${e.message}` })
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
      <>
        <GlobalStyle />
        <Background />
        <Layout>
          <Header>
            <LogoImg src="/logo.png" alt="free4m Academy" />
            <HeaderTitle>free4m Academy</HeaderTitle>
            <HeaderSub>Student Onboarding</HeaderSub>
          </Header>

          <MessagesArea>
            {messages.map((m, i) => (
                <MessageRow key={i} $role={m.role}>
                  <Bubble $role={m.role}>{m.content}</Bubble>
                </MessageRow>
            ))}
            {loading && (
                <MessageRow $role="assistant">
                  <TypingIndicator $role="assistant">
                    <TypingDot $i={0} /><TypingDot $i={1} /><TypingDot $i={2} />
                  </TypingIndicator>
                </MessageRow>
            )}
            <div ref={bottomRef} />
          </MessagesArea>

          {status && <StatusBanner $ok={status.ok}>{status.text}</StatusBanner>}

          <InputArea onSubmit={handleSubmit}>
            <TextInput
                placeholder={done ? 'Onboarding complete!' : 'Type your message… (Enter to send)'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading || done}
                rows={1}
            />
            <SendBtn type="submit" disabled={!input.trim() || loading || done} aria-label="Send">
              →
            </SendBtn>
          </InputArea>
        </Layout>
      </>
  )
}
