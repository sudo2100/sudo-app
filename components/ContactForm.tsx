"use client";

import { useState, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle, Phone, Mail, Award } from "lucide-react";
import type { ContactData } from "@/lib/types";
import type { Translations } from "@/lib/translations";

interface ContactFormProps {
  t: Translations;
}

export default function ContactForm({ t }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    course: t.contact.courseOptions[0],
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert(t.contact.validationAlert);
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }

      setSubmitSuccess(t.contact.successMessage);
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: t.contact.courseOptions[0],
        message: "",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.contact.unknownError;
      console.error("Contact submission failed:", message);
      alert(`${t.contact.errorAlertPrefix}${message}${t.contact.errorAlertSuffix}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50">
            {t.contact.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.contact.title}
          </h2>
          <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full" />
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">

          {/* Column 1: Contact direct Card */}
          <div className="lg:col-span-4 bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-between shadow-xl space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-extrabold tracking-tight">{t.contact.leftCardTitle}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                {t.contact.leftCardDesc}
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3.5">
                  <span className="p-2.5 bg-white/10 rounded-xl">
                    <Mail className="w-4 h-4 text-indigo-400" />
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">{t.contact.emailLabel}</span>
                    <a href="mailto:sudo2100@naver.com" className="text-xs font-bold text-slate-100 hover:text-indigo-300">
                      sudo2100@naver.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <span className="p-2.5 bg-white/10 rounded-xl">
                    <Phone className="w-4 h-4 text-indigo-400" />
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">{t.contact.websiteLabel}</span>
                    <span className="text-xs font-bold text-slate-100">www.sudo-app.kr</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <span className="p-2.5 bg-white/10 rounded-xl">
                    <Award className="w-4 h-4 text-indigo-400" />
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">{t.contact.curriculumLabel}</span>
                    <span className="text-xs font-bold text-slate-100">{t.contact.curriculumValue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro info */}
            <div className="pt-6 border-t border-white/10 text-[10px] text-slate-400 font-medium">
              {t.contact.privacyNote}
            </div>
          </div>

          {/* Column 2: Form application */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 border border-slate-100 rounded-3xl shadow-xl flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t.contact.nameLabel}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.contact.namePlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-3 text-xs text-slate-800 transition"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t.contact.emailFieldLabel}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-3 text-xs text-slate-800 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t.contact.phoneFieldLabel}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="010-0000-0000"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-3 text-xs text-slate-800 transition"
                  />
                </div>

                {/* Course option */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{t.contact.courseFieldLabel}</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-3 text-xs text-slate-800 transition cursor-pointer"
                  >
                    {t.contact.courseOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message text area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{t.contact.messageLabel}</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-3 text-xs text-slate-800 transition resize-none"
                />
              </div>

              {/* Actions success */}
              <div className="flex flex-col space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide rounded-xl shadow-lg shadow-indigo-600/10 active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? t.contact.submittingLabel : t.contact.submitLabel}</span>
                </button>

                <AnimatePresence>
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start space-x-2 text-emerald-800 text-xs leading-relaxed"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{submitSuccess}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
