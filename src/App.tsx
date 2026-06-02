/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import PhoneAuth from './components/PhoneAuth';
import ParentDashboard from './components/ParentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { 
  BookOpen, Sparkles, Brain, Video, User, Award, MessageSquare, Home, 
  Flame, Trophy, Sliders, DownloadCloud, Wifi, WifiOff, HardDrive, 
  Volume2, Play, Heart, Share2, Send, Plus, Search, Briefcase, 
  GraduationCap, CheckCircle, AlertCircle, Mic, MicOff, Clock, 
  Settings, UserCheck, ShieldAlert, ArrowRight, ChevronRight, 
  RotateCcw, Compass, ShoppingBag, X, Info, Check, Filter, Calendar,
  Calculator, FlaskConical, Palette, Laptop, Dna, TrendingUp, LineChart, 
  Cpu, Library, Shield, Map, Users, Languages, Leaf, Globe
} from 'lucide-react';
import { GRADES, STATE_BOARDS, SUBJECTS, CHAPTERS, SCHOLARSHIPS, CAREER_PATHS, BADGES, STORE_ITEMS, VIDEO_FEED, ALL_SUBJECTS, CLASSES_DATA, getChaptersForSubject } from './data';
import { Language, StudentProfile, Subject, Chapter, QuizQuestion, DoubtQuestion } from './types';

export const CLASSES_METADATA = [
  { num: 1, emoji: '🎒', titleEn: 'First Steps', titleHi: 'पहला कदम', subjectsCount: 6, focusEn: 'Basic Alphabet, Fun Art & Math Play', focusHi: 'वर्णमाला, कला और गणितीय खेल', stage: 'primary' },
  { num: 2, emoji: '✏️', titleEn: 'Word Builder', titleHi: 'शब्द निर्माता', subjectsCount: 6, focusEn: 'Reading Sentences & Activity Labs', focusHi: 'पठन, सरल व्याकरण और गृह विज्ञान', stage: 'primary' },
  { num: 3, emoji: '📐', titleEn: 'Math Wizard', titleHi: 'संख्या जादूगर', subjectsCount: 6, focusEn: 'Multiplication Tables & Science', focusHi: 'गुणा तालिका और पर्यावरण', stage: 'primary' },
  { num: 4, emoji: '🔍', titleEn: 'Eco Explorer', titleHi: 'पर्यावरण खोजी', subjectsCount: 6, focusEn: 'Social Milestones & Local Geography', focusHi: 'सामाजिक मेलजोल और स्थानीय भूगोल', stage: 'primary' },
  { num: 5, emoji: '🚀', titleEn: 'Astro Junior', titleHi: 'भावी वैज्ञानिक', subjectsCount: 6, focusEn: 'Elementary Fractions & Space', focusHi: 'सामान्य भिन्न और सुदूर अंतरिक्ष', stage: 'primary' },
  { num: 6, emoji: '🧪', titleEn: 'Chem Spark', titleHi: 'रसायन चिंगारी', subjectsCount: 7, focusEn: 'Physics Concepts & Indian History', focusHi: 'भौतिकी अवधारणाएं और हिंदी व्याख्या', stage: 'middle' },
  { num: 7, emoji: '🗺️', titleEn: 'World Navigator', titleHi: 'विश्व यात्री', subjectsCount: 7, focusEn: 'Ancient Histories, Algebra & Coding', focusHi: 'प्राचीन इतिहास, बीजगणित, कोडिंग', stage: 'middle' },
  { num: 8, emoji: '🏛️', titleEn: 'Civics Leader', titleHi: 'नागरिक प्रेरणा', subjectsCount: 7, focusEn: 'Democratic Rights & Computers', focusHi: 'लोकतांत्रिक नियम और संगणक अभ्यास', stage: 'middle' },
  { num: 9, emoji: '🔬', titleEn: 'Microcosm', titleHi: 'सूक्ष्म जगत', subjectsCount: 6, focusEn: 'Cells, Atoms & Multi-lingual Vocab', focusHi: 'कोशिका, परमाणु और बहुभाषी ज्ञान', stage: 'secondary' },
  { num: 10, emoji: '📜', titleEn: 'Board Warrior', titleHi: 'बोर्ड विजेता', subjectsCount: 6, focusEn: 'Official Matriculation & Exam Practice', focusHi: 'प्रवेश परीक्षा और बोर्ड परीक्षा महारत', stage: 'secondary' },
  { num: 11, emoji: '📡', titleEn: 'Genius Streams', titleHi: 'अकादमिक मार्ग', subjectsCount: 6, focusEn: 'Science, Business or Humanities Paths', focusHi: 'विज्ञान, व्यवसाय या मानविकी शाखा', stage: 'senior' },
  { num: 12, emoji: '🎓', titleEn: 'Scholar Crown', titleHi: 'एकलव्य संवर्ग', subjectsCount: 6, focusEn: 'Final Exit Boards & Career Hub', focusHi: 'अंतिम परीक्षा और भविष्य करियर मंच', stage: 'senior' }
];

function MainDashboard({ role }: { role?: string }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('userRole');
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // Global States
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding' | 'login' | 'interests' | 'main'>('splash');
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'tiktok' | 'tutor' | 'hubs' | 'profile'>('dashboard');
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage === 'hi' || savedLanguage === 'en') ? (savedLanguage as Language) : 'en';
  });
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [lowInternetMode, setLowInternetMode] = useState<boolean>(false);
  const [dyslexicMode, setDyslexicMode] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'teacher' | 'parent' | 'career' | 'scholarship'>('parent');

  // Theme and Custom Accent Color setup
  const [theme, setTheme] = useState<'dark' | 'light'>('light'); // Default light mode
  const ACCENT_COLORS = [
    { name: 'Deep Navy', primary: '#155EEF', royal: '#061633', accent: '#53B1FD' }
  ];
  const [accentIndex, setAccentIndex] = useState(0); 
  const activeAccent = ACCENT_COLORS[0];

  // Student Profile State
  const [student, setStudent] = useState<StudentProfile>({
    name: 'Aman Patel',
    grade: 'Class 9',
    stateBoard: 'CBSE (Central Board)',
    interests: ['Science Experiments', 'Farming Technology', 'Competitive Exam Grammar'],
    streak: 4,
    coins: 120,
    badges: [BADGES[0], BADGES[2]],
    rankName: 'Pratibhashali Scholar',
    completedLessons: ['ch-sci-1']
  });

  // Active Lesson Detail UI Modal State
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);

  // AI Active Quizzes
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);

  // AI Doubt Solver
  const [doubtText, setDoubtText] = useState<string>('');
  const [doubtList, setDoubtList] = useState<DoubtQuestion[]>([
    {
      id: 'd-1',
      question: 'What is photosynthesis simple explanation?',
      answer: 'Photosynthesis is like a super kitchen inside green leaves! They use yellow sunlight, carbon dioxide gas from air, and water with soil nutrients to cook sweet food (glucose) and release fresh oxygen for us to breathe.',
      timestamp: '2026-05-28 10:11'
    }
  ]);
  const [isAskingDoubt, setIsAskingDoubt] = useState<boolean>(false);
  const [voiceRecording, setVoiceRecording] = useState<boolean>(false);
  const [voiceSeconds, setVoiceSeconds] = useState<number>(0);

  // Onboarding screen index
  const [onboardIndex, setOnboardIndex] = useState<number>(0);
  const onboardingSlides = [
    {
      titleEn: "National Curriculum Framework Portal",
      titleHi: "राष्ट्रीय पाठ्यचर्या रूपरेखा प्रवेश",
      descEn: "Bilingual, responsive curriculum frameworks designed in alignment with State Board directives and integrated academic metrics.",
      descHi: "राज्य बोर्ड और राष्ट्रीय शिक्षा दिशानिर्देशों के अनुरूप तैयार द्विभाषी, अनुकूलित और अत्यंत परिष्कृत शैक्षणिक मंच।",
      badge: "Classes 6 - 12 State Portals"
    },
    {
      titleEn: "Bilingual Adaptive Assistant",
      titleHi: "द्विभाषी अनुकूली शिक्षण प्रणाली",
      descEn: "Intelligent databases designed to operate on local, low-bandwidth files with complete sync consistency.",
      descHi: "बिना इंटरनेट के भी सीखने की निरंतरता के लिए स्थानीय एसडी-कार्ड डेटाबेस तकनीक और ग्रामीण हब सिंकिंग प्रणालियों का सुचारू घालमेल।",
      badge: "Zero-Data Offline Engineering"
    },
    {
      titleEn: "Scholastic Honors & Career Tracks",
      titleHi: "अकादमिक पुरस्कार और करियर दिशा-निर्देश",
      descEn: "Log progressive milestones, prepare for administrative scholarship exams, and unlock certified career modules.",
      descHi: "दैनिक लक्ष्यों को पूरा करें, राष्ट्रीय प्रतिस्पर्धी छात्रवृत्ति योजनाओं की तैयारी करें और विशेष प्रशासनिक व तकनीकी करियर मार्ग खोलें।",
      badge: "Scholastic Honors & Verification"
    }
  ];

  // Quick state board custom state
  const [tempBoard, setTempBoard] = useState(STATE_BOARDS[0]);
  const [tempGrade, setTempGrade] = useState(GRADES[8]);
  const [selectedClassNum, setSelectedClassNum] = useState<number>(9);
  const [classSelectorDesign, setClassSelectorDesign] = useState<'stages-glow' | 'friendly-cards' | 'sleek-badges'>('stages-glow');
  const [selectedStream, setSelectedStream] = useState<'Science' | 'Commerce' | 'Arts/Humanities'>('Science');
  const [dashboardView, setDashboardView] = useState<'classes' | 'subjects'>('classes');
  const [downloadedSubjects, setDownloadedSubjects] = useState<string[]>([]);
  const [activeSubjectTab, setActiveSubjectTab] = useState<'chapters' | 'videos' | 'tutor' | 'offline'>('chapters');
  const [downloadingSubjectId, setDownloadingSubjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Short Video TikTok simulation state
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
  const [videoComments, setVideoComments] = useState<Record<string, { user: string, text: string }[]>>({
    'vid-1': [
      { user: 'Sanjay Yadav', text: 'This is a beautiful demo Sir! Simple' },
      { user: 'Anjali Verma', text: 'Our teacher showed this ball bounce trick in the school grounds today!' }
    ],
    'vid-2': [
      { user: 'Rahul Prasad', text: 'Shreedharacharya formula was so easy standard layout' }
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);

  // Store variables
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Village Sync Hub Simulation
  const [isSyncingVillage, setIsSyncingVillage] = useState(false);
  const [villageSyncLog, setVillageSyncLog] = useState<string>('');

  // Homework submission state
  const [homeworkFileSubmitted, setHomeworkFileSubmitted] = useState(false);
  const [isUploadingHomework, setIsUploadingHomework] = useState(false);

  // Parent Report generator state
  const [parentReportText, setParentReportText] = useState<string>('');
  const [isGeneratingParentReport, setIsGeneratingParentReport] = useState<boolean>(false);

  // Teacher tools: Assignments list state on client side
  const [assignments, setAssignments] = useState<any[]>([
    { id: '1', titleEn: 'Math: Quadratic Equations Practice', titleHi: 'गणित: द्विघात समीकरण अभ्यास', dueDate: '2026-06-05', classGrade: 'Class 10', totalPoints: 50, submissions: 18 },
    { id: '2', titleEn: 'Science: Water Cycle Diagram & Setup', titleHi: 'विज्ञान: जल चक्र चित्र और गतिविधि', dueDate: '2026-06-03', classGrade: 'Class 7', totalPoints: 30, submissions: 24 }
  ]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentGrade, setNewAssignmentGrade] = useState('Class 9');

  // Attention Timer Mode (Adaptive Attention Mode)
  const [attentionActive, setAttentionActive] = useState(false);
  const [attentionTimeLeft, setAttentionTimeLeft] = useState(1500); // 25 Min
  const [attentionCoinsBonus, setAttentionCoinsBonus] = useState(0);

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Mindful Shorts Break States
  const [studyTime, setStudyTime] = useState<number>(() => {
    const saved = localStorage.getItem("daily_study_seconds");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [shortsWatchTime, setShortsWatchTime] = useState<number>(() => {
    const saved = localStorage.getItem("daily_shorts_watch_seconds");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());
  const [mindfulShorts, setMindfulShorts] = useState<any[]>([]);
  const [activeShortsBreakOpen, setActiveShortsBreakOpen] = useState<boolean>(false);
  const [activeShortVideo, setActiveShortVideo] = useState<any | null>(null);
  const [shortsCategoryFilter, setShortsCategoryFilter] = useState<string>('All');
  const [viewingAdminShorts, setViewingAdminShorts] = useState<boolean>(false);

  // Admin upload/categorize states
  const [adminTitleEn, setAdminTitleEn] = useState<string>('');
  const [adminTitleHi, setAdminTitleHi] = useState<string>('');
  const [adminAuthor, setAdminAuthor] = useState<string>('');
  const [adminCategory, setAdminCategory] = useState<string>('Motivation');
  const [adminVideoUrl, setAdminVideoUrl] = useState<string>('');

  // Daily Reset & Initialization
  useEffect(() => {
    const today = new Date().toDateString();
    const lastSavedDate = localStorage.getItem("last_active_date");
    if (lastSavedDate && lastSavedDate !== today) {
      setStudyTime(0);
      setShortsWatchTime(0);
      localStorage.setItem("daily_study_seconds", "0");
      localStorage.setItem("daily_shorts_watch_seconds", "0");
      localStorage.setItem("last_active_date", today);
    } else if (!lastSavedDate) {
      localStorage.setItem("last_active_date", today);
    }
  }, []);

  // Sync state with backend at interval & on change
  useEffect(() => {
    const syncStatusWithBackend = async () => {
      try {
        await fetch('/api/mindful-shorts/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: 'default-student',
            studyTime,
            shortsWatchTime
          })
        });
      } catch (err) {
        console.error("Failed to sync status with database:", err);
      }
    };
    const interval = setInterval(syncStatusWithBackend, 12000);
    syncStatusWithBackend();
    return () => clearInterval(interval);
  }, [studyTime, shortsWatchTime]);

  // Fetch approved videos from list
  const fetchMindfulShorts = async () => {
    try {
      const res = await fetch('/api/mindful-shorts/videos');
      const data = await res.json();
      if (data.videos) {
        setMindfulShorts(data.videos);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMindfulShorts();
  }, []);

  // Track active study interactions (1-second precision)
  useEffect(() => {
    const handleActivity = () => {
      setLastActivityTime(Date.now());
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Active study timer loop (pauses after 2 minutes idle)
  useEffect(() => {
    const interval = setInterval(() => {
      const isInactive = (Date.now() - lastActivityTime) > 120000;
      const isStudying = currentTab === 'tutor' || 
                         dashboardView === 'subjects' || 
                         selectedSubject !== null || 
                         currentQuiz.length > 0;

      if (!isInactive && isStudying) {
        setStudyTime(prev => {
          const nextVal = prev + 1;
          localStorage.setItem("daily_study_seconds", String(nextVal));
          return nextVal;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastActivityTime, currentTab, dashboardView, selectedSubject, currentQuiz]);

  // Active watch timer loop for shorts viewing (deducts 15 mins daily)
  useEffect(() => {
    let interval: any;
    if (activeShortsBreakOpen && activeShortVideo && shortsWatchTime < 900) {
      interval = setInterval(() => {
        setShortsWatchTime(prev => {
          const nextVal = prev + 1;
          localStorage.setItem("daily_shorts_watch_seconds", String(nextVal));
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeShortsBreakOpen, activeShortVideo, shortsWatchTime]);

  // Study time display formatting
  const formatStudyProgressString = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return `${hrs} hr ${mins} min / 2 hr completed`;
  };

  // Dynamic Audio Voice simulation
  useEffect(() => {
    let interval: any;
    if (voiceRecording) {
      interval = setInterval(() => {
        setVoiceSeconds(s => s + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(interval);
  }, [voiceRecording]);

  useEffect(() => {
    let timer: any;
    if (attentionActive && attentionTimeLeft > 0) {
      timer = setInterval(() => {
        setAttentionTimeLeft(t => t - 1);
        if (attentionTimeLeft % 60 === 0) {
          // award fractional rewards to motivate student
          setAttentionCoinsBonus(c => c + 1);
          setStudent(st => ({ ...st, coins: st.coins + 1 }));
        }
      }, 1000);
    } else if (attentionTimeLeft === 0 && attentionActive) {
      setAttentionActive(false);
      triggerCelebration("Focus streak complete! +15 Premium Eklavya coins!");
      setStudent(st => ({ ...st, coins: st.coins + 15, streak: st.streak + 1 }));
    }
    return () => clearInterval(timer);
  }, [attentionActive, attentionTimeLeft]);

  // Utility to show beautiful alerts matching the design language
  const triggerCelebration = (msg: string, type: 'success' | 'info' = 'success') => {
    setFeedbackMessage({ text: msg, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  };

  // Maps the icon name string to a nice custom sized Lucide Icon Component
  const renderSubjectIcon = (iconName: string, classNameString = "w-5 h-5") => {
    switch (iconName) {
      case 'Calculator': return <Calculator className={classNameString} />;
      case 'FlaskConical': return <FlaskConical className={classNameString} />;
      case 'Palette': return <Palette className={classNameString} />;
      case 'Laptop': return <Laptop className={classNameString} />;
      case 'Dna': return <Dna className={classNameString} />;
      case 'TrendingUp': return <TrendingUp className={classNameString} />;
      case 'LineChart': return <LineChart className={classNameString} />;
      case 'Cpu': return <Cpu className={classNameString} />;
      case 'Library': return <Library className={classNameString} />;
      case 'Shield': return <Shield className={classNameString} />;
      case 'Map': return <Map className={classNameString} />;
      case 'Brain': return <Brain className={classNameString} />;
      case 'Users': return <Users className={classNameString} />;
      case 'Languages': return <Languages className={classNameString} />;
      case 'Leaf': return <Leaf className={classNameString} />;
      case 'Globe': return <Globe className={classNameString} />;
      case 'Flame': return <Flame className={classNameString} />;
      default: return <BookOpen className={classNameString} />;
    }
  };

  // Text to Speech translation helper (Plays static audio simulation, reads custom block via window.speechSynthesis if supported)
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      triggerCelebration(language === 'hi' ? "🔊 ऑडियो प्लेबैक शुरू..." : "🔊 Audio playback started...", 'info');
    } else {
      triggerCelebration("Text-to-speech fallback: " + text.substring(0, 30) + "...", 'info');
    }
  };

  const handleToggleVoiceDoubt = () => {
    if (voiceRecording) {
      setVoiceRecording(false);
      const voiceQuestion = language === 'hi' 
        ? "विद्युत परिपथ में विद्युत धारा कैसे मापी जाती है और इसका क्या लाभ है?" 
        : "How is electricity measured in circuits and what is Ohm's Law?";
      setDoubtText(voiceQuestion);
      triggerCelebration(language === 'hi' ? "🎙️ आपकी आवाज़ को हिंदी में ट्रांसक्राइब किया गया!" : "🎙️ Speech successfully transcribed bilingually!", 'info');
    } else {
      setVoiceRecording(true);
      triggerCelebration(language === 'hi' ? "🎙️ बोलना शुरू करें, एआई सुन रहा है..." : "🎙️ Voice listening active...", 'info');
    }
  };

  // Server API calls

  // AI Doubt solver trigger
  const handleAskDoubt = async (customText?: string) => {
    const textQuery = customText || doubtText;
    if (!textQuery.trim()) return;

    setIsAskingDoubt(true);
    // Add pending question
    const tempId = 'doubt-' + Date.now();
    const newDoubt: DoubtQuestion = {
      id: tempId,
      question: textQuery,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setDoubtList(prev => [newDoubt, ...prev]);
    setDoubtText('');

    try {
      const response = await fetch('/api/doubt/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textQuery,
          grade: student.grade,
          language,
          isOfflineMode
        })
      });
      const data = await response.json();
      setDoubtList(prev => prev.map(d => d.id === tempId ? { ...d, answer: data.answer || "No response received." } : d));
      triggerCelebration(language === 'hi' ? "✨ एआई ट्यूटर से मिला शानदार उत्तर!" : "✨ Got explanation from AI Tutor!");
    } catch (e) {
      console.error(e);
      setDoubtList(prev => prev.map(d => d.id === tempId ? { ...d, answer: "Unable to reach server. Please complete offline sync or try again!" } : d));
    } finally {
      setIsAskingDoubt(false);
    }
  };

  // Generate Interactive Quiz via Gemini
  const generateQuizForTopic = async (topicNameEn: string, topicNameHi: string) => {
    setIsGeneratingQuiz(true);
    setCurrentQuiz([]);
    setQuizScore(0);
    setActiveQuestionIndex(0);
    setQuizCompleted(false);
    setSelectedOptionIndex(null);
    setHasSubmittedAnswer(false);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: student.grade,
          topicName: language === 'hi' ? topicNameHi : topicNameEn,
          language
        })
      });
      const data = await response.json();
      if (data.quiz && data.quiz.length > 0) {
        setCurrentQuiz(data.quiz);
        triggerCelebration(language === 'hi' ? "📝 आपके लिए लाइव टेस्ट तैयार है!" : "📝 Dynamic AI Quiz prepared for you!");
      } else {
        triggerCelebration("Error preparing quiz. Swapping to local practice schema.", 'info');
      }
    } catch (e) {
      console.error(e);
      triggerCelebration("Offline backup: Integrated science quiz active.", 'info');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Save localized offline state and sync with local Village Hub system
  const handleVillageSync = async () => {
    setIsSyncingVillage(true);
    setVillageSyncLog(language === 'hi' ? "लोकल सिंक फाइलों की खोज..." : "Scanning local sync files...");
    
    setTimeout(async () => {
      setVillageSyncLog(language === 'hi' ? "एसडी कार्ड डेटाबेस पैक किया जा रहा है..." : "Packing local study databases...");
      setTimeout(async () => {
        try {
          const response = await fetch('/api/sync/village', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: 'abhi-std-77',
              offlineLogs: {
                streak: student.streak,
                coins: student.coins,
                completed: student.completedLessons
              }
            })
          });
          const data = await response.json();
          // Add a coins incentive for offline synchronizers
          setStudent(st => ({
            ...st,
            coins: st.coins + 30,
            streak: st.streak + 1
          }));
          triggerCelebration(language === 'hi' ? data.messageHi : data.messageEn);
          setVillageSyncLog(language === 'hi' ? "सिंक पूर्ण! +30 बोनस कॉइन्स प्राप्त हुए 🎉" : "Sync Completed! Saved +30 Bonus Coins 🎉");
        } catch (e) {
          triggerCelebration("Simulated local memory synchronization completed offline successfully!", 'info');
        } finally {
          setIsSyncingVillage(false);
        }
      }, 1500);
    }, 1200);
  };

  // Parent PDF-like feedback generator
  const generateParentReport = async () => {
    setIsGeneratingParentReport(true);
    setParentReportText('');
    try {
      const response = await fetch('/api/parent/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: student.name,
          grade: student.grade,
          language,
          performanceLogs: {
            streak: student.streak,
            coins: student.coins,
            completedLessonsCount: student.completedLessons.length
          }
        })
      });
      const data = await response.json();
      setParentReportText(data.report || "Excellent conceptual tracking.");
      triggerCelebration(language === 'hi' ? "📊 पेरेंट प्रोग्रेस रिपोर्ट तैयार!" : "📊 Parent Performance report compiled!");
    } catch (e) {
      console.error(e);
      setParentReportText("Maintained safe scorecards. High attendance checked.");
    } finally {
      setIsGeneratingParentReport(false);
    }
  };

  // Store custom purchasing
  const purchaseStoreItem = (item: typeof STORE_ITEMS[0]) => {
    if (student.coins < item.price) {
      triggerCelebration(language === 'hi' ? "❌ अपर्याप्त सिक्के! और क्विज खेलें।" : "❌ Not enough gold! Play more quizzes to earn coins.");
      return;
    }
    setStudent(st => ({
      ...st,
      coins: st.coins - item.price,
    }));
    setUnlockedItems(prev => [...prev, item.id]);
    triggerCelebration(language === 'hi' ? `🎉 ${item.nameHi} अनलॉक हो गया!` : `🎉 Successfully unlocked ${item.nameEn}!`);
  };

  // Submit mock student assignments
  const handleHomeworkUpload = () => {
    setIsUploadingHomework(true);
    setTimeout(() => {
      setIsUploadingHomework(false);
      setHomeworkFileSubmitted(true);
      setStudent(st => ({ ...st, coins: st.coins + 20 }));
      triggerCelebration(language === 'hi' ? "⬆️ उत्तर सफलतापूर्वक अपलोड! +20 सिक्के मिले।" : "⬆️ Homework uploaded! State teacher notified. (+20 coins)");
    }, 1500);
  };

  // Create customized assignments (Teacher module)
  const addNewAssignment = () => {
    if (!newAssignmentTitle.trim()) return;
    const item = {
      id: (assignments.length + 1).toString(),
      titleEn: newAssignmentTitle,
      titleHi: `[अनुवाद एआई] ${newAssignmentTitle}`,
      dueDate: '2026-06-15',
      classGrade: newAssignmentGrade,
      totalPoints: 100,
      submissions: 0
    };
    setAssignments([item, ...assignments]);
    setNewAssignmentTitle('');
    triggerCelebration(language === 'hi' ? "📝 नया होमवर्क बोर्ड जारी किया गया!" : "📝 Successfully published homework on State bulletin!");
  };

  // Next Question logic for active Quiz
  const handleQuizAnswerSelect = (index: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOptionIndex(index);
  };

  const submitQuizAnswer = () => {
    if (selectedOptionIndex === null || hasSubmittedAnswer) return;
    setHasSubmittedAnswer(true);
    const correct = currentQuiz[activeQuestionIndex].answerIndex === selectedOptionIndex;
    if (correct) {
      setQuizScore(s => s + 1);
      setStudent(st => ({ ...st, coins: st.coins + 15 })); // Earn 15 coins for correct answer
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOptionIndex(null);
    setHasSubmittedAnswer(false);
    if (activeQuestionIndex + 1 < currentQuiz.length) {
      setActiveQuestionIndex(idx => idx + 1);
    } else {
      setQuizCompleted(true);
      // increment student accomplishments
      if (!student.completedLessons.includes(selectedChapter?.id || '')) {
        setStudent(st => ({
          ...st,
          streak: st.streak + 1,
          completedLessons: [...st.completedLessons, selectedChapter?.id || '']
        }));
      }
    }
  };

  return (
    <div className={`min-h-screen bg-[#F0F5FF] text-[#0C1A30] selection:bg-[#27D8FF]/30 select-none pb-12 transition-all ${dyslexicMode ? 'font-dyslexic' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --color-primary-blue: ${activeAccent.primary};
          --color-royal-blue: ${activeAccent.royal};
          --color-accent-cyan: ${activeAccent.accent};
          --color-bg-white: ${theme === 'dark' ? '#090D1A' : '#F8FBFF'};
        }
        
        .text-\\[\\#0038FF\\] { color: ${activeAccent.royal} !important; }
        .text-\\[\\#005BFF\\] { color: ${activeAccent.primary} !important; }
        .text-\\[\\#27D8FF\\] { color: ${activeAccent.accent} !important; }
        .text-blue-600 { color: ${activeAccent.primary} !important; }
        .text-blue-500 { color: ${activeAccent.primary} !important; }
        .text-blue-700 { color: ${activeAccent.royal} !important; }
        
        .bg-\\[\\#0038FF\\] { background-color: ${activeAccent.royal} !important; }
        .bg-\\[\\#005BFF\\] { background-color: ${activeAccent.primary} !important; }
        .bg-\\[\\#27D8FF\\] { background-color: ${activeAccent.accent} !important; }
        .bg-[#0038FF] { background-color: ${activeAccent.royal} !important; }
        .bg-[#005BFF] { background-color: ${activeAccent.primary} !important; }
        .bg-[#27D8FF] { background-color: ${activeAccent.accent} !important; }
        .bg-blue-600 { background-color: ${activeAccent.primary} !important; }
        .bg-blue-500 { background-color: ${activeAccent.primary} !important; }
        .bg-blue-700 { background-color: ${activeAccent.royal} !important; }
        
        .from-\\[\\#0038FF\\] { --tw-gradient-from: ${activeAccent.royal} !important; --tw-gradient-to: ${activeAccent.accent} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .from-\\[\\#005BFF\\] { --tw-gradient-from: ${activeAccent.primary} !important; }
        .from-blue-650 { --tw-gradient-from: ${activeAccent.royal} !important; }
        .from-blue-600 { --tw-gradient-from: ${activeAccent.primary} !important; }
        .from-blue-700 { --tw-gradient-from: ${activeAccent.royal} !important; }
        .to-\\[\\#27D8FF\\] { --tw-gradient-to: ${activeAccent.accent} !important; }
        .to-blue-500 { --tw-gradient-to: ${activeAccent.accent} !important; }
        .to-\\[\\#011C80\\] { --tw-gradient-to: ${theme === 'dark' ? '#040814' : '#011C80'} !important; }
        .to-\\[\\#002CBD\\] { --tw-gradient-to: ${theme === 'dark' ? '#070C1E' : '#002CBD'} !important; }
        
        .border-\\[\\#005BFF\\] { border-color: ${activeAccent.primary} !important; }
        .border-l-\\[\\#0038FF\\] { border-left-color: ${activeAccent.royal} !important; }
        .border-blue-200 { border-color: ${theme === 'dark' ? '#1E293B' : '#DBEAFE'} !important; }
        .border-blue-100 { border-color: ${theme === 'dark' ? '#1D2433' : '#E0E7FF'} !important; }
        .ring-\\[\\#0038FF\\] { --tw-ring-color: ${activeAccent.royal} !important; }
        
        /* Modern Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#090D1A' : '#F1F5F9'};
        }
        ::-webkit-scrollbar-thumb {
          background: ${activeAccent.primary}33;
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${activeAccent.primary}66;
        }

        ${theme === 'dark' ? `
          /* Ensure overall dark theme */
          body {
            background-color: #070B16 !important;
            color: #E2E8F0 !important;
          }
          .min-h-screen {
            background-color: #070B16 !important;
          }
          .bg-\\[\\#F0F5FF\\] {
            background-color: #070B16 !important;
          }
          .bg-[#F0F5FF] {
            background-color: #070B16 !important;
          }
          .bg-[#F8FBFF] {
            background-color: #0C1224 !important;
          }
          .bg-white {
            background-color: #0C1224 !important;
            color: #E2E8F0 !important;
          }
          .text-slate-800 { color: #94A3B8 !important; }
          .text-slate-900 { color: #F1F5F9 !important; }
          .text-slate-700 { color: #94A3B8 !important; }
          .text-slate-600 { color: #64748B !important; }
          .text-slate-500 { color: #64748B !important; }
          .text-slate-400 { color: #475569 !important; }
          
          .bg-slate-50 { background-color: #121A2F !important; }
          .bg-slate-100 { background-color: #121A2F !important; }
          .bg-slate-200 { background-color: #1E293B !important; }
          .bg-gray-100 { background-color: #121A2F !important; }
          
          .border-slate-100 { border-color: #1E293B !important; }
          .border-slate-200 { border-color: #1E293B !important; }
          .border-gray-200 { border-color: #1E293B !important; }
          .border-blue-50 { border-color: #121A2F !important; }
          
          .glass-panel {
            background: rgba(12, 18, 36, 0.85) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            color: #F8FAFC !important;
          }
          
          /* Cards, lists, elements dark mode */
          .bg-blue-50 { background-color: #121A2F !important; }
          .text-slate-900 { color: #F8FAFC !important; }
          .hover\\:bg-slate-50:hover { background-color: #1E293B !important; }
          .hover\\:bg-slate-100:hover { background-color: #1E293B !important; }
          .hover\\:bg-blue-50:hover { background-color: #121A2F !important; }
          
          /* Override list elements border/colors */
          input, select, textarea {
            background-color: #121A2F !important;
            color: #F8FAFC !important;
            border-color: #1E293B !important;
          }
          ::placeholder {
            color: #64748B !important;
            opacity: 1;
          }
        ` : `
          body {
            background-color: #F8FBFF !important;
            color: #0c1a30;
          }
        `}
      ` }} />
      
      {/* Dynamic Global Top Header Bar (Desktop & Tablet Navigation Support) */}
      <nav className="glass-panel sticky top-0 z-50 px-4 md:px-8 py-3 border-b border-blue-100 flex flex-wrap justify-between items-center bg-white/90">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-[#0038FF] to-[#27D8FF] p-2.5 rounded-2xl shadow-md text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#0038FF] to-[#005BFF] bg-clip-text text-transparent">
              ABHIshiksha
            </h1>
            <p className="text-[10px] uppercase font-bold text-[#005BFF] tracking-widest hidden sm:block">
              Premium Indian EdTech System
            </p>
          </div>
        </div>

        {/* Global Control Widgets */}
        <div className="flex flex-wrap items-center gap-2 mt-2 lg:mt-0">

          {/* Theme switcher: Dark Mode <-> Light Mode */}
          <button 
            id="theme-switcher-btn"
            onClick={() => {
              setTheme(t => t === 'dark' ? 'light' : 'dark');
              triggerCelebration(
                theme === 'dark' 
                  ? (language === 'hi' ? "☀️ लाइट मोड एक्टिवेट हो गया है!" : "☀️ Light Mode activated!") 
                  : (language === 'hi' ? "🌙 डार्क मोड एक्टिवेट हो गया है!" : "🌙 Dark Mode activated!")
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer"
            title="Switch Theme"
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          
          {/* Bilingual Language Selector Swapper toggler */}
          <button 
            id="lang-toggler"
            onClick={() => setLanguage(lang => lang === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-750 dark:text-slate-200 shadow-xs cursor-pointer"
          >
            <span>🇮🇳</span>
            <span>{language === 'hi' ? 'English (En)' : 'हिन्दी (Hi)'}</span>
          </button>

          {/* Low Internet mode toggle */}
          <button 
            id="internet-mode-toggler"
            onClick={() => {
              setLowInternetMode(!lowInternetMode);
              triggerCelebration(
                !lowInternetMode 
                  ? (language === 'hi' ? "⚠️ लो-इंटरनेट मोड: इमेज और वीडियो कंप्रेस्ड लोड होंगे" : "⚠️ Low Internet Mode Activated: Data saved.") 
                  : (language === 'hi' ? "🌐 सामान्य हाई-स्पीड मोड चालू" : "🌐 High speed connection active.")
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer ${
              lowInternetMode 
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                : 'bg-white/75 dark:bg-slate-900/50 text-slate-700 dark:text-slate-250 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {lowInternetMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{lowInternetMode ? 'Low Data (On)' : 'Normal Net'}</span>
          </button>

          {/* Offline Sandbox Simulator Switch */}
          <button 
            id="offline-toggler"
            onClick={() => {
              setIsOfflineMode(!isOfflineMode);
              triggerCelebration(
                !isOfflineMode 
                  ? "📴 Offline learning active. Queries will use preloaded memory database!" 
                  : "🌐 Connected to State Cloud Sync servers!"
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer ${
              isOfflineMode 
                ? 'bg-[#0038FF]/10 text-[#0038FF] dark:text-[#27D8FF] border-[#0038FF]/30 animate-pulse' 
                : 'bg-white/75 dark:bg-slate-900/50 text-slate-755 dark:text-slate-250 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{isOfflineMode ? 'Offline Mode (On)' : 'Online Cloud'}</span>
          </button>

          {/* Dyslexic Font support toggler */}
          <button
            id="dyslexic-font-btn"
            onClick={() => setDyslexicMode(!dyslexicMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-xs cursor-pointer ${
              dyslexicMode 
                ? 'bg-indigo-600/10 text-indigo-500 border-indigo-600/35' 
                : 'bg-white/75 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
            title="Dyslexia Friendly Font Switcher"
          >
            ✏️ Dyslexic Assist
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 shadow-xs cursor-pointer"
            title="Logout"
          >
            🚪 Logout
          </button>

        </div>
      </nav>

      {/* Dynamic alert message modal box */}
      {feedbackMessage && (
        <div id="feedback-alert" className="fixed top-20 right-4 z-50 max-w-sm glass-panel p-4 rounded-2xl shadow-2xl flex items-start gap-3 border-l-4 border-l-[#0038FF] transition-all animate-bounce">
          <Sparkles className="w-5 h-5 text-[#27D8FF] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#0038FF] uppercase tracking-wider">ABHIshiksha Alert</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">{feedbackMessage.text}</p>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* Layout description on top */}
        <div className="bg-gradient-to-r from-[#0038FF]/5 to-[#27D8FF]/5 p-4 rounded-2xl border border-blue-100/30 mb-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-xs font-extrabold bg-[#005BFF]/10 text-[#0038FF] px-2.5 py-1 rounded-full uppercase tracking-wider">
              {language === 'hi' ? 'भारतीय सरकारी स्कूल शिक्षा' : 'Indian National Curriculum Support'}
            </span>
            <h2 className="text-base font-bold text-slate-800 mt-1 text-left">
              {language === 'hi' 
                ? 'कक्षा 1 से 12 तक के छात्रों के लिए यूपी, बिहार और सीबीएसई बोर्ड विशेष' 
                : 'UP, Bihar, CBSE Board customized dynamic modules'}
            </h2>
          </div>
          {/* Avatar Profile mini card */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-blue-100 shadow-sm shrink-0">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-[#0038FF] to-[#27D8FF] p-0.5 relative ${unlockedItems.includes('str-frame-gold') ? 'ring-4 ring-amber-400 scale-105' : ''}`}>
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-[#0038FF]">
                {student.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 text-[8px] font-bold">
                ★
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800">{student.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">{student.grade} • {student.stateBoard}</p>
            </div>
          </div>
        </div>

        {/* If we are NOT in main screen, render the intro screens in a beautifully centered widescreen container on the desktop */}
        {currentScreen !== 'main' ? (
          <div className="max-w-xl mx-auto my-12 bg-white shadow-2xl rounded-3xl border border-blue-100 overflow-hidden relative flex flex-col justify-between w-full" style={{ minHeight: '580px' }}>
            
            <div className="bg-[#F8FBFF] flex-grow overflow-y-auto no-scrollbar relative flex flex-col min-h-[580px]">
                
                {/* 1. SPLASH SCREEN (Premium Blue Gradient with book logo) */}
                {currentScreen === 'splash' && (
                  <div id="splash-screen" className="absolute inset-0 bg-gradient-to-b from-[#0038FF] to-[#011C80] text-white flex flex-col justify-between p-8 z-20 text-center animate-fade-in">
                    <div className="mt-8 flex justify-end">
                      <span className="bg-white/10 text-white border border-white/20 text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold">
                        Bilingual AI Ed
                      </span>
                    </div>

                    <div className="my-auto flex flex-col items-center">
                      <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mb-6 shadow-xl border border-white/20 animate-pulse">
                        <BookOpen className="w-12 h-12 text-[#27D8FF]" />
                      </div>
                      <h1 className="text-4xl font-extrabold tracking-tight">ABHIshiksha</h1>
                      <div className="w-12 h-1 bg-[#27D8FF] my-4 rounded-full"></div>
                      <p className="text-sm font-light text-blue-100 max-w-xs leading-relaxed">
                        Learn & Rise daily with the power of Adaptability
                      </p>
                    </div>

                    <div className="mb-4 space-y-3">
                      <button 
                        id="start-onboard-btn"
                        onClick={() => setCurrentScreen('onboarding')}
                        className="w-full bg-[#27D8FF] hover:bg-cyan-400 text-[#0038FF] text-sm font-extrabold py-4 px-6 rounded-2xl shadow-lg transition-all transform active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2"
                      >
                        <span>{language === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <p className="text-[10px] text-blue-200">ABHIshiksha v3.5-flash Built securely with Cloud AI</p>
                    </div>
                  </div>
                )}

                {/* 2. ONBOARDING SCREEN (Interactive Slider with dots, Duolingo tone) */}
                {currentScreen === 'onboarding' && (
                  <div id="onboarding-screen" className="absolute inset-0 bg-gradient-to-b from-[#0038FF] to-[#011C80] text-white flex flex-col justify-between p-8 z-20 animate-fade-in">
                    <div className="flex justify-between items-center mt-6">
                      <span className="text-xs bg-black/20 px-3 py-1 rounded-full border border-white/10 font-bold">
                        {onboardingSlides[onboardIndex].badge}
                      </span>
                      <button className="text-xs text-white/70 hover:text-white" onClick={() => setCurrentScreen('login')}>
                        Skip
                      </button>
                    </div>

                    <div className="my-auto flex flex-col items-center text-center">
                      {/* Generates placeholder educational graphic depending on sliding screen */}
                      <div className="w-32 h-32 bg-white/10 rounded-[40px] flex items-center justify-center mb-8 shadow-inner border border-white/10">
                        {onboardIndex === 0 && <Brain className="w-16 h-16 text-[#27D8FF]" />}
                        {onboardIndex === 1 && <WifiOff className="w-16 h-16 text-yellow-300" />}
                        {onboardIndex === 2 && <Trophy className="w-16 h-16 text-amber-300" />}
                      </div>

                      <h2 className="text-2xl font-bold tracking-tight">
                        {language === 'hi' ? onboardingSlides[onboardIndex].titleHi : onboardingSlides[onboardIndex].titleEn}
                      </h2>
                      <p className="text-sm text-slate-100 font-light mt-4 leading-relaxed max-w-xs">
                        {language === 'hi' ? onboardingSlides[onboardIndex].descHi : onboardingSlides[onboardIndex].descEn}
                      </p>
                    </div>

                    <div className="mb-4 space-y-4">
                      {/* Dots representation */}
                      <div className="flex justify-center gap-2">
                        {onboardingSlides.map((_, i) => (
                          <span 
                            key={i} 
                            onClick={() => setOnboardIndex(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${onboardIndex === i ? 'bg-[#27D8FF] w-6' : 'bg-white/30'}`}
                          />
                        ))}
                      </div>

                      <button 
                        id="onboard-next-btn"
                        onClick={() => {
                          if (onboardIndex + 1 < onboardingSlides.length) {
                            setOnboardIndex(onboardIndex + 1);
                          } else {
                            setCurrentScreen('login');
                          }
                        }}
                        className="w-full bg-[#F8FBFF] hover:bg-white text-[#0038FF] text-sm font-extrabold py-4 rounded-2xl shadow-lg transition-all uppercase tracking-wider"
                      >
                        {onboardIndex < 2 ? (language === 'hi' ? 'आगे बढ़ें' : 'More') : (language === 'hi' ? 'लॉगिन / साइनअप' : 'Let\'s Learn!')}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. LOGIN & SIGN UP SCREEN (Indian Context with Phone / Email container) */}
                {currentScreen === 'login' && (
                  <div id="login-screen" className="absolute inset-0 bg-gradient-to-b from-[#0038FF] to-[#011C80] text-white flex flex-col justify-between p-8 z-20 animate-fade-in">
                    <div className="mt-8 text-center flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
                        <BookOpen className="w-9 h-9 text-[#0038FF]" />
                      </div>
                      <h2 className="text-2xl font-bold">Log in or sign up</h2>
                      <p className="text-xs text-blue-100 mt-1">Select your desired state board pathway</p>
                    </div>

                    {/* Inputs Card block */}
                    <div className="glass-panel text-slate-800 p-6 rounded-3xl shadow-xl space-y-4 my-auto">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Mobile Student / Parent Contact
                        </label>
                        <div className="flex">
                          <span className="bg-slate-100 text-slate-600 px-3 py-3 rounded-l-xl text-sm font-bold border border-slate-200">
                            +91
                          </span>
                          <input 
                            id="login-phone"
                            type="text" 
                            placeholder="Enter 10-digit phone" 
                            defaultValue="9876543210"
                            className="w-full bg-[#F8FBFF] border border-slate-200 border-l-0 px-4 py-3 rounded-r-xl text-sm focus:outline-none focus:border-[#0038FF]" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Secure Password or OTP PIN
                        </label>
                        <input 
                          id="login-pass"
                          type="password" 
                          placeholder="••••••" 
                          defaultValue="123456"
                          className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF]" 
                        />
                      </div>

                      <button 
                        id="login-sub-btn"
                        onClick={() => setCurrentScreen('interests')}
                        className="w-full bg-gradient-to-r from-[#0038FF] to-[#005BFF] hover:from-[#005BFF] hover:to-[#0038FF] text-white text-sm font-extrabold py-3.5 rounded-xl shadow-md transition-all active:scale-95"
                      >
                        Verify with OTP
                      </button>

                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">or continue with</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setCurrentScreen('interests')} className="bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl font-bold hover:bg-slate-100 flex items-center justify-center gap-1.5 p-3">
                          <span>Google Workspace</span>
                        </button>
                        <button onClick={() => setCurrentScreen('interests')} className="bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl font-bold hover:bg-slate-100 flex items-center justify-center gap-1.5 p-3">
                          <span>Verified Registry</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-center text-[10px] text-slate-500 max-w-xs mx-auto">
                      By continuing, you verify your student registration in accordance with state Ministry of Education digital portal guidelines.
                    </div>
                  </div>
                )}

                {/* 4. INTERESTS & GRADE SELECTION SCREEN */}
                {currentScreen === 'interests' && (
                  <div id="interests-screen" className="absolute inset-0 bg-[#F0F5FF]/95 text-slate-800 overflow-y-auto p-6 z-20 animate-fade-in">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="text-[#0038FF] font-bold cursor-pointer hover:underline text-xs" onClick={() => setCurrentScreen('login')}>
                        ← Back
                      </div>
                      <div className="h-1 flex-grow bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-[#005BFF]"></div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">Step 2/3</span>
                    </div>

                    <div className="mb-6 text-left">
                      <h2 className="text-2xl font-black tracking-tight text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text">
                        Choose your Level & State Board
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">This configures the Adaptive Learning and Exam prep engine bilingually!</p>
                    </div>

                    {/* Choose Class Selection Grid */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-[#0038FF] tracking-widest block uppercase mb-2">
                          Select Grade Level
                        </label>
                        <div className="grid grid-cols-4 gap-2.5">
                          {GRADES.map((g) => {
                            const gradeNum = g.replace('Class ', '');
                            return (
                              <button
                                key={g}
                                onClick={() => setTempGrade(g)}
                                id={`onboarding-grade-${gradeNum}`}
                                className={`aspect-square rounded-full flex flex-col items-center justify-center border transition-all hover:scale-105 cursor-pointer ${
                                  tempGrade === g 
                                    ? 'bg-[#0038FF] text-white border-[#0038FF] shadow-md font-black' 
                                    : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700 shadow-2xs'
                                }`}
                              >
                                <span className="text-[8px] uppercase tracking-wider opacity-80 font-bold">
                                  {language === 'hi' ? 'कक्षा' : 'Class'}
                                </span>
                                <span className="text-sm font-black -mt-0.5">{gradeNum}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* State Boards */}
                      <div>
                        <label className="text-[10px] font-bold text-[#0038FF] tracking-wider block uppercase mb-2">
                          Select Secondary State Board
                        </label>
                        <div className="space-y-1.5">
                          {STATE_BOARDS.map((bd) => (
                            <button
                              key={bd}
                              onClick={() => setTempBoard(bd)}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                                tempBoard === bd 
                                  ? 'bg-blue-50 text-[#0038FF] border-[#0038FF]' 
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                            >
                              <span>{bd}</span>
                              {tempBoard === bd && <CheckCircle className="w-4 h-4 text-[#0038FF]" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Select Learning Interest Category (Bento Card Style) */}
                      <div>
                        <label className="text-[10px] font-bold text-[#0038FF] tracking-wider block uppercase mb-2">
                          Specialization Stream / Interest Module
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Board Topper Quizzes', 'Vocational & Farming', 'Defense (NDA) Entrance', 'Interactive AI Lab'].map((cat) => (
                            <div 
                              key={cat} 
                              className="p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-cyan-300 transition-all shadow-2xs"
                            >
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mb-2"></div>
                              <p className="text-[10px] font-extrabold text-slate-800">{cat}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Continue Dynamic Launcher Button */}
                      <button 
                        id="onboarding-to-main"
                        onClick={() => {
                          setStudent(s => ({
                            ...s,
                            grade: tempGrade,
                            stateBoard: tempBoard
                          }));
                          // Synchronize dashboard selectedClassNum based on selected tempGrade
                          const numMatch = tempGrade.match(/\d+/);
                          if (numMatch) {
                            setSelectedClassNum(parseInt(numMatch[0], 10));
                          }
                          setCurrentScreen('main');
                          triggerCelebration(language === 'hi' ? `🎉 ${tempGrade} (${tempBoard}) के लिए पाठ्यक्रम सक्रिय !` : `🎉 Initialized learning dynamic modules for ${tempGrade}!`);
                        }}
                        className="w-full mt-4 bg-gradient-to-r from-[#0038FF] to-[#27D8FF] text-white py-4 px-6 rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-[#005BFF]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <span>{language === 'hi' ? 'स्मार्ट डैशबोर्ड पर जाएँ' : 'Launch Adaptive Dashboard'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

            </div>
          </div>
        ) : role === 'admin' ? (
          <AdminDashboard language={language} />
        ) : role === 'parent' ? (
          <ParentDashboard language={language} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            
            {/* COLUMN 1: SIDEBAR ON DESKTOP, DEVICES FEED COMPILER ON MOBILE */}
            <div className="col-span-1 lg:col-span-3 bg-white dark:bg-[#0C1224] border border-blue-100 dark:border-slate-800 rounded-3xl shadow-lg lg:shadow-xs relative overflow-hidden lg:overflow-visible flex flex-col justify-between animate-fade-in lg:sticky lg:top-24 self-start" style={{ minHeight: '640px' }}>
              
              <div className="bg-[#F8FBFF] dark:bg-[#0A0F1E]/20 flex-grow overflow-y-auto lg:overflow-visible no-scrollbar relative flex flex-col h-full lg:bg-transparent" style={{ height: 'auto' }}>
                
                {/* 5. MAIN SYSTEM DASHBOARD SCREENS CONTAINER */}
                {currentScreen === 'main' && (
                  <>
                    {/* DESKTOP PERSISTENT LEFT SIDEBAR MENU (Visible in desktop viewports) */}
                    <div className="hidden lg:flex flex-col gap-4 p-4 text-left h-full justify-between" style={{ minHeight: '580px' }}>
                      <div className="space-y-4">
                        
                        {/* Branded Logo */}
                        <div className="flex items-center gap-2 mb-2 font-display">
                          <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0038FF] to-cyan-400 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">ABH</span>
                          <h4 className="text-[12.5px] font-black text-slate-900 dark:text-white uppercase tracking-wider">AbhiShiksha System</h4>
                        </div>

                        {/* Profile metrics banner */}
                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                          <div className={`w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#0038FF] to-[#27D8FF] p-0.5 relative shrink-0 ${unlockedItems.includes('str-frame-gold') ? 'ring-2 ring-amber-400' : ''}`}>
                            <div className="w-full h-full bg-white dark:bg-[#0C1224] rounded-full flex items-center justify-center font-black text-[11px] text-[#0038FF]">
                              {student.name.charAt(0)}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-black text-slate-850 dark:text-slate-150 truncate leading-none">{student.name}</h5>
                            <span className="text-[9.5px] text-slate-450 dark:text-slate-500 font-medium truncate block mt-1">{student.grade} • {student.stateBoard.replace(/Board.*/, '')}</span>
                          </div>
                        </div>

                        {/* Stats Cards Row */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#FFFCEB] dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900/50 p-2 rounded-xl text-center">
                            <span className="text-[8px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider block">Coins Gained</span>
                            <span className="text-xs font-black text-amber-600 dark:text-amber-300 block mt-0.5 font-mono">{student.coins} pts</span>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-950/25 border border-orange-200 dark:border-orange-900/50 p-2 rounded-xl text-center">
                            <span className="text-[8px] text-orange-850 dark:text-orange-400 font-bold uppercase tracking-wider block">Study streak</span>
                            <span className="text-xs font-black text-orange-600 dark:text-orange-300 block mt-0.5 font-mono">{student.streak} Days</span>
                          </div>
                        </div>

                        {/* Navigation List Menu */}
                        <div className="space-y-1 select-none">
                          {[
                            { id: 'dashboard', label: 'Syllabus & Course', labelHi: 'पाठ्यक्रम और डैशबोर्ड', icon: Home, desc: 'Class books & assessments font-sans' },
                            { id: 'tiktok', label: 'Mindful Shorts', labelHi: 'माइंडफुल शॉर्ट्स', icon: Video, desc: 'Controlled wellness & motivational break' },
                            { id: 'tutor', label: 'AI doubt Solver', labelHi: 'एआई शंका समाधान', icon: Brain, desc: 'Instant bilingual co-pilot font-sans' },
                            { id: 'hubs', label: 'Parent & Teacher Hubs', labelHi: 'अभिभावक-शिक्षक कंसोल', icon: Compass, desc: 'School reports & metrics font-sans' },
                            { id: 'profile', label: 'Cosmetic Store', labelHi: 'पुरस्कार व कस्टमाइज', icon: User, desc: 'Unlocked medals & frames font-sans' }
                          ].map((item) => {
                            const IconComponent = item.icon;
                            const isActive = currentTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setCurrentTab(item.id as any);
                                  if (item.id === 'hubs') {
                                    setActiveSubTab('parent');
                                  }
                                }}
                                className={`w-full flex items-start gap-2.5 p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-[#0038FF] text-white shadow-xs font-bold'
                                    : 'text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                              >
                                <IconComponent className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-[#0038FF]'}`} />
                                <div className="min-w-0">
                                  <span className="text-[11px] font-black block leading-none">
                                    {language === 'hi' ? item.labelHi : item.label}
                                  </span>
                                  <span className={`text-[8px] block mt-1 ${isActive ? 'text-blue-105' : 'text-slate-450 dark:text-slate-500'}`}>
                                    {item.desc}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                      </div>

                      {/* Sync indicators sidebar footer */}
                      <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[8.5px] text-slate-400 dark:text-slate-500 font-mono space-y-0.5 bg-slate-50/50 dark:bg-slate-900/40 p-2 rounded-xl">
                        <div className="flex justify-between items-center bg-transparent">
                          <span>Exam Board:</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-350">{student.stateBoard.replace(/Board.*/, '')}</span>
                        </div>
                        <div className="flex justify-between items-center bg-transparent">
                          <span>Local Cache:</span>
                          <span className="text-emerald-500 font-extrabold flex items-center gap-0.5">● Active</span>
                        </div>
                      </div>

                    </div>

                    {/* MOBILE VIEWPORT FEED COMPILER (Visible only on mobile/tablet viewports) */}
                    <div className="flex flex-col justify-between h-full relative lg:hidden" style={{ minHeight: '620px' }}>
                      
                      {/* APP INTERNAL CONTENT ROUTER */}
                      <div className="p-4 flex-grow overflow-y-auto no-scrollbar pb-20">
                        
                        {/* SUB-SCREEN 1: STANDARD STUDENT DASHBOARD FEED (TikTok visual cues) */}
                        {currentTab === 'dashboard' && (
                        <div id="subscreen-dashboard" className="space-y-4 animate-fade-in">
                          
                          {/* Welcome Profile header banner */}
                          <div className="bg-gradient-to-tr from-[#0038FF] to-[#27D8FF] p-4 rounded-3xl text-white relative overflow-hidden shadow-lg">
                            {/* Accent graphics */}
                            <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mb-8 blur-lg"></div>
                            
                            <div className="flex justify-between items-start z-10 relative">
                              <div>
                                <span className="bg-white/20 text-white border border-white/20 text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full font-extrabold font-mono">
                                  {student.rankName}
                                </span>
                                <h3 className="text-lg font-black mt-1 font-display">Namaste, {student.name}!</h3>
                                <p className="text-[10px] text-blue-100 font-light mt-0.5">Let\'s level up your Class Board prep today</p>
                              </div>
                              <div className="flex items-center gap-1.5 bg-black/25 px-2 py-1 rounded-xl">
                                <Flame className="w-4 h-4 text-orange-400 animated-waves fill-orange-400" />
                                <span className="text-xs font-black font-mono">{student.streak} Days</span>
                              </div>
                            </div>

                            {/* Live metrics progress indicator */}
                            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center z-10 relative">
                              <div className="flex items-center gap-1.5">
                                <Trophy className="w-4 h-4 text-amber-300" />
                                <span className="text-xs font-bold text-white font-mono">{student.coins} Eklavya Coins</span>
                              </div>
                              <span className="text-[10px] text-cyan-200 underline font-semibold cursor-pointer hover:text-cyan-100" onClick={() => setCurrentTab('profile')}>
                                Store reward Shop
                              </span>
                            </div>
                          </div>

                          {/* Quick Attention mode activation banner */}
                          <div className="bg-gradient-to-r from-[#1E293B] to-[#111827] border border-slate-800 p-3 rounded-2xl flex items-center justify-between shadow-xs mb-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-[#38BDF8] animate-spin" />
                              <div>
                                <h4 className="text-xs font-black text-slate-100 uppercase tracking-widest font-mono">Adaptive Focus Mode</h4>
                                <p className="text-[9px] text-slate-400 font-medium">{attentionActive ? "Timer Running: Stay focused!" : "Boost memory concentration + coins!"}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setAttentionActive(!attentionActive);
                                if (!attentionActive) {
                                  triggerCelebration("Focus timer active! Earn standard coin rewards.");
                                }
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer font-mono ${
                                attentionActive 
                                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
                                  : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                              }`}
                            >
                              {attentionActive ? "PAUSE" : "START"}
                            </button>
                          </div>

                          {/* Choose Your Class & Coursework Flow */}
                          <div className="bg-[#111827] p-4.5 rounded-3xl border border-slate-850 shadow-xs text-left mb-4">
                            {dashboardView === 'classes' ? (
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <div>
                                    <h4 className="text-xs font-black text-[#38BDF8] uppercase tracking-widest font-mono">
                                      {language === 'hi' ? 'अपनी कक्षा चुनें' : 'Choose Your Class'}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                      {language === 'hi' ? 'राष्ट्रीय पाठ्यचर्या (Class 1 - 12) चयन' : 'Academic curriculum selection'}
                                    </p>
                                  </div>
                                  <GraduationCap className="w-5 h-5 text-[#38BDF8]" />
                                </div>

                                {/* Premium Visual Design Selector */}
                                <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl mb-4 border border-slate-850">
                                  <button
                                    onClick={() => setClassSelectorDesign('stages-glow')}
                                    className={`flex-1 text-[9px] font-black uppercase py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                                      classSelectorDesign === 'stages-glow'
                                        ? 'bg-[#2563EB] text-white shadow-md'
                                        : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    🚀 {language === 'hi' ? 'स्कूल स्टेज' : 'Interactive Stages'}
                                  </button>
                                  <button
                                    onClick={() => setClassSelectorDesign('friendly-cards')}
                                    className={`flex-1 text-[9px] font-black uppercase py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                                      classSelectorDesign === 'friendly-cards'
                                        ? 'bg-[#0A58FF] text-white shadow-xs'
                                        : 'text-slate-500 hover:text-slate-850'
                                    }`}
                                  >
                                    🍱 {language === 'hi' ? 'स्मार्ट कार्ड' : 'Curated Cards'}
                                  </button>
                                  <button
                                    onClick={() => setClassSelectorDesign('sleek-badges')}
                                    className={`flex-1 text-[9px] font-black uppercase py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                                      classSelectorDesign === 'sleek-badges'
                                        ? 'bg-[#0A58FF] text-white shadow-xs'
                                        : 'text-slate-500 hover:text-slate-850'
                                    }`}
                                  >
                                    💎 {language === 'hi' ? 'न्यूनतम पिल्स' : 'Minimal Pills'}
                                  </button>
                                </div>

                                {/* Design Choice A: Interactive Stages Grid with elegant glowing circles */}
                                {classSelectorDesign === 'stages-glow' && (
                                  <div className="space-y-4 animate-fade-in">
                                    {/* Primary Grades */}
                                    <div className="bg-gradient-to-br from-emerald-950/20 to-[#0F172A] p-3 rounded-2xl border border-slate-800">
                                      <div className="flex justify-between items-center mb-2.5">
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
                                          {language === 'hi' ? 'प्राथमिक विद्यालय (कक्षा 1 - 5)' : 'Primary Stage (Class 1 - 5)'}
                                        </span>
                                        <span className="text-[8px] font-bold text-emerald-400 font-mono">{language === 'hi' ? '6 विषय' : '6 Subjects'}</span>
                                      </div>
                                      <div className="grid grid-cols-5 gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                          <button
                                            key={num}
                                            onClick={() => {
                                              setSelectedClassNum(num);
                                              setDashboardView('subjects');
                                              triggerCelebration(language === 'hi' ? `🎉 कक्षा ${num} चयन किया गया!` : `🎉 Class ${num} Selected!`);
                                            }}
                                            id={`dashboard-grade-circle-${num}`}
                                            className={`aspect-square rounded-full text-xs font-extrabold border transition-all hover:scale-110 flex flex-col items-center justify-center cursor-pointer ${
                                              selectedClassNum === num 
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105' 
                                                : 'bg-[#111827] text-slate-300 border-slate-800 hover:border-emerald-500 hover:bg-[#1E293B] shadow-2xs'
                                            }`}
                                          >
                                            <span className="text-[7px] uppercase tracking-wider opacity-85 font-mono">{language === 'hi' ? 'कक्षा' : 'Class'}</span>
                                            <span className="text-xs font-black mt-0.5">{num}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Middle Grades */}
                                    <div className="bg-gradient-to-br from-blue-950/20 to-[#0F172A] p-3 rounded-2xl border border-slate-800">
                                      <div className="flex justify-between items-center mb-2.5">
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md font-mono">
                                          {language === 'hi' ? 'उच्च प्राथमिक (कक्षा 6 - 8)' : 'Middle Stage (Class 6 - 8)'}
                                        </span>
                                        <span className="text-[8px] font-bold text-blue-400 font-mono">{language === 'hi' ? '7 विषय' : '7 Subjects'}</span>
                                      </div>
                                      <div className="grid grid-cols-5 gap-2">
                                        {[6, 7, 8].map((num) => (
                                          <button
                                            key={num}
                                            onClick={() => {
                                              setSelectedClassNum(num);
                                              setDashboardView('subjects');
                                              triggerCelebration(language === 'hi' ? `🎉 कक्षा ${num} चयन किया गया!` : `🎉 Class ${num} Selected!`);
                                            }}
                                            id={`dashboard-grade-circle-${num}`}
                                            className={`aspect-square rounded-full text-xs font-extrabold border transition-all hover:scale-110 flex flex-col items-center justify-center cursor-pointer ${
                                              selectedClassNum === num 
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                                                : 'bg-[#111827] text-slate-305 border-slate-800 hover:border-blue-500 hover:bg-[#1E293B] shadow-2xs'
                                            }`}
                                          >
                                            <span className="text-[7px] uppercase tracking-wider opacity-85 font-mono">{language === 'hi' ? 'कक्षा' : 'Class'}</span>
                                            <span className="text-xs font-black mt-0.5">{num}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Secondary */}
                                    <div className="bg-gradient-to-br from-amber-950/20 to-[#0F172A] p-3 rounded-2xl border border-slate-800">
                                      <div className="flex justify-between items-center mb-2.5">
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md font-mono">
                                          {language === 'hi' ? 'माध्यमिक विद्यालय (कक्षा 9 - 10)' : 'Secondary Stage (Class 9 - 10)'}
                                        </span>
                                        <span className="text-[8px] font-bold text-amber-400 font-mono">{language === 'hi' ? '6 विषय + बोर्ड' : '6 Subjects + Boards'}</span>
                                      </div>
                                      <div className="grid grid-cols-5 gap-2">
                                        {[9, 10].map((num) => (
                                          <button
                                            key={num}
                                            onClick={() => {
                                              setSelectedClassNum(num);
                                              setDashboardView('subjects');
                                              triggerCelebration(language === 'hi' ? `🎉 कक्षा ${num} चयन किया गया!` : `🎉 Class ${num} Selected!`);
                                            }}
                                            id={`dashboard-grade-circle-${num}`}
                                            className={`aspect-square rounded-full text-xs font-extrabold border transition-all hover:scale-110 flex flex-col items-center justify-center cursor-pointer ${
                                              selectedClassNum === num 
                                                ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105' 
                                                : 'bg-[#111827] text-slate-300 border-slate-800 hover:border-amber-500 hover:bg-[#1E293B] shadow-2xs'
                                            }`}
                                          >
                                            <span className="text-[7px] uppercase tracking-wider opacity-85 font-mono">{language === 'hi' ? 'कक्षा' : 'Class'}</span>
                                            <span className="text-xs font-black mt-0.5">{num}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Senior Secondary */}
                                    <div className="bg-gradient-to-br from-purple-950/20 to-[#0F172A] p-3 rounded-2xl border border-slate-800">
                                      <div className="flex justify-between items-center mb-2.5">
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md font-mono">
                                          {language === 'hi' ? 'उच्च माध्यमिक (कक्षा 11 - 12)' : 'Sr. Secondary Stage (Class 11 - 12)'}
                                        </span>
                                        <span className="text-[8px] font-bold text-purple-400 font-mono">{language === 'hi' ? 'स्ट्रीम्स' : '3 Streams'}</span>
                                      </div>
                                      <div className="grid grid-cols-5 gap-2">
                                        {[11, 12].map((num) => (
                                          <button
                                            key={num}
                                            onClick={() => {
                                              setSelectedClassNum(num);
                                              setDashboardView('subjects');
                                              triggerCelebration(language === 'hi' ? `🎉 कक्षा ${num} चयन किया गया! स्ट्रीम चुनें।` : `🎉 Class ${num} Selected! Select your stream.`);
                                            }}
                                            id={`dashboard-grade-circle-${num}`}
                                            className={`aspect-square rounded-full text-xs font-extrabold border transition-all hover:scale-110 flex flex-col items-center justify-center cursor-pointer ${
                                              selectedClassNum === num 
                                                ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105' 
                                                : 'bg-[#111827] text-slate-300 border-slate-800 hover:border-purple-500 hover:bg-[#1E293B] shadow-2xs'
                                            }`}
                                          >
                                            <span className="text-[7px] uppercase tracking-wider opacity-85 font-mono">{language === 'hi' ? 'कक्षा' : 'Class'}</span>
                                            <span className="text-xs font-black mt-0.5">{num}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Design Choice B: Curated Cards with rich information descriptors */}
                                {classSelectorDesign === 'friendly-cards' && (
                                  <div className="grid grid-cols-2 gap-3 animate-fade-in max-h-[460px] overflow-y-auto pr-1 pb-1">
                                    {CLASSES_METADATA.map((item) => {
                                      const isSelected = selectedClassNum === item.num;
                                      return (
                                        <div
                                          key={item.num}
                                          onClick={() => {
                                            setSelectedClassNum(item.num);
                                            setDashboardView('subjects');
                                            triggerCelebration(language === 'hi' ? `🎉 कक्षा ${item.num} चयन किया गया!` : `🎉 Class ${item.num} Selected!`);
                                          }}
                                          className={`group relative p-2.5 rounded-2xl border text-left cursor-pointer transition-all transform active:scale-98 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
                                            isSelected
                                              ? 'bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border-[#0A58FF] ring-2 ring-[#0A58FF]/10'
                                              : 'bg-white border-slate-200/85 hover:border-slate-350'
                                          }`}
                                        >
                                          {/* Stage color mini bar */}
                                          <div className={`absolute top-0 left-3 right-3 h-1 rounded-b-full transition-all ${
                                            isSelected 
                                              ? 'bg-[#0A58FF]' 
                                              : item.stage === 'primary' 
                                                ? 'bg-emerald-400 opacity-60' 
                                                : item.stage === 'middle' 
                                                  ? 'bg-sky-400 opacity-60' 
                                                  : item.stage === 'secondary' 
                                                    ? 'bg-amber-400 opacity-60' 
                                                    : 'bg-purple-400 opacity-60'
                                          }`} />

                                          <div className="flex items-start justify-between gap-1 pt-1 ml-0.5">
                                            <div className="text-xl">{item.emoji}</div>
                                            <span className={`text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm tracking-widest ${
                                              item.stage === 'primary' 
                                                ? 'text-emerald-700 bg-emerald-50' 
                                                : item.stage === 'middle' 
                                                  ? 'text-[#0A58FF] bg-blue-50' 
                                                  : item.stage === 'secondary' 
                                                    ? 'text-amber-700 bg-amber-50' 
                                                    : 'text-purple-700 bg-purple-50'
                                            }`}>
                                              {language === 'hi' ? (
                                                item.stage === 'primary' ? 'प्राथमिक' : item.stage === 'middle' ? 'माध्यमिक' : item.stage === 'secondary' ? 'हाई' : 'सीनियर'
                                              ) : (
                                                item.stage
                                              )}
                                            </span>
                                          </div>

                                          <div className="mt-2">
                                            <h5 className="text-[10px] font-black text-slate-900 flex items-center gap-1">
                                              <span>{language === 'hi' ? `कक्षा ${item.num}` : `Class ${item.num}`}</span>
                                              <span className="text-[8px] font-medium text-slate-450">- {language === 'hi' ? item.titleHi : item.titleEn}</span>
                                            </h5>
                                            <p className="text-[9px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                                              {language === 'hi' ? item.focusHi : item.focusEn}
                                            </p>
                                          </div>

                                          <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px] font-bold text-slate-400">
                                            <span>{item.subjectsCount} {language === 'hi' ? 'विषय' : 'Subjects'}</span>
                                            <div className="flex items-center text-[#0A58FF]">
                                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-all" />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Design Choice C: Flat Compact Modern Pills */}
                                {classSelectorDesign === 'sleek-badges' && (
                                  <div className="space-y-3.5 animate-fade-in">
                                    <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mb-2">
                                      {language === 'hi' ? 'शीघ्रता से एक-टैप में स्विच करें:' : 'Quick swipe one-tap selection:'}
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                      {CLASSES_METADATA.map((item) => {
                                        const isSelected = selectedClassNum === item.num;
                                        return (
                                          <button
                                            key={item.num}
                                            onClick={() => {
                                              setSelectedClassNum(item.num);
                                              setDashboardView('subjects');
                                              triggerCelebration(language === 'hi' ? `🎉 कक्षा ${item.num} चयन किया गया!` : `🎉 Class ${item.num} Selected!`);
                                            }}
                                            className={`py-2 px-1 rounded-xl text-center border transition-all hover:scale-105 transform active:scale-95 cursor-pointer relative overflow-hidden flex flex-col items-center justify-center ${
                                              isSelected
                                                ? 'bg-[#0A58FF] text-white border-[#0A58FF] shadow-[0_4px_12px_rgba(10,88,255,0.25)] font-bold'
                                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 shadow-3xs'
                                            }`}
                                          >
                                            <span className="text-[14px] leading-none mb-1">{item.emoji}</span>
                                            <span className="text-[9px] font-black uppercase tracking-wider">
                                              {language === 'hi' ? `कक्षा ${item.num}` : `C-${item.num}`}
                                            </span>
                                            <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                                              item.stage === 'primary' 
                                                ? 'bg-emerald-400' 
                                                : item.stage === 'middle' 
                                                  ? 'bg-[#0A58FF]' 
                                                  : item.stage === 'secondary' 
                                                    ? 'bg-amber-400' 
                                                    : 'bg-purple-400'
                                            }`} />
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <div className="flex gap-4 items-center justify-center pt-2 text-[8px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50 p-2 rounded-xl border border-slate-100">
                                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Primary</span>
                                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#0A58FF]"></span> Middle</span>
                                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Secondary</span>
                                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Senior</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-550 uppercase tracking-wider mb-3 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                  <span className="hover:text-[#0A58FF] cursor-pointer" onClick={() => setDashboardView('classes')}>
                                    {language === 'hi' ? 'होम' : 'Home'}
                                  </span>
                                  <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
                                  <span className="hover:text-[#0A58FF] cursor-pointer" onClick={() => setDashboardView('classes')}>
                                    {language === 'hi' ? 'कक्षाएं' : 'Classes'}
                                  </span>
                                  <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
                                  <span className="text-[#0A58FF] bg-blue-100/70 text-blue-800 px-1 py-0.2 rounded font-black max-w-full truncate text-[8px]">
                                    {language === 'hi' ? `कक्षा ${selectedClassNum}` : `Class ${selectedClassNum}`}
                                  </span>
                                  <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
                                  <span className="text-slate-800 font-bold truncate">
                                    {language === 'hi' ? 'विषय' : 'Subjects'}
                                  </span>
                                </div>

                                {/* Stream Selection UI for Class 11 and 12 */}
                                {(selectedClassNum === 11 || selectedClassNum === 12) && (
                                  <div className="mb-4 bg-slate-50/50 p-2 border border-slate-200/80 rounded-2xl">
                                    <h5 className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                                      {language === 'hi' ? 'अपनी स्ट्रीम चुनें' : 'Choose Stream'}
                                    </h5>
                                    <div className="flex flex-col gap-1">
                                      {(['Science', 'Commerce', 'Arts/Humanities'] as const).map((stream) => (
                                        <button
                                          key={stream}
                                          onClick={() => {
                                            setSelectedStream(stream);
                                            triggerCelebration(language === 'hi' ? `🔑 ${stream} स्ट्रीम सक्रिय!` : `🔑 ${stream} Stream customized!`);
                                          }}
                                          className={`px-3 py-1.5 rounded-xl text-left text-[11px] font-extrabold border transition-all cursor-pointer flex items-center justify-between ${
                                            selectedStream === stream
                                              ? 'bg-purple-50 border-purple-300 text-purple-700'
                                              : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                                          }`}
                                        >
                                          <span>
                                            {language === 'hi' 
                                              ? (stream === 'Science' ? 'विज्ञान वर्ग (Science)' : stream === 'Commerce' ? 'वाणिज्य वर्ग (Commerce)' : 'कला वर्ग (Arts)')
                                              : stream}
                                          </span>
                                          {selectedStream === stream && <Check className="w-3.5 h-3.5 text-purple-600" />}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Subjects List Grid */}
                                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                  {((selectedClassNum === 11 || selectedClassNum === 12)
                                    ? CLASSES_DATA[selectedClassNum].streams?.[selectedStream] || []
                                    : CLASSES_DATA[selectedClassNum].subjects
                                  ).map((sub) => {
                                    // Calculate artificial progress mapping for higher design realism:
                                    const progress = student.completedLessons.includes(`ch-${sub.id}-1`) ? 100 : (sub.id === 'math' ? 65 : sub.id === 'science' ? 40 : 0);
                                    return (
                                      <div 
                                        key={sub.id} 
                                        onClick={() => {
                                          setSelectedSubject(sub);
                                          const chaptersList = getChaptersForSubject(sub.id, selectedClassNum);
                                          if (chaptersList.length > 0) {
                                            setSelectedChapter(chaptersList[0]);
                                            setActiveTopicIndex(0);
                                          }
                                          setActiveSubjectTab('chapters');
                                          triggerCelebration(language === 'hi' ? `📖 ${sub.nameHi} विषय सक्रिय !` : `📖 Selected ${sub.nameEn}!`);
                                        }}
                                        className={`bg-white border p-3 rounded-2xl text-left cursor-pointer transition-all transform active:scale-98 shadow-2xs hover:shadow-xs flex items-center justify-between ${
                                          selectedSubject?.id === sub.id 
                                            ? 'border-[#0A58FF] bg-blue-50/10 shadow-xs' 
                                            : 'border-slate-200/80 hover:border-[#0A58FF]/50'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white bg-gradient-to-br ${sub.color}`}>
                                            {renderSubjectIcon(sub.icon, "w-4.5 h-4.5")}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h5 className="text-[11.5px] font-black text-slate-900 leading-tight truncate">
                                              {language === 'hi' ? sub.nameHi : sub.nameEn}
                                            </h5>
                                            <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mt-1">
                                              <span>{sub.chaptersCount} {language === 'hi' ? 'अध्याय' : 'Chapters'}</span>
                                              <span>•</span>
                                              <span className="font-semibold text-slate-600">{sub.difficulty}</span>
                                            </div>
                                            
                                            {/* Progress bar */}
                                            <div className="mt-1 flex items-center gap-2">
                                              <div className="flex-1 bg-slate-100 h-1 rounded-full overflow-hidden">
                                                <div 
                                                  className="bg-[#0A58FF] h-full rounded-full transition-all duration-500" 
                                                  style={{ width: `${progress}%` }}
                                                />
                                              </div>
                                              <span className="text-[8px] font-black text-slate-700">{progress}%</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 hover:bg-[#0A58FF]/15 hover:text-[#0A58FF] shrink-0 ml-1.5 transition-all">
                                          <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <button
                                  onClick={() => setDashboardView('classes')}
                                  className="w-full mt-3.5 bg-slate-150 text-slate-700 hover:bg-slate-200 transition-all py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest cursor-pointer text-center border border-slate-200"
                                >
                                  {language === 'hi' ? '← कक्षाओं पर वापस जाएं' : '← Back to Classes'}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* SMART ADAPTIVE JOURNEY PATH Map (Gamified study path tracking milestone nodes) */}
                          <div className="bg-white p-4 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                              <Brain className="w-4 h-4" /> 
                              <span>{language === 'hi' ? 'महा ज्ञानी डिजिटल मार्ग' : 'Smart Diagnostic Pathway'}</span>
                            </h4>

                            <div className="relative pl-6 py-2 space-y-4 border-l border-blue-200">
                              
                              {/* Node 1 */}
                              <div className="relative">
                                <div className="absolute -left-9 top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-xs flex items-center justify-center text-[10px] text-white">
                                  ✓
                                </div>
                                <h5 className="text-xs font-extrabold text-slate-800">Enrollment & Assessment</h5>
                                <p className="text-[9px] text-slate-500">Perfectly adapted for standard setup requirements</p>
                              </div>

                              {/* Node 2 - Interactive chapter */}
                              <div className="relative p-2.5 bg-blue-50/75 rounded-xl border border-blue-105">
                                <div className="absolute -left-[37px] top-4 w-6 h-6 rounded-full bg-[#030E0] border-4 border-white text-[12px] text-white font-extrabold flex items-center justify-center">
                                  ●
                                </div>
                                <h5 className="text-xs font-extrabold text-[#0A58FF] flex items-center gap-1">
                                  <span>Active Study: Applied Science</span>
                                  <span className="text-[8px] bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">LIVE</span>
                                </h5>
                                <p className="text-[9px] text-slate-600 mt-0.5">Explore Photosynthesis & Formulas</p>
                                <button 
                                  onClick={() => {
                                    const scienceSub = SUBJECTS[1];
                                    const photosynChapter = CHAPTERS[2];
                                    setSelectedSubject(scienceSub);
                                    setSelectedChapter(photosynChapter);
                                    triggerCelebration(language === 'hi' ? "शाबाश! प्रकाश संश्लेषण मॉड्यूल सक्रिय" : "Enjoy learning Photosynthesis!");
                                  }}
                                  className="mt-2 text-[9px] text-white font-bold bg-[#0A58FF] py-1 px-2.5 rounded-lg inline-block hover:bg-[#0030E0]"
                                >
                                  {language === 'hi' ? 'पाठ खोलें' : 'Open Module'}
                                </button>
                              </div>

                              {/* Node 3 */}
                              <div className="relative">
                                <div className="absolute -left-9 top-1 w-6 h-6 rounded-full bg-slate-300 border-4 border-white flex items-center justify-center text-[8px] text-slate-600 font-bold">
                                  3
                                </div>
                                <h5 className="text-xs font-bold text-slate-500">Midterm Grand Assessment</h5>
                                <p className="text-[9px] text-slate-400">Requires 200 Academic Points</p>
                              </div>

                            </div>
                          </div>

                          {/* MINDFUL SHORTS BREAK CARD */}
                          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-[#0F172A] border border-indigo-100 dark:border-indigo-900/40 p-3.5 rounded-2xl space-y-3 text-left">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[8px] uppercase tracking-wider px-2 py-0.5 rounded font-black font-mono">
                                  {language === 'hi' ? 'माइंडफुल ब्रेक' : 'WELLBEING BREAK'}
                                </span>
                                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1">
                                  <span>🧘</span>
                                  <span>{language === 'hi' ? 'माइंडफुल शॉर्ट्स ब्रेक' : 'Mindful Shorts Break'}</span>
                                </h4>
                              </div>
                              <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>

                            {studyTime < 7200 ? (
                              // Locked State
                              <div className="space-y-2">
                                <p className="text-[9px] text-slate-600 dark:text-slate-300 leading-normal">
                                  {language === 'hi' 
                                    ? '15 मिनट के माइंडफुल ब्रेक को अनलॉक करने के लिए कम से कम 2 घंटे सक्रिय होकर अध्ययन करें।' 
                                    : 'Study for 2 hours to unlock your 15-minute mindful break.'}
                                </p>
                                
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[8.5px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                                    <span>{formatStudyProgressString(studyTime)}</span>
                                    <span>{Math.min(100, Math.floor((studyTime / 7200) * 100))}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-indigo-600 transition-all duration-500" 
                                      style={{ width: `${Math.min(100, (studyTime / 7200) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex gap-1.5 pt-1">
                                  <button
                                    onClick={() => {
                                      setCurrentTab('tutor');
                                      triggerCelebration(language === 'hi' ? "चलो ट्यूटर से बात करें या अध्याय पढ़ें!" : "Let's study concepts to earn progress!");
                                    }}
                                    className="flex-1 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[9px] font-black py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 text-center uppercase tracking-wider"
                                  >
                                    {language === 'hi' ? 'चलो अध्ययन करें 📖' : 'Go Study 📖'}
                                  </button>
                                  
                                  {/* Dev test helper button */}
                                  <button
                                    onClick={() => {
                                      setStudyTime(prev => {
                                        const next = prev + 3600; // adds 1 hour
                                        localStorage.setItem("daily_study_seconds", String(next));
                                        return next;
                                      });
                                      triggerCelebration("Added 1 hour study progress!");
                                    }}
                                    className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-[8.5px] font-black px-2 py-1.5 rounded-lg border border-indigo-500/20"
                                    title="Add 1 hr (Dev)"
                                  >
                                    +1h Dev
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Unlocked State
                              <div className="space-y-2">
                                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                                  <p className="text-[9.5px] text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                                    <span>🎉</span>
                                    <span>{language === 'hi' ? '15 मिनट का माइंडफुल ब्रेक उपलब्ध है!' : '15-minute mindful break available!'}</span>
                                  </p>
                                  <span className="text-[8.5px] font-bold text-slate-500 font-mono">
                                    {Math.max(0, Math.floor((900 - shortsWatchTime) / 60))}m left
                                  </span>
                                </div>

                                <p className="text-[9px] text-slate-500 dark:text-slate-400">
                                  {language === 'hi'
                                    ? 'बेहतरीन प्रयास! आप अब प्रेरक कहानियां और युक्तियां देख सकते हैं। (अनियंत्रित स्क्रॉलिंग अक्षम है)।'
                                    : 'Great job studying! You can now watch approved motivational stories & guidance tips.'}
                                </p>

                                <div className="flex gap-2">
                                  {shortsWatchTime >= 900 ? (
                                    <button
                                      disabled
                                      className="flex-1 bg-slate-450 dark:bg-slate-800 text-slate-600 text-[10px] font-black py-2 rounded-xl text-center uppercase tracking-wider cursor-not-allowed"
                                    >
                                      {language === 'hi' ? 'दैनिक ब्रेक समाप्त' : 'Break Time Finished'}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setActiveShortsBreakOpen(true);
                                        const approvedList = mindfulShorts.filter(v => v.approved);
                                        if (approvedList.length > 0) {
                                          setActiveShortVideo(approvedList[0]);
                                        }
                                        triggerCelebration(language === 'hi' ? "🧘 माइंडफुल वीडियो ब्रेक शुरू!" : "🧘 Mindful Break Started!");
                                      }}
                                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black py-2 rounded-xl text-center uppercase tracking-wider cursor-pointer"
                                    >
                                      {language === 'hi' ? 'शॉर्ट्स ब्रेक लें 🎬' : 'Take Shorts Break 🎬'}
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => {
                                      setStudyTime(0);
                                      setShortsWatchTime(0);
                                      localStorage.setItem("daily_study_seconds", "0");
                                      localStorage.setItem("daily_shorts_watch_seconds", "0");
                                      triggerCelebration("Reset progress to zero!");
                                    }}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[8.5px] font-black px-2 py-1.5 rounded-lg border border-red-500/10"
                                    title="Reset Study Progress"
                                  >
                                    Reset Dev
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Interactive Village Sync module triggers inside phone */}
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 p-3.5 rounded-2xl">
                            <h4 className="text-xs font-extrabold text-[#0C1A30] flex items-center gap-1.5">
                              <HardDrive className="w-4 h-4 text-orange-600" />
                              <span>{language === 'hi' ? 'अकादमिक ऑफलाइन सिंक टर्मिनल' : 'Academic Offline Sync Terminal'}</span>
                            </h4>
                            <p className="text-[9px] text-slate-600 mt-1 leading-relaxed">
                              Synchronize local homework results and diagnostic records with local networks or cached physical drives securely.
                            </p>
                            <button 
                              id="village-sync-btn"
                              onClick={handleVillageSync}
                              disabled={isSyncingVillage}
                              className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black py-2 rounded-xl transition-all tracking-wider"
                            >
                              {isSyncingVillage ? (language === 'hi' ? 'सिंकिंग चालू है...' : 'Syncing Data...') : (language === 'hi' ? 'ऑफ़लाइन अकादमिक सिंक' : 'SYNC OFFLINE RECORDS')}
                            </button>
                            {villageSyncLog && <p className="text-[8px] text-slate-500 mt-1.5 font-mono">{villageSyncLog}</p>}
                          </div>

                        </div>
                      )}


                      {/* SUB-SCREEN 2: MINDUL SHORTS WELLBEING & CONTROLLED BREAK PLATFORM */}
                      {currentTab === 'tiktok' && (() => {
                        const activeSelectedVideo = activeShortVideo || (mindfulShorts.length > 0 ? mindfulShorts[0] : null);
                        return (
                        <div id="subscreen-tiktok" className="h-full relative overflow-y-auto bg-[#0C1224] text-white rounded-3xl p-4 space-y-4 animate-fade-in text-left no-scrollbar" style={{ height: '520px' }}>
                          
                          {/* Title block with Countdown */}
                          <div className="flex justify-between items-center border-b border-indigo-950 pb-2">
                            <div>
                              <span className="text-[7.5px] bg-[#0038FF] text-white px-2 py-0.5 rounded uppercase font-black tracking-wider font-mono">
                                {language === 'hi' ? 'नियंत्रित विश्राम समय' : 'Controlled Wellbeing Break'}
                              </span>
                              <h3 className="text-xs font-black text-white mt-1">
                                🧠 {language === 'hi' ? 'माइंडफुल शॉर्ट्स ब्रेक' : 'Mindful Shorts Break'}
                              </h3>
                            </div>
                            
                            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-indigo-500/15 text-indigo-300">
                              <Clock className="w-3.5 h-3.5 text-[#27D8FF]" />
                              <span className="text-[10px] font-black font-mono">
                                {shortsWatchTime >= 900 ? "00:00" : `${String(Math.floor((900 - shortsWatchTime) / 60)).padStart(2, '0')}:${String((900 - shortsWatchTime) % 60).padStart(2, '0')}`}
                              </span>
                            </div>
                          </div>

                          {studyTime < 7200 ? (
                            // Locked state inside the mobile simulated tab
                            <div className="flex flex-col justify-center items-center py-10 px-4 text-center space-y-4">
                              <div className="w-16 h-16 bg-slate-900/80 text-amber-500 border border-slate-800 rounded-full flex items-center justify-center animate-pulse">
                                <Lock className="w-8 h-8" />
                              </div>
                              <div className="space-y-1.5">
                                <h4 className="text-xs font-black text-rose-450 uppercase tracking-wider">
                                  {language === 'hi' ? 'शॉर्ट्स ब्रेक लॉक है 🔒' : 'Shorts Break Locked 🔒'}
                                </h4>
                                <p className="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto">
                                  {language === 'hi' 
                                    ? '15 मिनट के माइंडफुल ब्रेक को अनलॉक करने के लिए कम से कम 2 घंटे सक्रिय होकर अध्ययन करें।' 
                                    : 'Study for 2 hours to unlock your 15-minute mindful break and watch approved positive stories.'}
                                </p>
                              </div>

                              <div className="w-full space-y-1.5 max-w-xs">
                                <div className="flex justify-between text-[8px] font-bold text-slate-400 font-mono">
                                  <span>{formatStudyProgressString(studyTime)}</span>
                                  <span>{Math.min(100, Math.floor((studyTime / 7200) * 100))}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-indigo-500 transition-all duration-500" 
                                    style={{ width: `${Math.min(100, (studyTime / 7200) * 100)}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2 w-full pt-1.5">
                                <button
                                  onClick={() => {
                                    setCurrentTab('dashboard');
                                    triggerCelebration(language === 'hi' ? "चलो पाठ्यक्रम पढ़ें!" : "Let's work through chapters to build study hours!");
                                  }}
                                  className="flex-grow bg-[#0038FF] hover:bg-blue-700 text-white text-[9px] font-black py-2 rounded-xl text-center uppercase tracking-wider cursor-pointer"
                                >
                                  {language === 'hi' ? 'चलो अध्ययन करें 📖' : 'Study Chapters 📖'}
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setStudyTime(prev => {
                                      const next = prev + 3600;
                                      localStorage.setItem("daily_study_seconds", String(next));
                                      return next;
                                    });
                                    triggerCelebration("Added 1 hour study progress!");
                                  }}
                                  className="bg-indigo-650/15 hover:bg-indigo-650/35 text-indigo-400 text-[9px] font-semibold px-2 py-2 rounded-xl border border-indigo-500/15 cursor-pointer"
                                >
                                  +1h Dev
                                </button>
                              </div>
                            </div>
                          ) : shortsWatchTime >= 900 ? (
                            // Locked because daily limit has been exhausted
                            <div className="py-12 text-center space-y-5 px-4">
                              <div className="w-16 h-16 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Flame className="w-8 h-8 text-orange-400 fill-orange-450/20" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-xs font-black text-white">
                                  {language === 'hi' ? 'दैनिक ब्रेक समाप्त हो गया है।' : 'Daily Break is Complete!'}
                                </h4>
                                <p className="text-[9.5px] text-slate-400 leading-normal">
                                  {language === 'hi' 
                                    ? '“आपका माइंडफुल ब्रेक पूरा हो गया है। चलो हमारी पढ़ाई जारी रखते हैं।”' 
                                    : '“Your mindful break is complete. Let’s continue learning and earning rewards!”'}
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  setCurrentTab('dashboard');
                                  triggerCelebration(language === 'hi' ? "चलो पढ़ाई जारी रखें!" : "Let's work hard together!");
                                }}
                                className="w-full bg-[#0038FF] hover:bg-blue-700 text-white text-[9px] font-black py-2.5 rounded-xl uppercase tracking-widest cursor-pointer"
                              >
                                {language === 'hi' ? 'अध्ययन पर वापस जाएं 🚀' : 'Back to Learning 🚀'}
                              </button>
                            </div>
                          ) : (
                            // Unlocked watching state
                            <div className="space-y-3">
                              {/* Current Playing video screen */}
                              {activeSelectedVideo ? (
                                <div className="bg-black rounded-2xl overflow-hidden border border-slate-800 relative aspect-video flex flex-col justify-end bg-cover bg-center shadow-md shrink-0" style={{ backgroundImage: `url(${activeSelectedVideo.videoUrl})` }}>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35 flex flex-col justify-between p-3">
                                    <div className="flex justify-between items-start">
                                      <span className="text-[7.5px] bg-indigo-650/95 border border-indigo-500/20 text-white font-mono px-2 py-0.5 rounded uppercase font-black">
                                        {activeSelectedVideo.category}
                                      </span>
                                      
                                      <button 
                                        onClick={() => {
                                          setShortsWatchTime(prev => {
                                            const next = Math.min(900, prev + 15);
                                            localStorage.setItem("daily_shorts_watch_seconds", String(next));
                                            return next;
                                          });
                                          triggerCelebration("Watched 15 seconds!");
                                        }}
                                        className="text-[7px] bg-emerald-500 hover:bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                                      >
                                        ⚡ Sim 15s Watch
                                      </button>
                                    </div>

                                    <div className="flex justify-between items-end">
                                      <div className="space-y-0.5 text-left min-w-0 flex-1">
                                        <p className="text-[8.5px] font-bold text-[#27D8FF]">@{activeSelectedVideo.author}</p>
                                        <h4 className="text-[10px] font-extrabold text-white truncate leading-normal">
                                          {language === 'hi' ? activeSelectedVideo.titleHi : activeSelectedVideo.titleEn}
                                        </h4>
                                      </div>

                                      {/* Speak title TTS */}
                                      <button 
                                        onClick={() => speakText(language === 'hi' ? activeSelectedVideo.titleHi : activeSelectedVideo.titleEn)}
                                        className="p-1 px-1.5 bg-amber-500 hover:bg-amber-600 rounded-lg text-white text-[8px] font-black flex items-center gap-0.5 cursor-pointer ml-2"
                                        title="Speak title aloud"
                                      >
                                        <Volume2 className="w-2.5 h-2.5" />
                                        <span>Spk</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-8 text-center bg-slate-900/30 rounded-xl border border-slate-800 text-slate-405 text-[10px]">
                                  No approved short clips available. Customize or select filter options.
                                </div>
                              )}

                              {/* Category Filter Horizontal Scroll */}
                              <div className="space-y-1">
                                <span className="text-[7.5px] uppercase tracking-wider text-slate-500 font-bold block">
                                  Wellness Categories
                                </span>
                                <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                                  {['All', 'Motivation', 'Study Tips', 'Exam Confidence', 'Career Awareness', 'Health & Focus', 'Inspirational Student Stories', 'Quick Life Skills', 'Positive Mindset'].map(cat => (
                                    <button
                                      key={cat}
                                      onClick={() => setShortsCategoryFilter(cat)}
                                      className={`text-[8px] font-extrabold uppercase px-2 py-0.8 rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                                        shortsCategoryFilter === cat
                                          ? 'bg-[#0038FF] border-[#0038FF] text-white'
                                          : 'bg-slate-900 border-slate-800 text-slate-400'
                                      }`}
                                    >
                                      {cat}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Playlist */}
                              <div className="space-y-1.5 text-left">
                                <span className="text-[7.5px] uppercase tracking-wider text-slate-500 font-bold block">
                                  Approved Positive Clips ({mindfulShorts.filter(v => v.approved && (shortsCategoryFilter === 'All' || v.category === shortsCategoryFilter)).length})
                                </span>
                                <div className="space-y-1 max-h-[140px] overflow-y-auto no-scrollbar">
                                  {mindfulShorts
                                    .filter(v => v.approved && (shortsCategoryFilter === 'All' || v.category === shortsCategoryFilter))
                                    .map(video => (
                                      <div 
                                        key={video.id}
                                        onClick={() => {
                                          setActiveShortVideo(video);
                                          triggerCelebration(language === 'hi' ? "वीडियो बदला गया" : "Playing video");
                                        }}
                                        className={`p-1.5 rounded-lg flex gap-2 items-center border transition-all cursor-pointer ${
                                          activeSelectedVideo?.id === video.id
                                            ? 'bg-indigo-950/40 border-indigo-500/30 text-white font-black'
                                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                                        }`}
                                      >
                                        <img 
                                          className="w-10 h-6.5 object-cover rounded shrink-0 border border-slate-800" 
                                          src={video.videoUrl} 
                                          alt=""
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="min-w-0 flex-1 text-left">
                                          <h5 className="text-[9px] font-black truncate text-white leading-tight">
                                            {language === 'hi' ? video.titleHi : video.titleEn}
                                          </h5>
                                          <p className="text-[7.5px] text-slate-500 font-medium">by @{video.author} • {video.category}</p>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>

                              {/* Admin trigger button inside mobile tab */}
                              <div className="pt-2 border-t border-slate-850 flex justify-between items-center">
                                <button
                                  onClick={() => setViewingAdminShorts(!viewingAdminShorts)}
                                  className="text-[8px] font-black text-indigo-400 hover:underline uppercase cursor-pointer"
                                >
                                  ⚙️ {viewingAdminShorts ? "Close Console" : "Teacher Console"}
                                </button>
                                <span className="text-[7.5px] font-mono text-slate-500">
                                  Limit: 15m/day
                                </span>
                              </div>

                              {/* Student Propose / Teacher Add section inside mobile tab */}
                              {viewingAdminShorts && (
                                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-[9px] text-indigo-300">
                                  <p className="text-[8px] text-slate-400">Admins or teachers can submit pre-approved wellness videos here.</p>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <input 
                                      type="text" 
                                      placeholder="Title (En)" 
                                      value={adminTitleEn} 
                                      onChange={(e) => setAdminTitleEn(e.target.value)} 
                                      className="bg-slate-900 border border-slate-800 text-slate-100 p-1.5 rounded text-[8px] w-full"
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="Title (Hi)" 
                                      value={adminTitleHi} 
                                      onChange={(e) => setAdminTitleHi(e.target.value)} 
                                      className="bg-slate-900 border border-slate-800 text-slate-100 p-1.5 rounded text-[8px] w-full"
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="Author/Creator" 
                                      value={adminAuthor} 
                                      onChange={(e) => setAdminAuthor(e.target.value)} 
                                      className="bg-slate-900 border border-slate-800 text-slate-100 p-1.5 rounded text-[8px] col-span-2 w-full"
                                    />
                                  </div>
                                  <button
                                    onClick={async () => {
                                      if (!adminTitleEn || !adminTitleHi || !adminAuthor) return;
                                      try {
                                        const r = await fetch('/api/mindful-shorts/videos', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            titleEn: adminTitleEn,
                                            titleHi: adminTitleHi,
                                            author: adminAuthor,
                                            category: adminCategory,
                                            videoUrl: adminVideoUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
                                            approved: true
                                          })
                                        });
                                        if (r.ok) {
                                          setAdminTitleEn('');
                                          setAdminTitleHi('');
                                          setAdminAuthor('');
                                          triggerCelebration("Pre-approved wellness video added!");
                                          fetchMindfulShorts();
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    className="w-full bg-[#0038FF] text-white py-1.5 rounded-xl text-[8px] font-black uppercase cursor-pointer text-center"
                                  >
                                    Add Approved Short
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      );
                      })()}


                      {/* SUB-SCREEN 3: AI ACADEMIC CO-PILOT & AI DOUBT SOLVER CHAT WITH VOICE TUTOR */}
                      {currentTab === 'tutor' && (
                        <div id="subscreen-tutor" className="space-y-4 animate-fade-in text-left">
                          
                          {/* Online vs Offline hybrid mode header card banner */}
                          <div className={`p-4 rounded-3xl border ${isOfflineMode ? 'bg-[#E1ECFF]/70 border-blue-200' : 'bg-gradient-to-r from-blue-950 to-[#0A58FF] text-white border-blue-900'}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${isOfflineMode ? 'bg-[#0A58FF] text-white' : 'bg-[#20C5FF] text-blue-900'}`}>
                                  {isOfflineMode ? 'Local SD-Card Database Active' : 'Gemini Cloud Intelligence Access'}
                                </span>
                                <h3 className={`text-base font-black mt-2 ${isOfflineMode ? 'text-[#0A58FF]' : 'text-white'}`}>
                                  AI Academic Co-Pilot & Doubt Resolver
                                </h3>
                                <p className={`text-[10px] mt-0.5 ${isOfflineMode ? 'text-slate-600' : 'text-blue-105'}`}>
                                  Ask curriculum questions and get adaptive bilingual explanations instantly.
                                </p>
                              </div>
                              <Brain className="w-8 h-8 text-[#20C5FF] opacity-80" />
                            </div>

                            {/* Preset quick smart questions for student click */}
                            <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar">
                              {['Physics: Why is the sky blue?', 'Chemistry: Photosynthesis process', 'Algebra: Solving Quadratic equations'].map((p) => (
                                <button
                                  key={p}
                                  onClick={() => handleAskDoubt(p)}
                                  className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[9px] font-bold text-slate-800 bg-white shadow-xs whitespace-nowrap"
                                >
                                  "{p}"
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dynamic active chat dialog state logs list */}
                          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                            {doubtList.map((item) => (
                              <div key={item.id} className="space-y-2">
                                {/* Query bubble */}
                                <div className="flex justify-end">
                                  <div className="bg-[#0038FF] text-white px-3.5 py-2.5 rounded-2xl rounded-tr-xs text-xs max-w-[85%] font-medium">
                                    {item.question}
                                  </div>
                                </div>

                                {/* Answer bubble */}
                                <div className="flex justify-start items-start gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0038FF] to-[#27D8FF] text-white flex items-center justify-center font-bold text-[8px] shrink-0 mt-1">
                                    AI
                                  </div>
                                  <div className="bg-white border border-slate-200/90 text-slate-800 p-3.5 rounded-2xl rounded-tl-xs text-xs max-w-[85%] shadow-2xs">
                                    {item.answer ? (
                                      <div>
                                        <p className="leading-relaxed font-medium">{item.answer}</p>
                                        
                                        {/* Actionable buttons */}
                                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex gap-2">
                                          <button 
                                            onClick={() => speakText(item.answer || '')}
                                            className="text-[9px] text-[#005BFF] font-black hover:underline flex items-center gap-1"
                                          >
                                            🔊 Speak Answer
                                          </button>
                                          <button 
                                            onClick={() => {
                                              // fetch extremely simplified version of text
                                              handleAskDoubt(`In much simpler language for kids: ${item.question}`);
                                            }}
                                            className="text-[9px] text-emerald-600 font-extrabold hover:underline"
                                          >
                                            🌱 Simplify Explanation
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-slate-400 italic">Asking ABHI Mini AI... (Simulated key checkout)</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Voice Recording Simulator Area */}
                          {voiceRecording && (
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-center shadow-xs">
                              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block animate-ping mr-2"></span>
                              <span className="text-xs font-black text-rose-600">BILINGUAL VOICE RECORDING: 0:{voiceSeconds < 10 ? '0' + voiceSeconds : voiceSeconds}</span>
                              <div className="flex justify-center gap-1 my-2">
                                {[1, 2, 3, 4, 3, 2, 1, 3, 5, 2, 1].map((h, i) => (
                                  <span key={i} className="w-1 bg-[#0038FF] rounded-full animated-waves" style={{ height: `${h * 4}px` }}></span>
                                ))}
                              </div>
                              <button 
                                onClick={() => {
                                  setVoiceRecording(false);
                                  handleAskDoubt(language === 'hi' ? "मुझे प्रकाश संश्लेषण पौधों के बारे में बहुत सरल रूप से बताएं।" : "Tell me photosynthesis class standard levels bilingually.");
                                }}
                                className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg hover:bg-rose-700 mt-1"
                              >
                                Stop & Ask Doubt
                              </button>
                            </div>
                          )}

                          {/* Dynamic chat entry forms */}
                          <div className="flex gap-2">
                            <button
                              id="voice-recording-btn"
                              onClick={() => {
                                setVoiceRecording(!voiceRecording);
                                setVoiceSeconds(0);
                                if (!voiceRecording) {
                                  triggerCelebration(language === 'hi' ? "🎙️ बोलना शुरू करें..." : "🎙️ Speak clearly in English/Hindi...");
                                }
                              }}
                              className={`p-3 rounded-2xl flex items-center justify-center transition-all ${voiceRecording ? 'bg-rose-200 text-rose-700 border border-rose-300 animate-pulse' : 'bg-blue-50 text-[#0038FF] hover:bg-blue-100 border border-blue-200'}`}
                              title="Voice Tutor Search"
                            >
                              {voiceRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>

                            <input 
                              id="doubt-input"
                              type="text" 
                              placeholder={language === 'hi' ? 'गणित, क्लोरोफिल या सवाल पूछें...' : 'Ask how something works / type equation...'}
                              value={doubtText}
                              onChange={(e) => setDoubtText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleAskDoubt(); }}
                              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:outline-[#005BFF] focus:outline-offset-1 select-text"
                            />

                            <button 
                              id="doubt-submit-btn"
                              onClick={() => handleAskDoubt()}
                              className="bg-[#0038FF] hover:bg-[#002CBD] text-white p-3 rounded-2xl shadow-md transition-all active:scale-95"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      )}


                      {/* SUB-SCREEN 4: COLLABORATIVE SOCIAL HUBS PORTAL (Teacher tools, Parent tracker, scholarships, paths) */}
                      {currentTab === 'hubs' && (
                        <div id="subscreen-hubs" className="space-y-4 animate-fade-in text-left">
                          
                           {/* Grid selection header tabs */}
                           <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
                             {[
                               { key: 'parent', labelEn: 'Parent Tracker', labelHi: 'अभिभावक' },
                               { key: 'teacher', labelEn: 'Teacher Hub', labelHi: 'शिक्षक' },
                               { key: 'career', labelEn: 'Career Guidance', labelHi: 'करियर मार्ग' },
                               { key: 'scholarship', labelEn: 'Scholarships', labelHi: 'छात्रवृत्ति' }
                             ].map((ht) => (
                               <button
                                 key={ht.key}
                                 onClick={() => setActiveSubTab(ht.key as any)}
                                 className={`py-2 px-0.5 text-[8.5px] font-extrabold uppercase text-center rounded-lg transition-all ${
                                   activeSubTab === ht.key ? 'bg-[#0A58FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                                 }`}
                               >
                                 {language === 'hi' ? ht.labelHi : ht.labelEn}
                               </button>
                             ))}
                           </div>

                          {/* HUB PANEL A: PARENT ASSIST TRACKER */}
                          {activeSubTab === 'parent' && (
                            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                              <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-1">
                                <UserCheck className="w-4 h-4" />
                                <span>Parent Progress Tracker Portal</span>
                              </h4>
                              <p className="text-[10px] text-slate-500">
                                View daily attendance logs, study accomplishments, and get simulated Weekly reports instantly.
                              </p>

                              {/* Progress parameters overview */}
                              <div className="grid grid-cols-2 gap-2 pt-2">
                                <div className="bg-[#F8FBFF] p-2.5 rounded-xl border border-slate-100">
                                  <span className="text-[8px] text-slate-400 font-extrabold uppercase block">Smart Attendance</span>
                                  <span className="text-sm font-black text-[#0038FF]">98.2% Checked</span>
                                </div>
                                <div className="bg-[#F8FBFF] p-2.5 rounded-xl border border-slate-100">
                                  <span className="text-[8px] text-slate-400 font-extrabold uppercase block">Study Streak</span>
                                  <span className="text-sm font-black text-orange-600">{student.streak} Days Live</span>
                                </div>
                              </div>

                              {/* Generate automated parents advice bilingually */}
                              <button 
                                id="generate-parent-report-btn"
                                onClick={generateParentReport}
                                disabled={isGeneratingParentReport}
                                className="w-full bg-[#005BFF] hover:bg-[#0038FF] text-white text-[10px] py-2.5 rounded-xl font-black transition-all"
                              >
                                {isGeneratingParentReport ? 'Analyzing Study Logs...' : 'GENERATE AI REPORT CARD (SMS Format)'}
                              </button>

                              {parentReportText && (
                                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-xs text-slate-700 leading-normal">
                                  <p className="font-semibold text-[10px] text-[#0038FF] uppercase tracking-wider mb-1">Generated Report Response:</p>
                                  <p className="italic">"{parentReportText}"</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* HUB PANEL B: TEACHER PATHWAY MODULER */}
                          {activeSubTab === 'teacher' && (
                            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                              <h4 className="text-xs font-black text-[#0038FF] uppercase tracking-widest flex items-center gap-1">
                                <Sparkles className="w-4 h-4" />
                                <span>Classroom Teacher Portal</span>
                              </h4>
                              <p className="text-[10px] text-slate-500">
                                Upload customized board homework exercises or review weak students metrics dynamically.
                              </p>

                              {/* Simple homework list upload simulation */}
                              <div className="space-y-2">
                                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Class assignments active:</span>
                                {assignments.map(asg => (
                                  <div key={asg.id} className="bg-slate-50 p-2.5 rounded-xl text-xs flex justify-between items-center">
                                    <div>
                                      <p className="font-extrabold text-slate-800">{language === 'hi' ? asg.titleHi : asg.titleEn}</p>
                                      <p className="text-[9px] text-slate-500">{asg.classGrade} • Due {asg.dueDate}</p>
                                    </div>
                                    <span className="text-[9px] bg-[#0038FF]/10 text-[#005BFF] px-2 py-0.5 rounded font-black">{asg.submissions} Submissions</span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-2 border-t border-slate-100 space-y-2">
                                <span className="text-[9px] font-extrabold text-slate-500 block uppercase">Issue New Homework:</span>
                                <input 
                                  type="text" 
                                  placeholder="Assignment Title (e.g., UP board physics test)..." 
                                  value={newAssignmentTitle}
                                  onChange={e => setNewAssignmentTitle(e.target.value)}
                                  className="w-full bg-[#F8FBFF] border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                                />
                                <button
                                  onClick={addNewAssignment}
                                  className="w-full bg-slate-900 text-white text-[10px] py-2 rounded-xl font-bold"
                                >
                                  Publish on Bulletins
                                </button>
                              </div>
                            </div>
                          )}

                          {/* HUB PANEL C: CAREER MILITARY & GOVT SERVICES ROADMAPS */}
                          {activeSubTab === 'career' && (
                            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                <span>NDA entrance & UPSC Civil Careers</span>
                              </h4>
                              
                              <div className="space-y-2.5">
                                {CAREER_PATHS.map((cp) => (
                                  <div key={cp.id} className="p-3 bg-[#F8FBFF] rounded-xl border border-slate-100">
                                    <span className="text-[8px] bg-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded uppercase block w-fit mb-1">
                                      Class {cp.classesFilter} Goal
                                    </span>
                                    <h5 className="text-xs font-bold text-slate-800">{language === 'hi' ? cp.titleHi : cp.titleEn}</h5>
                                    <p className="text-[9px] text-slate-500 mt-1">{language === 'hi' ? cp.descHi : cp.descEn}</p>
                                    <p className="text-[8px] mt-1 text-slate-700 font-medium">💰 Average Pay: {cp.salaryEn}</p>
                                    
                                    {/* Progression stepper */}
                                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 pl-1">
                                      <p className="text-[8px] text-indigo-600 font-black uppercase">Preparation Pathway:</p>
                                      {(language === 'hi' ? cp.stepsHi : cp.stepsEn).map((st, i) => (
                                        <p key={i} className="text-[9px] text-slate-600">
                                          {i + 1}. {st}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* HUB PANEL D: STATE INCENTIVES & WELFARE ANNOUNCEMENT */}
                          {activeSubTab === 'scholarship' && (
                            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                              <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>National Scholarships & Incentives</span>
                              </h4>
                              <p className="text-[10px] text-slate-500">
                                Valid Government schemes to help underfunded rural girls and boys continue Class 10-12 schooling.
                              </p>

                              <div className="space-y-2">
                                {SCHOLARSHIPS.map((sch) => (
                                  <div key={sch.id} className="p-2.5 bg-[#F8FBFF] rounded-xl border border-slate-150">
                                    <h5 className="text-xs font-extrabold text-slate-800">{language === 'hi' ? sch.titleHi : sch.titleEn}</h5>
                                    <p className="text-[9px] text-amber-700 font-bold mt-1">₹ Amount Support: {language === 'hi' ? sch.amountHi : sch.amountEn}</p>
                                    <p className="text-[9px] text-slate-500">Eligibility: {language === 'hi' ? sch.eligibilityHi : sch.eligibilityEn}</p>
                                    <span className="text-[8px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 block w-fit mt-1.5">Apply before: {sch.deadline}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      )}


                      {/* SUB-SCREEN 5: STUDENT PROFILE & EKLAVYA REWARD STORE Custom cosmetics */}
                      {currentTab === 'profile' && (
                        <div id="subscreen-profile" className="space-y-4 animate-fade-in text-left">
                          
                          {/* Profile card metadata details view */}
                          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs text-center flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-tr from-[#0038FF] to-cyan-400 p-1 relative ${unlockedItems.includes('str-frame-gold') ? 'ring-4 ring-amber-400 scale-105' : ''}`}>
                              <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-xl text-[#0038FF]">
                                {student.name.charAt(0)}
                              </div>
                            </div>

                            <h4 className="text-sm font-black text-slate-900 mt-3">{student.name}</h4>
                            <p className="text-[10px] bg-blue-105 px-2.5 py-0.5 rounded-full text-[#0038FF] bg-blue-50 font-bold uppercase tracking-wider mt-1">
                              {unlockedItems.includes('str-title-eklavya') ? 'Super Scholar ★' : student.rankName}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-3 border-t border-slate-100">
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Scholarly Credits</span>
                                <span className="text-base font-extrabold text-[#0038FF]">{student.coins} Pts</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Class Level</span>
                                <span className="text-base font-extrabold text-slate-800">{student.grade}</span>
                              </div>
                            </div>
                          </div>

                          {/* Achievements Badges unlocked section (Eklavya badges) */}
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                              Unlocked State Honor Badges ({student.badges.length})
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {BADGES.map((b) => {
                                const isUnlocked = student.badges.some(u => u.id === b.id);
                                return (
                                  <div 
                                    key={b.id} 
                                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                                      isUnlocked 
                                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                                        : 'bg-slate-100 border-slate-200 text-slate-400'
                                    }`}
                                  >
                                    <div className={`p-1.5 rounded-lg text-xs ${isUnlocked ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                      ★
                                    </div>
                                    <div className="text-left">
                                      <p className="text-[10px] font-black leading-tight">
                                        {language === 'hi' ? b.titleHi : b.titleEn}
                                      </p>
                                      <p className="text-[8px] text-slate-400 leading-tight">
                                        {language === 'hi' ? b.descHi : b.descEn}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Eklavya store - customizable titles and item rewards */}
                          <div className="bg-[#FFFCEB] border border-amber-200 p-4 rounded-2xl">
                            <span className="text-[9px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                              Academic Honors Redemptions
                            </span>
                            <p className="text-[10px] text-slate-600 mt-1.5">Exchange academic milestone credits for certification badges and advanced custom titles.</p>

                            <div className="space-y-2 mt-3">
                              {STORE_ITEMS.map((item) => {
                                const isOwned = unlockedItems.includes(item.id);
                                return (
                                  <div key={item.id} className="bg-white p-2.5 rounded-xl flex items-center justify-between border border-amber-100 text-xs">
                                    <div>
                                      <p className="font-extrabold text-[#0C1A30]">{language === 'hi' ? item.nameHi : item.nameEn}</p>
                                      <span className="text-[9px] text-amber-600 font-bold">{item.price} Credits</span>
                                    </div>
                                    <button
                                      onClick={() => purchaseStoreItem(item)}
                                      disabled={isOwned}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                                        isOwned 
                                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                                      }`}
                                    >
                                      {isOwned ? 'OWNED' : 'REDEEM'}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      )}

                    </div>

                    {/* STYLED SCREEN NAVIGATION BAR AT BOTH MOBILE BOTTOM PORTION */}
                    <div className="absolute bottom-0 inset-x-0 bg-white/95 dark:bg-[#070B16]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 py-2.5 px-3 z-10 flex justify-between items-center text-center shadow-lg">
                      
                      <button 
                        id="nav-dash"
                        onClick={() => setCurrentTab('dashboard')} 
                        className={`flex flex-col items-center gap-1 w-12 transition-all cursor-pointer ${currentTab === 'dashboard' ? 'text-[#0038FF] dark:text-[#27D8FF] scale-105 font-extrabold' : 'text-slate-450 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                      >
                        <Home className="w-4 h-4" />
                        <span className="text-[8px] font-bold">Learn</span>
                      </button>

                      <button 
                        id="nav-video"
                        onClick={() => setCurrentTab('tiktok')} 
                        className={`flex flex-col items-center gap-1 w-12 transition-all relative cursor-pointer ${currentTab === 'tiktok' ? 'text-[#0038FF] dark:text-[#27D8FF] scale-105 font-extrabold' : 'text-slate-450 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                      >
                        <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[8px] font-bold">Shorts 🧘</span>
                        {/* active notification ping */}
                        <span className="absolute top-0 right-3 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      </button>

                      {/* Giant Central Floating Doubt button */}
                      <button 
                        id="nav-tutor"
                        onClick={() => setCurrentTab('tutor')} 
                        className="w-12 h-12 -mt-6 bg-gradient-to-tr from-[#0038FF] to-[#005BFF] hover:from-[#005BFF] hover:to-[#27D8FF] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-[#0C1224] transition-all transform active:scale-95 cursor-pointer"
                      >
                        <Brain className="w-5 h-5 animate-pulse" />
                      </button>

                      <button 
                        id="nav-hubs"
                        onClick={() => {
                          setCurrentTab('hubs');
                          setActiveSubTab('parent');
                        }} 
                        className={`flex flex-col items-center gap-1 w-12 transition-all cursor-pointer ${currentTab === 'hubs' ? 'text-[#0038FF] dark:text-[#27D8FF] scale-105 font-extrabold' : 'text-slate-450 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                      >
                        <Compass className="w-4 h-4" />
                        <span className="text-[8px] font-bold">Hubs</span>
                      </button>

                      <button 
                        id="nav-profile"
                        onClick={() => setCurrentTab('profile')} 
                        className={`flex flex-col items-center gap-1 w-12 transition-all cursor-pointer ${currentTab === 'profile' ? 'text-[#0038FF] dark:text-[#27D8FF] scale-105 font-extrabold' : 'text-slate-450 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-[8px] font-bold">Profile</span>
                      </button>

                    </div>

                    </div>
                  </>
                )}

              </div>

            </div>

          {/* COLUMN 2: PRIMARY LANDSCAPE WORKSPACE (Provides real-time interactive dashboards & full content detail layout) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* ACTIVE TEXTBOOK VIEW & DIRECT DIALOGS / LIVE ASSESSMENT MODULE */}
            {selectedSubject && selectedChapter ? (
              <div id="subject-detail-panel" className="bg-white p-6 rounded-3xl border border-blue-100 shadow-md text-left transition-all">
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-[#005BFF]/10 text-[#0038FF] font-black uppercase px-2.5 py-1 rounded">
                      {language === 'hi' ? selectedSubject.nameHi : selectedSubject.nameEn}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      {language === 'hi' ? selectedChapter.titleHi : selectedChapter.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'hi' ? selectedChapter.summaryHi : selectedChapter.summaryEn}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedSubject(null);
                      setSelectedChapter(null);
                    }}
                    className="p-1.5 hover:bg-slate-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Topics scroll panel */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Left topic links */}
                  <div className="md:col-span-4 space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block">Chapter Topics:</span>
                    {selectedChapter.topics.map((tp, idx) => (
                      <button
                        key={tp.id}
                        onClick={() => setActiveTopicIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeTopicIndex === idx 
                            ? 'bg-blue-50 text-[#0038FF] border-l-4 border-l-[#0038FF]' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}. {language === 'hi' ? tp.titleHi : tp.titleEn}
                      </button>
                    ))}
                  </div>

                  {/* Right dynamic content view */}
                  <div className="md:col-span-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-black">
                        Topic Explained
                      </span>
                      {/* Audio playback button */}
                      <button 
                        onClick={() => speakText(language === 'hi' ? selectedChapter!.topics[activeTopicIndex].contentHi : selectedChapter!.topics[activeTopicIndex].contentEn)}
                        className="bg-[#005BFF] hover:bg-[#0038FF] text-white p-1.5 rounded-full"
                        title="TTS text"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 mb-2">
                      {language === 'hi' ? selectedChapter.topics[activeTopicIndex].titleHi : selectedChapter.topics[activeTopicIndex].titleEn}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {language === 'hi' ? selectedChapter.topics[activeTopicIndex].contentHi : selectedChapter.topics[activeTopicIndex].contentEn}
                    </p>

                    {/* REAL-LIFE LEARNING MODE: Hands-on activity box as requested by user */}
                    <div className="mt-4 p-3 bg-gradient-to-tr from-[#FFFCEB] to-amber-50 rounded-xl border border-amber-200">
                      <h5 className="text-[10px] font-black text-amber-700 uppercase flex items-center gap-1">
                        🌱 {language === 'hi' ? 'दैनिक जीवन में वास्तविक प्रयोग (DIY)' : 'Real-Life Discovery Corner'}
                      </h5>
                      <p className="text-xs text-slate-800 mt-1 leading-normal italic">
                        "{language === 'hi' ? selectedChapter.topics[activeTopicIndex].diyActivityHi : selectedChapter.topics[activeTopicIndex].diyActivityEn}"
                      </p>
                    </div>

                    {/* Instant AI-generated Active quiz assessment triggers */}
                    <div className="mt-4 flex gap-2">
                      <button
                        id="topic-quiz-generator"
                        onClick={() => generateQuizForTopic(selectedChapter!.topics[activeTopicIndex].titleEn, selectedChapter!.topics[activeTopicIndex].titleHi)}
                        className="w-full bg-gradient-to-r from-[#0038FF] to-[#27D8FF] text-white text-xs py-3 px-4 rounded-xl font-black shadow-md hover:shadow-[#005BFF]/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Brain className="w-4 h-4" />
                        <span>{language === 'hi' ? 'इस विषय का लाइव टेस्ट शुरू करें' : 'Generate Interactive AI Quiz'}</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <div className="space-y-6">
                
                {/* WIDGET DISPATCHER FOR ALL TABS (Widespread grid layouts) */}
                {currentTab === 'dashboard' && (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-tr from-[#0038FF] to-[#005BFF] p-6 lg:p-8 rounded-3xl text-white relative overflow-hidden shadow-lg">
                      <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/10 rounded-full -mr-8 -mb-8 blur-2xl"></div>
                      
                      <h3 className="text-xl lg:text-2xl font-black tracking-tight flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-[#27D8FF]" />
                        <span>{language === 'hi' ? 'राजकीय राज्य बोर्ड शैक्षिक पोर्टल' : 'State Board Interactive Workspace'}</span>
                      </h3>
                      <p className="text-xs text-slate-100 max-w-2xl mt-1.5 leading-relaxed">
                        {language === 'hi' 
                          ? 'इंटरैक्टिव राज्य दिशानिर्देश, अनुकूलन योग्य परीक्षण, द्विभाषी संदेह-निवारण और वास्तविक समय होमवर्क ग्रेडिंग। विषय या पुस्तक इकाइयों का चयन करें।' 
                          : 'Interactive, low-bandwidth concepts, customized test generators, and physical homework uploads for village students. Explore syllabus modules below!'}
                      </p>
                    </div>

                    {/* Class Selection & Grade Segmenter Grid (3 columns on desktop) */}
                    <div className="bg-white dark:bg-[#0C1224] p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-[#0038FF] dark:text-[#27D8FF] font-black">
                            {language === 'hi' ? 'अपनी कक्षा चुनें' : 'Select Academic Grade & Board'}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Syllabus aligns perfectly with state education boards (Class 1 - 12)</p>
                        </div>
                        
                        {/* Selector Theme dropdown */}
                        <select 
                          value={classSelectorDesign}
                          onChange={(e) => setClassSelectorDesign(e.target.value as any)}
                          className="text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-lg text-slate-600 dark:text-slate-200 font-extrabold focus:outline-hidden"
                        >
                          <option value="stages-glow">Stages Tracker</option>
                          <option value="friendly-cards">Compact Badges</option>
                        </select>
                      </div>

                      {/* Grade Selector Row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {CLASSES_METADATA.map((c) => (
                          <button
                            key={c.num}
                            onClick={() => {
                              setSelectedClassNum(c.num);
                              setDashboardView('subjects');
                            }}
                            className={`p-3 rounded-2xl border text-center transition-all ${
                              selectedClassNum === c.num
                                ? 'bg-[#0038FF] text-white border-[#0038FF] shadow-xs scale-[1.02]'
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-855 dark:text-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span className="text-[9px] uppercase font-black text-slate-400 block">{c.stage}</span>
                            <span className="text-sm font-black block mt-0.5">{language === 'hi' ? `कक्षा ${c.num}` : `Class ${c.num}`}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subjects Grid (Syllabus Course Content) */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">
                        {language === 'hi' ? 'उपलब्ध विषय और अध्याय' : 'Available Board Syllabus Subjects'}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(() => {
                          const classObj = CLASSES_DATA[selectedClassNum] || CLASSES_DATA[9];
                          const subjectsForClass = classObj.subjects?.length > 0 ? classObj.subjects : (classObj.streams ? [
                            ...(classObj.streams['Science'] || []),
                            ...(classObj.streams['Commerce'] || []),
                            ...(classObj.streams['Arts/Humanities'] || [])
                          ] : SUBJECTS);
                          return subjectsForClass;
                        })().map((s) => (
                          <div 
                            key={s.id} 
                            className="bg-white dark:bg-[#0C1224] p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-xs transition-all"
                          >
                            <div>
                              <div className="flex justify-between items-center bg-transparent">
                                <span className="text-[9px] bg-blue-50 dark:bg-blue-950/40 text-[#0038FF] dark:text-[#27D8FF] px-2 py-0.5 rounded font-black">
                                  Syllabus Map
                                </span>
                                <span className="text-amber-500 text-[10px] font-bold flex items-center gap-0.5">★ {s.chaptersCount} chapters</span>
                              </div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white mt-2">
                                {language === 'hi' ? s.nameHi : s.nameEn}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Free low-data textbooks synced with Bihar, MP & UP Board questions.</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-900">
                              <span className="text-[9px] text-slate-400 block font-bold mb-1.5 uppercase">Select Chapter:</span>
                              <div className="space-y-1">
                                {CHAPTERS.filter(ch => ch.subjectId === s.id).map((ch) => (
                                  <button
                                    key={ch.id}
                                    onClick={() => {
                                      setSelectedSubject(s);
                                      setSelectedChapter(ch);
                                      setActiveTopicIndex(0);
                                      triggerCelebration(`Loaded chapter ${ch.titleEn}`);
                                    }}
                                    className="w-full text-left p-1.5 rounded-lg bg-slate-55 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-[10.5px] font-black text-[#0038FF] dark:text-[#27D8FF] flex justify-between items-center cursor-pointer"
                                  >
                                    <span className="truncate max-w-[170px]">{language === 'hi' ? ch.titleHi : ch.titleEn}</span>
                                    <span className="text-[8px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-355 px-1 py-0.2 rounded font-mono">Free</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === 'tiktok' && (() => {
                  const activeSelectedVideo = activeShortVideo || (mindfulShorts.length > 0 ? mindfulShorts[0] : null);
                  return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left animate-fade-in font-sans">
                    
                    {studyTime < 7200 ? (
                      // Locked Widescreen view
                      <div className="lg:col-span-12 bg-white dark:bg-[#0C1224] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
                        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 rounded-full flex items-center justify-center mx-auto">
                          <Lock className="w-10 h-10" />
                        </div>
                        <div className="space-y-2 max-w-lg mx-auto">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                            {language === 'hi' ? 'शॉर्ट्स ब्रेक लॉक है 🔒' : 'Mindful Wellness Break Locked 🔒'}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {language === 'hi' 
                              ? '15 मिनट के माइंडफुल ब्रेक को अनलॉक करने के लिए कम से कम 2 घंटे सक्रिय होकर अध्ययन करें।' 
                              : 'Study for 2 hours to unlock your 15-minute mindful break. Controlled study habits ensure success and prevent screen addiction.'}
                          </p>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full max-w-md mx-auto space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                            <span>{formatStudyProgressString(studyTime)} / 2 Hr study goal</span>
                            <span>{Math.min(100, Math.floor((studyTime / 7200) * 100))}% completed</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#0038FF] transition-all duration-500" 
                              style={{ width: `${Math.min(100, (studyTime / 7200) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              setCurrentTab('dashboard');
                              triggerCelebration(language === 'hi' ? "चलो अध्याय शुरू करें!" : "Let's read class books!");
                            }}
                            className="bg-[#0038FF] hover:bg-blue-700 text-white text-xs font-black px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
                          >
                            {language === 'hi' ? 'पाठ्यक्रम का अध्ययन करें 📖' : 'Read Chapters 📖'}
                          </button>

                          <button
                            onClick={() => {
                              setStudyTime(prev => {
                                const next = prev + 3600;
                                localStorage.setItem("daily_study_seconds", String(next));
                                return next;
                              });
                              triggerCelebration("Added 1 hour study progress!");
                            }}
                            className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 cursor-pointer"
                          >
                            Accelerate Study (+1h Dev)
                          </button>
                        </div>
                      </div>
                    ) : shortsWatchTime >= 900 ? (
                      // Break over widescreen view
                      <div className="lg:col-span-12 bg-white dark:bg-[#0C1224] p-10 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-full flex items-center justify-center mx-auto">
                          <Flame className="w-10 h-10 text-orange-500 fill-orange-450/20" />
                        </div>
                        <div className="space-y-2 max-w-md mx-auto">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white">
                            {language === 'hi' ? 'दैनिक माइंडफुल ब्रेक पूरा हुआ!' : 'Daily Mindful Break Finished!'}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            “{language === 'hi' 
                              ? 'आपका माइंडफुल ब्रेक पूरा हो गया है। चलो हमारी पढ़ाई जारी रखते हैं।' 
                              : 'Your mindful break is complete. Let’s continue learning and earning rewards.'}”
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setCurrentTab('dashboard');
                            triggerCelebration(language === 'hi' ? "चलो पाठ्यक्रम का अध्ययन जारी रखें!" : "Let's study concepts!");
                          }}
                          className="bg-[#0038FF] hover:bg-blue-700 text-white text-xs font-black px-8 py-3 rounded-xl uppercase tracking-widest cursor-pointer"
                        >
                          {language === 'hi' ? 'अध्ययन पर वापस जाएं 🚀' : 'Go back to study syllabus 🚀'}
                        </button>
                      </div>
                    ) : (
                      // Active watching widescreen view
                      <>
                        {/* Cinematic player (Left column) */}
                        <div className="lg:col-span-8 space-y-4">
                          {activeSelectedVideo ? (
                            <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative flex flex-col justify-end p-5 text-white group border border-slate-850">
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 flex flex-col justify-between p-5 z-10 pointer-events-none">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] bg-[#0038FF] px-2.5 py-0.8 rounded uppercase tracking-widest font-black">
                                    {activeSelectedVideo.category}
                                  </span>
                                  <span className="text-[9px] font-mono text-emerald-400 bg-black/40 px-2 py-0.5 rounded">
                                    ⚡ Approved Playback
                                  </span>
                                </div>
                                
                                <div className="text-center space-y-1 mb-20 md:mb-0">
                                  <p className="text-sm md:text-base font-bold text-yellow-300 drop-shadow-md">
                                    {activeSelectedVideo.titleHi}
                                  </p>
                                  <p className="text-xs md:text-sm text-slate-100 leading-normal drop-shadow-sm font-medium">
                                    {activeSelectedVideo.titleEn}
                                  </p>
                                </div>
                              </div>

                              {/* Video controls placeholder */}
                              <div className="w-full z-15 flex items-center justify-between pointer-events-auto bg-black/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={() => {
                                      setShortsWatchTime(prev => {
                                        const next = Math.min(900, prev + 30);
                                        localStorage.setItem("daily_shorts_watch_seconds", String(next));
                                        return next;
                                      });
                                      triggerCelebration("Watched 30 seconds!");
                                    }}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] px-3 py-1.5 rounded-lg hover:scale-105 active:scale-95 font-bold transition-all cursor-pointer"
                                  >
                                    ⏱️ Watch 30s
                                  </button>
                                  <div>
                                    <span className="text-[11px] font-black block leading-none">{activeSelectedVideo.titleEn}</span>
                                    <span className="text-[9px] text-[#27D8FF] font-medium block mt-1 font-sans">Creator: @{activeSelectedVideo.author}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => speakText(language === 'hi' ? activeSelectedVideo.titleHi : activeSelectedVideo.titleEn)}
                                    className="bg-[#0038FF] hover:bg-[#27D8FF] p-2 rounded-full cursor-pointer text-white"
                                    title="Speak Title Outloud"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                            </div>
                          ) : (
                            <div className="bg-slate-900 rounded-3xl aspect-video flex flex-col justify-center items-center text-slate-400 p-8 text-center">
                              <p className="text-sm">Choose approved wellness shorts breakouts on the right menu.</p>
                            </div>
                          )}

                          {/* Horizontal category chooser */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-black text-[#0038FF] tracking-wider block">Filter Wellness Clips</span>
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                              {['All', 'Motivation', 'Study Tips', 'Exam Confidence', 'Career Awareness', 'Health & Focus', 'Inspirational Student Stories', 'Quick Life Skills', 'Positive Mindset'].map(cat => (
                                <button
                                  key={cat}
                                  onClick={() => setShortsCategoryFilter(cat)}
                                  className={`text-[9px] font-extrabold uppercase px-3 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                                    shortsCategoryFilter === cat
                                      ? 'bg-[#0038FF] border-[#0038FF] text-white'
                                      : 'bg-white dark:bg-[#0C1224] border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400'
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Playlist items & submissions control (Right column) */}
                        <div className="lg:col-span-4 space-y-4">
                          {/* Active Playlist cards */}
                          <div className="bg-white dark:bg-[#0C1224] p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3 flex flex-col h-[280px]">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex justify-between items-center">
                              <div>
                                <h4 className="text-xs font-black uppercase text-[#0038FF]">Positive Break Playlist</h4>
                                <p className="text-[10px] text-slate-450 mt-0.5">Approved categories and wellness stories</p>
                              </div>
                              <span className="text-[10px] bg-[#27D8FF]/15 text-[#0038FF] font-mono px-2 py-0.5 rounded font-black">
                                {String(Math.floor((900 - shortsWatchTime) / 60)).padStart(2, '0')}:{String((900 - shortsWatchTime) % 60).padStart(2, '0')} Left
                              </span>
                            </div>

                            <div className="space-y-2 flex-grow overflow-y-auto no-scrollbar">
                              {mindfulShorts
                                .filter(v => v.approved && (shortsCategoryFilter === 'All' || v.category === shortsCategoryFilter))
                                .map(video => (
                                  <div 
                                    key={video.id}
                                    onClick={() => {
                                      setActiveShortVideo(video);
                                      triggerCelebration(language === 'hi' ? "वीडियो बदला गया" : "Playing video");
                                    }}
                                    className={`p-2 rounded-xl flex gap-3 items-center border transition-all cursor-pointer ${
                                      activeSelectedVideo?.id === video.id
                                        ? 'bg-blue-50 dark:bg-indigo-950/20 border-indigo-400/30'
                                        : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    <img 
                                      className="w-12 h-8.5 object-cover rounded shadow-xs" 
                                      src={video.videoUrl} 
                                      alt=""
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="min-w-0 flex-1 text-left">
                                      <h5 className="text-[10.5px] font-black truncate text-slate-800 dark:text-slate-100 leading-snug">
                                        {language === 'hi' ? video.titleHi : video.titleEn}
                                      </h5>
                                      <p className="text-[9px] text-slate-400 mt-0.5">by @{video.author} • <span className="text-indigo-500 font-extrabold">{video.category}</span></p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Approved teacher submitting portal */}
                          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-100 dark:border-slate-850 space-y-2.5">
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-1.5 text-left">
                              <h5 className="text-[10px] font-black uppercase text-indigo-500 flex items-center gap-1">
                                <span>🏫 Teacher Study Room Control</span>
                              </h5>
                              <p className="text-[8.5px] text-slate-450 mt-0.5">Authorize positive custom wellness links instantly</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <input 
                                type="text" 
                                placeholder="Title (English)" 
                                value={adminTitleEn} 
                                onChange={(e) => setAdminTitleEn(e.target.value)} 
                                className="bg-white dark:bg-[#0C1224] border border-slate-200 dark:border-[#0F172A] text-slate-800 dark:text-slate-100 p-2 rounded-xl text-[10px] focus:outline-hidden"
                              />
                              <input 
                                type="text" 
                                placeholder="शीर्षक (हिंदी)" 
                                value={adminTitleHi} 
                                onChange={(e) => setAdminTitleHi(e.target.value)} 
                                className="bg-white dark:bg-[#0C1224] border border-slate-200 dark:border-[#0F172A] text-slate-800 dark:text-slate-100 p-2 rounded-xl text-[10px] focus:outline-hidden"
                              />
                              <input 
                                type="text" 
                                placeholder="Source speaker / Author" 
                                value={adminAuthor} 
                                onChange={(e) => setAdminAuthor(e.target.value)} 
                                className="bg-white dark:bg-[#0C1224] border border-slate-200 dark:border-[#0F172A] text-slate-800 dark:text-slate-100 p-2 rounded-xl text-[10px] col-span-2 focus:outline-hidden"
                              />
                            </div>

                            <button
                              onClick={async () => {
                                if (!adminTitleEn || !adminTitleHi || !adminAuthor) return;
                                try {
                                  const r = await fetch('/api/mindful-shorts/videos', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      titleEn: adminTitleEn,
                                      titleHi: adminTitleHi,
                                      author: adminAuthor,
                                      category: adminCategory,
                                      videoUrl: adminVideoUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
                                      approved: true
                                    })
                                  });
                                  if (r.ok) {
                                    setAdminTitleEn('');
                                    setAdminTitleHi('');
                                    setAdminAuthor('');
                                    triggerCelebration("Pre-approved wellness video added!");
                                    fetchMindfulShorts();
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="w-full bg-[#005BFF] hover:bg-[#0038FF] text-white py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-xs cursor-pointer text-center"
                            >
                              Authorize & Post Wellness Short
                            </button>
                          </div>

                        </div>
                      </>
                    )}

                  </div>
                );
                })()}

                {currentTab === 'tutor' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left animate-fade-in">
                    
                    {/* Left Sidebar: Asked Doubt History lists */}
                    <div className="lg:col-span-3 bg-white dark:bg-[#0C1224] p-4.5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-slate-400 font-black">Asked doubts</h4>
                        <p className="text-[10px] text-slate-405 mt-0.5">Doubt history (Class Cache)</p>
                      </div>

                      <div className="space-y-1.5 h-[240px] overflow-y-auto no-scrollbar">
                        {doubtList.map((db, idx) => (
                          <button
                            key={db.id}
                            onClick={() => setDoubtText(db.question)}
                            className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[10.5px] text-slate-700 dark:text-slate-350 truncate hover:bg-slate-100 font-medium block cursor-pointer"
                          >
                            {idx + 1}. {db.question}
                          </button>
                        ))}
                      </div>
                      
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-[9px] text-slate-400 leading-normal border border-slate-100 dark:border-slate-800">
                        ⚡ SD-Card active mode bypasses high broadband fees, enabling village students to query syllabus chapters 100% offline.
                      </div>
                    </div>

                    {/* Center Chat Area */}
                    <div className="lg:col-span-6 bg-white dark:bg-[#0C1224] p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between" style={{ minHeight: '400px' }}>
                      <div className="space-y-4 flex-grow flex flex-col justify-between">
                        <div className="border-b border-slate-105 dark:border-slate-800 pb-2.5 flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-[#0038FF] dark:text-[#27D8FF] flex items-center gap-1">
                              <span>ABHIsampark AI Doubts solver</span>
                              <span className="text-[9px] bg-red-100 text-red-750 font-mono font-black rounded px-1 py-0.2">AI Active</span>
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Dual English/Hindi automatic state board translations</p>
                          </div>
                        </div>

                        {/* Speech controller simulation */}
                        <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden" style={{ minHeight: '150px' }}>
                          <span className="absolute top-2 left-2 text-[8px] bg-cyan-400 text-[#0038FF] uppercase font-black px-1.5 py-0.2 rounded font-mono">Voice Co-Pilot</span>
                          
                          {voiceRecording ? (
                            <>
                              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] animate-ping font-extrabold">
                                MIC
                              </div>
                              <span className="text-xs font-mono font-bold text-red-400">Microphone active... {voiceSeconds}s elapsed</span>
                              <button 
                                onClick={handleToggleVoiceDoubt}
                                className="px-5 py-1.5 bg-white text-[#0038FF] text-[10px] font-black rounded-lg hover:scale-105 transition-all text-center cursor-pointer"
                              >
                                STOP & SOLVE DOUBT
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 bg-[#005BFF] hover:bg-[#002CBD] rounded-full flex items-center justify-center text-sm cursor-pointer hover:scale-105 active:scale-95 transition-all" onClick={handleToggleVoiceDoubt}>
                                🎤
                              </div>
                              <span className="text-xs font-bold text-slate-200">Tap to Ask Doubt using Voice Speech</span>
                              <span className="text-[9px] text-slate-400">Auto-transcripts dialects into math & board equations formulas</span>
                            </>
                          )}
                        </div>

                        {/* Recent Doubt Solution Bubble */}
                        <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-105 dark:border-slate-850">
                          <span className="text-[9px] text-[#0038FF] dark:text-[#27D8FF] uppercase tracking-wider font-extrabold block">Latest Solution Solved:</span>
                          <p className="text-xs font-black text-slate-900 dark:text-white mt-1">"How a simple circuit resists current flow?"</p>
                          <p className="text-xs mt-1.5 leading-relaxed text-slate-700 dark:text-slate-350 italic">
                            {language === 'hi'
                              ? 'समाधान: विद्युत परिपथ में विद्युत धारा का गतिरोध प्रतिरोधक (R) द्वारा किया जाता है। ओम का नियम विद्युत धारा को परिभाषित करता है (V = IR)।'
                              : 'AI Tutor Explanation: Electricity flow in circuits travels through resistance. Resistors restrict charge carrier flow. Ohm\'s law states voltage is proportional to current (V = IR).'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Chat Input form bar */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        <input
                          type="text"
                          value={doubtText}
                          onChange={(e) => setDoubtText(e.target.value)}
                          placeholder="Type science / algebra question in Hindi or English..."
                          className="flex-grow text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:outline-hidden text-slate-800 dark:text-slate-200"
                        />
                        <button 
                          onClick={handleAskDoubt}
                          className="bg-[#0038FF] hover:bg-[#002CBD] text-white h-11 px-4.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          Send
                        </button>
                      </div>

                    </div>

                    {/* Right Panel: Direct Actions & Suggestions */}
                    <div className="lg:col-span-3 bg-white dark:bg-[#0C1224] p-4.5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">Instant Assistant Actions</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Suggested syllabus syllabus queries</p>
                      </div>

                      <div className="space-y-1.5 text-xs font-black">
                        {[
                          'Solve quadratic eq: x² - 5x + 6 = 0',
                          'Explain Ohm\'s Law with analogy',
                          'What is the function of resistor?',
                          'द्विघात समीकरण क्या है?',
                          'Explain distance vs displacement'
                        ].map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setDoubtText(sug);
                              triggerCelebration(`Asked: ${sug}`);
                            }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-[10px] hover:text-[#0038FF] transition-all flex items-start gap-1.5 cursor-pointer leading-tight"
                          >
                            <span className="text-slate-405">➜</span>
                            <span className="text-slate-700 dark:text-slate-300 truncate">{sug}</span>
                          </button>
                        ))}
                      </div>

                      <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-[9.5px] leading-relaxed">
                        💡 Click suggested doubts above to copy instantly inside translation panels.
                      </div>
                    </div>

                  </div>
                )}

                {currentTab === 'hubs' && (
                  <div className="space-y-6 text-left animate-fade-in">
                    
                    {/* Horizontal subtab navigation inside Hubs */}
                    <div className="bg-white dark:bg-[#0C1224] p-2 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 font-bold select-none">
                      {[
                        { id: 'parent', label: 'Parent tracker', labelHi: 'अभिभावक केंद्र', icon: Award },
                        { id: 'teacher', label: 'Teacher portal', labelHi: 'शिक्षक कंसोल', icon: Sparkles },
                        { id: 'career', label: 'Career Pathway (NDA Exam)', labelHi: 'रक्षा कैरियर', icon: Compass },
                        { id: 'scholarship', label: 'Allowances portal', labelHi: 'छात्रवृत्ति विभाग', icon: Trophy }
                      ].map((subT) => {
                        const IconComp = subT.icon;
                        const isSubActive = activeSubTab === subT.id;
                        return (
                          <button
                            key={subT.id}
                            onClick={() => {
                              setActiveSubTab(subT.id as any);
                              triggerCelebration(`Loaded sub-tab: ${subT.label}`);
                            }}
                            className={`px-4 py-2.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSubActive 
                                ? 'bg-[#0038FF] text-white shadow-xs' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? subT.labelHi : subT.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* SUB-TAB CONTENTS CONTROLLER */}
                    {activeSubTab === 'parent' && (
                      <div className="space-y-6">
                        
                        {/* Parent metric dashboard card row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-[#0C1224] p-4.5 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[8px] uppercase font-black text-slate-400 block tracking-wider">Weekly minutes</span>
                            <span className="text-xl font-black text-[#0038FF] dark:text-[#27D8FF] block mt-1">180 Mins</span>
                            <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">✓ Target completed (Class 10 Average)</span>
                          </div>
                          
                          <div className="bg-white dark:bg-[#0C1224] p-4.5 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[8px] uppercase font-black text-slate-400 block tracking-wider">Doubt Clearance Rate</span>
                            <span className="text-xl font-black text-emerald-600 block mt-1">94.2%</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Auto-cleared by offline translator app</span>
                          </div>

                          <div className="bg-white dark:bg-[#0C1224] p-4.5 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[8px] uppercase font-black text-slate-400 block tracking-wider">Milestone Credits Gained</span>
                            <span className="text-xl font-black text-amber-500 block mt-1">370 Credits</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Unlocked 4/6 National Scholar Badges</span>
                          </div>
                        </div>

                        {/* Custom wide parent analytics progressive chart */}
                        <div className="bg-white dark:bg-[#0C1224] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-left space-y-4">
                          <div>
                            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">Weekly Progressive study hours graph</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Monitoring continuous homework persistence vs regional peers average</p>
                          </div>

                          {/* Beautiful direct SVG analytics graphs */}
                          <div className="w-full h-40 border-b border-l border-slate-200 dark:border-slate-800 relative flex items-end pt-5 select-none bg-slate-50/50 dark:bg-slate-900/30 p-2">
                            <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                              {/* Grid lines */}
                              <line x1="0" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3" />
                              <line x1="0" y1="60" x2="500" y2="60" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3" />
                              <line x1="0" y1="90" x2="500" y2="90" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3" />

                              {/* Student Hour progression curve line */}
                              <polyline
                                fill="none"
                                stroke="#0038FF"
                                strokeWidth="3"
                                points="10,100 80,85 160,95 240,65 320,40 400,25 480,10"
                                strokeLinecap="round"
                              />

                              {/* Regional peers comparative curve */}
                              <polyline
                                fill="none"
                                stroke="#94A3B8"
                                strokeWidth="1.5"
                                points="10,100 80,95 160,90 240,85 320,80 400,75 480,70"
                                strokeDasharray="4"
                              />

                              {/* Active Nodes highlights */}
                              <circle cx="480" cy="10" r="4" fill="#27D8FF" stroke="#0038FF" strokeWidth="2" />
                            </svg>

                            <div className="absolute top-3 right-3 text-[9px] flex gap-3 text-slate-505 font-bold bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1 rounded-md">
                              <span className="flex items-center gap-1">
                                <span className="w-2 bg-[#0038FF] h-1"></span> Student Progress
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 bg-slate-400 h-1"></span> Peers Average
                              </span>
                            </div>

                            {/* Hour Markers */}
                            <span className="absolute bottom-12 left-1 text-[8px] text-slate-400 font-mono">3.0 hrs</span>
                            <span className="absolute bottom-4 left-1 text-[8px] text-slate-400 font-mono">1.5 hrs</span>
                            
                            {/* Days Markers */}
                            <div className="absolute bottom-[-18px] inset-x-0 flex justify-between px-3 text-[8.5px] text-slate-404 font-bold ml-4 pb-1">
                              <span>Mon</span>
                              <span>Tue</span>
                              <span>Wed</span>
                              <span>Thu</span>
                              <span>Fri</span>
                              <span>Sat</span>
                              <span>Sun (Quiz)</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {activeSubTab === 'teacher' && (
                      <div className="space-y-6">
                        
                        {/* Homework dispatcher wider assignment table */}
                        <div className="bg-white dark:bg-[#0C1224] p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-left space-y-4">
                          <div className="flex justify-between items-center bg-transparent">
                            <div>
                              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">Active Class homework table</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Assigned notebook materials for State Board children tracking</p>
                            </div>
                            
                            <span className="text-[9.5px] bg-red-100 text-red-750 px-2.5 py-0.8 rounded-full font-black uppercase font-mono">Bihar Board Sync</span>
                          </div>

                          <div className="w-full overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900 text-slate-450 border-b border-slate-100 dark:border-slate-800">
                                  <th className="p-3">Homework Title / गृहकार्य</th>
                                  <th className="p-3">Chapters Group</th>
                                  <th className="p-3">Assigned date</th>
                                  <th className="p-3">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {assignments.map((as, idx) => (
                                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/55">
                                    <td className="p-3 font-extrabold text-slate-850 dark:text-slate-150">{as.title}</td>
                                    <td className="p-3 font-mono text-[10.5px] text-slate-500">{as.subject}</td>
                                    <td className="p-3 text-slate-400">{as.date}</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                                        as.status === 'Completed' 
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                      }`}>
                                        {as.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    )}

                    {activeSubTab === 'career' && (
                      <div className="bg-white dark:bg-[#0C1224] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">National Defence Academy (NDA Exam) syllabus Checklist</h4>
                          <p className="text-[10px] text-slate-415 mt-0.5">Direct pathway guidelines for Class 12 state board toppers</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(language === 'hi' ? CAREER_PATHS[0].stepsHi : CAREER_PATHS[0].stepsEn).map((st, sI) => (
                            <div key={sI} className="bg-slate-55 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                              <span className="text-[9px] bg-blue-50 dark:bg-blue-950/40 text-[#0038FF] dark:text-[#27D8FF] px-2 py-0.5 rounded font-black font-mono">STEP {sI + 1}</span>
                              <h5 className="text-xs font-black text-slate-852 dark:text-slate-200 mt-1">{st}</h5>
                              <p className="text-[10px] text-slate-400 leading-normal">
                                Standardized health guidelines, bilingual physics mock exams, and NDA direct allowances details.
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSubTab === 'scholarship' && (
                      <div className="bg-white dark:bg-[#0C1224] p-6 rounded-3xl border border-slate-100 dark:border-slate-805 space-y-4">
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">Active Stateboard Scholarships list</h4>
                          <p className="text-[10px] text-slate-415 mt-0.5">Government sponsored allowances for low-bandwidth families tracking</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {SCHOLARSHIPS.map((sc, scIdx) => (
                            <div key={scIdx} className="bg-slate-55 dark:bg-slate-900 border border-slate-100 dark:border-slate-805 p-4 rounded-2xl flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <span className="text-[8.5px] bg-amber-500 text-white px-2 py-0.5 rounded uppercase font-black tracking-wider">Textbook stipend</span>
                                <h5 className="text-xs font-extrabold text-slate-850 dark:text-slate-100">{sc.titleEn}</h5>
                                <p className="text-[10px] text-slate-400 leading-normal italic">"{sc.titleHi}"</p>
                                <span className="text-[9.5px] block text-rose-500 font-bold mt-1">Deadline Calendar: {sc.deadline}</span>
                              </div>
                              <span className="text-xs font-black text-[#0038FF] dark:text-[#27D8FF] shrink-0 font-mono">{language === 'hi' ? sc.amountHi : sc.amountEn}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {currentTab === 'profile' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left animate-fade-in">
                    
                    {/* Left: Milestones Badges Gallery */}
                    <div className="lg:col-span-6 bg-white dark:bg-[#0C1224] p-5.5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-slate-400 font-black">Milestone honor certificates group</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Earned by maintaining quiz streaks and homework grades</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {BADGES.map((b) => {
                          const isUnlocked = unlockedItems.includes(b.id) || b.id === 'bdg-pioneer';
                          return (
                            <div
                              key={b.id}
                              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                                isUnlocked 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200' 
                                  : 'bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg text-xs shrink-0 ${isUnlocked ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-405'}`}>
                                ★
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black leading-tight truncate">
                                  {language === 'hi' ? b.titleHi : b.titleEn}
                                </p>
                                <p className="text-[8.5px] text-slate-405 leading-tight truncate block mt-0.5">
                                  {language === 'hi' ? b.descHi : b.descEn}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Eklavya store merchandise redemptions */}
                    <div className="lg:col-span-6 bg-[#FFFCEB] dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/50 p-5.5 rounded-3xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] bg-amber-500 text-white font-black px-2.5 py-0.8 rounded uppercase tracking-wider">
                            Eklavya reward store
                          </span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-amber-505 mt-1.5 leading-none">Honor Store Redemptions</h4>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                          Exchange milestone coins gained during Chapter topic test clearances for custom profile titles, medals and advanced certificates frames.
                        </p>

                        <div className="space-y-2 mt-3">
                          {STORE_ITEMS.map((item) => {
                            const isOwned = unlockedItems.includes(item.id);
                            return (
                              <div key={item.id} className="bg-white dark:bg-[#0C1224] p-3 rounded-2xl flex items-center justify-between border border-amber-100 dark:border-slate-805 text-xs">
                                <div>
                                  <p className="font-extrabold text-slate-904 dark:text-white leading-none">{language === 'hi' ? item.nameHi : item.nameEn}</p>
                                  <span className="text-[9.5px] text-amber-600 font-bold block mt-1">{item.price} Credits</span>
                                </div>
                                <button
                                  onClick={() => purchaseStoreItem(item)}
                                  disabled={isOwned}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                                    isOwned 
                                      ? 'bg-slate-100 text-slate-405 dark:bg-slate-900 cursor-not-allowed' 
                                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                                  }`}
                                >
                                  {isOwned ? 'OWNED' : 'REDEEM'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-3 bg-white/70 dark:bg-slate-900 rounded-xl text-[9px] text-slate-450 font-mono text-center">
                        Coins Sync Balance: <span className="text-amber-600 font-black font-mono">{student.coins} pts</span>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* AI INTERACTIVE TEST ASSESSMENT COMPONENT (Beautiful active interactive quiz results screen) */}
            {currentQuiz.length > 0 && (
              <div id="active-quiz-panel" className="bg-white p-6 rounded-3xl border border-[#27D8FF] shadow-lg text-left transition-all animate-fade-in">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-black text-[#0038FF] uppercase tracking-wider">
                      ABHIshiksha Active Live Assessment
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Question {activeQuestionIndex + 1} of {currentQuiz.length}
                  </span>
                </div>

                {!quizCompleted ? (
                  <div className="mt-4 space-y-4">
                    
                    {/* The Question */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Question / प्रश्न</p>
                      <h4 className="text-base font-extrabold text-slate-900 leading-normal">
                        {language === 'hi' ? currentQuiz[activeQuestionIndex].questionHi : currentQuiz[activeQuestionIndex].questionEn}
                      </h4>
                    </div>

                    {/* Options Stack */}
                    <div className="space-y-2">
                      {(language === 'hi' ? currentQuiz[activeQuestionIndex].optionsHi : currentQuiz[activeQuestionIndex].optionsEn).map((opt, oIdx) => {
                        let btnStyle = 'border-slate-200 hover:border-blue-300 text-slate-800 bg-white';
                        if (selectedOptionIndex === oIdx) {
                          btnStyle = 'border-[#0038FF] bg-[#F0F5FF] text-[#0038FF] font-extrabold';
                        }
                        if (hasSubmittedAnswer) {
                          const isCorrectOption = currentQuiz[activeQuestionIndex].answerIndex === oIdx;
                          if (isCorrectOption) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold';
                          } else if (selectedOptionIndex === oIdx) {
                            btnStyle = 'border-rose-500 bg-rose-50 text-rose-850 font-extrabold';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={hasSubmittedAnswer}
                            onClick={() => handleQuizAnswerSelect(oIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex justify-between items-center ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {hasSubmittedAnswer && currentQuiz[activeQuestionIndex].answerIndex === oIdx && <Check className="w-4 h-4 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
                      
                      {!hasSubmittedAnswer ? (
                        <button
                          onClick={submitQuizAnswer}
                          disabled={selectedOptionIndex === null}
                          className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#0038FF] hover:bg-[#002CBD] text-white disabled:opacity-50"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuizQuestion}
                          className="px-6 py-2.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white"
                        >
                          {activeQuestionIndex + 1 === currentQuiz.length ? 'Finish Test' : 'Next Question ➜'}
                        </button>
                      )}

                    </div>

                    {/* Interactive state board explanation */}
                    {hasSubmittedAnswer && (
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-250 text-xs">
                        <p className="font-extrabold text-emerald-850">🎓 Explanation / समाधान:</p>
                        <p className="text-slate-700 italic mt-1 leading-relaxed">
                          {language === 'hi' ? currentQuiz[activeQuestionIndex].explanationHi : currentQuiz[activeQuestionIndex].explanationEn}
                        </p>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="mt-4 text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner animate-bounce">
                      🏆
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-[#0038FF]">Quiz successfully finished!</h4>
                      <p className="text-xs text-slate-500">Your score: {quizScore} / {currentQuiz.length} correct answers</p>
                    </div>

                    <div className="p-3.5 bg-blue-50/50 rounded-2xl max-w-sm mx-auto border border-blue-105">
                      <p className="text-xs font-bold text-[#0038FF]">🎉 Rewards Gained!</p>
                      <p className="text-xs text-slate-700 mt-1 font-semibold">Earned +30 Eklavya Coins towards avatar upgrades!</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentQuiz([]);
                        setStudent(st => ({ ...st, coins: st.coins + 30 }));
                      }}
                      className="px-6 py-2 text-xs font-bold bg-[#0038FF] hover:bg-[#002CBD] text-white rounded-xl"
                    >
                      Return to Learning
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* IMMERSIVE MINDFUL SHORTS BREAK BOARD VIEW */}
      {activeShortsBreakOpen && (
        <div id="mindful-shorts-overlay" className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0C1224] border border-[#27D8FF]/30 rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-fade-in text-white">
            
            {/* Header / Countdown section */}
            <div className="p-4 bg-gradient-to-r from-[#061633] to-[#155EEF] border-b border-slate-800 flex justify-between items-center text-left">
              <div>
                <span className="text-[8px] bg-indigo-500 text-white px-2 py-0.5 rounded uppercase font-black tracking-wider font-mono">
                  {language === 'hi' ? 'नियंत्रित विश्राम समय' : 'Mindful Controlled Break'}
                </span>
                <h3 className="text-sm font-black text-white mt-1 font-display">
                  🧘 {language === 'hi' ? 'माइंडफुल शॉर्ट्स' : 'Mindful Shorts Break'}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-indigo-500/20 text-indigo-300">
                <Clock className="w-4 h-4 text-[#53B1FD]" />
                <span className="text-xs font-black font-mono">
                  {shortsWatchTime >= 900 ? "00:00" : `${String(Math.floor((900 - shortsWatchTime) / 60)).padStart(2, '0')}:${String((900 - shortsWatchTime) % 60).padStart(2, '0')}`}
                </span>
              </div>
            </div>

            {shortsWatchTime >= 900 ? (
              // Locked because 15-minute daily limit has been exhausted
              <div className="p-8 text-center space-y-6 my-auto">
                <div className="w-20 h-20 bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto">
                  <Flame className="w-10 h-10 text-orange-405 fill-orange-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-white font-display">
                    {language === 'hi' ? 'आपका माइंडफुल ब्रेक पूरा हो गया है।' : 'Your Mindful Break is Complete!'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === 'hi' 
                      ? '“आपका माइंडफुल ब्रेक पूरा हो गया है। चलो हमारी पढ़ाई जारी रखते हैं।”' 
                      : '“Your mindful break is complete. Let’s continue learning.”'}
                  </p>
                </div>
                
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl max-w-sm mx-auto text-left">
                  <p className="text-[10px] text-emerald-400 font-extrabold text-center">
                    💡 {language === 'hi' ? 'सुझाव: रिवार्ड स्टोर पर अपने एकलव्य सिक्कों का उपयोग करें या मिनी ट्यूटर से सवाल पूछें!' : 'Hint: Spend your Eklavya Coins inside the Reward Shop or ask questions to ABHI Mini Tutor!'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveShortsBreakOpen(false);
                    setActiveShortVideo(null);
                    triggerCelebration(language === 'hi' ? "चलो पढ़ाई जारी रखें!" : "Let's work hard together!");
                  }}
                  className="w-full bg-[#155EEF] hover:bg-blue-600 text-white text-xs font-black py-3 rounded-2xl transition-all uppercase tracking-widest cursor-pointer shadow-md"
                >
                  {language === 'hi' ? 'अध्ययन पर वापस जाएं 🚀' : 'Back to Learning 🚀'}
                </button>
              </div>
            ) : (
              // Active watching state
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                
                {/* Main Active video frame visual mockup */}
                {activeShortVideo ? (
                  <div className="bg-black rounded-2xl overflow-hidden border border-slate-800 relative aspect-video flex flex-col justify-end bg-cover bg-center shadow-lg" style={{ backgroundImage: `url(${activeShortVideo.videoUrl})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/45 flex flex-col justify-between p-3.5">
                      
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] bg-indigo-600/90 border border-indigo-500/20 text-white font-mono px-2 py-0.5 rounded uppercase font-black tracking-widest">
                          {activeShortVideo.category}
                        </span>
                        
                        <span className="text-[8.5px] bg-black/60 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                          Playing Breaker
                        </span>
                      </div>

                      <div className="space-y-1 text-left">
                        <p className="text-[10px] font-bold text-[#53B1FD]">@{activeShortVideo.author}</p>
                        <h4 className="text-xs font-black text-white leading-tight">
                          {language === 'hi' ? activeShortVideo.titleHi : activeShortVideo.titleEn}
                        </h4>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                    Please select a video to begin your mindful watch session!
                  </div>
                )}

                {/* Curated Wellbeing Categories Swapper */}
                <div className="space-y-1 text-left">
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-black">
                    Filter Curated Categories (No Infinite Scroll)
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    {['All', 'Motivation', 'Study Tips', 'Exam Confidence', 'Career Awareness', 'Health & Focus', 'Inspirational Student Stories', 'Quick Life Skills', 'Positive Mindset'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setShortsCategoryFilter(cat)}
                        className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                          shortsCategoryFilter === cat
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-extrabold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-250'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Playlist Grid selector */}
                <div className="space-y-2 text-left">
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-black">
                    Approved Positivity Playlist (No Entertainment Clutter)
                  </span>
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                    {mindfulShorts
                      .filter(v => v.approved && (shortsCategoryFilter === 'All' || v.category === shortsCategoryFilter))
                      .map(video => (
                        <div 
                          key={video.id}
                          onClick={() => {
                            setActiveShortVideo(video);
                            triggerCelebration(language === 'hi' ? "वीडियो बदला गया" : "Selected short video");
                          }}
                          className={`p-2 rounded-xl flex gap-3 items-center border transition-all cursor-pointer text-left ${
                            activeShortVideo?.id === video.id
                              ? 'bg-indigo-950/45 border-indigo-500/40 text-white'
                              : 'bg-[#0E1528] border-slate-850 text-slate-300 hover:bg-[#151D35]'
                          }`}
                        >
                          <img 
                            className="w-14 h-9 object-cover rounded-lg shrink-0 border border-slate-800" 
                            src={video.videoUrl} 
                            alt=""
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[7.5px] bg-slate-850 text-[#53B1FD] font-mono px-1 rounded uppercase tracking-wider">
                              {video.category}
                            </span>
                            <h5 className="text-[10px] font-extrabold truncate mt-0.5 text-white">
                              {language === 'hi' ? video.titleHi : video.titleEn}
                             </h5>
                            <p className="text-[8px] text-slate-500 font-mono">by @{video.author}</p>
                          </div>
                        </div>
                      ))}
                    {mindfulShorts.filter(v => v.approved && (shortsCategoryFilter === 'All' || v.category === shortsCategoryFilter)).length === 0 && (
                      <p className="text-[10px] text-slate-550 text-center py-4">No approved videos in this category yet.</p>
                    )}
                  </div>
                </div>

                {/* Footer and Panels CTA trigger */}
                <div className="pt-2.5 border-t border-slate-850 flex justify-between items-center text-xs">
                  <button
                    onClick={() => setViewingAdminShorts(!viewingAdminShorts)}
                    className="text-[9px] font-black text-indigo-400 hover:underline uppercase flex items-center gap-1 cursor-pointer"
                  >
                    ⚙️ {viewingAdminShorts ? "Close Controller" : "Open Admin Panel"}
                  </button>

                  <button
                    onClick={() => {
                      setActiveShortsBreakOpen(false);
                      setActiveShortVideo(null);
                      triggerCelebration(language === 'hi' ? "मजबूत कदम! पढ़ाई पर वापस चलें।" : "Excellent! Back to textbooks.");
                    }}
                    className="bg-[#155EEF] hover:bg-blue-700 text-white text-[9.5px] font-black px-4 py-2 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {language === 'hi' ? 'वापस पढ़ाई पर जाएं' : 'Back to Learning ➜'}
                  </button>
                </div>

                {/* Teacher approved short uploads and custom approvals console */}
                {viewingAdminShorts && (
                  <div className="p-3 bg-[#081020] rounded-2xl border border-slate-800 text-left space-y-3 animate-fade-in text-[11px] text-white">
                    <div className="flex justify-between items-center pb-2 border-b border-indigo-950">
                      <span className="font-extrabold text-slate-205">🛠️ Teacher & Admin Controller</span>
                      <span className="text-[8px] bg-emerald-500 text-white px-1 rounded font-mono uppercase font-black">Authorized</span>
                    </div>

                    <p className="text-[9px] text-slate-400">
                      Teachers or Admins can upload motivational student wellness shorts. 
                      Only approved videos are added to the list. Unapproved videos can be accepted.
                    </p>

                    {/* Proposed unapproved checklist */}
                    <div className="space-y-1.5 text-left">
                      <span className="text-[8.5px] text-slate-500 uppercase font-bold block">Proposed Videos Checklist ({mindfulShorts.filter(v => !v.approved).length})</span>
                      <div className="space-y-1.5 max-h-[145px] overflow-y-auto">
                        {mindfulShorts.filter(v => !v.approved).map(v => (
                          <div key={v.id} className="p-2 bg-slate-950/60 border border-slate-850 rounded-lg flex justify-between items-center gap-2">
                            <div className="min-w-0 flex-1 text-left text-white">
                              <h6 className="font-bold text-slate-300 truncate">{v.titleEn}</h6>
                              <p className="text-[8px] text-slate-500">by @{v.author} • {v.category}</p>
                            </div>
                            <button
                              onClick={async () => {
                                try {
                                  await fetch(`/api/mindful-shorts/videos/${v.id}/approve`, { method: 'POST' });
                                  triggerCelebration("Video Approved successfully!");
                                  fetchMindfulShorts();
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[8px] font-bold px-2 py-1 rounded shrink-0 uppercase tracking-wider cursor-pointer font-mono"
                            >
                              Approve
                            </button>
                          </div>
                        ))}
                        {mindfulShorts.filter(v => !v.approved).length === 0 && (
                          <p className="text-[8.5px] text-slate-500 italic">No video suggestions pending approval currently.</p>
                        )}
                      </div>
                    </div>

                    {/* Upload forms */}
                    <div className="space-y-2 pt-2 border-t border-indigo-950 text-left">
                      <span className="text-[8.5px] text-slate-500 uppercase font-bold block">Propose/Upload Motivating Short</span>
                      <div className="grid grid-cols-2 gap-2 text-slate-800">
                        <input 
                          type="text" 
                          placeholder="English Title" 
                          value={adminTitleEn} 
                          onChange={(e) => setAdminTitleEn(e.target.value)} 
                          className="bg-slate-950 border border-slate-800 text-slate-200 p-1 rounded text-[9.5px]"
                        />
                        <input 
                          type="text" 
                          placeholder="Hindi Title" 
                          value={adminTitleHi} 
                          onChange={(e) => setAdminTitleHi(e.target.value)} 
                          className="bg-slate-950 border border-slate-800 text-slate-200 p-1 rounded text-[9.5px]"
                        />
                        <input 
                          type="text" 
                          placeholder="Author / Sir Name" 
                          value={adminAuthor} 
                          onChange={(e) => setAdminAuthor(e.target.value)} 
                          className="bg-slate-950 border border-slate-800 text-slate-200 p-1 rounded text-[9.5px]"
                        />
                        <select 
                          value={adminCategory} 
                          onChange={(e) => setAdminCategory(e.target.value)} 
                          className="bg-slate-950 border border-slate-800 text-slate-300 p-1 rounded text-[9.5px] select-dark"
                        >
                          {['Motivation', 'Study Tips', 'Exam Confidence', 'Career Awareness', 'Health & Focus', 'Inspirational Student Stories', 'Quick Life Skills', 'Positive Mindset'].map(c => (
                            <option key={c} value={c} className="text-slate-800">{c}</option>
                          ))}
                        </select>
                        <input 
                          type="text" 
                          placeholder="Unsplash/Video Thumbnail Url" 
                          value={adminVideoUrl} 
                          onChange={(e) => setAdminVideoUrl(e.target.value)} 
                          className="bg-slate-950 border border-slate-800 text-slate-200 p-1 rounded text-[9.5px] col-span-2"
                        />
                      </div>
                      
                      <button
                        onClick={async () => {
                          if (!adminTitleEn || !adminTitleHi || !adminAuthor) {
                            triggerCelebration("Please fill in required fields.");
                            return;
                          }
                          try {
                            const response = await fetch('/api/mindful-shorts/videos', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                titleEn: adminTitleEn,
                                  titleHi: adminTitleHi,
                                  author: adminAuthor,
                                  category: adminCategory,
                                  videoUrl: adminVideoUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
                                  approved: true // Admins add them pre-approved
                                })
                              });
                              
                              if (response.ok) {
                                setAdminTitleEn('');
                                setAdminTitleHi('');
                                setAdminAuthor('');
                                setAdminVideoUrl('');
                                triggerCelebration("Uploaded motivational video pre-approved successfully!");
                                fetchMindfulShorts();
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="w-full bg-[#155EEF] hover:bg-blue-700 text-white text-[9px] font-black py-1.5 rounded uppercase tracking-wider cursor-pointer"
                        >
                          Publish Approved Wellness Short
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PhoneAuth />} />
      <Route path="/student-dashboard" element={<ProtectedRoute allowedRole="student"><MainDashboard role="student" /></ProtectedRoute>} />
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><MainDashboard role="admin" /></ProtectedRoute>} />
      <Route path="/parent-dashboard" element={<ProtectedRoute allowedRole="parent"><MainDashboard role="parent" /></ProtectedRoute>} />
    </Routes>
  );
}
