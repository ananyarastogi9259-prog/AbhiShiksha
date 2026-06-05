import React, { useState, useEffect } from 'react';
import { Play, Video, BookOpen, Clock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import type { CurriculumChapter, ChapterVideo } from '../types';

interface StudentLearningViewProps {
  language: 'en' | 'hi';
  theme: 'light' | 'dark';
}

const StudentLearningView: React.FC<StudentLearningViewProps> = ({ language, theme }) => {
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [chapters, setChapters] = useState<CurriculumChapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  
  const [selectedChapter, setSelectedChapter] = useState<CurriculumChapter | null>(null);
  const [videos, setVideos] = useState<ChapterVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ChapterVideo | null>(null);

  // Fetch Chapters
  useEffect(() => {
    const fetchChapters = async () => {
      setLoadingChapters(true);
      setSelectedChapter(null);
      setVideos([]);
      setActiveVideo(null);
      try {
        const res = await fetch(`http://localhost:8000/api/curriculum/${selectedClass}/${selectedSubject}`);
        if (res.ok) {
          const data = await res.json();
          setChapters(data);
        }
      } catch (err) {
        console.error('Error fetching chapters', err);
      } finally {
        setLoadingChapters(false);
      }
    };
    fetchChapters();
  }, [selectedClass, selectedSubject]);

  // Fetch Videos for Chapter
  const handleSelectChapter = async (chap: CurriculumChapter) => {
    setSelectedChapter(chap);
    setLoadingVideos(true);
    setActiveVideo(null);
    try {
      const res = await fetch(`http://localhost:8000/api/videos/${chap.id}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
        if (data.length > 0) {
          setActiveVideo(data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching videos', err);
    } finally {
      setLoadingVideos(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : '';
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#0C1224]' : 'bg-white';
  const panelBg = isDark ? 'bg-[#121A2F]' : 'bg-slate-50';
  const borderColor = isDark ? 'border-[#1E293B]' : 'border-slate-200';
  const textColor = isDark ? 'text-slate-100' : 'text-slate-800';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`max-w-6xl mx-auto ${textColor}`}>
      <div className={`mb-6 p-6 rounded-3xl border ${borderColor} ${bgColor} shadow-sm`}>
        <h2 className="text-2xl font-black text-purple-600 flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6" /> 
          {language === 'hi' ? 'एनसीईआरटी वीडियो पोर्टल' : 'NCERT Video Portal'}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>
              {language === 'hi' ? 'कक्षा चुनें' : 'Select Class'}
            </label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`w-full border ${borderColor} px-4 py-3 rounded-xl text-sm font-bold cursor-pointer outline-none ${isDark ? 'bg-[#1E293B] text-white' : 'bg-[#F8FBFF] text-slate-800'}`}
            >
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>
              {language === 'hi' ? 'विषय चुनें' : 'Select Subject'}
            </label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={`w-full border ${borderColor} px-4 py-3 rounded-xl text-sm font-bold cursor-pointer outline-none ${isDark ? 'bg-[#1E293B] text-white' : 'bg-[#F8FBFF] text-slate-800'}`}
            >
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="EVS">EVS (Class 3-5)</option>
              <option value="Science">Science (Class 6-10)</option>
              <option value="Social Science">Social Science (Class 6-10)</option>
              <option value="Physics">Physics (Class 11/12)</option>
              <option value="Chemistry">Chemistry (Class 11/12)</option>
              <option value="Biology">Biology (Class 11/12)</option>
            </select>
          </div>
        </div>
      </div>

      {!selectedChapter ? (
        <div className={`p-6 rounded-3xl border ${borderColor} ${bgColor}`}>
          <h3 className={`text-lg font-bold mb-4 ${textColor}`}>
            {language === 'hi' ? 'अध्याय (Chapters)' : 'Chapters'}
          </h3>
          {loadingChapters ? (
            <div className={`py-10 text-center font-bold ${mutedText}`}>Loading Chapters...</div>
          ) : chapters.length === 0 ? (
            <div className={`py-10 text-center font-bold ${mutedText}`}>No chapters found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapters.map(chap => (
                <div 
                  key={chap.id} 
                  onClick={() => handleSelectChapter(chap)}
                  className={`border ${borderColor} rounded-2xl p-5 ${panelBg} cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group`}
                >
                  <span className="text-[10px] font-black text-purple-600 bg-purple-100 px-2 py-1 rounded tracking-wider uppercase">
                    Chapter {chap.chapter_number}
                  </span>
                  <h4 className={`text-base font-black mt-3 group-hover:text-purple-600 transition-colors ${textColor}`}>
                    {chap.chapter_name}
                  </h4>
                  {chap.book_name && (
                    <p className={`text-xs font-bold mt-1 ${mutedText}`}>{chap.book_name}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-purple-600">
                    <span className="flex items-center gap-1"><Play className="w-3 h-3"/> View Videos</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player Area */}
          <div className={`lg:col-span-2 rounded-3xl border ${borderColor} ${bgColor} overflow-hidden shadow-sm flex flex-col`}>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <button 
                onClick={() => setSelectedChapter(null)}
                className={`flex items-center gap-2 text-sm font-bold ${mutedText} hover:text-purple-600`}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Chapters
              </button>
              <span className="text-xs font-black bg-purple-100 text-purple-700 px-2 py-1 rounded">
                CH {selectedChapter.chapter_number}: {selectedChapter.chapter_name}
              </span>
            </div>
            
            <div className="aspect-video bg-black relative w-full">
              {activeVideo ? (
                <iframe 
                  src={getYoutubeEmbedUrl(activeVideo.videoUrl)} 
                  className="w-full h-full absolute inset-0"
                  allowFullScreen
                  title={activeVideo.videoTitle}
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <Video className="w-12 h-12 mb-2 opacity-50" />
                  <p className="font-bold">{loadingVideos ? 'Loading Videos...' : 'No videos available for this chapter.'}</p>
                </div>
              )}
            </div>
            
            {activeVideo && (
              <div className="p-6">
                <h3 className={`text-xl font-black ${textColor}`}>{activeVideo.videoTitle}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <span className={`flex items-center gap-1 text-sm font-bold ${mutedText}`}>
                    <User className="w-4 h-4" /> {activeVideo.teacherName || 'Expert Tutor'}
                  </span>
                  <span className={`flex items-center gap-1 text-sm font-bold ${mutedText}`}>
                    <Clock className="w-4 h-4" /> {activeVideo.duration || 'Full Lesson'}
                  </span>
                  <span className={`text-xs font-black px-2 py-1 rounded uppercase ${
                    activeVideo.videoType === 'explanation' ? 'bg-blue-100 text-blue-700' :
                    activeVideo.videoType === 'revision' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {activeVideo.videoType}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Playlist Sidebar */}
          <div className={`rounded-3xl border ${borderColor} ${bgColor} p-5 h-fit shadow-sm`}>
            <h4 className={`text-sm font-black uppercase tracking-wider mb-4 ${mutedText}`}>
              Chapter Videos ({videos.length})
            </h4>
            
            <div className="space-y-3">
              {videos.map(vid => (
                <div 
                  key={vid.id}
                  onClick={() => setActiveVideo(vid)}
                  className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                    activeVideo?.id === vid.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : `${borderColor} hover:border-purple-300 ${panelBg}`
                  }`}
                >
                  <div className="w-20 h-12 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden">
                    <img src={`https://img.youtube.com/vi/${getYoutubeEmbedUrl(vid.videoUrl).split('/').pop()?.split('?')[0]}/mqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                    <Play className="w-5 h-5 text-white z-10" fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold line-clamp-2 ${activeVideo?.id === vid.id ? 'text-purple-900' : textColor}`}>
                      {vid.videoTitle}
                    </p>
                    <p className="text-xs font-bold text-slate-500 mt-1">{vid.duration}</p>
                  </div>
                </div>
              ))}
              {!loadingVideos && videos.length === 0 && (
                 <p className="text-xs text-slate-500 text-center font-bold py-4">Check back later for new videos!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLearningView;
