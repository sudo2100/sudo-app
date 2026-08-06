"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronRight, Play, Pause, Smartphone } from "lucide-react";
import type { ProjectItem } from "@/lib/types";
import type { Translations } from "@/lib/translations";

interface ProjectsProps {
  t: Translations;
}

// 상품 목록 컴포넌트
function ShoppingDetailPreview() {
  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col overflow-hidden group-hover:scale-103 transition-transform duration-500 origin-center">
      <div className="flex-1 flex flex-col px-8 py-5 overflow-hidden">

        {/* 상세 레이아웃 (간소화: 이미지만 표시) */}
        <div className="flex-1 min-h-0 flex items-center justify-center">
          {/* 이미지 박스 - 전체로 확장 */}
          <div className="w-full flex items-center justify-center">
            <div
              className="w-full rounded-xl p-6 flex items-center justify-center"
              style={{
                backgroundImage: "url(/images/back.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-full">
                <img src="/images/products.png" alt="무선마우스" className="max-h-[360px] max-w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PROJECT_META: { id: string; imageUrl: string; techStack: string[] }[] = [
  {
    id: "project_number_recognizer",
    imageUrl: "/video/hand_writing.mp4",
    techStack: ["Python", "TensorFlow/Keras", "MNIST", "Claude Code"],
  },
  {
    id: "project_shop",
    imageUrl: "/images/products.png",
    techStack: ["TypeScript", "React", "Express", "PostgreSQL"],
  },
  {
    id: "project_iro",
    imageUrl: "/images/ironews.png",
    techStack: ["WordPress", "JavaScript", "Claude AI", "Web-crawling"],
  },
];

export default function Projects({ t }: ProjectsProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const projects: ProjectItem[] = t.projects.items.map((item, idx) => ({
    ...item,
    ...PROJECT_META[idx],
  }));

  return (
    <section id="projects" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50">
            {t.projects.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.projects.title}
          </h2>
          <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full" />
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Projects Grid cards */}
        <div className="space-y-16">
          {projects.map((proj, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                {/* Visual Representation Column */}
                <div className={`lg:col-span-6 relative overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative h-64 sm:h-80 lg:h-full min-h-[320px] group">
                    {proj.id === "project_shop" ? (
                      <ShoppingDetailPreview />
                    ) : proj.id === "project_number_recognizer" ? (
                      <>
                        <video
                          ref={videoRef}
                          src={proj.imageUrl}
                          className="absolute inset-0 w-full h-full object-cover"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                          <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-1.5 w-24 sm:w-28">
                            <img src="/images/number.png" alt={t.projects.trainingDataLabel} className="w-full h-auto rounded object-cover" />
                            <span className="block text-center text-[9px] font-bold text-slate-500 mt-1">{t.projects.trainingDataLabel}</span>
                          </div>
                          <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-1.5 w-24 sm:w-28">
                            <img src="/images/recognizer.png" alt={t.projects.executionLabel} className="w-full h-auto rounded object-cover" />
                            <span className="block text-center text-[9px] font-bold text-slate-500 mt-1">{t.projects.executionLabel}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={togglePlayPause}
                          className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-950/25 hover:bg-slate-900 transition"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlaying ? t.projects.pauseLabel : t.projects.playLabel}</span>
                        </button>
                      </>
                    ) : (
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className={`absolute inset-0 w-full h-full group-hover:scale-103 transition-transform duration-500 ${proj.id === "project_iro" ? "object-contain bg-white" : "object-cover"}`}
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

                    {/* Floating pill indicators */}
                    <div className={`absolute bottom-4 left-4 right-4 flex items-center text-white ${proj.id === "project_number_recognizer" ? "justify-end" : "justify-between"}`}>
                      {proj.id !== "project_number_recognizer" && (
                        <span className="text-xs bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-full font-bold inline-flex items-center space-x-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{t.projects.responsiveLabel}</span>
                        </span>
                      )}
                      <span className="text-xs bg-indigo-600/90 backdrop-blur px-3 py-1.5 rounded-full font-extrabold tracking-wide">
                        {proj.techStack[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content description column */}
                <div className={`lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>

                  {/* Card head metadata */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="p-1 px-2.5 rounded-md text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700">
                        {proj.role}
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      {proj.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500">
                      {proj.subtitle}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed pt-2">
                      {proj.description}
                    </p>
                  </div>

                  {/* Core features bullet metrics list */}
                  <div className="space-y-2.5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                    <span className="text-xs font-extrabold text-slate-400 tracking-wider uppercase block mb-1">
                      {t.projects.coreFeaturesLabel}
                    </span>
                    <ul className="space-y-2">
                      {proj.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack labels and tags */}
                  <div className="flex justify-between items-center pt-2 flex-wrap gap-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <a
                      href="#contact"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <span>{t.projects.contactCta}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
