export type Role = {
  slug: string;
  title: string;
  openings: number;
  summary: string;
  location: string;
  date: string;
  jobType: string;
  intro: string;
  responsibilities: string[];
  requirements: string[];
  experience: string;
  salary: string;
  deadline: string;
};

export type CareersContent = {
  perks: string[];
  closing: string;
  workingHours: string;
  workingDays: string;
  educationNote: string;
};

type Locale = "en" | "ar";

// ponytail: placeholder data, swap for CMS query once backend decided
const rolesByLocale: Record<Locale, Role[]> = {
  en: [
    {
      slug: "ui-ux-designer",
      title: "UI/UX Designer",
      openings: 2,
      summary:
        "Design intuitive, elegant interfaces across our web and product surfaces — from wireframes to polished, production-ready screens.",
      location: "New Cairo, Egypt",
      date: "1 Sep 2026",
      jobType: "Full time (On-site)",
      intro:
        "We're looking for a UI/UX Designer to shape how people experience Margins' developments online — from the first landing page to the final signed contract.",
      responsibilities: [
        "Design wireframes, prototypes, and polished UI for our marketing site and internal tools",
        "Run usability sessions and translate findings into concrete design improvements",
        "Maintain and extend our design system for consistency across every page",
        "Partner closely with frontend engineers to ship pixel-accurate interfaces",
      ],
      requirements: [
        "3+ years designing product or marketing interfaces",
        "Strong portfolio showing end-to-end design process, not just final screens",
        "Comfortable in Figma, including auto-layout, variables, and component libraries",
        "Clear communicator who can justify design decisions with reasoning, not just taste",
      ],
      experience: "3+ Years Experience",
      salary: "EGP 25k - 40k (Monthly)",
      deadline: "30 Nov 2026",
    },
    {
      slug: "frontend-developer",
      title: "Frontend Developer",
      openings: 5,
      summary:
        "Build fast, accessible, pixel-accurate interfaces in React and Next.js, working closely with design to ship production features.",
      location: "New Cairo, Egypt / Remote",
      date: "1 Sep 2026",
      jobType: "Full time (Hybrid)",
      intro:
        "We're hiring a Frontend Developer to help build and maintain the Margins Development web platform — fast, accessible, and true to the brand.",
      responsibilities: [
        "Build interfaces in React and Next.js from Figma designs, pixel by pixel",
        "Own performance and accessibility across every page we ship",
        "Work directly with design and product to scope and estimate new features",
        "Write clean, typed, testable TypeScript",
      ],
      requirements: [
        "3+ years of production React experience",
        "Solid grasp of TypeScript, modern CSS, and responsive layout",
        "Experience with Next.js App Router is a strong plus",
        "Comfortable reading a design file and matching it precisely",
      ],
      experience: "3+ Years Experience",
      salary: "EGP 30k - 50k (Monthly)",
      deadline: "30 Nov 2026",
    },
    {
      slug: "product-manager",
      title: "Product Manager",
      openings: 1,
      summary:
        "Own the roadmap for our digital products, translating business goals into clear requirements the team can execute against.",
      location: "New Cairo, Egypt",
      date: "1 Sep 2026",
      jobType: "Full time (On-site)",
      intro:
        "We're looking for a Product Manager to own the roadmap for our digital products and keep design, engineering, and sales pointed at the same goals.",
      responsibilities: [
        "Define and prioritize the product roadmap based on business and customer needs",
        "Write clear requirements the design and engineering teams can build against",
        "Run regular syncs to unblock the team and keep delivery on track",
        "Track product metrics and report on impact after each release",
      ],
      requirements: [
        "2+ years managing digital products end-to-end",
        "Comfortable working directly with designers and engineers day-to-day",
        "Strong written communication — specs, updates, and stakeholder reports",
        "Real estate or property-tech experience is a plus, not required",
      ],
      experience: "2+ Years Experience",
      salary: "EGP 35k - 55k (Monthly)",
      deadline: "30 Nov 2026",
    },
    {
      slug: "javascript-engineer",
      title: "JavaScript Engineer",
      openings: 3,
      summary:
        "Write reliable, well-tested JavaScript/TypeScript across our stack, from internal tooling to customer-facing features.",
      location: "New Cairo, Egypt / Remote",
      date: "1 Sep 2026",
      jobType: "Full time (Remote)",
      intro:
        "We're hiring a JavaScript Engineer to build reliable tooling and features across our stack, from internal dashboards to customer-facing pages.",
      responsibilities: [
        "Build and maintain internal tools alongside customer-facing features",
        "Write tests for the code paths that matter, not for coverage numbers",
        "Review pull requests and help raise the bar on code quality",
        "Debug production issues and ship fixes with confidence",
      ],
      requirements: [
        "3+ years of professional JavaScript/TypeScript experience",
        "Comfortable across both frontend and backend Node.js code",
        "Experience with REST or GraphQL APIs",
        "Pragmatic about trade-offs — ships working software, not perfect software",
      ],
      experience: "3+ Years Experience",
      salary: "EGP 30k - 50k (Monthly)",
      deadline: "30 Nov 2026",
    },
    {
      slug: "site-engineer",
      title: "Site Engineer",
      openings: 4,
      summary:
        "Oversee day-to-day construction quality and safety on-site, coordinating with contractors to keep projects on schedule.",
      location: "North Coast, Egypt",
      date: "1 Sep 2026",
      jobType: "Full time (On-site)",
      intro:
        "We're looking for a Site Engineer to oversee day-to-day construction quality and safety on one of our active developments.",
      responsibilities: [
        "Supervise daily construction activity against approved drawings and schedule",
        "Enforce safety standards and site discipline across all contractors",
        "Review and approve contractor submittals and material deliveries",
        "Report progress and flag risks to the project manager weekly",
      ],
      requirements: [
        "Bachelor's degree in Civil Engineering",
        "4+ years of on-site construction supervision experience",
        "Solid knowledge of Egyptian building codes and safety regulations",
        "Comfortable spending most of the week on-site, not behind a desk",
      ],
      experience: "4+ Years Experience",
      salary: "EGP 25k - 35k (Monthly)",
      deadline: "30 Nov 2026",
    },
    {
      slug: "sales-manager",
      title: "Sales Manager",
      openings: 2,
      summary:
        "Lead our sales team through the full client journey — from first inquiry to signed contract — for our flagship developments.",
      location: "New Cairo, Egypt",
      date: "1 Sep 2026",
      jobType: "Full time (On-site)",
      intro:
        "We're looking for a Sales Manager to lead our sales team through the full client journey on our flagship developments.",
      responsibilities: [
        "Lead and coach a team of sales consultants toward monthly targets",
        "Own key client relationships from first inquiry through contract signing",
        "Report on pipeline health and forecast sales to leadership",
        "Coordinate with marketing on lead quality and campaign feedback",
      ],
      requirements: [
        "5+ years in real estate sales, with 2+ years managing a team",
        "Track record of closing high-value residential or commercial deals",
        "Fluent in Arabic and English, spoken and written",
        "Comfortable with CRM tools and structured sales reporting",
      ],
      experience: "5+ Years Experience",
      salary: "EGP 20k - 40k + Commission (Monthly)",
      deadline: "30 Nov 2026",
    },
  ],
  ar: [
    {
      slug: "ui-ux-designer",
      title: "مصمم واجهات وتجربة مستخدم",
      openings: 2,
      summary:
        "صمّم واجهات بديهية وأنيقة عبر مواقعنا ومنتجاتنا الرقمية — من المخططات الأولية وحتى الشاشات الجاهزة للإنتاج.",
      location: "القاهرة الجديدة، مصر",
      date: "1 سبتمبر 2026",
      jobType: "دوام كامل (حضوري)",
      intro:
        "نبحث عن مصمم واجهات وتجربة مستخدم ليشكّل الطريقة التي يتفاعل بها الزوار مع مشاريع مارجنز عبر الإنترنت — من أول صفحة هبوط وحتى توقيع العقد.",
      responsibilities: [
        "تصميم المخططات الأولية والنماذج وواجهات نهائية لموقعنا وأدواتنا الداخلية",
        "إجراء جلسات اختبار قابلية الاستخدام وترجمة النتائج إلى تحسينات ملموسة",
        "صيانة وتطوير نظام التصميم للحفاظ على الاتساق عبر كل صفحة",
        "التعاون المباشر مع مطوري الواجهات الأمامية لإطلاق واجهات دقيقة",
      ],
      requirements: [
        "خبرة 3 سنوات فأكثر في تصميم واجهات المنتجات أو المواقع التسويقية",
        "بورتفوليو قوي يوضح عملية التصميم الكاملة وليس فقط الشاشات النهائية",
        "إتقان Figma بما في ذلك auto-layout والمتغيرات ومكتبات المكونات",
        "قدرة على شرح قرارات التصميم بالمنطق لا بالذوق فقط",
      ],
      experience: "خبرة 3 سنوات فأكثر",
      salary: "25 - 40 ألف جنيه (شهرياً)",
      deadline: "30 نوفمبر 2026",
    },
    {
      slug: "frontend-developer",
      title: "مطوّر واجهات أمامية",
      openings: 5,
      summary:
        "ابنِ واجهات سريعة ودقيقة باستخدام React وNext.js، بالتعاون المباشر مع فريق التصميم لإطلاق ميزات جاهزة للإنتاج.",
      location: "القاهرة الجديدة، مصر / عن بُعد",
      date: "1 سبتمبر 2026",
      jobType: "دوام كامل (هجين)",
      intro:
        "نبحث عن مطوّر واجهات أمامية للمساعدة في بناء وصيانة منصة مارجنز ديفلوبمنت الرقمية — سريعة، متاحة للجميع، وأمينة لهوية العلامة.",
      responsibilities: [
        "بناء واجهات بلغة React وNext.js انطلاقاً من تصاميم Figma بدقة كاملة",
        "تحمّل مسؤولية الأداء وإتاحة الوصول عبر كل صفحة نطلقها",
        "العمل المباشر مع فريقي التصميم والمنتج لتقدير الميزات الجديدة",
        "كتابة كود TypeScript نظيف وموثّق وقابل للاختبار",
      ],
      requirements: [
        "خبرة 3 سنوات فأكثر في React ضمن بيئة إنتاج",
        "إتقان جيد لـ TypeScript وCSS الحديثة والتصميم المتجاوب",
        "خبرة في Next.js App Router ميزة إضافية قوية",
        "القدرة على قراءة ملف تصميم ومطابقته بدقة",
      ],
      experience: "خبرة 3 سنوات فأكثر",
      salary: "30 - 50 ألف جنيه (شهرياً)",
      deadline: "30 نوفمبر 2026",
    },
    {
      slug: "product-manager",
      title: "مدير منتج",
      openings: 1,
      summary:
        "تولَّ مسؤولية خارطة طريق منتجاتنا الرقمية، وترجم أهداف الشركة إلى متطلبات واضحة ينفذها الفريق.",
      location: "القاهرة الجديدة، مصر",
      date: "1 سبتمبر 2026",
      jobType: "دوام كامل (حضوري)",
      intro:
        "نبحث عن مدير منتج يتولى خارطة طريق منتجاتنا الرقمية ويحافظ على توافق فرق التصميم والهندسة والمبيعات نحو هدف واحد.",
      responsibilities: [
        "تحديد أولويات خارطة طريق المنتج بناءً على أهداف العمل واحتياجات العملاء",
        "كتابة متطلبات واضحة يبني عليها فريقا التصميم والهندسة",
        "قيادة اجتماعات دورية لإزالة العوائق والحفاظ على الالتزام بالمواعيد",
        "متابعة مؤشرات المنتج ورفع تقارير الأثر بعد كل إطلاق",
      ],
      requirements: [
        "خبرة سنتين فأكثر في إدارة منتجات رقمية من الألف إلى الياء",
        "القدرة على العمل المباشر اليومي مع المصممين والمهندسين",
        "مهارات تواصل كتابي قوية — مواصفات وتحديثات وتقارير لأصحاب المصلحة",
        "خبرة في العقارات أو التقنية العقارية ميزة إضافية وليست شرطاً",
      ],
      experience: "خبرة سنتين فأكثر",
      salary: "35 - 55 ألف جنيه (شهرياً)",
      deadline: "30 نوفمبر 2026",
    },
    {
      slug: "javascript-engineer",
      title: "مهندس جافاسكريبت",
      openings: 3,
      summary:
        "اكتب كوداً موثوقاً ومختبراً بلغتي JavaScript وTypeScript عبر منظومتنا التقنية، من الأدوات الداخلية إلى الميزات الموجهة للعملاء.",
      location: "القاهرة الجديدة، مصر / عن بُعد",
      date: "1 سبتمبر 2026",
      jobType: "دوام كامل (عن بُعد)",
      intro:
        "نبحث عن مهندس جافاسكريبت لبناء أدوات وميزات موثوقة عبر منظومتنا التقنية، من لوحات التحكم الداخلية إلى الصفحات الموجهة للعملاء.",
      responsibilities: [
        "بناء وصيانة أدوات داخلية إلى جانب ميزات موجهة للعملاء",
        "كتابة اختبارات للمسارات المهمة فعلياً، لا لرفع نسبة التغطية فقط",
        "مراجعة طلبات الدمج والمساهمة في رفع جودة الكود",
        "تشخيص مشاكل بيئة الإنتاج وإطلاق إصلاحات موثوقة",
      ],
      requirements: [
        "خبرة 3 سنوات فأكثر في JavaScript وTypeScript باحترافية",
        "إتقان العمل على كود الواجهة الأمامية وNode.js الخلفي معاً",
        "خبرة في واجهات REST أو GraphQL",
        "منطق عملي في الموازنات — يطلق برمجيات تعمل لا برمجيات مثالية فقط",
      ],
      experience: "خبرة 3 سنوات فأكثر",
      salary: "30 - 50 ألف جنيه (شهرياً)",
      deadline: "30 نوفمبر 2026",
    },
    {
      slug: "site-engineer",
      title: "مهندس موقع",
      openings: 4,
      summary:
        "أشرف على جودة التنفيذ والسلامة في موقع البناء يومياً، بالتنسيق مع المقاولين للحفاظ على الجدول الزمني للمشروع.",
      location: "الساحل الشمالي، مصر",
      date: "1 سبتمبر 2026",
      jobType: "دوام كامل (حضوري)",
      intro:
        "نبحث عن مهندس موقع للإشراف على جودة التنفيذ والسلامة يومياً في أحد مشاريعنا النشطة.",
      responsibilities: [
        "الإشراف اليومي على أعمال التنفيذ مقارنة بالمخططات المعتمدة والجدول الزمني",
        "فرض معايير السلامة والانضباط في الموقع على جميع المقاولين",
        "مراجعة واعتماد مستندات المقاولين والتوريدات",
        "رفع تقارير التقدم وتنبيه مدير المشروع للمخاطر أسبوعياً",
      ],
      requirements: [
        "بكالوريوس هندسة مدنية",
        "خبرة 4 سنوات فأكثر في الإشراف على مواقع التنفيذ",
        "معرفة جيدة بكود البناء المصري ومعايير السلامة",
        "الاستعداد لقضاء معظم الأسبوع في الموقع لا خلف المكتب",
      ],
      experience: "خبرة 4 سنوات فأكثر",
      salary: "25 - 35 ألف جنيه (شهرياً)",
      deadline: "30 نوفمبر 2026",
    },
    {
      slug: "sales-manager",
      title: "مدير مبيعات",
      openings: 2,
      summary:
        "قُد فريق المبيعات عبر رحلة العميل الكاملة — من أول استفسار وحتى توقيع العقد — لمشاريعنا الرائدة.",
      location: "القاهرة الجديدة، مصر",
      date: "1 سبتمبر 2026",
      jobType: "دوام كامل (حضوري)",
      intro: "نبحث عن مدير مبيعات يقود فريق المبيعات عبر رحلة العميل الكاملة في مشاريعنا الرائدة.",
      responsibilities: [
        "قيادة وتدريب فريق من مستشاري المبيعات لتحقيق الأهداف الشهرية",
        "إدارة علاقات العملاء الرئيسيين من أول استفسار حتى توقيع العقد",
        "رفع تقارير عن حالة المسار البيعي وتوقعات المبيعات للإدارة",
        "التنسيق مع فريق التسويق حول جودة العملاء المحتملين",
      ],
      requirements: [
        "خبرة 5 سنوات فأكثر في مبيعات العقارات، منها سنتان في إدارة فريق",
        "سجل حافل بإغلاق صفقات سكنية أو تجارية عالية القيمة",
        "إجادة العربية والإنجليزية تحدثاً وكتابة",
        "إتقان أدوات CRM والتقارير البيعية المنظمة",
      ],
      experience: "خبرة 5 سنوات فأكثر",
      salary: "20 - 40 ألف جنيه + عمولة (شهرياً)",
      deadline: "30 نوفمبر 2026",
    },
  ],
};

const contentByLocale: Record<Locale, CareersContent> = {
  en: {
    perks: [
      "Competitive salary and annual bonus",
      "Private medical insurance",
      "Professional development support and training budget",
      "Paid annual and parental leave",
      "Team events and an annual company retreat",
      "Clear path for growth within the company",
    ],
    closing:
      "We're committed to building a team as thoughtfully as we build our developments. If this role sounds like you, we'd love to hear from you.",
    workingHours: "09 AM to 05 PM",
    workingDays: "Weekly 5 days (Sun to Thu)",
    educationNote:
      "A relevant degree is preferred but not required — we care more about what you can do than where you studied.",
  },
  ar: {
    perks: [
      "راتب تنافسي ومكافأة سنوية",
      "تأمين طبي خاص",
      "دعم للتطوير المهني وميزانية تدريب",
      "إجازة سنوية وإجازة أمومة/أبوة مدفوعة",
      "فعاليات جماعية ورحلة سنوية للشركة",
      "مسار نمو واضح داخل الشركة",
    ],
    closing:
      "نحرص على بناء فريقنا بنفس العناية التي نبني بها مشاريعنا. إن كانت هذه الوظيفة تناسبك، يسعدنا التواصل معك.",
    workingHours: "9 صباحاً إلى 5 مساءً",
    workingDays: "5 أيام أسبوعياً (الأحد إلى الخميس)",
    educationNote:
      "يُفضّل الحصول على مؤهل ذي صلة وليس شرطاً أساسياً — ما يهمنا فعلاً هو قدراتك لا مكان دراستك.",
  },
};

export function getRoles(locale: string) {
  return rolesByLocale[locale as Locale] ?? rolesByLocale.en;
}

export function getRoleBySlug(locale: string, slug: string) {
  return getRoles(locale).find((r) => r.slug === slug);
}

export function getCareersContent(locale: string) {
  return contentByLocale[locale as Locale] ?? contentByLocale.en;
}
