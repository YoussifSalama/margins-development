// SEED DATA ONLY — imported into the CMS by scripts/seed.mts on a fresh database.
// The website reads the CMS (server/public/pages.ts), never this file.
// A post's category is a key into the category list — not a fixed union — because
// editors can add categories in the CMS (Shared → Lookups → Post categories).
export type PostCategory = { key: string; name: string };

// what the data below holds; getPosts() adds the display name for the language
type PostData = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  author: string;
  image: string;
  sections: { heading: string; paragraphs: string[] }[];
  gallery: string[];
};

type Locale = "en" | "ar";

// ponytail: placeholder data, swap for CMS query once backend decided
export type Post = PostData & { categoryName: string };

const postsByLocale: Record<Locale, PostData[]> = {
  en: [
    {
      slug: "sheraton-residences-launch",
      category: "news",
      title: "Margins Developments Launches Sheraton Residences with Omar Khairat's Live Performance",
      excerpt:
        "Margins Developments hosted an unforgettable launch event for its latest project, Sheraton Residences, featuring a live performance by legendary composer Omar Khairat. The event drew numerous celebrities and guests for an exclusive first look.",
      date: "12 May 2026",
      readingTime: "6 Min",
      author: "Margins Press Team",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "Introduction",
          paragraphs: [
            "Margins Developments hosted an unforgettable launch event for its latest project, Sheraton Residences, featuring a fascinating live performance by the legendary composer Omar Khairat. The event attracted numerous celebrities and distinguished guests, who gathered for an exclusive first look at the luxurious new residential project.",
          ],
        },
        {
          heading: "A Night to Remember",
          paragraphs: [
            "Set against the backdrop of the development's landscaped courtyards, the evening combined live orchestral music with a guided walkthrough of the show units. Guests were among the first to experience the finished interiors, the marina-facing terraces, and the amenities that define the Sheraton Residences lifestyle.",
            "Margins' leadership used the occasion to outline the project's delivery timeline, confirming that the first phase remains on track for handover in 2027.",
          ],
        },
        {
          heading: "What Comes Next",
          paragraphs: [
            "Sales for the remaining units opened the following morning, with early demand concentrated on the waterfront-facing residences. Margins says a second sales event is planned once the marina promenade construction reaches its final phase.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "interior-design-investment-value",
      category: "blogs",
      title: "Top Quality Interior Design for Exceptional Investment Properties",
      excerpt:
        "We focus on premium properties and interiors, carefully considering every detail — from material selection to spatial flow — because interior quality is one of the strongest drivers of long-term resale value.",
      date: "12 May 2026",
      readingTime: "5 Min",
      author: "Margins Design Studio",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "Introduction",
          paragraphs: [
            "We focus on premium properties and interiors, carefully considering every detail an investor cares about — from material selection to spatial flow — because interior quality is one of the strongest drivers of long-term resale value.",
          ],
        },
        {
          heading: "What Buyers Actually Notice",
          paragraphs: [
            "Natural light, ceiling height, and finish quality consistently outrank square footage in buyer feedback. A well-lit, well-finished 120 sqm unit routinely outsells a poorly finished 150 sqm one at a higher price per square meter.",
            "Kitchens and bathrooms remain the two spaces buyers scrutinize most closely — they're also the most expensive to retrofit, which is why we invest heavily in getting them right from day one.",
          ],
        },
        {
          heading: "Designing for Resale, Not Just Move-In Day",
          paragraphs: [
            "Every finish package we specify is chosen with a ten-year horizon in mind: materials that age well, layouts that suit multiple buyer profiles, and neutral palettes that don't date quickly.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "harbor-view-groundbreaking",
      category: "events",
      title: "Groundbreaking Ceremony Marks the Start of Harbor View Residences",
      excerpt:
        "Margins Developments broke ground on Harbor View Residences this month, marking the official start of construction on our newest waterfront community on the North Coast.",
      date: "3 April 2026",
      readingTime: "4 Min",
      author: "Margins Press Team",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "Introduction",
          paragraphs: [
            "Margins Developments broke ground on Harbor View Residences this month, marking the official start of construction on our newest waterfront community on the North Coast.",
          ],
        },
        {
          heading: "On Site",
          paragraphs: [
            "The ceremony brought together the project's engineering and contracting teams alongside early reservation holders, who got a first look at the site layout and marina access points.",
          ],
        },
        {
          heading: "Timeline",
          paragraphs: [
            "Foundation work begins immediately, with the first residential blocks expected to top out by early 2027 ahead of a planned Q3 2027 delivery.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541976590-713941681591?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "new-capital-office-demand",
      category: "news",
      title: "Demand for Grade-A Offices Surges in the New Capital",
      excerpt:
        "Leasing activity at Meridian Business District has accelerated ahead of schedule, as government relocations and private-sector tenants compete for Grade-A office space in the New Capital.",
      date: "20 March 2026",
      readingTime: "5 Min",
      author: "Margins Press Team",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "Introduction",
          paragraphs: [
            "Leasing activity at Meridian Business District has accelerated ahead of schedule, as government relocations and private-sector tenants compete for Grade-A office space in the New Capital.",
          ],
        },
        {
          heading: "Why Demand Is Rising",
          paragraphs: [
            "Occupancy commitments now cover more than half of the development's office floors, over a year before the first phase is due to open. Tenants cite proximity to the government district and the building's certified sustainability rating as key factors.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "choosing-the-right-unit-type",
      category: "blogs",
      title: "How to Choose the Right Unit Type for Your Lifestyle",
      excerpt:
        "From compact one-bedrooms to standalone villas, the right unit type depends less on budget alone and more on how you actually plan to live in the space day to day.",
      date: "28 February 2026",
      readingTime: "7 Min",
      author: "Margins Sales Team",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "Introduction",
          paragraphs: [
            "From compact one-bedrooms to standalone villas, the right unit type depends less on budget alone and more on how you actually plan to live in the space day to day.",
          ],
        },
        {
          heading: "Apartments vs. Villas",
          paragraphs: [
            "Apartments suit buyers who prioritize low maintenance and community amenities over private outdoor space. Villas make more sense for families who want a garden, extra storage, and more separation from neighbors — at the cost of higher upkeep.",
          ],
        },
        {
          heading: "Thinking About Resale",
          paragraphs: [
            "Smaller, well-located units tend to resell faster; larger units hold value better over longer horizons. Match the unit type to your actual holding period, not just your current budget.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "willowbrook-open-house-weekend",
      category: "events",
      title: "Join Our Open House Weekend at Willowbrook Villas",
      excerpt:
        "Margins Developments invites prospective buyers to tour completed and furnished villas at Willowbrook, our fully delivered gated community in October City.",
      date: "15 February 2026",
      readingTime: "3 Min",
      author: "Margins Sales Team",
      image: "https://images.unsplash.com/photo-1541976590-713941681591?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "Introduction",
          paragraphs: [
            "Margins Developments invites prospective buyers to tour completed and furnished villas at Willowbrook, our fully delivered gated community in October City.",
          ],
        },
        {
          heading: "What to Expect",
          paragraphs: [
            "Two furnished show villas will be open across the weekend, along with a walkthrough of the community's parks, clubhouse, and school zoning. Our sales team will be on-site to answer questions on remaining inventory and payment plans.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1541976590-713941681591?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80&auto=format&fit=crop",
      ],
    },
  ],
  ar: [
    {
      slug: "sheraton-residences-launch",
      category: "news",
      title: "مارجنز ديفلوبمنت تُطلق مشروع شيراتون ريزيدنس بحفل أحياه الموسيقار عمر خيرت",
      excerpt:
        "استضافت مارجنز ديفلوبمنت حفل إطلاق لا يُنسى لمشروعها الجديد شيراتون ريزيدنس، بعزف حي للموسيقار الكبير عمر خيرت، بحضور عدد كبير من المشاهير والضيوف.",
      date: "12 مايو 2026",
      readingTime: "6 دقائق",
      author: "فريق مارجنز الإعلامي",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "مقدمة",
          paragraphs: [
            "استضافت مارجنز ديفلوبمنت حفل إطلاق لا يُنسى لمشروعها الجديد شيراتون ريزيدنس، بعزف حي مميز للموسيقار الكبير عمر خيرت. جذب الحدث عدداً كبيراً من المشاهير والضيوف المميزين الذين حضروا للاطلاع الحصري على المشروع السكني الفاخر الجديد.",
          ],
        },
        {
          heading: "ليلة لا تُنسى",
          paragraphs: [
            "وسط الساحات الخضراء للمشروع، جمعت الأمسية بين العزف الأوركسترالي الحي وجولة إرشادية داخل الوحدات النموذجية، حيث كان الضيوف من أوائل من عاينوا التشطيبات النهائية والتراسات المطلة على المارينا والمرافق التي تميز أسلوب حياة شيراتون ريزيدنس.",
            "واستغلت إدارة مارجنز المناسبة لتوضيح الجدول الزمني للتسليم، مؤكدةً أن المرحلة الأولى لا تزال في موعدها المحدد للتسليم في 2027.",
          ],
        },
        {
          heading: "الخطوة القادمة",
          paragraphs: [
            "فُتح باب الحجز للوحدات المتبقية في صباح اليوم التالي، مع تركّز الطلب المبكر على الوحدات المطلة على الواجهة البحرية. وتعتزم مارجنز تنظيم فعالية بيع ثانية بعد اكتمال المرحلة النهائية من إنشاء ممشى المارينا.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "interior-design-investment-value",
      category: "blogs",
      title: "تصميم داخلي عالي الجودة لعقارات استثمارية استثنائية",
      excerpt:
        "نركّز على العقارات والتشطيبات الفاخرة، مع اهتمام دقيق بكل تفصيلة من اختيار الخامات إلى توزيع المساحات، لأن جودة التشطيب من أقوى عوامل ارتفاع القيمة السوقية للعقار على المدى الطويل.",
      date: "12 مايو 2026",
      readingTime: "5 دقائق",
      author: "استوديو التصميم بمارجنز",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "مقدمة",
          paragraphs: [
            "نركّز على العقارات والتشطيبات الفاخرة، مع اهتمام دقيق بكل تفصيلة تهم المستثمر، من اختيار الخامات إلى توزيع المساحات، لأن جودة التشطيب من أقوى عوامل ارتفاع القيمة السوقية للعقار على المدى الطويل.",
          ],
        },
        {
          heading: "ما يلاحظه المشتري فعلاً",
          paragraphs: [
            "الإضاءة الطبيعية وارتفاع الأسقف وجودة التشطيب تتصدر دائماً اهتمامات المشترين، متفوقةً حتى على المساحة الإجمالية. فوحدة بمساحة 120 متراً جيدة الإضاءة والتشطيب تُباع غالباً بسعر أعلى للمتر من وحدة أكبر مساحة لكن أقل جودة.",
            "يبقى المطبخ والحمام أكثر المساحات التي يدققها المشترون، وهما أيضاً الأكثر تكلفة عند إعادة التجهيز لاحقاً، لذا نستثمر بشكل كبير في إتقانهما من اليوم الأول.",
          ],
        },
        {
          heading: "تصميم يراعي إعادة البيع لا يوم الاستلام فقط",
          paragraphs: [
            "كل باقة تشطيب نختارها مدروسة على مدى عشر سنوات: خامات تحافظ على مظهرها، وتصاميم تناسب أنماط متعددة من المشترين، وألوان محايدة لا تفقد رونقها بسرعة.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "harbor-view-groundbreaking",
      category: "events",
      title: "حفل وضع حجر الأساس يُعلن انطلاق مشروع هاربور فيو ريزيدنسز",
      excerpt:
        "وضعت مارجنز ديفلوبمنت حجر الأساس لمشروع هاربور فيو ريزيدنسز هذا الشهر، إيذاناً بانطلاق أعمال الإنشاء في أحدث مجتمعاتها الساحلية على الساحل الشمالي.",
      date: "3 أبريل 2026",
      readingTime: "4 دقائق",
      author: "فريق مارجنز الإعلامي",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "مقدمة",
          paragraphs: [
            "وضعت مارجنز ديفلوبمنت حجر الأساس لمشروع هاربور فيو ريزيدنسز هذا الشهر، إيذاناً بانطلاق أعمال الإنشاء في أحدث مجتمعاتها الساحلية على الساحل الشمالي.",
          ],
        },
        {
          heading: "في الموقع",
          paragraphs: [
            "جمع الحفل فرق الهندسة والمقاولات في المشروع إلى جانب أوائل حاملي الحجز، الذين حصلوا على أول اطلاع على مخطط الموقع ونقاط الوصول إلى المارينا.",
          ],
        },
        {
          heading: "الجدول الزمني",
          paragraphs: [
            "تبدأ أعمال الأساسات فوراً، على أن تكتمل الطوابق الأولى من المباني السكنية بحلول أوائل 2027 تمهيداً للتسليم المستهدف في الربع الثالث من 2027.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541976590-713941681591?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "new-capital-office-demand",
      category: "news",
      title: "طفرة في الطلب على المكاتب الفاخرة بالعاصمة الإدارية الجديدة",
      excerpt:
        "تسارعت وتيرة التأجير في ميريديان بيزنس ديستريكت قبل الموعد المحدد، مع تنافس الجهات الحكومية والقطاع الخاص على مساحات المكاتب من الفئة الأولى بالعاصمة الجديدة.",
      date: "20 مارس 2026",
      readingTime: "5 دقائق",
      author: "فريق مارجنز الإعلامي",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "مقدمة",
          paragraphs: [
            "تسارعت وتيرة التأجير في ميريديان بيزنس ديستريكت قبل الموعد المحدد، مع تنافس الجهات الحكومية والقطاع الخاص على مساحات المكاتب من الفئة الأولى بالعاصمة الجديدة.",
          ],
        },
        {
          heading: "أسباب ارتفاع الطلب",
          paragraphs: [
            "تغطي التزامات الإشغال حالياً أكثر من نصف طوابق المكاتب في المشروع، قبل أكثر من عام من موعد افتتاح المرحلة الأولى. ويشير المستأجرون إلى قرب الموقع من الحي الحكومي وتصنيف المبنى البيئي المعتمد كعاملين رئيسيين.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "choosing-the-right-unit-type",
      category: "blogs",
      title: "كيف تختار نوع الوحدة المناسب لأسلوب حياتك",
      excerpt:
        "من الشقق المدمجة ذات الغرفة الواحدة إلى الفيلات المستقلة، يعتمد اختيار الوحدة المناسبة على طريقة معيشتك اليومية أكثر من اعتماده على الميزانية وحدها.",
      date: "28 فبراير 2026",
      readingTime: "7 دقائق",
      author: "فريق مبيعات مارجنز",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "مقدمة",
          paragraphs: [
            "من الشقق المدمجة ذات الغرفة الواحدة إلى الفيلات المستقلة، يعتمد اختيار الوحدة المناسبة على طريقة معيشتك اليومية أكثر من اعتماده على الميزانية وحدها.",
          ],
        },
        {
          heading: "شقق أم فيلات؟",
          paragraphs: [
            "تناسب الشقق من يفضّلون قلة الصيانة والاستفادة من المرافق المشتركة على حساب المساحة الخارجية الخاصة. أما الفيلات فتناسب أكثر العائلات الراغبة في حديقة خاصة ومساحة تخزين إضافية وخصوصية أكبر عن الجيران، مقابل تكلفة صيانة أعلى.",
          ],
        },
        {
          heading: "التفكير في إعادة البيع",
          paragraphs: [
            "الوحدات الأصغر جيدة الموقع تُباع عادة بشكل أسرع، بينما تحافظ الوحدات الأكبر على قيمتها بشكل أفضل على المدى الطويل. اختر نوع الوحدة بناءً على مدة امتلاكك الفعلية المخطط لها، لا على ميزانيتك الحالية فقط.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80&auto=format&fit=crop",
      ],
    },
    {
      slug: "willowbrook-open-house-weekend",
      category: "events",
      title: "انضم إلينا في عطلة البيت المفتوح بمشروع ويلوبروك فيلاز",
      excerpt:
        "تدعو مارجنز ديفلوبمنت المشترين المحتملين لجولة داخل الفيلات المكتملة والمفروشة في ويلوبروك، مجتمعها المسوّر المُسلَّم بالكامل في مدينة أكتوبر.",
      date: "15 فبراير 2026",
      readingTime: "3 دقائق",
      author: "فريق مبيعات مارجنز",
      image: "https://images.unsplash.com/photo-1541976590-713941681591?w=1200&q=80&auto=format&fit=crop",
      sections: [
        {
          heading: "مقدمة",
          paragraphs: [
            "تدعو مارجنز ديفلوبمنت المشترين المحتملين لجولة داخل الفيلات المكتملة والمفروشة في ويلوبروك، مجتمعها المسوّر المُسلَّم بالكامل في مدينة أكتوبر.",
          ],
        },
        {
          heading: "ماذا تتوقع",
          paragraphs: [
            "ستكون فيلتان نموذجيتان مفروشتان مفتوحتين طوال العطلة، إلى جانب جولة في حدائق المجتمع والنادي الاجتماعي ومنطقة المدارس المخصصة. سيكون فريق المبيعات متواجداً في الموقع للإجابة عن استفساراتكم حول الوحدات المتبقية وخطط السداد.",
          ],
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1541976590-713941681591?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80&auto=format&fit=crop",
      ],
    },
  ],
};

// ponytail: placeholder list, same as the posts — comes from the CMS once connected
const categoriesByLocale: Record<Locale, PostCategory[]> = {
  en: [
    { key: "news", name: "News" },
    { key: "events", name: "Events" },
    { key: "blogs", name: "Blogs" },
  ],
  ar: [
    { key: "news", name: "الأخبار" },
    { key: "events", name: "الفعاليات" },
    { key: "blogs", name: "المدونة" },
  ],
};

export function getPostCategories(locale: string) {
  return categoriesByLocale[locale as Locale] ?? categoriesByLocale.en;
}

/** Display name for a post's category key, in the given language. */
export function categoryName(locale: string, key: string) {
  return getPostCategories(locale).find((category) => category.key === key)?.name ?? key;
}

export function getPosts(locale: string): Post[] {
  const posts = postsByLocale[locale as Locale] ?? postsByLocale.en;
  return posts.map((post) => ({ ...post, categoryName: categoryName(locale, post.category) }));
}

export function getPostBySlug(locale: string, slug: string) {
  return getPosts(locale).find((p) => p.slug === slug);
}
