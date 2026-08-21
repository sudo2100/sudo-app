export interface Translations {
  nav: {
    menuItems: { id: string; label: string; href?: string }[];
    openMenuAria: string;
    languageButton: string;
    languageOptions: { code: "ko" | "en"; label: string; sub: string }[];
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    quote: string;
    ctaButton: string;
    featuresTitle: string;
    features: { title: string; desc: string }[];
  };
  profile: {
    sectionTitle: string;
    sectionSubtitle: string;
    companyTag: string;
    companyName: string;
    companyDesc: string;
    ceoSectionTitle: string;
    ceoSectionSubtitle: string;
    photoBadge: string;
    ceoBadge: string;
    ceoName: string;
    ceoNameSub: string;
    ceoDesc: string;
    careerTitle: string;
    careerList: string[];
    showMore: string;
    showLess: string;
    licenseTitle: string;
    licenses: string[];
    eduTitle: string;
    education: string[];
    businessTitle: string;
    businessSubtitle: string;
    businessAreas: { title: string; desc: string }[];
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    coreFeaturesLabel: string;
    responsiveLabel: string;
    contactCta: string;
    playLabel: string;
    pauseLabel: string;
    trainingDataLabel: string;
    executionLabel: string;
    items: {
      title: string;
      subtitle: string;
      description: string;
      role: string;
      features: string[];
    }[];
  };
  aiNews: {
    badge: string;
    title: string;
    summaryEmpty: string;
    summaryCount: (count: number) => string;
    updatedAtPrefix: string;
    updatedAtSuffix: string;
    loadingText: string;
    errorTitle: string;
    noNews: string;
    sourceFallback: string;
    fetchErrorMessage: string;
    unknownError: string;
    timeJustNow: string;
    timeMinutesAgo: (n: number) => string;
    timeHoursAgo: (n: number) => string;
    timeDaysAgo: (n: number) => string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    courseOptions: string[];
    leftCardTitle: string;
    leftCardDesc: string;
    emailLabel: string;
    websiteLabel: string;
    curriculumLabel: string;
    curriculumValue: string;
    privacyNote: string;
    nameLabel: string;
    namePlaceholder: string;
    emailFieldLabel: string;
    phoneFieldLabel: string;
    courseFieldLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    submittingLabel: string;
    validationAlert: string;
    successMessage: string;
    errorAlertPrefix: string;
    errorAlertSuffix: string;
    unknownError: string;
  };
  footer: {
    companyName: string;
    companyTag: string;
    companyDesc: string;
    ceoLabel: string;
    bizNumberLabel: string;
    contactInfoTitle: string;
    address: string;
    scrollToTopAria: string;
    copyright: string;
  };
  popup: {
    title: string;
    subtitle: string;
    closeAria: string;
    confirmButton: string;
  };
  notices: {
    pageTitle: string;
    pageSubtitle: string;
    empty: string;
  };
}

export const translations: Record<"ko" | "en", Translations> = {
  ko: {
    nav: {
      menuItems: [
        { id: "hero", label: "홈" },
        { id: "profile", label: "회사 소개" },
        { id: "projects", label: "대표 실적" },
        { id: "ai-news", label: "AI 뉴스" },
        { id: "notices", label: "공지사항", href: "/notices" },
        { id: "contact", label: "코칭 신청" },
      ],
      openMenuAria: "메뉴 열기",
      languageButton: "Language",
      languageOptions: [
        { code: "ko", label: "한국어", sub: "KOR" },
        { code: "en", label: "English", sub: "ENG" },
      ],
    },
    hero: {
      badge: "10년 경력의 검증된 IT 교육 멘토",
      titleLine1: "AI - Coaching",
      titleLine2: "코드를 넘어 AI와 함께 성장하는 시대",
      quote:
        "\"AI는 더 이상 미래 기술이 아닙니다. 지금 바로 여러분의 경쟁력이 됩니다. 실무 중심의 경험과 검증된 노하우로 당신의 새로운 도전을 주도하겠습니다.\"",
      ctaButton: "코칭 과정 문의하기",
      featuresTitle: "AI 코칭 핵심 배움 리스트",
      features: [
        {
          title: "생성형 AI & 프롬프트 엔지니어링",
          desc: "단순 입력을 넘어서 정확한 의도의 질의로 원하는 개발 성과를 유도하는 코칭",
        },
        {
          title: "실무 자동화 & 생산성 제고",
          desc: "고부가가치 실무 수행을 위한 최신 AI 자동화 도구 이식 및 통합 활용기법",
        },
        {
          title: "현장 검증 수준 맞춤 전수",
          desc: "10년 국비 교육 현장에서 누적된 검증된 세부 가이드 및 실제 비즈니스 자문 연계",
        },
      ],
    },
    profile: {
      sectionTitle: "회사 소개",
      sectionSubtitle: "소프트웨어 개발과 AI 기술로 더 나은 미래를 만듭니다",
      companyTag: "Advanced Software & AI",
      companyName: "$UDO소프트",
      companyDesc:
        "소프트웨어 개발과 인공지능 솔루션을 결합하여 기업과 개인의 디지털 혁신을 이끌어가는 IT 전문 기업입니다. 컴퓨터 프로그래밍 서비스부터 AI 기반 자동화, 전문 교육까지 폭넓은 서비스를 제공합니다.",
      ceoSectionTitle: "대표 소개",
      ceoSectionSubtitle: "SUDO소프트를 이끌어가는 사람",
      photoBadge: "대표 김기용",
      ceoBadge: "CEO",
      ceoName: "김기용",
      ceoNameSub: "Giyong Kim",
      ceoDesc:
        "15년간 프로그래밍 실무와 교육 현장을 겸해온 IT 전문가로, AI 기술과 소프트웨어 개발을 접목한 혁신적인 솔루션을 제공합니다.",
      careerTitle: "주요 경력",
      careerList: [
        "현) SUDO소프트 대표이사",
        "현) 더조은컴퓨터 아카데미 직업훈련교사(IT 분야)",
        "현) 한국AI서비스학회 생성형 AI 분과 위원",
        "스페이스시엘 에듀 - K-Move(일본 취업) 웹 풀스택 웹 개발 강의",
        "정보시스템 감리 협회 - 생성형 AI 활용 강의",
        "한양사이버대학교 평생교육원 - 빅데이터 분석기사 실기",
        "코딩온(스프레틱스) - KDT 스마트 팩토리(머신러닝/딥러닝) 강의",
        "하이미디어, KH 정보교육원 - 자바(Java) 웹 개발 강의",
        "에듀윌 국비교육원, 그린컴퓨터 - 파이썬(Pytho) 웹 개발 강의",
        "(사)대한민국청소년로봇연맹 - 컨텐츠 개발/교육 이사",
        "한컴CQ교실 - 일대일 방문 교육 서비스(서대문 지사장)",
      ],
      showMore: "더보기",
      showLess: "접기",
      licenseTitle: "주요 자격",
      licenses: ["AI활용 전문가", "SQL 전문가", "정보처리기사"],
      eduTitle: "학력",
      education: [
        "서울시립대학교 행정학사 (도시행정 전공)",
        "한국방송통신대학교 이학사 (컴퓨터과학 전공)",
      ],
      businessTitle: "사업 분야",
      businessSubtitle: "다양한 IT 서비스로 고객의 성장을 지원합니다",
      businessAreas: [
        { title: "컴퓨터 프로그래밍 서비스업", desc: "맞춤형 소프트웨어 설계 및 개발" },
        { title: "홈페이지 제작 및 유지 보수", desc: "반응형 웹사이트 기획·개발·운영" },
        { title: "AI 솔루션 개발", desc: "생성형 AI 기반 자동화 및 서비스" },
        { title: "교육 서비스", desc: "IT·AI 전문 교육 및 강의 제공" },
      ],
    },
    projects: {
      badge: "RECORD & PORTFOLIO",
      title: "대표 프로젝트 실적",
      subtitle: "다양한 비즈니스 모델에 생성형 AI와 프리미엄 웹 솔루션을 접목한 실전 산출물들을 소개합니다",
      coreFeaturesLabel: "핵심 설계 특징",
      responsiveLabel: "반응형 시스템",
      contactCta: "코칭 상담 문의",
      playLabel: "재생",
      pauseLabel: "일시정지",
      trainingDataLabel: "학습 데이터(MNIST)",
      executionLabel: "실행 화면",
      items: [
        {
          title: "손글씨 숫자 인식 프로그램",
          subtitle: "MNIST 데이터셋 기반 손글씨 숫자 인식 및 실행 파일(exe) 제작",
          description: `마우스로 그린 손글씨 숫자를 실시간으로 인식하는 딥러닝 기반 OCR 프로그램입니다. Agentic AI인 클로드 코드에게 프롬프트만으로 모델 설계부터 GUI 구현, exe 패키징까지 전 과정을 맡겨 개발한 사례입니다.

    동작 원리:
    - MNIST(학습 60,000장·테스트 10,000장, 28x28 흑백 이미지) 데이터셋으로 숫자 분류 모델을 학습합니다.
    - 사용자가 캔버스에 그린 숫자를 28x28 픽셀로 축소·정규화하여 모델에 입력합니다.
    `,
          role: "Agentic AI 활용 앱 기획 및 개발",
          features: [
            "MNIST 데이터셋 학습을 통한 0~9 숫자 분류 모델 구축",
            "마우스 드로잉 캔버스 → 28x28 흑백 이미지 전처리 파이프라인 구현",
            "클로드 코드 프롬프트만으로 exe 실행 파일까지 패키징 자동화",
          ],
        },
        {
          title: "컴퓨터 기기 쇼핑몰",
          subtitle: "TypeScript Express 기반 전자기기 온라인 쇼핑몰 구축",
          description:
            "무선마우스·키보드·USB·모니터 등 컴퓨터 주변기기를 판매하는 풀스택 쇼핑몰입니다. 상품 목록·상세 페이지·장바구니·관리자 상품 등록 기능을 포함하며 Django ORM 기반으로 DB를 관리합니다.",
          role: "풀스택 기획 및 개발",
          features: [
            "상품 목록·상세·장바구니·주문 완료 흐름의 풀 페이지 구현",
            "관리자 상품 등록 및 이미지 업로드 기능 탑재",
            "로그인/로그아웃 세션 기반 인증 및 접근 권한 관리",
          ],
        },
        {
          title: "AI 뉴스룸 [이로뉴스]",
          subtitle: "생성형 AI 및 웹 자문 및 뉴스 플랫폼 구축",
          description:
            "글로벌 정세, 실시간 증시, 주요 경제 지표 등을 지능형 생성형 AI로 핵심 요약하여 독자에게 신속한 맥락을 파악시켜주는 미디어 테크 서비스입니다.",
          role: "생성형 AI 모델 커스텀 및 웹 기획 자문",
          features: [
            "LLM 기반 헤드라인 분석 및 단일 요약 피드 자동 생성 기술",
            "깔끔한 그리드 구조를 채택한 현대적 데스크톱/모바일 반응형 레이아웃",
            "주요 경제 금융 일정의 데이터 마크다운 피드 분석 대시보드 탑재",
          ],
        },
      ],
    },
    aiNews: {
      badge: "AI NEWS FEED",
      title: "AI 뉴스 한눈에 보기",
      summaryEmpty: "실시간 AI 뉴스 업데이트를 확인해 보세요.",
      summaryCount: (count) => `${count}건의 최신 AI 뉴스를 실시간으로 확인할 수 있습니다.`,
      updatedAtPrefix: "마지막 업데이트: ",
      updatedAtSuffix: " (매일 오전 7시 자동 갱신)",
      loadingText: "뉴스를 불러오는 중입니다.",
      errorTitle: "뉴스를 불러오지 못했습니다.",
      noNews: "표시할 뉴스가 없습니다.",
      sourceFallback: "AI 뉴스",
      fetchErrorMessage: "뉴스를 불러오지 못했습니다.",
      unknownError: "알 수 없는 오류가 발생했습니다.",
      timeJustNow: "방금 전",
      timeMinutesAgo: (n) => `${n}분 전`,
      timeHoursAgo: (n) => `${n}시간 전`,
      timeDaysAgo: (n) => `${n}일 전`,
    },
    contact: {
      badge: "CONSULTATION REQUEST",
      title: "코칭 과정 및 자문 상담 문의",
      subtitle: "생성형 AI 이식 및 실무 코칭 강좌 수강에 관심 있으신 분은 부담 없이 언제든 상담을 접수해 주세요",
      courseOptions: [
        "AI 코칭 과정 (생성형 AI & 프롬프트)",
        "업무/실무 자동화 비즈니스 코칭",
        "SQL 자격 및 빅데이터 특화 특강",
        "개발 기업 협업 / 생성형 AI 및 웹 자문",
      ],
      leftCardTitle: "상담안내",
      leftCardDesc:
        "SUDO 소프트 대표이자 15년 차 공인 컴퓨터 직업훈련교사 김기용이 직접 기업별, 수험 목적별 맞춤 코칭 솔루션을 제안 드립니다.",
      emailLabel: "직접 이메일 문의",
      websiteLabel: "홈페이지 코칭 신청",
      curriculumLabel: "코칭 주요 커리큘럼",
      curriculumValue: "AI 실무 자동화 / 웹 개발 강의 / 홈페이지 제작",
      privacyNote: "* 기재하신 소형 개인 정보(이름, 이메일)는 오직 김기용 강사의 회신용 용도로만 안전하게 활용됩니다.",
      nameLabel: "이름 *",
      namePlaceholder: "성함을 한글로 입력해 주세요",
      emailFieldLabel: "이메일 주소 *",
      phoneFieldLabel: "연락처 (선택)",
      courseFieldLabel: "관심 코칭 코스 선택",
      messageLabel: "문의 내용 *",
      messagePlaceholder: "상담을 원하시는 교육 내용이나, 기업 자문 이슈에 대해 자유로이 기록해 주세요.",
      submitLabel: "상담 신청 제출하기",
      submittingLabel: "문의 전송 중...",
      validationAlert: "이름, 이메일, 문의 내용은 필수 입력 정보입니다.",
      successMessage: "상담 신청이 완료되었습니다! 김기용 강사가 확인 후 메일로 신속히 답변 드리겠습니다.",
      errorAlertPrefix: "전송 중 오류가 발생했습니다: ",
      errorAlertSuffix: "\n잠시 후 다시 시도하거나 sudo2100@naver.com으로 직접 문의해 주세요.",
      unknownError: "알 수 없는 오류",
    },
    footer: {
      companyName: "SUDO 소프트",
      companyTag: "Advanced Software & AI",
      companyDesc: "나의 완벽한 비서 Agent AI",
      ceoLabel: "대표자",
      bizNumberLabel: "사업자등록번호",
      contactInfoTitle: "연락처 정보",
      address: "서울 금천구 가산디지털1로 205-27, 가산 A1타워 0218호(회의실)",
      scrollToTopAria: "위로 이동",
      copyright: "© 2026 SUDO 소프트 & Giyong Kim. All rights reserved.",
    },
    popup: {
      title: "대표강사 일정 안내",
      subtitle: "최신 강의 일정을 확인하세요.",
      closeAria: "팝업 닫기",
      confirmButton: "확인했어요",
    },
    notices: {
      pageTitle: "공지사항",
      pageSubtitle: "대표강사 강의 일정 및 주요 공지를 확인하세요.",
      empty: "등록된 공지사항이 없습니다.",
    },
  },
  en: {
    nav: {
      menuItems: [
        { id: "hero", label: "Home" },
        { id: "profile", label: "Company" },
        { id: "projects", label: "Portfolio" },
        { id: "ai-news", label: "AI News" },
        { id: "notices", label: "Notices", href: "/en/notices" },
        { id: "contact", label: "Apply" },
      ],
      openMenuAria: "Open menu",
      languageButton: "Language",
      languageOptions: [
        { code: "ko", label: "한국어", sub: "KOR" },
        { code: "en", label: "English", sub: "ENG" },
      ],
    },
    hero: {
      badge: "A Trusted IT Education Mentor with 10 Years of Experience",
      titleLine1: "AI - Coaching",
      titleLine2: "An Era of Growing With AI, Beyond Code",
      quote:
        "\"AI is no longer a technology of the future — it's your competitive edge, starting now. With hands-on experience and proven know-how, I'll lead the way for your next challenge.\"",
      ctaButton: "Inquire About Coaching",
      featuresTitle: "Key AI Coaching Curriculum",
      features: [
        {
          title: "Generative AI & Prompt Engineering",
          desc: "Coaching that goes beyond simple input to precise, intent-driven prompts that produce the development results you want",
        },
        {
          title: "Workplace Automation & Productivity",
          desc: "Adopting and integrating the latest AI automation tools for high-value professional work",
        },
        {
          title: "Field-Tested, Tailored Instruction",
          desc: "Proven, detailed guidance built from 10 years of government-funded training, linked with real business consulting",
        },
      ],
    },
    profile: {
      sectionTitle: "Company",
      sectionSubtitle: "Building a better future through software development and AI technology",
      companyTag: "Advanced Software & AI",
      companyName: "$UDO Soft",
      companyDesc:
        "We are an IT specialist company driving digital innovation for businesses and individuals by combining software development with AI solutions. Our services span computer programming, AI-based automation, and professional education.",
      ceoSectionTitle: "CEO Introduction",
      ceoSectionSubtitle: "The person leading SUDO Soft",
      photoBadge: "CEO Giyong Kim",
      ceoBadge: "CEO",
      ceoName: "Giyong Kim",
      ceoNameSub: "CEO, SUDO Soft",
      ceoDesc:
        "An IT specialist with 15 years of combined hands-on programming and teaching experience, delivering innovative solutions that merge AI technology with software development.",
      careerTitle: "Career Highlights",
      careerList: [
        "Present) CEO, SUDO Soft",
        "Present) Vocational Training Instructor (IT), The Joeun Computer Academy",
        "Present) Committee Member, Generative AI Division, Korea AI Service Society",
        "Space CL Edu - K-Move (Employment in Japan) Full-Stack Web Development Course",
        "Information System Audit Association - Generative AI Application Course",
        "Hanyang Cyber University Lifelong Education Center - Big Data Analyst Practical Exam",
        "CodingOn (Spreadics) - KDT Smart Factory (Machine Learning/Deep Learning) Course",
        "Hi Media, KH Information Education Institute - Java Web Development Course",
        "Eduwill National Training Center, Green Computer - Python Web Development Course",
        "Korea Youth Robot Federation - Director of Content Development/Education",
        "Hancom CQ Classroom - One-on-One On-Site Education Service (Seodaemun Branch Manager)",
      ],
      showMore: "Show more",
      showLess: "Show less",
      licenseTitle: "Certifications",
      licenses: ["AI Utilization Specialist", "SQL Specialist", "Engineer Information Processing"],
      eduTitle: "Education",
      education: [
        "B.A. in Public Administration (Urban Administration), University of Seoul",
        "B.S. in Computer Science, Korea National Open University",
      ],
      businessTitle: "Business Areas",
      businessSubtitle: "Supporting client growth through a wide range of IT services",
      businessAreas: [
        { title: "Computer Programming Services", desc: "Custom software design and development" },
        { title: "Website Development & Maintenance", desc: "Planning, development, and operation of responsive websites" },
        { title: "AI Solution Development", desc: "Automation and services powered by generative AI" },
        { title: "Education Services", desc: "Specialized IT and AI training and lectures" },
      ],
    },
    projects: {
      badge: "RECORD & PORTFOLIO",
      title: "Featured Project Portfolio",
      subtitle: "Real-world results combining generative AI and premium web solutions across diverse business models",
      coreFeaturesLabel: "Key Design Features",
      responsiveLabel: "Responsive System",
      contactCta: "Inquire About Coaching",
      playLabel: "Play",
      pauseLabel: "Pause",
      trainingDataLabel: "Training Data (MNIST)",
      executionLabel: "Live Demo",
      items: [
        {
          title: "Handwritten Digit Recognizer",
          subtitle: "Handwritten digit recognition based on the MNIST dataset, packaged as an executable (exe)",
          description: `A deep learning-based OCR program that recognizes handwritten digits drawn with a mouse in real time. Built by delegating the entire process — from model design to GUI implementation and exe packaging — to Claude Code (an agentic AI) using only prompts.

    How it works:
    - Trains a digit classification model on the MNIST dataset (60,000 training / 10,000 test 28x28 grayscale images).
    - Downscales and normalizes the digit drawn on the canvas to 28x28 pixels before feeding it into the model.
    `,
          role: "Planning & Development Using Agentic AI",
          features: [
            "Built a 0-9 digit classification model trained on the MNIST dataset",
            "Implemented a preprocessing pipeline converting the mouse-drawn canvas into 28x28 grayscale images",
            "Automated packaging into an executable file using only Claude Code prompts",
          ],
        },
        {
          title: "Computer Peripherals Shopping Mall",
          subtitle: "Built an online electronics shopping mall using TypeScript and Express",
          description:
            "A full-stack shopping mall selling computer peripherals such as wireless mice, keyboards, USB devices, and monitors. Includes a product list, detail pages, shopping cart, and admin product registration, with the database managed via Django ORM.",
          role: "Full-Stack Planning & Development",
          features: [
            "Implemented the full product list, detail, cart, and order-completion flow",
            "Built admin product registration with image upload support",
            "Session-based login/logout authentication and access control",
          ],
        },
        {
          title: "AI Newsroom [IRO News]",
          subtitle: "Built a generative-AI-powered news and web consulting platform",
          description:
            "A media-tech service that uses intelligent generative AI to summarize global affairs, real-time stock markets, and key economic indicators, helping readers quickly grasp the context.",
          role: "Generative AI Model Customization & Web Planning Consultation",
          features: [
            "LLM-based headline analysis with automatic single-summary feed generation",
            "Modern desktop/mobile responsive layout with a clean grid structure",
            "Dashboard analyzing markdown data feeds of key economic and financial schedules",
          ],
        },
      ],
    },
    aiNews: {
      badge: "AI NEWS FEED",
      title: "AI News At a Glance",
      summaryEmpty: "Check out the latest real-time AI news updates.",
      summaryCount: (count) => `You can view ${count} of the latest AI news items in real time.`,
      updatedAtPrefix: "Last updated: ",
      updatedAtSuffix: " (auto-refreshed daily at 7 AM)",
      loadingText: "Loading news...",
      errorTitle: "Failed to load news.",
      noNews: "No news to display.",
      sourceFallback: "AI News",
      fetchErrorMessage: "Failed to load news.",
      unknownError: "An unknown error occurred.",
      timeJustNow: "just now",
      timeMinutesAgo: (n) => `${n}m ago`,
      timeHoursAgo: (n) => `${n}h ago`,
      timeDaysAgo: (n) => `${n}d ago`,
    },
    contact: {
      badge: "CONSULTATION REQUEST",
      title: "Coaching & Consulting Inquiry",
      subtitle: "If you're interested in generative AI adoption or hands-on coaching courses, feel free to reach out anytime",
      courseOptions: [
        "AI Coaching Course (Generative AI & Prompts)",
        "Business Automation Coaching",
        "SQL Certification & Big Data Special Lecture",
        "Corporate Collaboration / Generative AI & Web Consulting",
      ],
      leftCardTitle: "Consultation Guide",
      leftCardDesc:
        "Giyong Kim, CEO of SUDO Soft and a certified vocational training instructor with 15 years of experience, personally proposes tailored coaching solutions for each company and goal.",
      emailLabel: "Direct Email Inquiry",
      websiteLabel: "Apply for Coaching via Website",
      curriculumLabel: "Key Coaching Curriculum",
      curriculumValue: "AI Workplace Automation / Web Development Training / Website Development",
      privacyNote: "* The personal information you provide (name, email) is used solely and securely for Giyong Kim's reply.",
      nameLabel: "Name *",
      namePlaceholder: "Enter your name",
      emailFieldLabel: "Email Address *",
      phoneFieldLabel: "Phone (optional)",
      courseFieldLabel: "Select Course of Interest",
      messageLabel: "Message *",
      messagePlaceholder: "Feel free to describe the training or business consulting topic you'd like to discuss.",
      submitLabel: "Submit Inquiry",
      submittingLabel: "Sending...",
      validationAlert: "Name, email, and message are required.",
      successMessage: "Your inquiry has been submitted! Instructor Giyong Kim will review it and reply by email promptly.",
      errorAlertPrefix: "An error occurred while sending: ",
      errorAlertSuffix: "\nPlease try again later or contact sudo2100@naver.com directly.",
      unknownError: "Unknown error",
    },
    footer: {
      companyName: "SUDO Soft",
      companyTag: "Advanced Software & AI",
      companyDesc: "My perfect assistant, Agent AI",
      ceoLabel: "CEO",
      bizNumberLabel: "Business Registration No.",
      contactInfoTitle: "Contact Information",
      address: "Room 0218, Gasan A1 Tower, 205-27 Gasandigital 1-ro, Geumcheon-gu, Seoul (Conference Room)",
      scrollToTopAria: "Scroll to top",
      copyright: "© 2026 SUDO Soft & Giyong Kim. All rights reserved.",
    },
    popup: {
      title: "Lead Instructor Schedule Notice",
      subtitle: "Check the latest class schedule.",
      closeAria: "Close popup",
      confirmButton: "Got it",
    },
    notices: {
      pageTitle: "Notices",
      pageSubtitle: "Check the latest class schedule and announcements.",
      empty: "No notices yet.",
    },
  },
};
