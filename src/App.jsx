import React, { useState, useRef, useEffect } from 'react'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import emailjs from '@emailjs/browser'

// Cyan: #00d4ff
// Pink/Purple: #bb33ff
// Dark navy blue: #050d2e

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
        <svg viewBox="0 0 900 1200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Base */}
            <radialGradient id="bgBase" cx="30%" cy="70%" r="90%">
              <stop offset="0%" stopColor="#050d2e"/>
              <stop offset="60%" stopColor="#020818"/>
              <stop offset="100%" stopColor="#010410"/>
            </radialGradient>

            {/* Cyan glow left-center */}
            <radialGradient id="cyanGlow" cx="12%" cy="65%" r="30%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
            </radialGradient>

            {/* Purple glow bottom-right */}
            <radialGradient id="purpleGlow" cx="80%" cy="92%" r="35%">
              <stop offset="0%" stopColor="#bb33ff" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#bb33ff" stopOpacity="0"/>
            </radialGradient>

            {/* Blue deep ambient */}
            <radialGradient id="blueAmbient" cx="50%" cy="80%" r="70%">
              <stop offset="0%" stopColor="#0a1aaa" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#0a1aaa" stopOpacity="0"/>
            </radialGradient>

            {/* Cyan wave linear gradient - fades left bright to right dark */}
            <linearGradient id="cyanWaveFill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0.0"/>
              <stop offset="15%"  stopColor="#00aaff" stopOpacity="0.5"/>
              <stop offset="40%"  stopColor="#0066ff" stopOpacity="0.4"/>
              <stop offset="70%"  stopColor="#0033aa" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#001166" stopOpacity="0.0"/>
            </linearGradient>

            {/* Cyan edge glow */}
            <linearGradient id="cyanEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#00eeff" stopOpacity="0.0"/>
              <stop offset="10%"  stopColor="#00eeff" stopOpacity="1.0"/>
              <stop offset="45%"  stopColor="#4499ff" stopOpacity="0.7"/>
              <stop offset="75%"  stopColor="#2255cc" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#0022aa" stopOpacity="0.0"/>
            </linearGradient>

            {/* Purple wave gradient - fades from left dark to right bright then dark */}
            <linearGradient id="purpleWaveFill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#220066" stopOpacity="0.0"/>
              <stop offset="25%"  stopColor="#4411aa" stopOpacity="0.3"/>
              <stop offset="55%"  stopColor="#7722ff" stopOpacity="0.55"/>
              <stop offset="75%"  stopColor="#aa33ff" stopOpacity="0.6"/>
              <stop offset="90%"  stopColor="#cc44ff" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#cc44ff" stopOpacity="0.0"/>
            </linearGradient>

            {/* Purple edge */}
            <linearGradient id="purpleEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#6600ff" stopOpacity="0.0"/>
              <stop offset="30%"  stopColor="#8833ff" stopOpacity="0.6"/>
              <stop offset="65%"  stopColor="#cc44ff" stopOpacity="1.0"/>
              <stop offset="85%"  stopColor="#dd66ff" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#cc44ff" stopOpacity="0.0"/>
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* Strong glow for bright edges */}
            <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* Soft blur for wave bodies */}
            <filter id="waveBlur">
              <feGaussianBlur stdDeviation="8"/>
            </filter>

            {/* Very soft blur */}
            <filter id="softBlur">
              <feGaussianBlur stdDeviation="3"/>
            </filter>
          </defs>

          {/* ── BASE LAYERS ── */}
          <rect width="900" height="1200" fill="url(#bgBase)"/>
          <rect width="900" height="1200" fill="url(#blueAmbient)"/>
          <rect width="900" height="1200" fill="url(#cyanGlow)"/>
          <rect width="900" height="1200" fill="url(#purpleGlow)"/>

          {/* ══════════════════════════════════════════
            CYAN WAVE — diagonal top-left to mid-right
            fades into dark naturally on both ends
        ══════════════════════════════════════════ */}

          {/* Cyan wave soft body glow */}
          <path
              d="M -100,580 C 50,520 150,600 280,550 C 380,510 440,570 560,530 C 660,495 760,520 1000,490 L 1000,680 C 760,710 660,685 560,720 C 440,760 380,700 280,740 C 150,790 50,710 -100,770 Z"
              fill="url(#cyanWaveFill)"
              filter="url(#waveBlur)"
              opacity="0.7"
          />

          {/* Cyan wave fine lines — 22 lines stacked */}
          {Array.from({length: 22}).map((_, i) => {
            const o = i * 7
            const op = Math.max(0, 0.22 - i * 0.009)
            return (
                <path key={`cl${i}`}
                      d={`M -100,${592+o} C 50,${532+o} 150,${612+o} 280,${562+o} C 380,${522+o} 440,${582+o} 560,${542+o} C 660,${507+o} 760,${532+o} 1000,${502+o}`}
                      fill="none" stroke="#00bbff" strokeWidth="0.5" strokeOpacity={op}
                />
            )
          })}

          {/* Cyan wave bright top edge */}
          <path
              d="M -100,588 C 50,528 150,608 280,558 C 380,518 440,578 560,538 C 660,503 760,528 1000,498"
              fill="none" stroke="url(#cyanEdge)" strokeWidth="2.5"
              filter="url(#glow)" opacity="1"
          />

          {/* Extra bright hotspot on left where cyan bursts */}
          <path
              d="M -100,600 C 20,545 100,610 200,575"
              fill="none" stroke="#00ffff" strokeWidth="3.5"
              filter="url(#strongGlow)" opacity="0.85"
          />

          {/* Secondary thinner cyan wave above */}
          {Array.from({length: 10}).map((_, i) => {
            const o = i * 6
            const op = Math.max(0, 0.13 - i * 0.01)
            return (
                <path key={`cl2${i}`}
                      d={`M -100,${510+o} C 80,${460+o} 180,${520+o} 310,${478+o} C 420,${445+o} 500,${495+o} 640,${462+o} C 760,${434+o} 860,${455+o} 1000,${435+o}`}
                      fill="none" stroke="#0099ee" strokeWidth="0.4" strokeOpacity={op}
                />
            )
          })}

          {/* ══════════════════════════════════════════
            PURPLE/PINK WAVE — diagonal, below cyan
            strong on bottom-right, fades left & top
        ══════════════════════════════════════════ */}

          {/* Purple wave soft body */}
          <path
              d="M -100,820 C 100,760 220,840 380,790 C 500,750 590,810 700,770 C 790,738 860,762 1000,740 L 1000,950 C 860,972 790,948 700,980 C 590,1018 500,958 380,998 C 220,1048 100,968 -100,1028 Z"
              fill="url(#purpleWaveFill)"
              filter="url(#waveBlur)"
              opacity="0.65"
          />

          {/* Purple wave fine lines — 22 stacked */}
          {Array.from({length: 22}).map((_, i) => {
            const o = i * 7
            const op = Math.max(0, 0.20 - i * 0.008)
            return (
                <path key={`pl${i}`}
                      d={`M -100,${832+o} C 100,${772+o} 220,${852+o} 380,${802+o} C 500,${762+o} 590,${822+o} 700,${782+o} C 790,${750+o} 860,${774+o} 1000,${752+o}`}
                      fill="none" stroke="#8833ff" strokeWidth="0.5" strokeOpacity={op}
                />
            )
          })}

          {/* Purple wave bright edge */}
          <path
              d="M -100,828 C 100,768 220,848 380,798 C 500,758 590,818 700,778 C 790,746 860,770 1000,748"
              fill="none" stroke="url(#purpleEdge)" strokeWidth="2.5"
              filter="url(#glow)" opacity="1"
          />

          {/* Purple bright hotspot bottom-right */}
          <path
              d="M 650,800 C 750,768 840,785 1000,762"
              fill="none" stroke="#dd55ff" strokeWidth="3.5"
              filter="url(#strongGlow)" opacity="0.9"
          />

          {/* Extra thin secondary purple lines above main wave */}
          {Array.from({length: 8}).map((_, i) => {
            const o = i * 6
            const op = Math.max(0, 0.10 - i * 0.01)
            return (
                <path key={`pl2${i}`}
                      d={`M -100,${750+o} C 120,${700+o} 240,${765+o} 400,${722+o} C 520,${688+o} 610,${740+o} 720,${705+o} C 810,${677+o} 880,${698+o} 1000,${678+o}`}
                      fill="none" stroke="#6622cc" strokeWidth="0.4" strokeOpacity={op}
                />
            )
          })}

          {/* ── MESH GRID overlay on purple wave lower-right ── */}
          <g opacity="0.15">
            {Array.from({length: 18}).map((_, i) => (
                <line key={`mh${i}`}
                      x1="480" y1={790 + i*14} x2="1000" y2={760 + i*14}
                      stroke="#7733ff" strokeWidth="0.4" strokeOpacity="0.5"
                />
            ))}
            {Array.from({length: 20}).map((_, i) => (
                <line key={`mv${i}`}
                      x1={490 + i*27} y1="775" x2={470 + i*27} y2="1010"
                      stroke="#7733ff" strokeWidth="0.4" strokeOpacity="0.4"
                />
            ))}
          </g>

          {/* ══════════════════════════════════════════
            CIRCUIT LINES
        ══════════════════════════════════════════ */}

          {/* Circuit cluster — left mid (near cyan burst) */}
          <g stroke="#00aaff" strokeOpacity="0.4" strokeWidth="0.8" fill="none">
            <polyline points="15,640 15,670 55,670 55,695 120,695"/>
            <polyline points="15,655 40,655 40,680 100,680 100,710 180,710"/>
            <polyline points="25,665 25,700 85,700 85,725 165,725 165,748"/>
            <polyline points="55,650 55,685 135,685 135,715 210,715"/>
            <polyline points="75,660 75,692 155,692 155,720 230,720 230,740"/>
            <circle cx="55"  cy="670" r="2.5" fill="#00ddff" fillOpacity="0.8" stroke="none"/>
            <circle cx="100" cy="680" r="2.5" fill="#00ddff" fillOpacity="0.7" stroke="none"/>
            <circle cx="85"  cy="700" r="2"   fill="#00bbff" fillOpacity="0.6" stroke="none"/>
            <circle cx="135" cy="685" r="2"   fill="#00bbff" fillOpacity="0.6" stroke="none"/>
            <circle cx="165" cy="725" r="2.5" fill="#aa44ff" fillOpacity="0.7" stroke="none"/>
            <circle cx="155" cy="720" r="2"   fill="#aa44ff" fillOpacity="0.5" stroke="none"/>
          </g>

          {/* Circuit cluster — bottom-left */}
          <g stroke="#0099dd" strokeOpacity="0.35" strokeWidth="0.8" fill="none">
            <polyline points="15,990 15,1015 50,1015 50,1040 120,1040"/>
            <polyline points="15,1005 35,1005 35,1032 95,1032 95,1058 175,1058"/>
            <polyline points="25,1020 25,1048 85,1048 85,1072 160,1072 160,1095"/>
            <polyline points="50,1025 50,1055 130,1055 130,1082 205,1082"/>
            <circle cx="50"  cy="1015" r="2.5" fill="#00ccff" fillOpacity="0.7" stroke="none"/>
            <circle cx="95"  cy="1032" r="2.5" fill="#00ccff" fillOpacity="0.7" stroke="none"/>
            <circle cx="85"  cy="1048" r="2"   fill="#00aaff" fillOpacity="0.5" stroke="none"/>
            <circle cx="160" cy="1072" r="2.5" fill="#bb44ff" fillOpacity="0.8" stroke="none"/>
            <circle cx="130" cy="1055" r="2"   fill="#aa33ff" fillOpacity="0.5" stroke="none"/>
          </g>

          {/* Circuit cluster — bottom-right */}
          <g stroke="#6633cc" strokeOpacity="0.35" strokeWidth="0.8" fill="none">
            <polyline points="885,940 885,970 840,970 840,1000 770,1000"/>
            <polyline points="885,958 862,958 862,988 810,988 810,1015 740,1015"/>
            <polyline points="875,972 875,1002 828,1002 828,1028 758,1028 758,1052"/>
            <polyline points="850,980 850,1008 795,1008 795,1035 725,1035"/>
            <circle cx="840" cy="970"  r="2.5" fill="#cc44ff" fillOpacity="0.7" stroke="none"/>
            <circle cx="810" cy="988"  r="2.5" fill="#cc44ff" fillOpacity="0.7" stroke="none"/>
            <circle cx="828" cy="1002" r="2"   fill="#aa33ff" fillOpacity="0.5" stroke="none"/>
            <circle cx="758" cy="1028" r="2.5" fill="#dd55ff" fillOpacity="0.8" stroke="none"/>
            <circle cx="795" cy="1008" r="2"   fill="#bb44ff" fillOpacity="0.5" stroke="none"/>
          </g>

          {/* ── SCATTERED DOTS ── */}
          <g fill="#00ccff">
            <circle cx="195" cy="660" r="1.5" fillOpacity="0.5"/>
            <circle cx="218" cy="675" r="1"   fillOpacity="0.4"/>
            <circle cx="240" cy="655" r="1.5" fillOpacity="0.4"/>
            <circle cx="260" cy="670" r="1"   fillOpacity="0.3"/>
            <circle cx="205" cy="690" r="1"   fillOpacity="0.3"/>
          </g>
          <g fill="#bb44ff">
            <circle cx="590" cy="1055" r="3"   fillOpacity="0.7" filter="url(#glow)"/>
            <circle cx="710" cy="1025" r="1.5" fillOpacity="0.5"/>
            <circle cx="570" cy="1078" r="1"   fillOpacity="0.4"/>
            <circle cx="635" cy="1042" r="1"   fillOpacity="0.4"/>
            <circle cx="660" cy="1065" r="1.5" fillOpacity="0.5"/>
          </g>

          {/* Dot grid patterns */}
          <g fill="#0099cc" fillOpacity="0.3">
            {[0,6,12,18].map(dy => [0,6,12,18].map(dx => (
                <circle key={`d${dx}${dy}`} cx={32+dx} cy={992+dy} r="0.8"/>
            )))}
          </g>
          <g fill="#6622cc" fillOpacity="0.3">
            {[0,6,12,18].map(dy => [0,6,12].map(dx => (
                <circle key={`e${dx}${dy}`} cx={192+dx} cy={1062+dy} r="0.8"/>
            )))}
          </g>

          {/* ── HUD BRACKETS ── */}
          <g stroke="#00ccff" strokeOpacity="0.45" strokeWidth="1" fill="none">
            <polyline points="14,542 14,528 28,528"/>
            <polyline points="886,542 886,528 872,528"/>
            <polyline points="14,1172 14,1186 28,1186"/>
            <polyline points="886,1172 886,1186 872,1186"/>
          </g>

          {/* Top tick marks */}
          <g stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.8">
            {[180,210,240,270,300].map(x => (
                <line key={x} x1={x} y1="526" x2={x} y2="536"/>
            ))}
          </g>

          {/* Bottom tick marks */}
          <g stroke="#00ccff" strokeOpacity="0.3" strokeWidth="0.8">
            {[180,210,240,270,620,650,680,710].map(x => (
                <line key={x} x1={x} y1="1178" x2={x} y2="1188"/>
            ))}
          </g>

          {/* Right side ticks */}
          <g stroke="#aa44ff" strokeOpacity="0.3" strokeWidth="0.8">
            {[820,880,940,1000,1060,1100].map(y => (
                <line key={y} x1="880" y1={y} x2="890" y2={y}/>
            ))}
          </g>

          {/* Left side ticks */}
          <g stroke="#00aaff" strokeOpacity="0.2" strokeWidth="0.8">
            {[560,610,660,710,760].map(y => (
                <line key={y} x1="10" y1={y} x2="20" y2={y}/>
            ))}
          </g>
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
  height: 44px;
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
  color: #aaa;
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
  opacity: 0.6;
  border-radius: ${p => p.$role === 'user'
    ? '18px 18px 4px 18px'
    : '18px 18px 18px 4px'};
  background: ${p => p.$role === 'user' ? 'white' : '#050d2e'};
  color: ${p => p.$role === 'user' ? '#050d2e' : 'white'};
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
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  padding: 24px;
`
const TextInput = styled.input`
  flex: 1;
  background: #050d2e;
  opacity: 0.8;
  border: 1px solid #333;
  border-radius: 12px;
  color: #ececec;
  font-size: 14px;
  font-family: inherit;
  padding: 10px 14px;
  outline: none;
  height: 44px;
  transition: border-color 0.15s;
  &::placeholder { color: #888; }
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
  &:disabled { opacity: 1; cursor: not-allowed; }
`
const StatusBanner = styled.div`
  margin: 0 24px;
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
            />
            <SendBtn type="submit" disabled={!input.trim() || loading || done} aria-label="Send">
              →
            </SendBtn>
          </InputArea>
        </Layout>
      </>
  )
}
