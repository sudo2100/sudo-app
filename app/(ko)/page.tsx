"use client";

import HomeSections from "@/components/HomeSections";
import { translations } from "@/lib/translations";

export default function KoHomePage() {
  return <HomeSections t={translations.ko} locale="ko" />;
}
