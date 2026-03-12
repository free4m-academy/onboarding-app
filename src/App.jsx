import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import emailjs from "@emailjs/browser";
import {
  EMAILJS_PUBLIC,
  EMAILJS_SERVICE, EMAILJS_STUDENT,
  EMAILJS_TEMPLATE,
  RECIPIENT_EMAIL,
} from "./constants/emailJs";
import { Background } from "./Background";
import { NAVY } from "./constants/theme";
import { SYSTEM_PROMPT } from "./constants/prompt";

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
`;

// ─── ANIMATIONS ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const blink = keyframes`
  0%, 100% { opacity: 1; } 50% { opacity: 0; }
`;

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
`;
const Header = styled.header`
  padding: 12px 24px;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(8px);
`;
const LogoImg = styled.img`
  height: 44px;
  width: auto;
  display: block;
  object-fit: contain;
`;
const HeaderTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #ececec;
`;
const HeaderSub = styled.span`
  font-size: 13px;
  color: #aaa;
  margin-left: auto;
`;
const MessagesArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 24px 24px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
`;
const MessageRow = styled.div`
  display: flex;
  justify-content: ${(p) => (p.$role === "user" ? "flex-end" : "flex-start")};
  animation: ${fadeUp} 0.25s ease;
  margin-bottom: 12px;
`;
const BubbleWrapper = styled.div`
  max-width: 80%;
  padding: 10px 14px;
  opacity: 0.7;
  border-radius: ${(p) =>
    p.$role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px"};
  background: ${(p) => (p.$role === "user" ? "white" : NAVY)};
  color: ${(p) => (p.$role === "user" ? NAVY : "white")};
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  a {
    color: #00e5c0;
    text-decoration: underline;
    &:hover {
      color: #ff2d7a;
    }
  }
`;

// Renders message text with URLs converted to clickable links
function Bubble({ $role, children }) {
  const parts = String(children).split(/(https?:\/\/[^\s]+)/g);
  return (
    <BubbleWrapper $role={$role}>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        ) : (
          part
        )
      )}
    </BubbleWrapper>
  );
}
const TypingDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #666;
  margin: 0 2px;
  animation: ${blink} 1.2s infinite;
  animation-delay: ${(p) => p.$i * 0.2}s;
`;
const TypingIndicator = styled(BubbleWrapper)`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 12px 16px;
`;
const InputArea = styled.form`
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  padding: 24px;
`;
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
  &::placeholder {
    color: #888;
  }
  &:focus {
    border-color: #555;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
const SendBtn = styled.button`
  background: tomato;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  width: 44px;
  height: 44px;
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.1s;
  align-self: flex-end;
  &:hover:not(:disabled) {
    background: #e0392d;
  }
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  &:disabled {
    opacity: 1;
    cursor: not-allowed;
  }
`;
const StatusBanner = styled.div`
  margin: 0 24px;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${(p) => (p.$ok ? "#1a3a1a" : "#3a1a1a")};
  color: ${(p) => (p.$ok ? "#6fcf6f" : "#cf6f6f")};
  font-size: 13px;
  animation: ${fadeUp} 0.3s ease;
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function parseCollected(text) {
  const match = text.match(/<COLLECTED>([\s\S]*?)<\/COLLECTED>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

function stripCollected(text) {
  return text.replace(/<COLLECTED>[\s\S]*?<\/COLLECTED>/, "").trim();
}

async function callClaude(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: SYSTEM_PROMPT, messages }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }
  const data = await res.json();
  return data.text;
}

async function sendEmail(data) {
  // Email to admin
  await emailjs.send(
    EMAILJS_SERVICE,
    EMAILJS_TEMPLATE,
    {
      to_email: RECIPIENT_EMAIL,
      student_email: data.email,
      student_name: data.name,
      city: data.city,
      discord: data.discord,
      skills: data.skills,
      projects: data.projects,
      goal: data.goal,
      level: data.level,
      hours_per_day: data.hoursPerDay,
      determination_summary: data.determinationSummary,
      logic_q1: data.logicQ1,
      logic_a1: data.logicA1,
      logic_q2: data.logicQ2,
      logic_a2: data.logicA2,
      logic_q3: data.logicQ3,
      logic_a3: data.logicA3,
      logic_q4: data.logicQ4,
      logic_a4: data.logicA4,
      logic_q5: data.logicQ5,
      logic_a5: data.logicA5,
      logic_assessment: data.logicAssessment,
      conversation_synopsis: data.conversationSynopsis,
      student_assessment: data.studentAssessment,
    },
    EMAILJS_PUBLIC
  );

  // Confirmation email to student
  await emailjs.send(
      EMAILJS_SERVICE,
      EMAILJS_STUDENT,
      {
        to_email: data.email,
        student_name: data.name,
      },
      EMAILJS_PUBLIC
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [done, setDone] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    startConversation();
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function startConversation() {
    setLoading(true);
    try {
      const reply = await callClaude([]);
      setMessages([{ role: "assistant", content: reply }]);
    } catch (e) {
      setStatus({ ok: false, text: `Could not reach server: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading || done) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStatus(null);

    try {
      const aiText = await callClaude(newMessages);
      const collected = parseCollected(aiText);
      const displayText = stripCollected(aiText);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: displayText },
      ]);

      if (collected) {
        setDone(true);
        try {
          await sendEmail(collected);
          setStatus({
            ok: true,
            text: `✓ Onboarding complete! Data sent to ${RECIPIENT_EMAIL}`,
          });
        } catch {
          setStatus({
            ok: false,
            text: "Onboarding complete, but email failed. Check your EmailJS config.",
          });
        }
      }
    } catch (e) {
      setStatus({ ok: false, text: `Error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
                <TypingDot $i={0} />
                <TypingDot $i={1} />
                <TypingDot $i={2} />
              </TypingIndicator>
            </MessageRow>
          )}
          <div ref={bottomRef} />
        </MessagesArea>

        {status && <StatusBanner $ok={status.ok}>{status.text}</StatusBanner>}

        <InputArea onSubmit={handleSubmit}>
          <TextInput
            placeholder={
              done
                ? "Onboarding complete!"
                : "Type your message… (Enter to send)"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading || done}
          />
          <SendBtn
            type="submit"
            disabled={!input.trim() || loading || done}
            aria-label="Send"
          >
            →
          </SendBtn>
        </InputArea>
      </Layout>
    </>
  );
}
