/*
 * Arabic Study Hub — single source of truth for every page.
 * Tables, the search index, quizzes and flashcards are all built from this file,
 * so a fix made here shows up everywhere at once.
 */
window.STUDY_DATA = {
    topics: [
        {
            id: "numbers",
            href: "numbers.html",
            ar: "الأعداد",
            en: "Numbers",
            glyph: "٣",
            desc: "قواعد المطابقة والمخالفة",
            descEn: "Agreement and disagreement rules"
        },
        {
            id: "nahw",
            href: "nahw.html",
            ar: "النحو",
            en: "Nahw",
            glyph: "ن",
            desc: "إعراب بالحركة والحروف",
            descEn: "Case endings by vowels and letters"
        },
        {
            id: "makharij",
            href: "makharij-chart.html",
            ar: "مخارج الحروف",
            en: "Makharij",
            glyph: "خ",
            desc: "تفاعل مع مناطق النطق",
            descEn: "Interactive points of articulation"
        },
        {
            id: "radaah",
            href: "radaah.html",
            ar: "الرضاع",
            en: "Rada'ah",
            glyph: "ر",
            desc: "رسوم بسيطة للعلاقات",
            descEn: "Simple relationship diagrams"
        }
    ],

    numbers: {
        columns: [
            { key: "tarkib", ar: "تركيب", en: "Construction" },
            { key: "gender", ar: "جنس العدد", en: "Gender of the number" },
            { key: "madud", ar: "المعدود مفرد أم جمع", en: "Counted noun: singular or plural" }
        ],
        rows: [
            {
                id: "n-1-2", label: "١-٢", min: 1, max: 2,
                tarkib: ["نعت منعوت"],
                gender: ["مطابق للمعدود"],
                madud: ["مفرد"]
            },
            {
                id: "n-3-10", label: "٣-١٠", min: 3, max: 10,
                tarkib: ["مضاف مضاف إليه"],
                gender: ["مخالف للمعدود"],
                madud: ["جمع مجرور"]
            },
            {
                id: "n-11-12", label: "١١-١٢", min: 11, max: 12,
                tarkib: ["تمييز مفرد منصوب"],
                gender: ["الشق الأول: تابع للمعدود", "الشق الثاني: تابع للمعدود"],
                madud: ["مفرد منصوب"]
            },
            {
                id: "n-13-19", label: "١٣-١٩", min: 13, max: 19,
                tarkib: ["تمييز مفرد منصوب"],
                gender: ["الشق الأول: مخالف للمعدود", "الشق الثاني: تابع للمعدود"],
                madud: ["مفرد منصوب"]
            },
            {
                id: "n-20", label: "٢٠", min: 20, max: 20,
                tarkib: ["تمييز مفرد منصوب"],
                gender: ["لا يتغير"],
                madud: ["مفرد منصوب"]
            },
            {
                id: "n-21-22", label: "٢١-٢٢", min: 21, max: 22,
                tarkib: ["تمييز مفرد منصوب"],
                gender: ["الشق الأول: تابع للمعدود", "الشق الثاني: لا يتغير"],
                madud: ["مفرد منصوب"]
            },
            {
                id: "n-23-29", label: "٢٣-٢٩", min: 23, max: 29,
                tarkib: ["تمييز مفرد منصوب"],
                gender: ["الشق الأول: مخالف للمعدود", "الشق الثاني: لا يتغير"],
                madud: ["مفرد منصوب"]
            },
            {
                id: "n-30-99", label: "٣٠-٩٩", min: 30, max: 99,
                tarkib: ["على الرسم ما تقدّم"],
                gender: ["لا يتغير"],
                madud: ["مفرد منصوب"]
            },
            {
                id: "n-hundreds", label: "١٠٠، ٢٠٠، ٣٠٠", hundreds: true,
                tarkib: ["مضاف إليه"],
                gender: ["لا يتغير"],
                madud: ["مفرد مجرور"]
            }
        ],
        notes: [
            {
                id: "note-mabni",
                title: "ملاحظة هامة",
                titleEn: "Important note",
                paragraphs: [
                    "الأعداد من ١١ إلى ١٩ مبنية. في هذا السياق، تعني \"مبنية\" أن هذه الأعداد لا تتغير في إعرابها بصرف النظر عن موقعها في الجملة."
                ],
                english: "Numbers from 11 to 19 are mabni (indeclinable), meaning they do not change form based on syntactic position."
            },
            {
                id: "note-tamyiz",
                title: "التمييز والمميز في الأعداد",
                titleEn: "Tamyiz with large numbers",
                items: [
                    { term: "ثلاثمائة (٣٠٠)", text: "التمييز دائماً مفرد مجرور، مثل \"ثلاثمائة كتاب\"." },
                    { term: "ثلاثة آلاف (٣٠٠٠)", text: "التمييز مفرد مجرور أيضاً، مثل \"ثلاثة آلاف كتاب\"." },
                    { term: "مائتان (٢٠٠)", text: "التمييز مفرد مجرور." },
                    { term: "ألفان (٢٠٠٠)", text: "التمييز مفرد مجرور ويوضح المعدود." }
                ]
            }
        ]
    },

    nahw: {
        cases: [
            { key: "rafa", ar: "الرفع", voweled: "رَفْع", en: "Rafa", original: "ضمة" },
            { key: "nasb", ar: "النصب", voweled: "نَصْب", en: "Nasb", original: "فتحة" },
            { key: "jarr", ar: "الجر", voweled: "جَرّ", en: "Jarr", original: "كسرة" }
        ],
        groups: [
            {
                id: "irab-harakah",
                number: "١",
                ar: "إعراب بالحركة",
                en: "Inflection with vowel marks",
                substitutes: true,
                rows: [
                    {
                        id: "mufrad-munsarif",
                        type: "مفرد منصرف صحيح",
                        sample: "رجل، وعد، زيد",
                        rafa: { mark: "ضمة", ex: "هذا رجلٌ" },
                        nasb: { mark: "فتحة", ex: "رأيتُ رجلاً" },
                        jarr: { mark: "كسرة", ex: "مررت برجلٍ" }
                    },
                    {
                        id: "ghayr-munsarif",
                        type: "غير منصرف",
                        sample: "عُمَر",
                        rafa: { mark: "ضمة", ex: "هذا عُمَرُ" },
                        nasb: { mark: "فتحة", ex: "رأيتُ عُمَرَ" },
                        jarr: { mark: "فتحة", ex: "مررتُ بعُمَرَ" }
                    },
                    {
                        id: "jam-muannath",
                        type: "جمع مؤنث سالم",
                        sample: "مسلمات",
                        rafa: { mark: "ضمة", ex: "هذه مسلماتٌ" },
                        nasb: { mark: "كسرة", ex: "رأيتُ مسلماتٍ" },
                        jarr: { mark: "كسرة", ex: "مررتُ بمسلماتٍ" }
                    }
                ]
            },
            {
                id: "irab-huruf",
                number: "٢",
                ar: "إعراب بالحروف",
                en: "Inflection with letters",
                substitutes: true,
                rows: [
                    {
                        id: "asma-sittah",
                        type: "الأسماء الستة",
                        sample: "أب، أخ، حم، هن، فو، ذو",
                        rafa: { mark: "و", ex: "هذا أبوك" },
                        nasb: { mark: "ا", ex: "رأيت أباك" },
                        jarr: { mark: "ي", ex: "مررت بأبيك" }
                    },
                    {
                        id: "muthanna",
                        type: "المثنى",
                        sample: "رجلان",
                        rafa: { mark: "ا", ex: "جاء رجلانِ" },
                        nasb: { mark: "ي", ex: "رأيت رجلينِ" },
                        jarr: { mark: "ي", ex: "مررت برجلينِ" }
                    },
                    {
                        id: "jam-mudhakkar",
                        type: "جمع مذكر سالم",
                        sample: "مسلمون",
                        rafa: { mark: "و", ex: "جاء مسلمونَ" },
                        nasb: { mark: "ي", ex: "رأيت مسلمينَ" },
                        jarr: { mark: "ي", ex: "مررت بمسلمينَ" }
                    }
                ]
            },
            {
                id: "irab-taqdiri",
                number: "٣",
                ar: "إعراب تقديري",
                en: "Hidden / estimated inflection",
                substitutes: false,
                rows: [
                    {
                        id: "maqsur",
                        type: "اسم مقصور",
                        sample: "موسى",
                        rafa: { mark: "مقدر", ex: "هذا موسى" },
                        nasb: { mark: "مقدر", ex: "رأيت موسى" },
                        jarr: { mark: "مقدر", ex: "مررت بموسى" }
                    },
                    {
                        id: "manqus",
                        type: "اسم منقوص",
                        sample: "القاضي",
                        rafa: { mark: "مقدر", ex: "جاء القاضي" },
                        nasb: { mark: "ظاهر", ex: "رأيت القاضيَ" },
                        jarr: { mark: "مقدر", ex: "مررت بالقاضي" }
                    },
                    {
                        id: "mudaf-ya",
                        type: "مضاف إلى ياء المتكلم",
                        sample: "مسلمي",
                        sampleEn: "my Muslims",
                        rafa: { mark: "مقدر", ex: "جاء مسلميَّ" },
                        nasb: { mark: "ظاهر", ex: "رأيت مسلميَّ" },
                        jarr: { mark: "ظاهر", ex: "مررت بمسلميَّ" }
                    }
                ]
            }
        ]
    },

    makharij: {
        tip: {
            ar: "افتح منطقة واحدة في كل مرة، وانطق كل حرف ببطء، ثم قارن الوصف بموضع فمك.",
            en: "Open one area at a time, say each letter slowly, then compare the description with your mouth position."
        },
        areas: [
            {
                id: "jawf",
                ar: "الجوف",
                translit: "Al-Jawf",
                en: "The oral cavity",
                description: "الحروف المدية، وهي الألف المرققة الغير الممالة",
                letters: [
                    { letter: "ا", description: "الألف المرققة الغير الممالة" },
                    { letter: "و", variant: "المدية", description: "الواو المدية" },
                    { letter: "ي", variant: "المدية", description: "الياء المدية" }
                ]
            },
            {
                id: "halq",
                ar: "الحلق",
                translit: "Al-Halq",
                en: "The throat",
                description: "مخارج الحروف من الحلق",
                letters: [
                    { letter: "ء", description: "من أقصى الحلق مما يلي الصدر" },
                    { letter: "ه", description: "من أقصى الحلق" },
                    { letter: "ع", description: "من وسط الحلق" },
                    { letter: "ح", description: "من وسط الحلق" },
                    { letter: "غ", description: "من أدنى الحلق" },
                    { letter: "خ", description: "من أدنى الحلق" }
                ]
            },
            {
                id: "lisan",
                ar: "اللسان",
                translit: "Al-Lisan",
                en: "The tongue",
                description: "مخارج الحروف من اللسان",
                letters: [
                    { letter: "ق", description: "من أعلى أقصى اللسان وما فوقه من الحنك الأعلى" },
                    { letter: "ك", description: "من أسفله" },
                    { letter: "ج", description: "من وسط اللسان" },
                    { letter: "ش", description: "من وسط اللسان" },
                    { letter: "ي", variant: "غير المدية", description: "من وسط اللسان (غير المدية)" },
                    { letter: "ض", description: "من حافة اللسان" },
                    { letter: "ل", description: "اللام المرققة من أدنى الحافة يليها مع اللثة العليا" },
                    { letter: "ن", variant: "المظهرة", description: "النون المظهرة من طرفه مع ما يوازيه تحت اللام" },
                    { letter: "ر", description: "من ظهره بعيد طرفه مع ما يحاذيه" },
                    { letter: "ط", description: "من طرفه مع أصول الثنايا العليا" },
                    { letter: "د", description: "من طرفه مع أصول الثنايا العليا" },
                    { letter: "ت", description: "من طرفه مع أصول الثنايا العليا" },
                    { letter: "ص", description: "من طرفه مع صفحتي الثنيتين العليين" },
                    { letter: "س", description: "من طرفه مع صفحتي الثنيتين العليين" },
                    { letter: "ز", description: "من طرفه مع صفحتي الثنيتين العليين" },
                    { letter: "ظ", description: "من طرفه مع أطراف الثنايا العليا" },
                    { letter: "ذ", description: "من طرفه مع أطراف الثنايا العليا" },
                    { letter: "ث", description: "من طرفه مع أطراف الثنايا العليا" }
                ]
            },
            {
                id: "shafatan",
                ar: "الشفتان",
                translit: "Ash-Shafatan",
                en: "The two lips",
                description: "مخارج الحروف من الشفتين",
                letters: [
                    { letter: "ف", description: "من بطن الشفة السفلى مع أطراف الثنايا العليا" },
                    { letter: "ب", description: "من الشفتين" },
                    { letter: "م", variant: "المظهرة", description: "الميم المظهرة من الشفتين" },
                    { letter: "و", variant: "غير المدية", description: "الواو الغير المدية من الشفتين" }
                ]
            },
            {
                id: "khayshum",
                ar: "الخيشوم",
                translit: "Al-Khayshum",
                en: "The nasal passage",
                description: "مخرج الغنة",
                letters: [
                    { letter: "ن", variant: "المخفاة والمدغمة", description: "النون المخفاة والمدغمة" },
                    { letter: "م", variant: "المخفاة والمدغمة", description: "الميم المخفاة والمدغمة" }
                ]
            },
            {
                id: "asnan",
                ar: "الأسنان",
                translit: "Al-Asnan",
                en: "The teeth",
                description: "ثنتان وثلاثون، نصفها في الأعلى ونصفها في الأسفل",
                letters: [],
                details: [
                    { name: "الثنيتان", position: "في الأعلى المقدمتان" },
                    { name: "الرباعية", position: "تليهما يمينا وشمالا" },
                    { name: "الناب", position: "تليهما كذلك" },
                    { name: "الأضراس", position: "الباقي، منها ضاحك تال للنابين" },
                    { name: "الطواحن", position: "تليهما ثلاثة يمينا وثلاثة شمالا" },
                    { name: "النواجذ", position: "ثم الواحد كذلك" }
                ]
            }
        ]
    },

    radaah: {
        cycles: [
            {
                id: "cycle-1",
                title: "الدورة الأولى",
                titleEn: "First cycle",
                examples: [
                    {
                        id: "c1-e1",
                        title: "مثال 1",
                        nodes: [
                            { id: "a", label: "أمينة فاطمة", tag: "أم", x: 80, y: 60 },
                            { id: "b", label: "عبدالله", x: 220, y: 60 },
                            { id: "c", label: "رضاع", x: 150, y: 165 }
                        ],
                        lines: [["a", "b"], [["a", "b"], "c"]]
                    },
                    {
                        id: "c1-e2",
                        title: "مثال 2",
                        nodes: [
                            { id: "a", label: "زينب", x: 80, y: 60 },
                            { id: "b", label: "أمينة فاطمة", x: 220, y: 60 },
                            { id: "c", label: "عبدالله", x: 220, y: 165 }
                        ],
                        lines: [["a", "c"], ["b", "c"]]
                    }
                ]
            },
            {
                id: "cycle-2",
                title: "الدورة الثانية",
                titleEn: "Second cycle",
                examples: [
                    {
                        id: "c2-e1",
                        title: "مثال 1",
                        nodes: [
                            { id: "a", label: "أحمد", x: 80, y: 60 },
                            { id: "b", label: "برة", tag: "زوجة", x: 220, y: 60 },
                            { id: "c", label: "زيد", x: 150, y: 165 }
                        ],
                        lines: [["a", "b"], ["b", "c"], ["c", "a"]]
                    }
                ]
            }
        ]
    }
};
