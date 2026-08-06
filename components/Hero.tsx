"use client";

import { motion } from "motion/react";
import { Sparkles, ArrowRight, AppWindow, Cpu, Award } from "lucide-react";
import type { Translations } from "@/lib/translations";

interface HeroProps {
  onNavigate: (section: string) => void;
  t: Translations;
}

function AgentAIBackground() {
  const nodes = [
    { cx: 8,  cy: 18 }, { cx: 28, cy: 62 }, { cx: 52, cy: 12 },
    { cx: 68, cy: 44 }, { cx: 88, cy: 18 }, { cx: 18, cy: 82 },
    { cx: 62, cy: 78 }, { cx: 92, cy: 60 }, { cx: 42, cy: 38 },
    { cx: 76, cy: 88 }, { cx: 35, cy: 28 }, { cx: 80, cy: 35 },
  ];
  const connections = [
    [0,2],[0,1],[1,8],[2,4],[2,10],[3,4],[3,8],[3,11],
    [4,7],[4,11],[5,6],[5,1],[6,7],[6,9],[7,9],[8,10],[10,11],
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(99,102,241)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="rgb(15,23,42)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 배경 그라디언트 */}
      <rect width="100" height="100" fill="rgb(15,23,42)" />
      <ellipse cx="70" cy="30" rx="45" ry="35" fill="url(#glow)" />
      <ellipse cx="25" cy="75" rx="35" ry="28" fill="url(#glow)" />

      {/* 연결선 */}
      {connections.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgb(99,102,241)"
          strokeWidth="0.18"
          strokeOpacity="0.35"
        >
          <animate attributeName="stroke-opacity" values="0.15;0.5;0.15"
            dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
        </line>
      ))}

      {/* 데이터 패킷 이동 */}
      {connections.slice(0, 6).map(([a, b], i) => (
        <circle key={`p${i}`} r="0.4" fill="rgb(165,180,252)">
          <animateMotion
            dur={`${2.5 + i * 0.8}s`}
            repeatCount="indefinite"
            path={`M${nodes[a].cx},${nodes[a].cy} L${nodes[b].cx},${nodes[b].cy}`}
          />
          <animate attributeName="opacity" values="0;1;1;0" dur={`${2.5 + i * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* 노드 */}
      {nodes.map((node, i) => (
        <g key={i}>
          <circle cx={node.cx} cy={node.cy} r="2.2" fill="rgb(99,102,241)" fillOpacity="0.1">
            <animate attributeName="r" values="2.2;3.5;2.2"
              dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={node.cx} cy={node.cy} r="1" fill="rgb(129,140,248)">
            <animate attributeName="opacity" values="0.5;1;0.5"
              dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}

export default function Hero({ onNavigate, t }: HeroProps) {
  const icons = [
    <Cpu key="cpu" className="w-5 h-5 text-indigo-600" />,
    <AppWindow key="app" className="w-5 h-5 text-indigo-600" />,
    <Award key="award" className="w-5 h-5 text-indigo-600" />,
  ];

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden bg-slate-900">
      {/* Agent AI 애니메이션 배경 */}
      <div className="absolute inset-0 z-0">
        <AgentAIBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero text branding */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]"
            >
              {t.hero.titleLine1}
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-300">
                {t.hero.titleLine2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed"
            >
              {t.hero.quote}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
            >
              <button
                onClick={() => onNavigate("contact")}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-[0.98] transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>{t.hero.ctaButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          {/* Core Feature highlights box */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/90 p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl backdrop-blur-sm space-y-6"
            >
              <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-3">
                {t.hero.featuresTitle}
              </h3>

              <div className="space-y-4">
                {t.hero.features.map((feature, idx) => (
                  <div key={idx} className="flex space-x-4 items-start">
                    <span className="p-2 rounded-xl bg-indigo-50/70 border border-indigo-100/50 shrink-0">
                      {icons[idx]}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">{feature.title}</h4>
                      <p className="text-xs text-slate-500 leading-normal">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
