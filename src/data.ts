import { Subject, Chapter, Scholarship, CareerPath, Badge, VideoShort } from './types';

export const GRADES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 
  'Class 11', 'Class 12'
];

export const STATE_BOARDS = [
  'CBSE (Central Board)',
  'UP Board (Uttar Pradesh)',
  'Bihar Board (BSEB)',
  'Madhya Pradesh Board (MPBSE)',
  'Rajasthan Board (BSER)',
  'Maharashtra Board (MSBSHSE)'
];

export const SUBJECTS: Subject[] = [
  { id: 'math', nameEn: 'Mathematics', nameHi: 'गणित', color: 'from-blue-600 to-indigo-600', icon: 'Calculator', chaptersCount: 8, difficulty: 'Hard' },
  { id: 'science', nameEn: 'Science', nameHi: 'विज्ञान', color: 'from-cyan-500 to-blue-600', icon: 'FlaskConical', chaptersCount: 10, difficulty: 'Medium' },
  { id: 'english', nameEn: 'English Grammar', nameHi: 'अंग्रेजी व्याकरण', color: 'from-blue-700 to-royal-blue', icon: 'BookOpen', chaptersCount: 6, difficulty: 'Easy' },
  { id: 'sst', nameEn: 'Social Studies', nameHi: 'सामाजिक विज्ञान', color: 'from-indigo-700 to-violet-800', icon: 'Globe', chaptersCount: 7, difficulty: 'Medium' }
];

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch-math-1',
    subjectId: 'math',
    titleEn: 'Quadratic Equations & Roots',
    titleHi: 'द्विघात समीकरण और मूल',
    summaryEn: 'Understand curves, quadratic equations, and their applications in projectiles!',
    summaryHi: 'वक्र, द्विघात समीकरणों और प्रक्षेप्य में उनके अनुप्रयोगों को समझें!',
    duration: '45 mins',
    difficulty: 'Hard',
    topics: [
      {
        id: 'tp-math-1-1',
        titleEn: 'Introduction to Equation Forms',
        titleHi: 'समीकरण रूपों का परिचय',
        contentEn: 'A quadratic equation looks like ax² + bx + c = 0. The highest power is 2. It forms a beautiful shape called a Parabola (U-shape) when drawn on a graph paper!',
        contentHi: 'एक द्विघात समीकरण ax² + bx + c = 0 के रूप में दिखता है। इसकी उच्चतम घात 2 होती है। ग्राफ पेपर पर खींचने पर यह परवलय (Parabola - U आकार) बनाता है!',
        diyActivityEn: 'Throw a small cricket ball at an angle, observe its path. The path of the ball is literally a parabolic curve, which represents a quadratic equation curve in real life!',
        diyActivityHi: 'एक छोटी क्रिकेट गेंद को हवा में तिरछा फेंकें, इसके मार्ग का निरीक्षण करें। गेंद का मार्ग वास्तव में एक परवलयाकार वक्र है, जो वास्तविक जीवन में एक द्विघात समीकरण वक्र को दर्शाता है!'
      },
      {
        id: 'tp-math-1-2',
        titleEn: 'The Shreedharacharya Formula method',
        titleHi: 'श्रीधराचार्य सूत्र विधि',
        contentEn: 'To find roots of ax² + bx + c = 0, we can use Indian scholar Shreedharacharya’s quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. Let’s solve step by step!',
        contentHi: 'ax² + bx + c = 0 के मूल खोजने के लिए, हम महान भारतीय गणितज्ञ श्रीधराचार्य के सूत्र का उपयोग करते हैं: x = (-b ± √(b² - 4ac)) / 2a। आइए चरण-दर-चरण हल करें!',
        diyActivityEn: 'Create index flashcards containing values of a, b, and c. Play with classmates to calculate the discriminant (b² - 4ac) instantly!',
        diyActivityHi: 'a, b और c के मान वाले छोटे कार्ड बनाएं। अपने सहपाठियों के साथ खेलकर विविक्तकर (Discriminant - b² - 4ac) की गणना करें!'
      }
    ]
  },
  {
    id: 'ch-sci-1',
    subjectId: 'science',
    titleEn: 'Electricity and Circuits',
    titleHi: 'विद्युत और सर्किट',
    summaryEn: 'Explore how current flows, conductors, and making a homemade light switch.',
    summaryHi: 'विद्युत धारा के प्रवाह, चालकों और घरेलू लाइट स्विच बनाने की प्रक्रिया का पता लगाएं।',
    duration: '30 mins',
    difficulty: 'Medium',
    topics: [
      {
        id: 'tp-sci-1-1',
        titleEn: 'Flow of Free Electrons',
        titleHi: 'मुक्त इलेक्ट्रॉनों का प्रवाह',
        contentEn: 'Electric current is the rate of flow of negative charges called electrons through a metal wire. Think of it like water flowing through a standard steel pipe!',
        contentHi: 'विद्युत धारा एक धातु के तार के माध्यम से इलेक्ट्रॉनों नामक नकारात्मक आवेशों के बहने की दर है। इसे एक स्टील पाइप से बहते पानी की तरह समझें!',
        diyActivityEn: 'Take a wool cloth and rub a dry plastic pen against it. Bring the pen close to small bits of notebook paper. You will see them stick! This is static charge electricity.',
        diyActivityHi: 'एक ऊनी कपड़ा लें और उस पर एक सूखी प्लास्टिक पेन रगड़ें। पेन को कागज के छोटे टुकड़ों के पास लाएं। आप उन्हें चिपकते हुए देखेंगे! यह स्थिर आवेश विद्युत है।'
      }
    ]
  },
  {
    id: 'ch-sci-2',
    subjectId: 'science',
    titleEn: 'Photosynthesis: How Plants Breathe',
    titleHi: 'प्रकाश संश्लेषण: पौधे कैसे सांस लेते हैं',
    summaryEn: 'Learn how leaves catch sunlight to prepare starch glucose and release healthy oxygen.',
    summaryHi: 'जानें कि पत्तियां स्टार्च ग्लूकोज तैयार करने और स्वस्थ ऑक्सीजन छोड़ने के लिए सूर्य के प्रकाश को कैसे पकड़ती हैं।',
    duration: '25 mins',
    difficulty: 'Easy',
    topics: [
      {
        id: 'tp-sci-2-1',
        titleEn: 'Role of Green Chlorophyll',
        titleHi: 'हरे क्लोरोफिल की भूमिका',
        contentEn: 'Leaves have microscopic green kitchens inside them filled with chemical pigments called Chlorophyll. This capture sunlight energy to cook glucose!',
        contentHi: 'पत्तियों के अंदर क्लोरोफिल नामक रासायनिक रंजक से भरी सूक्ष्म हरी रसइयाँ होती हैं। ये ग्लूकोज पकाने के लिए सूर्य के प्रकाश की ऊर्जा को पकड़ते हैं!',
        diyActivityEn: 'Keep one small potted plant in a dark cupboard for 4 days, and another in sunlight. Notice how the cupboard plant turns pale and weak without sunlight green nutrition!',
        diyActivityHi: 'एक छोटे गमले के पौधे को 4 दिनों के लिए अँधेरी अलमारी में रखें, और दूसरे को धूप में रखें। ध्यान दें कि बिना धूप की रोशनी के अलमारी वाला पौधा कैसे पीला और कमजोर हो जाता है!'
      }
    ]
  }
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-1',
    titleEn: 'Pre-Matric State Scholarship for Government Schools',
    titleHi: 'सरकारी स्कूलों के लिए प्री-मैट्रिक राज्य छात्रवृत्ति',
    provider: 'Ministry of Social Welfare, Government of India',
    amountEn: '₹3,000 per year + textbook stipends',
    amountHi: '₹3,000 प्रति वर्ष + पाठ्यपुस्तक भत्ता',
    deadline: '2026-09-30',
    eligibilityEn: 'Students enrolled in Class 1-10 with family annual income below ₹2.5 Lakhs.',
    eligibilityHi: 'कक्षा 1-10 में पढ़ रहे छात्र जिनकी पारिवारिक वार्षिक आय ₹2.5 लाख से कम हो।'
  },
  {
    id: 'sch-2',
    titleEn: 'National Means-cum-Merit Scholarship (NMMS)',
    titleHi: 'राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना',
    provider: 'Department of School Education & Literacy',
    amountEn: '₹12,000 per year (Class 9 to 12)',
    amountHi: '₹12,000 प्रति वर्ष (कक्षा 9 से 12)',
    deadline: '2026-10-15',
    eligibilityEn: 'Class 8 passed with > 55% marks and qualifying NMMS State Level Entrance Exam.',
    eligibilityHi: 'कक्षा 8 में > 55% अंक प्राप्त करने वाले छात्र जिन्होंने NMMS राज्य स्तरीय प्रवेश परीक्षा उत्तीर्ण की हो।'
  },
  {
    id: 'sch-3',
    titleEn: 'Prime Minister SSP Single Girl Child Incentive',
    titleHi: 'प्रधानमंत्री एसएसपी एकल बालिका प्रोत्साहन योजना',
    provider: 'Central Board of Education & Ministry of HRD',
    amountEn: '₹500 per month stipend support',
    amountHi: '₹500 प्रति माह वजीफा सहायता',
    deadline: '2026-11-01',
    eligibilityEn: 'Only girl child of the family completing Class 10 with high merit results in state colleges.',
    eligibilityHi: 'परिवार की एकमात्र बालिका जिसने राज्य स्तर पर उच्च अंकों के साथ कक्षा 10 उत्तीर्ण की हो।'
  }
];

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'car-1',
    titleEn: 'Indian Armed Forces - NDA Entrance Path',
    titleHi: 'भारतीय सशस्त्र बल - एनडीए प्रवेश मार्ग',
    classesFilter: '12+',
    descEn: 'Join Army, Navy or Air Force as a respected officer right after Class 12!',
    descHi: 'कक्षा 12 के तुरंत बाद एक सम्मानित अधिकारी के रूप में थलसेना, नौसेना या वायुसेना में शामिल हों!',
    salaryEn: '₹56,100 starting officer monthly basic pay',
    salaryHi: '₹56,100 प्रारंभिक अधिकारी मासिक मूल वेतन',
    stepsEn: [
      'Take Physics & Math in Class 11 and 12.',
      'Apply online in Class 12 for UPSC NDA Exam.',
      'Clear the national written exam and physical fitness drills.',
      'Ace the 5-day Service Selection Board (SSB) Interview process.'
    ],
    stepsHi: [
      'कक्षा 11 और 12 में भौतिकी और गणित लें।',
      'कक्षा 12 में रहते हुए यूपीएससी एनडीए परीक्षा के लिए ऑनलाइन आवेदन करें।',
      'राष्ट्रीय लिखित परीक्षा और शारीरिक दक्षता परीक्षा पास करें।',
      '5 दिवसीय सेवा चयन बोर्ड (SSB) साक्षात्कार प्रक्रिया को पास करें।'
    ]
  },
  {
    id: 'car-2',
    titleEn: 'Civil Services Stream (UPSC IAS / State PSC)',
    titleHi: 'सिविल सेवा वर्ग (यूपीएससी आईएएस / राज्य पीएससी)',
    classesFilter: 'all',
    descEn: 'Become a District Magistrate, Police Chief, or State Welfare director to serve your town directly.',
    descHi: 'अपने क्षेत्र की सीधे सेवा करने के लिए जिला मजिस्ट्रेट (DM), पुलिस प्रमुख (IPS) या कल्याण निदेशक बनें।',
    salaryEn: '₹56,100 to ₹2,50,000 monthly pay scale with govt quarters',
    salaryHi: '₹56,100 से ₹2,50,000 मासिक वेतनमान + सरकारी आवास',
    stepsEn: [
      'Maintain strong reading habits in history, polity, and local languages.',
      'Complete any undergraduate college degree in any subject.',
      'Start UPSC preparation during final year of graduation.',
      'Clear Prelims, Mains, and the final personality interviews.'
    ],
    stepsHi: [
      'इतिहास, राजनीति और स्थानीय भाषाओं में पढ़ने की मजबूत आदतें बनाए रखें।',
      'किसी भी विषय में कोई भी स्नातक डिग्री पूरी करें।',
      'स्नातक के अंतिम वर्ष के दौरान यूपीएससी की तैयारी शुरू करें।',
      'प्रारंभिक, मुख्य परीक्षा और साक्षात्कार पास करें।'
    ]
  },
  {
    id: 'car-3',
    titleEn: 'Agricultural Scientist & Farming Tech Officer',
    titleHi: 'कृषि वैज्ञानिक और खेती प्रौद्योगिकी अधिकारी',
    classesFilter: '10+',
    descEn: 'Drive India’s digital village revolution by learning high-yielding crop genetics and irrigation tech!',
    descHi: 'फसल आनुवंशिकी और सिंचाई तकनीक सीखकर भारत की डिजिटल ग्रामीण क्रांति को गति दें!',
    salaryEn: '₹40,000 to ₹90,000 monthly state research payload',
    salaryHi: '₹40,000 से ₹90,000 मासिक अनुसंधान वेतन',
    stepsEn: [
      'Select Agricultural Sciences or Biology streams in Class 11.',
      'Pass the State Agricultural Common Entrance Exams (ICAR AIEEA).',
      'Complete a BSc degree in Agriculture or Bio-technology.',
      'Work with state agro offices or set up your premium smart farm agency!'
    ],
    stepsHi: [
      'कक्षा 11 में कृषि विज्ञान या जीव विज्ञान स्ट्रीम चुनें।',
      'राज्य कृषि सामान्य प्रवेश परीक्षा (ICAR AIEEA) पास करें।',
      'कृषि या जैव-प्रौद्योगिकी में बीएससी डिग्री पूरी करें।',
      'राज्य कृषि कार्यालयों के साथ काम करें या अपनी स्मार्ट फॉर्म एजेंसी स्थापित करें!'
    ]
  }
];

export const BADGES: Badge[] = [
  { id: 'bdg-streak-5', titleEn: '5-Day Warrior', titleHi: '5-दिवसीय योद्धा', icon: 'Flame', descEn: 'Studied for 5 consecutive days bilingually!', descHi: 'लगातार 5 दिनों तक द्विभाषी अध्ययन पूरा किया!' },
  { id: 'bdg-quiz-pro', titleEn: 'Arjuna Marksman', titleHi: 'अर्जुन निशानेबाज', icon: 'Target', descEn: 'Aced three consecutive AI-generated active quizzes.', descHi: 'लगातार तीन एआई-जनित क्विज में पूर्ण सफलता हासिल की।' },
  { id: 'bdg-offline', titleEn: 'Village Hub Star', titleHi: 'विलेज हब स्टार', icon: 'HardDrive', descEn: 'Downloaded and synced study state with SD-Card simulator.', descHi: 'एसडी-कार्ड सिम्युलेटर के साथ अध्ययन प्रगति को ऑफलाइन सुरक्षित किया।' },
  { id: 'bdg-voice', titleEn: 'Eklavya Speaker', titleHi: 'एकलव्य वक्ता', icon: 'Mic', descEn: 'Asked questions bilingually using interactive voice tutor waves.', descHi: 'आवाज ट्यूटर वेब्स का उपयोग करके द्विभाषी प्रश्न पूछे।' }
];

export const STORE_ITEMS = [
  { id: 'str-frame-gold', nameEn: 'Golden Peacock Avatar Frame', nameHi: 'सुनहरा मयूर अवतार फ्रेम', price: 150, category: 'Frame', icon: 'Crown' },
  { id: 'str-title-eklavya', nameEn: 'Title Badge: "Super Scholar"', nameHi: 'शीर्षक: "सुपर स्कॉलर"', price: 200, category: 'Title', icon: 'Award' },
  { id: 'str-bg-twilight', nameEn: 'Premium Twilight Canvas skin', nameHi: 'प्रीमियम ट्वाइलाइट थीम कलर', price: 400, category: 'Theme', icon: 'Sparkles' }
];

export const VIDEO_FEED: VideoShort[] = [
  {
    id: 'vid-1',
    titleEn: '💡 Why is the Sky Blue? Easy Experiment',
    titleHi: '💡 आकाश नीला क्यों है? आसान प्रयोग दृश्य',
    author: 'Siddharth Sir (Govt High School)',
    subject: 'Science',
    likes: 1840,
    comments: 312,
    videoUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'vid-2',
    titleEn: '📐 The Secret of Pythagoras Theorem visually',
    titleHi: '📐 पाइथागोरस प्रमेय का रहस्य चित्रों द्वारा समझें',
    author: 'Meenakshi Didi, UP Board',
    subject: 'Mathematics',
    likes: 2470,
    comments: 189,
    videoUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'vid-3',
    titleEn: '⚡ Magnetic levitation with classroom magnets',
    titleHi: '⚡ कक्षा के चुम्बकों से जादुई लिविटेशन प्रयोग',
    author: 'Prof. Amit Verma, Science Club',
    subject: 'Science',
    likes: 3120,
    comments: 494,
    videoUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80'
  }
];

export const ALL_SUBJECTS: Record<string, Subject> = {
  english: { id: 'english', nameEn: 'English', nameHi: 'अंग्रेजी', color: 'from-pink-500 to-rose-600', icon: 'BookOpen', chaptersCount: 6, difficulty: 'Easy' },
  hindi: { id: 'hindi', nameEn: 'Hindi', nameHi: 'हिन्दी', color: 'from-amber-500 to-orange-600', icon: 'Languages', chaptersCount: 5, difficulty: 'Easy' },
  math: { id: 'math', nameEn: 'Mathematics', nameHi: 'गणित', color: 'from-blue-600 to-indigo-600', icon: 'Calculator', chaptersCount: 8, difficulty: 'Hard' },
  evs: { id: 'evs', nameEn: 'EVS', nameHi: 'पर्यावरण अध्ययन', color: 'from-emerald-500 to-teal-600', icon: 'Leaf', chaptersCount: 6, difficulty: 'Medium' },
  gk: { id: 'gk', nameEn: 'General Knowledge', nameHi: 'सामान्य ज्ञान', color: 'from-violet-500 to-purple-600', icon: 'Compass', chaptersCount: 7, difficulty: 'Easy' },
  art: { id: 'art', nameEn: 'Art & Activity', nameHi: 'कला और गतिविधि', color: 'from-pink-400 to-rose-500', icon: 'Palette', chaptersCount: 4, difficulty: 'Easy' },
  science: { id: 'science', nameEn: 'Science', nameHi: 'विज्ञान', color: 'from-cyan-500 to-blue-600', icon: 'FlaskConical', chaptersCount: 10, difficulty: 'Medium' },
  sst: { id: 'sst', nameEn: 'Social Science', nameHi: 'सामाजिक विज्ञान', color: 'from-indigo-700 to-violet-800', icon: 'Globe', chaptersCount: 7, difficulty: 'Medium' },
  computer: { id: 'computer', nameEn: 'Computer Science', nameHi: 'कंप्यूटर विज्ञान', color: 'from-emerald-600 to-teal-750', icon: 'Laptop', chaptersCount: 8, difficulty: 'Medium' },
  sanskrit: { id: 'sanskrit', nameEn: 'Sanskrit', nameHi: 'संस्कृत', color: 'from-amber-600 to-amber-800', icon: 'BookOpen', chaptersCount: 5, difficulty: 'Medium' },
  physics: { id: 'physics', nameEn: 'Physics', nameHi: 'भौतिक विज्ञान', color: 'from-red-500 to-orange-600', icon: 'Flame', chaptersCount: 9, difficulty: 'Hard' },
  chemistry: { id: 'chemistry', nameEn: 'Chemistry', nameHi: 'रसायन विज्ञान', color: 'from-sky-500 to-blue-750', icon: 'FlaskConical', chaptersCount: 8, difficulty: 'Hard' },
  biology: { id: 'biology', nameEn: 'Biology', nameHi: 'जीव विज्ञान', color: 'from-green-500 to-teal-600', icon: 'Dna', chaptersCount: 9, difficulty: 'Medium' },
  accountancy: { id: 'accountancy', nameEn: 'Accountancy', nameHi: 'लेखाशास्त्र', color: 'from-purple-600 to-indigo-700', icon: 'TrendingUp', chaptersCount: 8, difficulty: 'Hard' },
  business: { id: 'business', nameEn: 'Business Studies', nameHi: 'व्यवसाय अध्ययन', color: 'from-orange-500 to-amber-600', icon: 'Briefcase', chaptersCount: 7, difficulty: 'Medium' },
  economics: { id: 'economics', nameEn: 'Economics', nameHi: 'अर्थशास्त्र', color: 'from-emerald-500 to-indigo-600', icon: 'LineChart', chaptersCount: 8, difficulty: 'Medium' },
  ip: { id: 'ip', nameEn: 'Informatics Practices', nameHi: 'सूचना अभ्यास', color: 'from-blue-500 to-cyan-600', icon: 'Cpu', chaptersCount: 8, difficulty: 'Medium' },
  history: { id: 'history', nameEn: 'History', nameHi: 'इतिहास', color: 'from-yellow-750 to-amber-900', icon: 'Library', chaptersCount: 8, difficulty: 'Medium' },
  polscience: { id: 'polscience', nameEn: 'Political Science', nameHi: 'राजनीति विज्ञान', color: 'from-sky-600 to-blue-800', icon: 'Shield', chaptersCount: 8, difficulty: 'Medium' },
  civics: { id: 'civics', nameEn: 'Civics', nameHi: 'नागरिक शास्त्र', color: 'from-sky-500 to-blue-700', icon: 'Landmark', chaptersCount: 8, difficulty: 'Medium' },
  geography: { id: 'geography', nameEn: 'Geography', nameHi: 'भूगोल', color: 'from-teal-600 to-emerald-700', icon: 'Map', chaptersCount: 8, difficulty: 'Medium' },
  psychology: { id: 'psychology', nameEn: 'Psychology', nameHi: 'मनोविज्ञान', color: 'from-purple-500 to-pink-600', icon: 'Brain', chaptersCount: 8, difficulty: 'Hard' },
  sociology: { id: 'sociology', nameEn: 'Sociology', nameHi: 'समाजशास्त्र', color: 'from-indigo-505 to-purple-600', icon: 'Users', chaptersCount: 8, difficulty: 'Medium' }
};

export const CLASSES_DATA: Record<number, {
  subjects: Subject[];
  streams?: Record<string, Subject[]>;
}> = {
  1: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math] },
  2: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math, ALL_SUBJECTS.evs] },
  3: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math, ALL_SUBJECTS.evs] },
  4: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math, ALL_SUBJECTS.evs] },
  5: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math, ALL_SUBJECTS.evs] },
  
  6: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math, ALL_SUBJECTS.science, ALL_SUBJECTS.sst, ALL_SUBJECTS.computer, ALL_SUBJECTS.sanskrit] },
  7: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math, ALL_SUBJECTS.science, ALL_SUBJECTS.sst, ALL_SUBJECTS.computer, ALL_SUBJECTS.sanskrit] },
  8: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math, ALL_SUBJECTS.science, ALL_SUBJECTS.sst, ALL_SUBJECTS.computer, ALL_SUBJECTS.sanskrit] },
  
  9: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math, ALL_SUBJECTS.science, ALL_SUBJECTS.sst, ALL_SUBJECTS.computer] },
  10: { subjects: [ALL_SUBJECTS.english, ALL_SUBJECTS.hindi, ALL_SUBJECTS.math, ALL_SUBJECTS.science, ALL_SUBJECTS.sst, ALL_SUBJECTS.computer] },
  
  11: {
    subjects: [],
    streams: {
      'PCM (Science)': [ALL_SUBJECTS.english, ALL_SUBJECTS.physics, ALL_SUBJECTS.chemistry, ALL_SUBJECTS.math],
      'Commerce': [ALL_SUBJECTS.english, ALL_SUBJECTS.accountancy, ALL_SUBJECTS.business, ALL_SUBJECTS.economics],
      'Humanities': [ALL_SUBJECTS.english, ALL_SUBJECTS.history, ALL_SUBJECTS.polscience, ALL_SUBJECTS.geography, ALL_SUBJECTS.economics]
    }
  },
  12: {
    subjects: [],
    streams: {
      'PCM (Science)': [ALL_SUBJECTS.english, ALL_SUBJECTS.physics, ALL_SUBJECTS.chemistry, ALL_SUBJECTS.math],
      'Commerce': [ALL_SUBJECTS.english, ALL_SUBJECTS.accountancy, ALL_SUBJECTS.business, ALL_SUBJECTS.economics],
      'Humanities': [ALL_SUBJECTS.english, ALL_SUBJECTS.history, ALL_SUBJECTS.polscience, ALL_SUBJECTS.geography, ALL_SUBJECTS.economics]
    }
  }
};

export function getChaptersForSubject(subjectId: string, classNum: number): Chapter[] {
  const matching = CHAPTERS.filter(c => c.subjectId === subjectId);
  if (matching.length > 0) return matching;

  const capitalized = subjectId.charAt(0).toUpperCase() + subjectId.slice(1);
  return [
    {
      id: `ch-${subjectId}-1`,
      subjectId: subjectId,
      titleEn: `Chapter 1: Foundations of ${capitalized}`,
      titleHi: `अध्याय 1: ${capitalized} के बुनियादी नियम`,
      summaryEn: `Introduction and essential concepts of ${capitalized} for Class ${classNum}.`,
      summaryHi: `कक्षा ${classNum} के लिए ${capitalized} के बारे में प्रारंभिक ज्ञान और सिद्धांत।`,
      duration: '40 mins',
      difficulty: 'Easy',
      topics: [
        {
          id: `tp-${subjectId}-1-1`,
          titleEn: `Core Principles of ${capitalized}`,
          titleHi: `${capitalized} के मुख्य नियम`,
          contentEn: `In this topic, we will explore the core principles of ${capitalized} and how they govern natural and structured environments around us. For class ${classNum}, we focus on foundational building blocks.`,
          contentHi: `इस विषय में, हम ${capitalized} के मुख्य नियमों और हमारे आस-पास के वातावरण में उनके महत्व को जानेंगे। कक्षा ${classNum} के लिए बुनियादी पहलुओं पर ध्यान दिया जाएगा।`,
          diyActivityEn: `Take an active notebook, write down three real-world examples of this subject that you notice in your local community everyday. Discuss with your friends!`,
          diyActivityHi: `अपनी नोटबुक में इस विषय के तीन उदाहरण लिखें जो आप रोजाना देखते हैं। अपने दोस्तों के साथ चर्चा करें!`
        }
      ]
    },
    {
      id: `ch-${subjectId}-2`,
      subjectId: subjectId,
      titleEn: `Chapter 2: Intermediate Applied ${capitalized}`,
      titleHi: `अध्याय 2: ${capitalized} के प्रायोगिक अनुप्रयोग`,
      summaryEn: `Deep dive into advanced models and practical board exam problems for Class ${classNum}.`,
      summaryHi: `कक्षा ${classNum} के बोर्ड परीक्षा से जुड़े महत्वपूर्ण प्रश्नों और सिद्धांतों का गहन अध्ययन।`,
      duration: '50 mins',
      difficulty: 'Medium',
      topics: [
        {
          id: `tp-${subjectId}-2-1`,
          titleEn: `Practical Applications`,
          titleHi: `व्यावहारिक परिभाषाएँ`,
          contentEn: `Now we look at the real-life practical systems. For instance, in ${capitalized}, modern NCERT standards describe regular structures and board examination questions step-by-step.`,
          contentHi: `अब हम व्यावहारिक प्रणालियों को देखते हैं। आधुनिक NCERT दिशा-निर्देशों के अनुसार महत्वपूर्ण समीकरणों और प्रश्नों को हल करेंगे।`,
          diyActivityEn: `Try to sketch or diagram this topic on a cardboard sheet to display at your village off-grid board sync center!`,
          diyActivityHi: `अपने ऑफ-ग्रिड सिंक सेंटर में प्रदर्शित करने के लिए कार्डबोर्ड शीट पर इस विषय का एक चित्र बनाएं!`
        }
      ]
    }
  ];
}
