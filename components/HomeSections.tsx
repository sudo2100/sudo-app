"use client";

import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Profile from "./Profile";
import Projects from "./Projects";
import AiNews from "./AiNews";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import SchedulePopup from "./SchedulePopup";
import { translations } from "@/lib/translations";
import type { Locale } from "@/lib/locale";
import type { ScheduleItem } from "@/lib/types";

interface HomeSectionsProps {
  locale: Locale;
  initialSchedules?: ScheduleItem[];
}

export default function HomeSections({ locale, initialSchedules }: HomeSectionsProps) {
  const t = translations[locale];
  const [activeSection, setActiveSection] = useState("hero");

  // Monitor scroll progression to dynamically update active section trigger
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "profile", "projects", "ai-news", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Top sticky Navigation header */}
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} t={t} locale={locale} />

      {/* Main Sections */}
      <main className="space-y-0">
        <Hero onNavigate={handleNavigate} t={t} />
        <Profile t={t} />
        <Projects t={t} />
        <AiNews t={t} locale={locale} />
        <ContactForm t={t} />
      </main>

      {/* Standard global Footer */}
      <Footer onScrollToTop={handleScrollToTop} t={t} />

      <SchedulePopup t={t} initialItems={initialSchedules} />
    </div>
  );
}
