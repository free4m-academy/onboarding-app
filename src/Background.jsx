// Vector background: dark grey/black base with pink and teal streak accents
import React from "react";
import styled from "styled-components";
import { CYAN, PINK } from "./constants/theme";

const SvgBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export function Background() {
  return (
    <SvgBackground>
      <svg
        viewBox="0 0 900 1200"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base */}
          <radialGradient id="bgBase" cx="30%" cy="70%" r="90%">
            <stop offset="0%" stopColor="#050d2e" />
            <stop offset="60%" stopColor="#020818" />
            <stop offset="100%" stopColor="#010410" />
          </radialGradient>

          {/* Cyan glow left-center */}
          <radialGradient id="cyanGlow" cx="12%" cy="65%" r="30%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.7" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </radialGradient>

          {/* Purple glow bottom-right */}
          <radialGradient id="purpleGlow" cx="80%" cy="92%" r="35%">
            <stop offset="0%" stopColor={PINK} stopOpacity="0.6" />
            <stop offset="100%" stopColor={PINK} stopOpacity="0" />
          </radialGradient>

          {/* Blue deep ambient */}
          <radialGradient id="blueAmbient" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#0a1aaa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a1aaa" stopOpacity="0" />
          </radialGradient>

          {/* Cyan wave linear gradient - fades left bright to right dark */}
          <linearGradient id="cyanWaveFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.0" />
            <stop offset="15%" stopColor="#00aaff" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#0066ff" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#0033aa" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#001166" stopOpacity="0.0" />
          </linearGradient>

          {/* Cyan edge glow */}
          <linearGradient id="cyanEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00eeff" stopOpacity="0.0" />
            <stop offset="10%" stopColor="#00eeff" stopOpacity="1.0" />
            <stop offset="45%" stopColor="#4499ff" stopOpacity="0.7" />
            <stop offset="75%" stopColor="#2255cc" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0022aa" stopOpacity="0.0" />
          </linearGradient>

          {/* Purple wave gradient - fades from left dark to right bright then dark */}
          <linearGradient id="purpleWaveFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#220066" stopOpacity="0.0" />
            <stop offset="25%" stopColor="#4411aa" stopOpacity="0.3" />
            <stop offset="55%" stopColor="#7722ff" stopOpacity="0.55" />
            <stop offset="75%" stopColor="#aa33ff" stopOpacity="0.6" />
            <stop offset="90%" stopColor="#cc44ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#cc44ff" stopOpacity="0.0" />
          </linearGradient>

          {/* Purple edge */}
          <linearGradient id="purpleEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6600ff" stopOpacity="0.0" />
            <stop offset="30%" stopColor="#8833ff" stopOpacity="0.6" />
            <stop offset="65%" stopColor="#cc44ff" stopOpacity="1.0" />
            <stop offset="85%" stopColor="#dd66ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#cc44ff" stopOpacity="0.0" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong glow for bright edges */}
          <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft blur for wave bodies */}
          <filter id="waveBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          {/* Very soft blur */}
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* ── BASE LAYERS ── */}
        <rect width="900" height="1200" fill="url(#bgBase)" />
        <rect width="900" height="1200" fill="url(#blueAmbient)" />
        <rect width="900" height="1200" fill="url(#cyanGlow)" />
        <rect width="900" height="1200" fill="url(#purpleGlow)" />

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
        {Array.from({ length: 22 }).map((_, i) => {
          const o = i * 7;
          const op = Math.max(0, 0.22 - i * 0.009);
          return (
            <path
              key={`cl${i}`}
              d={`M -100,${592 + o} C 50,${532 + o} 150,${612 + o} 280,${
                562 + o
              } C 380,${522 + o} 440,${582 + o} 560,${542 + o} C 660,${
                507 + o
              } 760,${532 + o} 1000,${502 + o}`}
              fill="none"
              stroke="#00bbff"
              strokeWidth="0.5"
              strokeOpacity={op}
            />
          );
        })}

        {/* Cyan wave bright top edge */}
        <path
          d="M -100,588 C 50,528 150,608 280,558 C 380,518 440,578 560,538 C 660,503 760,528 1000,498"
          fill="none"
          stroke="url(#cyanEdge)"
          strokeWidth="2.5"
          filter="url(#glow)"
          opacity="1"
        />

        {/* Extra bright hotspot on left where cyan bursts */}
        <path
          d="M -100,600 C 20,545 100,610 200,575"
          fill="none"
          stroke="#00ffff"
          strokeWidth="3.5"
          filter="url(#strongGlow)"
          opacity="0.85"
        />

        {/* Secondary thinner cyan wave above */}
        {Array.from({ length: 10 }).map((_, i) => {
          const o = i * 6;
          const op = Math.max(0, 0.13 - i * 0.01);
          return (
            <path
              key={`cl2${i}`}
              d={`M -100,${510 + o} C 80,${460 + o} 180,${520 + o} 310,${
                478 + o
              } C 420,${445 + o} 500,${495 + o} 640,${462 + o} C 760,${
                434 + o
              } 860,${455 + o} 1000,${435 + o}`}
              fill="none"
              stroke="#0099ee"
              strokeWidth="0.4"
              strokeOpacity={op}
            />
          );
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
        {Array.from({ length: 22 }).map((_, i) => {
          const o = i * 7;
          const op = Math.max(0, 0.2 - i * 0.008);
          return (
            <path
              key={`pl${i}`}
              d={`M -100,${832 + o} C 100,${772 + o} 220,${852 + o} 380,${
                802 + o
              } C 500,${762 + o} 590,${822 + o} 700,${782 + o} C 790,${
                750 + o
              } 860,${774 + o} 1000,${752 + o}`}
              fill="none"
              stroke="#8833ff"
              strokeWidth="0.5"
              strokeOpacity={op}
            />
          );
        })}

        {/* Purple wave bright edge */}
        <path
          d="M -100,828 C 100,768 220,848 380,798 C 500,758 590,818 700,778 C 790,746 860,770 1000,748"
          fill="none"
          stroke="url(#purpleEdge)"
          strokeWidth="2.5"
          filter="url(#glow)"
          opacity="1"
        />

        {/* Purple bright hotspot bottom-right */}
        <path
          d="M 650,800 C 750,768 840,785 1000,762"
          fill="none"
          stroke="#dd55ff"
          strokeWidth="3.5"
          filter="url(#strongGlow)"
          opacity="0.9"
        />

        {/* Extra thin secondary purple lines above main wave */}
        {Array.from({ length: 8 }).map((_, i) => {
          const o = i * 6;
          const op = Math.max(0, 0.1 - i * 0.01);
          return (
            <path
              key={`pl2${i}`}
              d={`M -100,${750 + o} C 120,${700 + o} 240,${765 + o} 400,${
                722 + o
              } C 520,${688 + o} 610,${740 + o} 720,${705 + o} C 810,${
                677 + o
              } 880,${698 + o} 1000,${678 + o}`}
              fill="none"
              stroke="#6622cc"
              strokeWidth="0.4"
              strokeOpacity={op}
            />
          );
        })}

        {/* ── MESH GRID overlay on purple wave lower-right ── */}
        <g opacity="0.15">
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={`mh${i}`}
              x1="480"
              y1={790 + i * 14}
              x2="1000"
              y2={760 + i * 14}
              stroke="#7733ff"
              strokeWidth="0.4"
              strokeOpacity="0.5"
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`mv${i}`}
              x1={490 + i * 27}
              y1="775"
              x2={470 + i * 27}
              y2="1010"
              stroke="#7733ff"
              strokeWidth="0.4"
              strokeOpacity="0.4"
            />
          ))}
        </g>

        {/* ══════════════════════════════════════════
            CIRCUIT LINES
        ══════════════════════════════════════════ */}

        {/* Circuit cluster — left mid (near cyan burst) */}
        <g stroke="#00aaff" strokeOpacity="0.4" strokeWidth="0.8" fill="none">
          <polyline points="15,640 15,670 55,670 55,695 120,695" />
          <polyline points="15,655 40,655 40,680 100,680 100,710 180,710" />
          <polyline points="25,665 25,700 85,700 85,725 165,725 165,748" />
          <polyline points="55,650 55,685 135,685 135,715 210,715" />
          <polyline points="75,660 75,692 155,692 155,720 230,720 230,740" />
          <circle
            cx="55"
            cy="670"
            r="2.5"
            fill="#00ddff"
            fillOpacity="0.8"
            stroke="none"
          />
          <circle
            cx="100"
            cy="680"
            r="2.5"
            fill="#00ddff"
            fillOpacity="0.7"
            stroke="none"
          />
          <circle
            cx="85"
            cy="700"
            r="2"
            fill="#00bbff"
            fillOpacity="0.6"
            stroke="none"
          />
          <circle
            cx="135"
            cy="685"
            r="2"
            fill="#00bbff"
            fillOpacity="0.6"
            stroke="none"
          />
          <circle
            cx="165"
            cy="725"
            r="2.5"
            fill="#aa44ff"
            fillOpacity="0.7"
            stroke="none"
          />
          <circle
            cx="155"
            cy="720"
            r="2"
            fill="#aa44ff"
            fillOpacity="0.5"
            stroke="none"
          />
        </g>

        {/* Circuit cluster — bottom-left */}
        <g stroke="#0099dd" strokeOpacity="0.35" strokeWidth="0.8" fill="none">
          <polyline points="15,990 15,1015 50,1015 50,1040 120,1040" />
          <polyline points="15,1005 35,1005 35,1032 95,1032 95,1058 175,1058" />
          <polyline points="25,1020 25,1048 85,1048 85,1072 160,1072 160,1095" />
          <polyline points="50,1025 50,1055 130,1055 130,1082 205,1082" />
          <circle
            cx="50"
            cy="1015"
            r="2.5"
            fill="#00ccff"
            fillOpacity="0.7"
            stroke="none"
          />
          <circle
            cx="95"
            cy="1032"
            r="2.5"
            fill="#00ccff"
            fillOpacity="0.7"
            stroke="none"
          />
          <circle
            cx="85"
            cy="1048"
            r="2"
            fill="#00aaff"
            fillOpacity="0.5"
            stroke="none"
          />
          <circle
            cx="160"
            cy="1072"
            r="2.5"
            fill="#bb44ff"
            fillOpacity="0.8"
            stroke="none"
          />
          <circle
            cx="130"
            cy="1055"
            r="2"
            fill="#aa33ff"
            fillOpacity="0.5"
            stroke="none"
          />
        </g>

        {/* Circuit cluster — bottom-right */}
        <g stroke="#6633cc" strokeOpacity="0.35" strokeWidth="0.8" fill="none">
          <polyline points="885,940 885,970 840,970 840,1000 770,1000" />
          <polyline points="885,958 862,958 862,988 810,988 810,1015 740,1015" />
          <polyline points="875,972 875,1002 828,1002 828,1028 758,1028 758,1052" />
          <polyline points="850,980 850,1008 795,1008 795,1035 725,1035" />
          <circle
            cx="840"
            cy="970"
            r="2.5"
            fill="#cc44ff"
            fillOpacity="0.7"
            stroke="none"
          />
          <circle
            cx="810"
            cy="988"
            r="2.5"
            fill="#cc44ff"
            fillOpacity="0.7"
            stroke="none"
          />
          <circle
            cx="828"
            cy="1002"
            r="2"
            fill="#aa33ff"
            fillOpacity="0.5"
            stroke="none"
          />
          <circle
            cx="758"
            cy="1028"
            r="2.5"
            fill="#dd55ff"
            fillOpacity="0.8"
            stroke="none"
          />
          <circle
            cx="795"
            cy="1008"
            r="2"
            fill="#bb44ff"
            fillOpacity="0.5"
            stroke="none"
          />
        </g>

        {/* ── SCATTERED DOTS ── */}
        <g fill="#00ccff">
          <circle cx="195" cy="660" r="1.5" fillOpacity="0.5" />
          <circle cx="218" cy="675" r="1" fillOpacity="0.4" />
          <circle cx="240" cy="655" r="1.5" fillOpacity="0.4" />
          <circle cx="260" cy="670" r="1" fillOpacity="0.3" />
          <circle cx="205" cy="690" r="1" fillOpacity="0.3" />
        </g>
        <g fill="#bb44ff">
          <circle
            cx="590"
            cy="1055"
            r="3"
            fillOpacity="0.7"
            filter="url(#glow)"
          />
          <circle cx="710" cy="1025" r="1.5" fillOpacity="0.5" />
          <circle cx="570" cy="1078" r="1" fillOpacity="0.4" />
          <circle cx="635" cy="1042" r="1" fillOpacity="0.4" />
          <circle cx="660" cy="1065" r="1.5" fillOpacity="0.5" />
        </g>

        {/* Dot grid patterns */}
        <g fill="#0099cc" fillOpacity="0.3">
          {[0, 6, 12, 18].map((dy) =>
            [0, 6, 12, 18].map((dx) => (
              <circle key={`d${dx}${dy}`} cx={32 + dx} cy={992 + dy} r="0.8" />
            ))
          )}
        </g>
        <g fill="#6622cc" fillOpacity="0.3">
          {[0, 6, 12, 18].map((dy) =>
            [0, 6, 12].map((dx) => (
              <circle
                key={`e${dx}${dy}`}
                cx={192 + dx}
                cy={1062 + dy}
                r="0.8"
              />
            ))
          )}
        </g>

        {/* ── HUD BRACKETS ── */}
        <g stroke="#00ccff" strokeOpacity="0.45" strokeWidth="1" fill="none">
          <polyline points="14,542 14,528 28,528" />
          <polyline points="886,542 886,528 872,528" />
          <polyline points="14,1172 14,1186 28,1186" />
          <polyline points="886,1172 886,1186 872,1186" />
        </g>

        {/* Top tick marks */}
        <g stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.8">
          {[180, 210, 240, 270, 300].map((x) => (
            <line key={x} x1={x} y1="526" x2={x} y2="536" />
          ))}
        </g>

        {/* Bottom tick marks */}
        <g stroke="#00ccff" strokeOpacity="0.3" strokeWidth="0.8">
          {[180, 210, 240, 270, 620, 650, 680, 710].map((x) => (
            <line key={x} x1={x} y1="1178" x2={x} y2="1188" />
          ))}
        </g>

        {/* Right side ticks */}
        <g stroke="#aa44ff" strokeOpacity="0.3" strokeWidth="0.8">
          {[820, 880, 940, 1000, 1060, 1100].map((y) => (
            <line key={y} x1="880" y1={y} x2="890" y2={y} />
          ))}
        </g>

        {/* Left side ticks */}
        <g stroke="#00aaff" strokeOpacity="0.2" strokeWidth="0.8">
          {[560, 610, 660, 710, 760].map((y) => (
            <line key={y} x1="10" y1={y} x2="20" y2={y} />
          ))}
        </g>
      </svg>
    </SvgBackground>
  );
}
