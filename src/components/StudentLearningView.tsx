import React, { useState, useEffect } from 'react';
import { Play, Video, BookOpen, Clock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import type { CurriculumChapter, ChapterVideo } from '../types';
import { CLASSES_DATA } from '../data';

interface StudentLearningViewProps {
  language: 'en' | 'hi';
  theme: 'light' | 'dark';
}

const StudentLearningView: React.FC<StudentLearningViewProps> = ({ language, theme }) => {
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const [chapters, setChapters] = useState<CurriculumChapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  
  const [videos, setVideos] = useState<ChapterVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ChapterVideo | null>(null);

  const classData = CLASSES_DATA[parseInt(selectedClass)];
  const availableSubjects = classData?.subjects?.length > 0 
    ? classData.subjects 
    : classData?.streams 
      ? Object.values(classData.streams).flat().filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
      : [];

  useEffect(() => {
    if (availableSubjects.length > 0) {
      const isValid = availableSubjects.some(s => s.nameEn === selectedSubject);
      if (!isValid) {
        setSelectedSubject(availableSubjects[0].nameEn);
      }
    }
  }, [selectedClass]);

  // Fetch Chapters to populate Book and Chapter dropdowns
  useEffect(() => {
    const fetchChapters = async () => {
      setLoadingChapters(true);
      try {
        const res = await fetch(`http://localhost:8000/api/curriculum/${selectedClass}/${selectedSubject}`);
        if (res.ok) {
          const data = await res.json();
          setChapters(data);
          
          const books = Array.from(new Set(data.map((c: any) => c.book_name).filter(b => b))) as string[];
          if (books.length > 0) {
            setSelectedBook(books[0]);
            const chaps = data.filter((c: any) => c.book_name === books[0]);
            if (chaps.length > 0) setSelectedChapter(chaps[0].chapter_name);
          } else {
            setSelectedBook('');
            if (data.length > 0) setSelectedChapter(data[0].chapter_name);
            else setSelectedChapter('');
          }
        }
      } catch (err) {
        console.error('Error fetching chapters', err);
      } finally {
        setLoadingChapters(false);
      }
    };
    fetchChapters();
  }, [selectedClass, selectedSubject]);

  // Fetch Videos when dropdowns change
  useEffect(() => {
    const fetchVideosForSelection = async () => {
      if (!selectedClass || !selectedSubject || !selectedChapter) {
        setVideos([]);
        return;
      }
      setLoadingVideos(true);
      setActiveVideo(null);
      try {
        const qs = new URLSearchParams({
          classGrade: selectedClass,
          subject: selectedSubject,
          chapter: selectedChapter,
          stream: selectedStream,
          book: selectedBook
        }).toString();
        const res = await fetch(`http://localhost:8000/api/videos?${qs}`);
        if (res.ok) {
          const data = await res.json();
          setVideos(data);
          if (data.length > 0) setActiveVideo(data[0]);
        }
      } catch (err) {
        console.error('Error fetching videos', err);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideosForSelection();
  }, [selectedClass, selectedSubject, selectedChapter, selectedBook, selectedStream]);

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

  const derivedBooks = Array.from(new Set(chapters.map((c: any) => c.book_name).filter(b => b))) as string[];
  const derivedChapters = (derivedBooks.length > 0 && selectedBook) ? chapters.filter(c => c.book_name === selectedBook) : chapters;

  return (
    <div className={`max-w-6xl mx-auto ${textColor}`}>
      <div className={`mb-6 p-6 rounded-3xl border ${borderColor} ${bgColor} shadow-sm`}>
        <h2 className="text-2xl font-black text-purple-600 flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6" /> 
          {language === 'hi' ? 'एनसीईआरटी वीडियो पोर्टल' : 'NCERT Video Portal'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>
              {language === 'hi' ? 'कक्षा चुनें' : 'Class'}
            </label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`w-full border ${borderColor} px-4 py-3 rounded-xl text-sm font-bold cursor-pointer outline-none ${isDark ? 'bg-[#1E293B] text-white' : 'bg-[#F8FBFF] text-slate-800'}`}
            >
              {[12,11,10,9,8,7,6,5,4,3,2,1].map(c => (
                <option key={c} value={c.toString()}>Class {c}</option>
              ))}
            </select>
          </div>
          
          {(selectedClass === '11' || selectedClass === '12') && (
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>
                Stream
              </label>
              <select 
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className={`w-full border ${borderColor} px-4 py-3 rounded-xl text-sm font-bold cursor-pointer outline-none ${isDark ? 'bg-[#1E293B] text-white' : 'bg-[#F8FBFF] text-slate-800'}`}
              >
                <option value="">Common</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Humanities">Humanities</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>
              {language === 'hi' ? 'विषय चुनें' : 'Subject'}
            </label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={`w-full border ${borderColor} px-4 py-3 rounded-xl text-sm font-bold cursor-pointer outline-none ${isDark ? 'bg-[#1E293B] text-white' : 'bg-[#F8FBFF] text-slate-800'}`}
            >
              {availableSubjects.map(subj => (
                <option key={subj.id} value={subj.nameEn}>
                  {language === 'hi' && subj.nameHi ? subj.nameHi : subj.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {derivedBooks.length > 0 && (
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Book</label>
              <select 
                value={selectedBook}
                onChange={(e) => {
                  setSelectedBook(e.target.value);
                  const newChaps = chapters.filter(c => c.book_name === e.target.value);
                  if (newChaps.length > 0) setSelectedChapter(newChaps[0].chapter_name);
                }}
                className={`w-full border ${borderColor} px-4 py-3 rounded-xl text-sm font-bold cursor-pointer outline-none ${isDark ? 'bg-[#1E293B] text-white' : 'bg-[#F8FBFF] text-slate-800'}`}
              >
                {derivedBooks.map(book => (
                  <option key={book} value={book}>{book}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${mutedText}`}>Chapter</label>
            <select 
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className={`w-full border ${borderColor} px-4 py-3 rounded-xl text-sm font-bold cursor-pointer outline-none ${isDark ? 'bg-[#1E293B] text-white' : 'bg-[#F8FBFF] text-slate-800'}`}
            >
              {derivedChapters.length === 0 && <option value="">No chapters found</option>}
              {derivedChapters.map(chap => (
                <option key={chap.id} value={chap.chapter_name}>
                  {chap.chapter_number}. {chap.chapter_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!selectedChapter ? (
        <div className={`p-10 text-center rounded-3xl border ${borderColor} ${bgColor}`}>
          <Video className={`w-12 h-12 mx-auto mb-4 ${mutedText} opacity-50`} />
          <p className={`font-bold ${mutedText}`}>Please select a chapter to view videos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player Area */}
          <div className={`lg:col-span-2 rounded-3xl border ${borderColor} ${bgColor} overflow-hidden shadow-sm flex flex-col`}>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-black bg-purple-100 text-purple-700 px-3 py-1.5 rounded">
                {selectedChapter}
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
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                  <Video className="w-12 h-12 mb-2 opacity-50" />
                  <p className="font-bold">{loadingVideos ? 'Loading Videos...' : 'Videos will be added soon.'}</p>
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
                 <p className="text-xs text-slate-500 text-center font-bold py-4">Videos will be added soon.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLearningView;
