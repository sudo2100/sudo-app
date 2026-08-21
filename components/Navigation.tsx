"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe } from "lucide-react";
import type { Translations } from "@/lib/translations";
import type { Locale } from "@/lib/locale";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  t: Translations;
  locale: Locale;
}

export default function Navigation({ activeSection, onNavigate, t, locale }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const menuItems = t.nav.menuItems;

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  const hrefForLocale = (code: Locale) => (code === "ko" ? "/" : "/en");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <button
            className="flex items-center cursor-pointer pl-2 sm:pl-4 md:pl-6 lg:pl-8"
            onClick={() => handleNavigate("hero")}
          >
            <img
              src="/images/sudo_logo.png"
              alt="SUDO AI Coaching"
              className="h-8 sm:h-9 md:h-11 lg:h-12 xl:h-14 w-auto ml-2 sm:ml-3 md:ml-4 lg:ml-6 transform"
              style={{ transform: "scale(1.44)" }}
            />
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) =>
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative py-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeSection === item.id ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`relative py-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeSection === item.id ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ),
            )}

            {/* Language Switcher (desktop) */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>{t.nav.languageButton}</span>
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50"
                    >
                      {t.nav.languageOptions.map((option) => (
                        <Link
                          key={option.code}
                          href={hrefForLocale(option.code)}
                          onClick={() => setLangMenuOpen(false)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left transition cursor-pointer ${
                            locale === option.code ? "bg-indigo-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <span className={`text-sm font-bold ${locale === option.code ? "text-indigo-600" : "text-slate-800"}`}>
                            {option.label}
                          </span>
                          <span className="text-xs text-slate-400">{option.sub}</span>
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Hamburger Button (mobile) */}
          <button
            className="md:hidden text-slate-600 hover:text-slate-900 transition cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={t.nav.openMenuAria}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-slate-100"
          >
            <div className="px-4 py-3 flex flex-col space-y-1">
              {menuItems.map((item) =>
                item.href ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      activeSection === item.id
                        ? "text-indigo-600 bg-indigo-50 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      activeSection === item.id
                        ? "text-indigo-600 bg-indigo-50 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ),
              )}

              {/* Language Switcher (mobile) */}
              <div className="pt-2 mt-2 border-t border-slate-100">
                <span className="block px-3 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.nav.languageButton}
                </span>
                <div className="flex px-3 gap-2">
                  {t.nav.languageOptions.map((option) => (
                    <Link
                      key={option.code}
                      href={hrefForLocale(option.code)}
                      className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                        locale === option.code
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
