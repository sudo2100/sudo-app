"use client";

import HomeSections from "@/components/HomeSections";
import { translations } from "@/lib/translations";

export default function EnHomePage() {
  return <HomeSections t={translations.en} locale="en" />;
}
