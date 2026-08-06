"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, FileCheck, GraduationCap, ChevronDown } from "lucide-react";
import type { Translations } from "@/lib/translations";

interface ProfileProps {
  t: Translations;
}

export default function Profile({ t }: ProfileProps) {
  const [showMoreCareer, setShowMoreCareer] = useState(false);

  const businessAreas = t.profile.businessAreas;
  const careerList = t.profile.careerList;
  const licenses = t.profile.licenses;
  const education = t.profile.education;

  return (
    <section id="profile" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.profile.sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full" />
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            {t.profile.sectionSubtitle}
          </p>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-linear-to-br from-sky-50 via-blue-50 to-indigo-100 border border-sky-100 rounded-3xl p-8 sm:p-12 mb-12 text-slate-900 relative overflow-hidden"
        >
          {/* 배경 장식 — Hero 섹션과 동일한 느낌 */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              {[{cx:85,cy:15},{cx:60,cy:50},{cx:90,cy:70},{cx:40,cy:20},{cx:75,cy:85}].map((n,i)=>(
                <g key={i}>
                  <circle cx={n.cx} cy={n.cy} r="6" fill="rgb(79,70,229)" fillOpacity="0.1">
                    <animate attributeName="r" values="5;9;5" dur={`${3+i*0.6}s`} repeatCount="indefinite"/>
                  </circle>
                  <circle cx={n.cx} cy={n.cy} r="1.2" fill="rgb(79,70,229)">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2+i*0.4}s`} repeatCount="indefinite"/>
                  </circle>
                </g>
              ))}
              <line x1="85" y1="15" x2="60" y2="50" stroke="rgb(79,70,229)" strokeWidth="0.3" strokeOpacity="0.4"/>
              <line x1="60" y1="50" x2="90" y2="70" stroke="rgb(79,70,229)" strokeWidth="0.3" strokeOpacity="0.4"/>
              <line x1="60" y1="50" x2="40" y2="20" stroke="rgb(79,70,229)" strokeWidth="0.3" strokeOpacity="0.4"/>
              <line x1="90" y1="70" x2="75" y2="85" stroke="rgb(79,70,229)" strokeWidth="0.3" strokeOpacity="0.4"/>
            </svg>
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-300/20 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-300/20 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* 로고 — 흰색 카드 위에 올려 또렷하게 보이도록 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xl shrink-0">
              <img
                src="/images/sudo_logo_trimmed.png"
                alt="SUDO소프트 로고"
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto"
              />
            </div>
            <div className="text-center md:text-left space-y-3">
              <p className="text-indigo-600 text-sm font-bold tracking-widest uppercase">{t.profile.companyTag}</p>
              <h3 className="text-4xl font-extrabold tracking-tight text-slate-900">{t.profile.companyName}</h3>
              <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                {t.profile.companyDesc}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Representative Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h4 className="text-xl font-extrabold text-slate-900">{t.profile.ceoSectionTitle}</h4>
            <p className="text-slate-500 text-sm mt-1">{t.profile.ceoSectionSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Photo */}
            <div className="lg:col-span-4 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative p-3 bg-white border border-slate-100 rounded-3xl shadow-xl w-full max-w-xs"
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 relative group">
                  <img
                    src="/images/giyong_kim.png"
                    alt={t.profile.photoBadge}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-full font-bold">
                      {t.profile.photoBadge}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Info */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                  {t.profile.ceoBadge}
                </span>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                  {t.profile.ceoName} <span className="text-lg font-medium text-slate-500">{t.profile.ceoNameSub}</span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.profile.ceoDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Career */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-sm font-bold text-slate-900">{t.profile.careerTitle}</h4>
                  </div>
                  <ul className="space-y-2">
                    {careerList.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 leading-relaxed flex items-start space-x-1.5">
                        <span className="text-indigo-600 font-bold shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                    <AnimatePresence>
                      {showMoreCareer && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden space-y-2"
                        >
                          {careerList.slice(4).map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-600 leading-relaxed flex items-start space-x-1.5">
                              <span className="text-indigo-600 font-bold shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ul>
                  <button
                    onClick={() => setShowMoreCareer(!showMoreCareer)}
                    className="mt-2 flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                  >
                    <span>{showMoreCareer ? t.profile.showLess : t.profile.showMore}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showMoreCareer ? "rotate-180" : ""}`} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Licenses */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                      <FileCheck className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-sm font-bold text-slate-900">{t.profile.licenseTitle}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {licenses.map((item, idx) => (
                        <span key={idx} className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/50">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-sm font-bold text-slate-900">{t.profile.eduTitle}</h4>
                    </div>
                    <ul className="space-y-2">
                      {education.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-600 leading-relaxed flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Business Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h4 className="text-xl font-extrabold text-slate-900">{t.profile.businessTitle}</h4>
            <p className="text-slate-500 text-sm mt-1">{t.profile.businessSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {businessAreas.map((area, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg mb-4">
                  {idx + 1}
                </div>
                <h5 className="text-sm font-extrabold text-slate-900 mb-1 leading-snug">{area.title}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
