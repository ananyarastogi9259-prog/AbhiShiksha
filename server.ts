/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const myFilename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
const myDirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(myFilename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI Client to prevent crash if key is missing or invalid on bootup
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Global mock state for teacher, parent, and village sync simulations
const teacherAssignments = [
  { id: '1', titleEn: 'Math: Quadratic Equations Practice', titleHi: 'गणित: द्विघात समीकरण अभ्यास', dueDate: '2026-06-05', classGrade: 'Class 10', totalPoints: 50, submissions: 18 },
  { id: '2', titleEn: 'Science: Water Cycle Diagram & Setup', titleHi: 'विज्ञान: जल चक्र चित्र और गतिविधि', dueDate: '2026-06-03', classGrade: 'Class 7', totalPoints: 30, submissions: 24 }
];

const studentsPerformance = [
  { id: 'std-1', name: 'Aarav Kumar', grade: 'Class 9', score: 85, attendance: '96%', weakSubjectEn: 'Mathematics', weakSubjectHi: 'गणित' },
  { id: 'std-2', name: 'Priya Sharma', grade: 'Class 10', score: 42, attendance: '72%', weakSubjectEn: 'Science', weakSubjectHi: 'विज्ञान' },
  { id: 'std-3', name: 'Rahul Yadav', grade: 'Class 8', score: 91, attendance: '100%', weakSubjectEn: 'English', weakSubjectHi: 'अंग्रेजी' },
  { id: 'std-4', name: 'Ananya Verma', grade: 'Class 6', score: 58, attendance: '81%', weakSubjectEn: 'Mathematics', weakSubjectHi: 'गणित' }
];

// Offline Pre-compiled Tutor replies for low/no internet
const offlineTutorReplies = [
  {
    topic: "gravity",
    replyEn: "Gravity is an invisible pull that draws objects toward each other. It's why things fall down under Class 6 level! For example, when you drop a ball, gravity brings it to the soil.",
    replyHi: "गुरुत्वाकर्षण एक अदृश्य खिंचाव है जो वस्तुओं को एक-दूसरे की ओर खींचता है। इसी वजह से चीजें जमीन पर गिरती हैं! उदाहरण के लिए, जब आप गेंद छोड़ते हैं, तो वह नीचे आती है।"
  },
  {
    topic: "photosynthesis",
    replyEn: "Photosynthesis is how green plants use sunlight, carbon dioxide, and water to prepare their food (glucose) and release oxygen for us!",
    replyHi: "प्रकाश संश्लेषण वह प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश, कार्बन डाइऑक्साइड और पानी का उपयोग करके अपना भोजन तैयार करते हैं और ऑक्सीजन छोड़ते हैं!"
  },
  {
    topic: "fraction",
    replyEn: "Fractions represent parts of a whole tree or food. For example, 1/2 means one part out of two equal parts of a sweet gulab jamun!",
    replyHi: "भिन्न (Fractions) किसी पूरी वस्तु के भागों को दर्शाते हैं। उदाहरण के लिए, 1/2 का मतलब है एक मीठे गुलाब जामुन के दो बराबर हिस्सों में से एक हिस्सा!"
  }
];

// --- API ENDPOINTS ---

// AI Doubt Solver and Mini Tutor endpoint using Gemini-3.5-flash
app.post('/api/doubt/ask', async (req, res) => {
  const { question, grade, language, isOfflineMode } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }

  // Handle Offline Simulation explicitly
  if (isOfflineMode) {
    const term = question.toLowerCase();
    const matched = offlineTutorReplies.find(r => term.includes(r.topic));
    if (matched) {
      return res.json({
        answer: language === 'hi' ? matched.replyHi : matched.replyEn,
        source: 'Offline Mini Tutor Database (SD Storage)',
        isOfflineResolved: true
      });
    } else {
      return res.json({
        answer: language === 'hi' 
          ? "यह संदेश 'ऑफ़लाइन मिनी ट्यूटर' से है। मुझे अभी इंटरनेट नहीं मिल रहा है। गुरुत्वाकर्षण (Gravity), प्रकाश संश्लेषण (Photosynthesis), या भिन्न (Fraction) लिखकर देखें!"
          : "Offline Mini Tutor Alert: Currently Offline. Try typing simple keywords like 'gravity', 'photosynthesis', or 'fraction'!",
        source: 'Offline Local Dictionary Finder',
        isOfflineResolved: true
      });
    }
  }

  const ai = getAIClient();

  if (!ai) {
    // Elegant simulation fallback if no API key is set
    console.log("No GEMINI_API_KEY detected. Running premium AI simulated route.");
    return res.json({
      answer: language === 'hi'
        ? `[सिम्युलेटेड प्रतिक्रिया] प्रिय कक्षा ${grade || 'छात्र'}, मैं एबीएचआई मिनी ट्यूटर हूँ! आपने "${question}" के बारे में पूछा। यह अवधारणा हमारे राज्य बोर्ड पाठ्यक्रम के बहुत महत्वपूर्ण भाग है। मुख्य बिंदु यह हैं: 1. हमेशा बुनियादी बातों से शुरू करें। 2. यह विषय दैनिक जीवन के अनुप्रयोगों से गहराई से जुड़ा हुआ है। 3. अभ्यास करने से आपको बोर्ड परीक्षा में अच्छे अंक मिलेंगे।`
        : `[Simulated Model Response] Hello Student of ${grade || 'Class 10'}, I am your ABHI Mini Tutor! You asked about: "${question}". This is a key textbook concept in state boards. Quick Tip: Always visualize with real-life examples to remember perfectly! Let me know if you need any simpler explanation or interactive quiz on this topic.`,
      source: 'ABHIshiksha Cloud Server'
    });
  }

  try {
    const prompt = `You are "ABHIshiksha Mini Tutor", a brilliant and extremely helpful bilingual AI assistant serving under-privileged government school children in India.
    Current student context:
    - Grade: ${grade || "Not Specified"}
    - Target Language of Explanation: ${language === 'hi' ? "Hindi (Devanagari)" : "English"}
    
    Student Question: "${question}"
    
    Instructions:
    1. Keep the language extremely simple, pedagogical, respectful, and comforting. Use real-life analogies common to rural/urban Indian neighborhoods (e.g., cricket, village farms, local markets, sweet dishes like jalebis).
    2. Write clearly. Do not use overly complex terminology. Make it fun, engaging, and highly informative.
    3. Ensure appropriate length (2-3 crisp paragraphs) and highlight main takeaways. Always offer warmth to motivate under-privileged state board children.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return res.json({
      answer: response.text || "No output generated.",
      source: 'Gemini-3.5-flash'
    });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return res.json({
      answer: language === 'hi' 
        ? "नमस्ते! सर्वर अभी लोड हो रहा है या एपीआई लिमिट समाप्त हो गई है। हमारी ऑफलाइन सैंडबॉक्स डेटा आपके पास उपलब्ध है।"
        : "Hello! The online AI system is currently loading. Let's explore standard course material, or check the offline study mode!",
      source: 'Smart Local Fallback'
    });
  }
});

// Dynamic AI-Generated Quiz Endpoint
app.post('/api/quiz/generate', async (req, res) => {
  const { grade, subjectName, topicName, language } = req.body;
  const ai = getAIClient();

  if (!ai) {
    // Return custom mock high-fidelity quiz instantly
    return res.json({
      quiz: [
        {
          id: "q-1",
          questionEn: `Which is a perfect example of gravity pulling an object back to earth?`,
          questionHi: `इनमें से कौन सा गुरुत्वाकर्षण द्वारा वस्तु को वापस जमीन पर खींचने का एक उत्तम उदाहरण है?`,
          optionsEn: ["A flying bird", "A raw mango falling from a tree branch", "Smoke rising upwards", "A helium balloon"],
          optionsHi: ["एक उड़ता हुआ पक्षी", "पेड़ की शाखा से गिरता हुआ कच्चा आम", "ऊपर की ओर उठता हुआ धुआं", "हिलियम से भरा गुब्बारा"],
          answerIndex: 1,
          explanationEn: "Gravity pulls all mass, including mangoes, downwards toward the Center of Earth.",
          explanationHi: "गुरुत्वाकर्षण आम सहित सभी द्रव्यमान को नीचे की ओर पृथ्वी के केंद्र की ओर खींचता है।"
        },
        {
          id: "q-2",
          questionEn: `What key element is produced by plants during the water-making and sugar-preparation cycles?`,
          questionHi: `पौधे भोजन बनाने और प्रकाश संश्लेषण चक्र के दौरान कौन सा मुख्य तत्व उत्सर्जित करते हैं?`,
          optionsEn: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Hydrogen"],
          optionsHi: ["नाइट्रोजन", "ऑक्सीजन", "कार्बन डाइऑक्साइड", "हाइड्रोजन"],
          answerIndex: 1,
          explanationEn: "Oxygen is released as a vital byproduct, supporting all life forms.",
          explanationHi: "ऑक्सीजन एक महत्वपूर्ण जीवन रक्षक उपउत्पाद के रूप में निकलती है।"
        }
      ]
    });
  }

  try {
    const prompt = `Generate a 2-question interactive quiz bilingually (English & Hindi) for Indian students of ${grade || "Class 8"} on the topic "${topicName || "General Science"}".
    You must return a raw JSON array that conforms strictly to this TypeScript format:
    Array<{
      questionEn: string,
      questionHi: string,
      optionsEn: string[] (length 4),
      optionsHi: string[] (length 4),
      answerIndex: number (0 to 3),
      explanationEn: string,
      explanationHi: string
    }>
    
    Make the questions engaging and realistic to local environments. Return only valid serialized JSON, no other text or markdown block markers outside the JSON representation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionEn: { type: Type.STRING },
              questionHi: { type: Type.STRING },
              optionsEn: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              optionsHi: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              answerIndex: { type: Type.INTEGER },
              explanationEn: { type: Type.STRING },
              explanationHi: { type: Type.STRING }
            },
            required: ["questionEn", "questionHi", "optionsEn", "optionsHi", "answerIndex", "explanationEn", "explanationHi"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ quiz: parsed });
  } catch (error) {
    console.error("Quiz creation error:", error);
    return res.json({
      quiz: [
        {
          id: "q-1",
          questionEn: `Which is a perfect example of gravity pulling an object back to earth?`,
          questionHi: `इनमें से कौन सा गुरुत्वाकर्षण द्वारा वस्तु को वापस जमीन पर खींचने का एक उत्तम उदाहरण है?`,
          optionsEn: ["A flying bird", "A raw mango falling from a tree branch", "Smoke rising upwards", "A helium balloon"],
          optionsHi: ["एक उड़ता हुआ पक्षी", "पेड़ की शाखा से गिरता हुआ कच्चा आम", "ऊपर की ओर उठता हुआ धुआं", "हिलियम से भरा गुब्बारा"],
          answerIndex: 1,
          explanationEn: "Gravity pulls all mass, including mangoes, downwards toward the Center of Earth.",
          explanationHi: "गुरुत्वाकर्षण आम सहित सभी द्रव्यमान को नीचे की ओर पृथ्वी के केंद्र की ओर खींचता है।"
        }
      ]
    });
  }
});

// parent weekly report generator using Gemini
app.post('/api/parent/report/generate', async (req, res) => {
  const { childName, grade, performanceLogs, language } = req.body;
  const ai = getAIClient();

  if (!ai) {
    return res.json({
      report: language === 'hi'
        ? `साप्ताहिक रिपोर्ट कार्ड: ${childName} का समग्र प्रदर्शन बेहतरीन है। गणित में सुधार की आवश्यकता है जहां ध्यान स्कोर 60% रहा। आगामी बोर्ड परीक्षाओं की तैयारी अच्छी है। सप्ताह में 4 दिन लगातार हाजिरी दर्ज हुई।`
        : `Weekly Report: ${childName} is maintaining an excellent study streak of 5 days, completing 6 modules this week. Science conceptual learning is high (88%), while math requires specific practice. Warm motivational feedback sent via simulated SMS to parent's phone.`
    });
  }

  try {
    const prompt = `Generate a concise 3-line encouraging weekly parent performance report card for:
    Child: ${childName}
    Grade: ${grade}
    Logs: ${JSON.stringify(performanceLogs || { streak: 5, completions: 4, weakAreas: 'Math Fractions' })}
    Language of output: ${language === 'hi' ? "Hindi (Devanagari)" : "English"}
    Remember, government school parents might need extremely direct, clear, comforting, and practical instructions on how to support their child at home (e.g., 'give them 30 minutes of uninterrupted reading time after dinner'). Keep it beautiful and actionable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return res.json({ report: response.text });
  } catch (error) {
    return res.json({
      report: `Excellent effort this week! Maintain consistent learning. (Simulated Success)`
    });
  }
});

// General assignments list for Teacher Dashboard
app.get('/api/teacher/assignments', (req, res) => {
  res.json({ assignments: teacherAssignments });
});

app.post('/api/teacher/assignments/create', (req, res) => {
  const { titleEn, titleHi, dueDate, classGrade, totalPoints } = req.body;
  const newItem = {
    id: (teacherAssignments.length + 1).toString(),
    titleEn: titleEn || "New Project Topic",
    titleHi: titleHi || "नया परियोजना विषय",
    dueDate: dueDate || "2026-06-10",
    classGrade: classGrade || "Class 9",
    totalPoints: Number(totalPoints || 40),
    submissions: 0
  };
  teacherAssignments.push(newItem);
  res.json({ success: true, item: newItem });
});

// Students list for Teacher Tracker
app.get('/api/teacher/students', (req, res) => {
  res.json({ students: studentsPerformance });
});

// Simulating rural SD-Card sync activity / Community cloud center updates
app.post('/api/sync/village', (req, res) => {
  const { offlineLogs, studentId } = req.body;
  console.log(`Synchronized offline state from student ${studentId}:`, offlineLogs);
  res.json({
    success: true,
    messageEn: "Successfully synchronized study hours, streaks, and quiz submissions directly with the Village Learning Sync Hub (Community Wi-Fi / SD Card format detected)!",
    messageHi: "ग्रामीण शिक्षा सिंक हब (सामुदायिक वाई-फाई / एसडी कार्ड प्रारूप) के साथ ऑफलाइन अध्ययन प्रगति, क्विज स्कोर और दैनिक स्ट्रीक सफलतापूर्वक सिंक हो गए हैं!"
  });
});

// --- MINDFUL SHORTS BREAK API ENDPOINTS ---

// Mock database for Mindful Shorts
interface MindfulShortVideo {
  id: string;
  titleEn: string;
  titleHi: string;
  author: string;
  category: 'Motivation' | 'Study Tips' | 'Exam Confidence' | 'Career Awareness' | 'Health & Focus' | 'Inspirational Student Stories' | 'Quick Life Skills' | 'Positive Mindset';
  videoUrl: string;
  likes: number;
  comments: number;
  approved: boolean; // Admin/Teacher control: Only approved shorts appear
}

let mindfulShortsDatabase: MindfulShortVideo[] = [
  {
    id: 'ms-1',
    titleEn: '💡 Secrets to 10x Subject Retention (Visual Study Tips)',
    titleHi: '💡 विषय को 10 गुना अधिक याद रखने के रहस्य (अध्ययन युक्तियाँ)',
    author: 'Siddharth Sir (Govt High School)',
    category: 'Study Tips',
    videoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    likes: 1245,
    comments: 189,
    approved: true
  },
  {
    id: 'ms-2',
    titleEn: '🧘 2-Min Mindfulness Breathing for Exam Focus',
    titleHi: '🧘 परीक्षा एकाग्रता के लिए 2 मिनट का माइंडफुलनेस श्वास व्यायाम',
    author: 'Yogi Amit (Yog Shiksha)',
    category: 'Health & Focus',
    videoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
    likes: 912,
    comments: 83,
    approved: true
  },
  {
    id: 'ms-3',
    titleEn: '⭐ UP Board Topper\'s Journey from Village to IIT Kanpur',
    titleHi: '⭐ गांव से आईआईटी कानपुर तक का सफर: एक टॉपर की सच्ची प्रेरणादायक कहानी',
    author: 'Abhishek Kumar, IITian',
    category: 'Inspirational Student Stories',
    videoUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80',
    likes: 3105,
    comments: 422,
    approved: true
  },
  {
    id: 'ms-4',
    titleEn: '🎯 How to Handle Board Exam Stress with Ultimate Confidence',
    titleHi: '🎯 बोर्ड परीक्षा के तनाव को पूर्ण आत्मविश्वास के साथ कैसे संभालें',
    author: 'Counselor Ritu, Bal Kalyan Kendra',
    category: 'Exam Confidence',
    videoUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80',
    likes: 1540,
    comments: 204,
    approved: true
  },
  {
    id: 'ms-5',
    titleEn: '🔥 Visualizing Your Career Options (Class 10 and 12 Simplified)',
    titleHi: '🔥 करियर के विभिन्न विकल्पों की रूपरेखा (कक्षा 10 और 12 के बाद)',
    author: 'Neha Didi, Career Margdarshan',
    category: 'Career Awareness',
    videoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
    likes: 2210,
    comments: 310,
    approved: true
  },
  {
    id: 'ms-6',
    titleEn: '💪 The Power of Positive Self-Talk for Daily Motivation',
    titleHi: '💪 दैनिक प्रेरणा के लिए सकारात्मक आत्म-संवाद की जादुई शक्ति',
    author: 'Coach Vinay (Nirmaan Academy)',
    category: 'Positive Mindset',
    videoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80',
    likes: 835,
    comments: 65,
    approved: true
  }
];

// In-memory student shorts progress dictionary keyed by student ID (or default)
interface StudentShortsStatus {
  studyTime: number; // in seconds
  shortsAccess: boolean; // whether 2hr limit is reached
  shortsWatchTime: number; // in seconds (up to 900)
  videoProgress: Record<string, number>; // item.id -> seconds watched
  dailyLimit: number; // 900 seconds (15 min)
  lastUpdatedDate: string; // YYYY-MM-DD
}

let studentShortsStats: Record<string, StudentShortsStatus> = {};

function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getOrInitStats(studentId: string = 'default-student'): StudentShortsStatus {
  const today = getTodayDateString();
  if (!studentShortsStats[studentId]) {
    studentShortsStats[studentId] = {
      studyTime: 0,
      shortsAccess: false,
      shortsWatchTime: 0,
      videoProgress: {},
      dailyLimit: 900, // 15 mins
      lastUpdatedDate: today
    };
  } else if (studentShortsStats[studentId].lastUpdatedDate !== today) {
    // Reset shorts eligibility & watch times daily at midnight
    studentShortsStats[studentId] = {
      studyTime: 0,
      shortsAccess: false,
      shortsWatchTime: 0,
      videoProgress: {},
      dailyLimit: 900,
      lastUpdatedDate: today
    };
  }
  return studentShortsStats[studentId];
}

// 1. Get all approved/unapproved videos
app.get('/api/mindful-shorts/videos', (req, res) => {
  res.json({ videos: mindfulShortsDatabase });
});

// 2. Upload/Propose a new video (Admin/Teacher tool)
app.post('/api/mindful-shorts/videos', (req, res) => {
  const { titleEn, titleHi, author, category, videoUrl, approved } = req.body;
  if (!titleEn || !titleHi || !author || !category) {
    return res.status(400).json({ error: "Missing required video properties." });
  }

  const newVid: MindfulShortVideo = {
    id: `ms-${Date.now()}`,
    titleEn,
    titleHi,
    author,
    category: category || 'Motivation',
    videoUrl: videoUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    likes: 0,
    comments: 0,
    approved: approved !== undefined ? approved : false // defaults to false (needs admin approval)
  };

  mindfulShortsDatabase.push(newVid);
  res.json({ success: true, video: newVid, videos: mindfulShortsDatabase });
});

// 3. Approve a proposed short video (Admin control)
app.post('/api/mindful-shorts/videos/:id/approve', (req, res) => {
  const { id } = req.params;
  const vid = mindfulShortsDatabase.find(v => v.id === id);
  if (!vid) {
    return res.status(404).json({ error: "Short video not found." });
  }
  vid.approved = true;
  res.json({ success: true, video: vid, videos: mindfulShortsDatabase });
});

// 4. Categorize a video (Admin/Teacher control)
app.post('/api/mindful-shorts/videos/:id/categorize', (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const vid = mindfulShortsDatabase.find(v => v.id === id);
  if (!vid) {
    return res.status(404).json({ error: "Short video not found." });
  }
  vid.category = category;
  res.json({ success: true, video: vid, videos: mindfulShortsDatabase });
});

// 5. Get student status (Handles midnight reset automatically)
app.get('/api/mindful-shorts/status', (req, res) => {
  const { studentId } = req.query;
  const sId = String(studentId || 'default-student');
  const stats = getOrInitStats(sId);
  res.json(stats);
});

// 6. Update student progress status (Synchronize with frontend)
app.post('/api/mindful-shorts/status', (req, res) => {
  const { studentId, studyTime, shortsWatchTime, videoProgress } = req.body;
  const sId = String(studentId || 'default-student');
  const stats = getOrInitStats(sId);

  if (studyTime !== undefined) {
    stats.studyTime = Math.max(stats.studyTime, studyTime);
    // Unlocked status triggers when study time >= 2 hours (2 * 3600 = 7200 seconds)
    stats.shortsAccess = stats.studyTime >= 7200;
  }
  if (shortsWatchTime !== undefined) {
    stats.shortsWatchTime = Math.min(stats.dailyLimit, Math.max(stats.shortsWatchTime, shortsWatchTime));
  }
  if (videoProgress !== undefined) {
    stats.videoProgress = { ...stats.videoProgress, ...videoProgress };
  }

  res.json(stats);
});

// --- VITE WEB MIDDLEWARE SETUP ---

async function startServer() {
  // In production, serve absolute built assets
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Mount Vite development middlewares dynamically for standard Node dev loops
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ABHIshiksha fullstack server running on http://localhost:${PORT}`);
  });
}

startServer();
