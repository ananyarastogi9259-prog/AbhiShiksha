import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, UserCheck, ShieldAlert, Settings,
  Clock, Plus, Filter, TrendingUp, Video, FileText, Zap, Megaphone, ArrowLeft, Trash2, Edit2, Check, X, Play, Sparkles
} from 'lucide-react';
import type { Course, CurriculumChapter, ChapterVideo } from '../types';
import { CLASSES_DATA } from '../data';

interface AdminDashboardProps {
  language?: 'en' | 'hi';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content-menu' | 'add-motivation' | 'add-course' | 'manage-courses' | 'curriculum-management' | 'user-management' | 'system-settings' | 'video-management' | 'announcements'>('overview');
  
  // Curriculum State
  const [curriculumClass, setCurriculumClass] = useState('10');
  const [curriculumSubject, setCurriculumSubject] = useState('Science');
  const [chapters, setChapters] = useState<CurriculumChapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  
  const classData = CLASSES_DATA[parseInt(curriculumClass)];
  const availableSubjects = classData?.subjects?.length > 0 
    ? classData.subjects 
    : classData?.streams 
      ? Object.values(classData.streams).flat().filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
      : [];

  useEffect(() => {
    if (availableSubjects.length > 0) {
      const isValid = availableSubjects.some(s => s.nameEn === curriculumSubject);
      if (!isValid) {
        setCurriculumSubject(availableSubjects[0].nameEn);
      }
    }
  }, [curriculumClass]);
  
  // Curriculum Edit State
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editPdfUrl, setEditPdfUrl] = useState('');
  const [editQuiz, setEditQuiz] = useState(false);
  const [editAnimatedVideoUrl, setEditAnimatedVideoUrl] = useState('');
  const [editInteractiveActivityUrl, setEditInteractiveActivityUrl] = useState('');

  const fetchCurriculum = async () => {
    setLoadingChapters(true);
    try {
      const res = await fetch(`http://localhost:8000/api/curriculum/${curriculumClass}/${curriculumSubject}`);
      if (res.ok) {
        const data = await res.json();
        setChapters(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChapters(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'curriculum-management') {
      fetchCurriculum();
    }
  }, [activeTab, curriculumClass, curriculumSubject]);

  const handleUpdateChapter = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/curriculum/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: editVideoUrl,
          notesPdfUrl: editPdfUrl,
          quiz_available: editQuiz,
          animatedVideoUrl: editAnimatedVideoUrl,
          interactiveActivityUrl: editInteractiveActivityUrl
        })
      });
      if (res.ok) {
        setEditingChapterId(null);
        fetchCurriculum();
      } else {
        alert('Failed to update chapter');
      }
    } catch(err) {
      console.error(err);
    }
  };

  const startEditingChapter = (chap: CurriculumChapter) => {
    setEditingChapterId(chap.id);
    setEditVideoUrl(chap.videoUrl);
    setEditPdfUrl(chap.notesPdfUrl);
    setEditQuiz(chap.quiz_available);
    setEditAnimatedVideoUrl(chap.animatedVideoUrl || '');
    setEditInteractiveActivityUrl(chap.interactiveActivityUrl || '');
    fetchChapterVideos(chap.id);
  };

  // Video Management State
  const [videoClass, setVideoClass] = useState('10');
  const [videoStream, setVideoStream] = useState('');
  const [videoSubject, setVideoSubject] = useState('Science');
  const [videoBook, setVideoBook] = useState('');
  const [videoChapter, setVideoChapter] = useState('');
  
  const [videoChapters, setVideoChapters] = useState<CurriculumChapter[]>([]);
  const [loadingVideoChapters, setLoadingVideoChapters] = useState(false);

  useEffect(() => {
    if (activeTab === 'video-management') {
      const fetchVideoChaptersData = async () => {
        if (!videoClass || !videoSubject) return;
        setLoadingVideoChapters(true);
        try {
          const res = await fetch(`http://localhost:8000/api/curriculum/${videoClass}/${videoSubject}`);
          if (res.ok) {
            const data = await res.json();
            setVideoChapters(data);
            
            // Auto-select book and chapter if possible
            const books = Array.from(new Set(data.map((c: any) => c.book_name).filter(b => b))) as string[];
            if (books.length > 0) {
              setVideoBook(books[0]);
              const chaps = data.filter((c: any) => c.book_name === books[0]);
              if (chaps.length > 0) setVideoChapter(chaps[0].chapter_name);
            } else {
              setVideoBook('');
              if (data.length > 0) setVideoChapter(data[0].chapter_name);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingVideoChapters(false);
        }
      };
      fetchVideoChaptersData();
    }
  }, [activeTab, videoClass, videoSubject]);

  useEffect(() => {
    if (activeTab === 'video-management' && videoClass && videoSubject && videoChapter) {
      fetchChapterVideosStr();
    }
  }, [activeTab, videoClass, videoSubject, videoChapter, videoBook, videoStream]);

  const [chapterVideos, setChapterVideos] = useState<ChapterVideo[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTeacher, setNewVideoTeacher] = useState('');
  const [newVideoLanguage, setNewVideoLanguage] = useState('en');
  const [newVideoDuration, setNewVideoDuration] = useState('');
  const [newVideoType, setNewVideoType] = useState('explanation');

  const fetchChapterVideosStr = async () => {
    if (!videoClass || !videoSubject || !videoChapter) return;
    try {
      const qs = new URLSearchParams({
        classGrade: videoClass,
        subject: videoSubject,
        chapter: videoChapter,
        stream: videoStream,
        book: videoBook
      }).toString();
      const res = await fetch(`http://localhost:8000/api/videos?${qs}`);
      if (res.ok) {
        const data = await res.json();
        setChapterVideos(data);
      }
    } catch (err) {
      console.error('Error fetching videos', err);
    }
  };

  const handleAddVideo = async () => {
    if (!videoClass || !videoSubject || !videoChapter || !newVideoTitle || !newVideoUrl) return;
    try {
      const res = await fetch(`http://localhost:8000/api/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classGrade: videoClass,
          stream: videoStream,
          subject: videoSubject,
          book: videoBook,
          chapter: videoChapter,
          videoTitle: newVideoTitle,
          videoUrl: newVideoUrl,
          teacherName: newVideoTeacher,
          language: newVideoLanguage,
          duration: newVideoDuration,
          videoType: newVideoType
        })
      });
      if (res.ok) {
        fetchChapterVideosStr();
        setNewVideoTitle('');
        setNewVideoUrl('');
        setNewVideoTeacher('');
        setNewVideoDuration('');
      } else {
        alert('Failed to add video');
      }
    } catch (err) {
      console.error('Error adding video', err);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/videos/${videoId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchChapterVideosStr();
      }
    } catch (err) {
      console.error('Error deleting video', err);
    }
  };

  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const handleAutoFetchVideos = async () => {
    if (!editingChapterId) {
      alert('Please select a chapter first.');
      return;
    }
    setIsAutoFetching(true);
    try {
      const res = await fetch(`http://localhost:8000/api/videos/autofetch/${editingChapterId}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.inserted_count > 0) {
          alert('Videos fetched successfully');
          fetchChapterVideos(editingChapterId);
        } else {
          alert('Failed to fetch videos');
        }
      } else {
        alert('Failed to fetch videos');
      }
    } catch (err) {
      console.error('Error auto-fetching videos', err);
      alert('Failed to fetch videos');
    } finally {
      setIsAutoFetching(false);
    }
  };

  
  // Course State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  // Form State for Add/Edit Course
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseClass, setCourseClass] = useState('all');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [courseStatus, setCourseStatus] = useState('active');

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await fetch('http://localhost:8000/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage-courses') {
      fetchCourses();
    }
  }, [activeTab]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseTitle,
          description: courseDescription,
          category: courseCategory,
          class_grade: courseClass,
          thumbnail: courseThumbnail,
          status: courseStatus
        })
      });
      if (res.ok) {
        alert("Course created successfully!");
        setCourseTitle('');
        setCourseDescription('');
        setCourseCategory('');
        setCourseClass('all');
        setCourseThumbnail('');
        setCourseStatus('active');
        setActiveTab('manage-courses');
      } else {
        alert("Failed to create course");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== id));
      } else {
        alert("Failed to delete course");
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  // User Management State
  const [dummyUsers, setDummyUsers] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'student', joinDate: '2023-08-15', status: 'active' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', role: 'parent', joinDate: '2023-09-02', status: 'active' },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com', role: 'student', joinDate: '2023-10-11', status: 'inactive' },
    { id: 4, name: 'Neha Gupta', email: 'neha@example.com', role: 'admin', joinDate: '2023-01-05', status: 'active' },
    { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', role: 'student', joinDate: '2023-11-20', status: 'active' },
  ]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const filteredUsers = userRoleFilter === 'all' ? dummyUsers : dummyUsers.filter(u => u.role === userRoleFilter);

  // Dummy Data
  const metrics = {
    totalStudents: '1,420',
    totalParents: '845',
    totalAdmins: '12',
    totalCourses: '42',
    totalChapters: '315',
    totalVideos: '1,894'
  };

  const recentActivity = [
    { id: 1, text: 'New Teacher Account Registered', time: '10 mins ago', type: 'user' },
    { id: 2, text: 'Science Course Material Updated', time: '2 hours ago', type: 'course' },
    { id: 3, text: '15 New Students Joined', time: 'Yesterday', type: 'student' },
    { id: 4, text: 'System Backup Completed', time: '2 days ago', type: 'system' }
  ];

  const renderOverview = () => (
    <>
      {/* Hero Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full pointer-events-none opacity-60"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-[#0038FF] flex items-center gap-3">
             🛠️ Admin Dashboard
          </h2>
          <p className="text-slate-600 mt-2 font-medium">Manage curriculum, users, videos, content, and system settings.</p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 bg-slate-50 p-3 pr-6 rounded-2xl border border-slate-100">
           <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0038FF] to-blue-400 flex items-center justify-center shadow-md">
              <UserCheck className="w-6 h-6 text-white" />
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <h4 className="font-bold text-slate-800">Super Admin</h4>
                 <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    ADMIN ACCESS
                 </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">admin@abhishiksha.com</p>
           </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="mb-10">
         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">System Overview</h3>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
               <Users className="w-5 h-5 text-indigo-500 mb-2" />
               <h4 className="text-2xl font-black text-slate-800">{metrics.totalStudents}</h4>
               <p className="text-xs font-bold text-slate-400 uppercase mt-1">Students</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
               <UserCheck className="w-5 h-5 text-purple-500 mb-2" />
               <h4 className="text-2xl font-black text-slate-800">{metrics.totalParents}</h4>
               <p className="text-xs font-bold text-slate-400 uppercase mt-1">Parents</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
               <ShieldAlert className="w-5 h-5 text-red-500 mb-2" />
               <h4 className="text-2xl font-black text-slate-800">{metrics.totalAdmins}</h4>
               <p className="text-xs font-bold text-slate-400 uppercase mt-1">Admins</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
               <BookOpen className="w-5 h-5 text-blue-500 mb-2" />
               <h4 className="text-2xl font-black text-slate-800">{metrics.totalCourses}</h4>
               <p className="text-xs font-bold text-slate-400 uppercase mt-1">Courses</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
               <FileText className="w-5 h-5 text-emerald-500 mb-2" />
               <h4 className="text-2xl font-black text-slate-800">{metrics.totalChapters}</h4>
               <p className="text-xs font-bold text-slate-400 uppercase mt-1">Chapters</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
               <Play className="w-5 h-5 text-amber-500 mb-2" />
               <h4 className="text-2xl font-black text-slate-800">{metrics.totalVideos}</h4>
               <p className="text-xs font-bold text-slate-400 uppercase mt-1">Videos</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        <button 
          onClick={() => setActiveTab('content-menu')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-[#0038FF] hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer h-48 justify-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0038FF] mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">📚 Content Management</h3>
        </button>

        <button 
          onClick={() => setActiveTab('curriculum-management')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer h-48 justify-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">📖 Curriculum Management</h3>
        </button>

        <button 
          onClick={() => setActiveTab('video-management')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-red-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer h-48 justify-center relative overflow-hidden">
          <div className="absolute top-3 right-3 text-red-500 animate-pulse">
             <Sparkles className="w-4 h-4" />
          </div>
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">🎥 Video Management</h3>
        </button>

        <button 
          onClick={() => setActiveTab('user-management')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer h-48 justify-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">👥 User Management</h3>
        </button>
        
        <button 
          onClick={() => setActiveTab('system-settings')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-slate-800 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer h-48 justify-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mb-4 group-hover:scale-110 transition-transform">
            <Settings className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">⚙️ System Settings</h3>
        </button>
        
        <button 
          onClick={() => setActiveTab('add-motivation')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer h-48 justify-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">🎯 Motivation Shorts</h3>
        </button>
        
        <button 
          onClick={() => setActiveTab('announcements')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer h-48 justify-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
            <Megaphone className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">📢 Announcements</h3>
        </button>

      </div>
    </>
  );

  const renderContentMenu = () => (
    <>
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => setActiveTab('overview')}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#0038FF]">Content Management</h2>
          <p className="text-sm text-slate-600 mt-1">Select the type of content you want to create or manage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveTab('add-course')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-[#0038FF] hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0038FF] mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Add Course</h3>
          <p className="text-xs text-slate-500 mt-2">Create a new subject curriculum.</p>
        </button>

        <button 
          onClick={() => setActiveTab('curriculum-management')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Manage Curriculum</h3>
          <p className="text-xs text-slate-500 mt-2">Manage NCERT chapters and resources.</p>
        </button>

        <button className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Add Study Material</h3>
          <p className="text-xs text-slate-500 mt-2">Upload PDFs, notes, or quiz files.</p>
        </button>

        <button 
          onClick={() => setActiveTab('add-motivation')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full blur-2xl opacity-50"></div>
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Add Motivation Shorts</h3>
          <p className="text-xs text-slate-500 mt-2">Publish engaging vertical short videos.</p>
        </button>

        <button className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
            <Megaphone className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Add Announcement</h3>
          <p className="text-xs text-slate-500 mt-2">Broadcast a message to all users.</p>
        </button>
      </div>
    </>
  );

  const renderAddMotivation = () => (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('content-menu')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-[#0038FF] flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" /> Motivation Shorts
            </h2>
            <p className="text-sm text-slate-600 mt-1">Publish a new short video for student feeds.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-6 md:p-8 max-w-4xl mx-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video Title</label>
            <input 
              type="text" 
              placeholder="e.g. How to study for 10 hours effectively"
              className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea 
              rows={4}
              placeholder="Briefly describe what this short is about..."
              className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 placeholder-slate-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video URL (CDN / YouTube)</label>
              <input 
                type="text" 
                placeholder="https://..."
                className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration (MM:SS)</label>
              <input 
                type="text" 
                placeholder="02:45"
                className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <select className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 cursor-pointer">
                <option value="">Select Category...</option>
                <option value="exam-prep">Exam Preparation</option>
                <option value="life-skills">Life Skills & Discipline</option>
                <option value="success-stories">Success Stories</option>
                <option value="science-facts">Fascinating Science Facts</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Class / Grade</label>
              <select className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 cursor-pointer">
                <option value="all">All Classes</option>
                <option value="middle">Middle School (6-8)</option>
                <option value="high">High School (9-10)</option>
                <option value="senior">Senior Secondary (11-12)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Visibility Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 flex-1">
                <input type="radio" name="status" defaultChecked className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                <span className="text-sm font-bold text-emerald-800">Active (Visible)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 flex-1">
                <input type="radio" name="status" className="w-4 h-4 text-slate-600 focus:ring-slate-500 border-gray-300" />
                <span className="text-sm font-bold text-slate-700">Inactive (Draft)</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setActiveTab('content-menu')}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0038FF] to-[#27D8FF] hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Publish Short
            </button>
          </div>

        </form>
      </div>
    </>
  );

  const renderManageCourses = () => (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-[#0038FF] flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> Manage Courses
            </h2>
            <p className="text-sm text-slate-600 mt-1">View and manage all existing courses.</p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('add-course')}
          className="bg-[#0038FF] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4"/> New Course
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-6 md:p-8 max-w-6xl mx-auto">
        {loadingCourses ? (
          <p className="text-center text-slate-500 font-bold py-10">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-slate-500 font-bold py-10">No courses found. Add a new one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="border border-slate-200 rounded-2xl p-4 flex flex-col hover:border-[#0038FF] transition-colors relative group bg-slate-50">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => alert("Edit not fully implemented yet")} className="p-2 bg-white rounded-lg shadow text-[#0038FF] hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteCourse(course.id)} className="p-2 bg-white rounded-lg shadow text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded-xl mb-4 bg-slate-200" />
                ) : (
                  <div className="w-full h-32 bg-slate-200 rounded-xl mb-4 flex items-center justify-center text-slate-400 font-bold flex-shrink-0">No Image</div>
                )}
                <span className="text-xs font-bold text-[#0038FF] bg-blue-100 px-2 py-1 rounded w-max mb-2">{course.category} | {course.class_grade}</span>
                <h4 className="text-lg font-black text-slate-800 mb-1">{course.title}</h4>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow">{course.description}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-200">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${course.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    {course.status === 'active' ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderAddCourse = () => (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('content-menu')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-[#0038FF] flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> Create New Course
            </h2>
            <p className="text-sm text-slate-600 mt-1">Publish a new subject curriculum.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-6 md:p-8 max-w-4xl mx-auto">
        <form className="space-y-6" onSubmit={handleCreateCourse}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Title</label>
            <input 
              required
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              type="text" 
              placeholder="e.g. Advanced Physics for Class 12"
              className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea 
              required
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              rows={4}
              placeholder="Briefly describe what this course covers..."
              className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 placeholder-slate-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thumbnail URL</label>
              <input 
                value={courseThumbnail}
                onChange={(e) => setCourseThumbnail(e.target.value)}
                type="text" 
                placeholder="https://..."
                className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <input
                required
                value={courseCategory}
                onChange={(e) => setCourseCategory(e.target.value)}
                type="text"
                placeholder="e.g. Science, Mathematics..."
                className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Class / Grade</label>
            <select 
              value={courseClass}
              onChange={(e) => setCourseClass(e.target.value)}
              className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#0038FF] font-medium text-slate-800 cursor-pointer"
            >
              <option value="all">All Classes</option>
              <option value="middle">Middle School (6-8)</option>
              <option value="high">High School (9-10)</option>
              <option value="senior">Senior Secondary (11-12)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Visibility Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 flex-1">
                <input 
                  type="radio" 
                  name="status" 
                  checked={courseStatus === 'active'}
                  onChange={() => setCourseStatus('active')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" 
                />
                <span className="text-sm font-bold text-emerald-800">Active (Visible)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 flex-1">
                <input 
                  type="radio" 
                  name="status" 
                  checked={courseStatus === 'draft'}
                  onChange={() => setCourseStatus('draft')}
                  className="w-4 h-4 text-slate-600 focus:ring-slate-500 border-gray-300" 
                />
                <span className="text-sm font-bold text-slate-700">Inactive (Draft)</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setActiveTab('content-menu')}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0038FF] to-[#27D8FF] hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Publish Course
            </button>
          </div>

        </form>
      </div>
    </>
  );

  const renderCurriculumManagement = () => (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('content-menu')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-purple-600 flex items-center gap-2">
              <Video className="w-6 h-6" /> NCERT Curriculum
            </h2>
            <p className="text-sm text-slate-600 mt-1">Manage chapters and resources for official curriculum.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Class</label>
            <select 
              value={curriculumClass}
              onChange={(e) => setCurriculumClass(e.target.value)}
              className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 cursor-pointer"
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
            <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
            <select 
              value={curriculumSubject}
              onChange={(e) => setCurriculumSubject(e.target.value)}
              className="w-full bg-[#F8FBFF] border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 cursor-pointer"
            >
              {availableSubjects.map(subj => (
                <option key={subj.id} value={subj.nameEn}>
                  {language === 'hi' && subj.nameHi ? subj.nameHi : subj.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingChapters ? (
           <p className="text-center font-bold text-slate-500 py-10">Loading Chapters...</p>
        ) : chapters.length === 0 ? (
           <p className="text-center font-bold text-slate-500 py-10">No chapters found for this selection.</p>
        ) : (
          <div className="space-y-4">
            {chapters.map(chap => (
              <div key={chap.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                  <div>
                    <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">Chapter {chap.chapter_number}</span>
                    <h4 className="text-lg font-black text-slate-800 mt-2">{chap.chapter_name}</h4>
                  </div>
                  {editingChapterId === chap.id ? (
                     <div className="flex items-center gap-2">
                        <button onClick={() => setEditingChapterId(null)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg text-sm cursor-pointer hover:bg-slate-300">Cancel</button>
                        <button onClick={() => handleUpdateChapter(chap.id)} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm cursor-pointer hover:bg-purple-700 shadow">Save</button>
                     </div>
                  ) : (
                     <button onClick={() => startEditingChapter(chap)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm text-sm hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                       <Edit2 className="w-4 h-4" /> Edit Resources
                     </button>
                  )}
                </div>
                
                {editingChapterId === chap.id ? (
                  <>
                    <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500">Video URL</label>
                      <input type="text" value={editVideoUrl} onChange={(e) => setEditVideoUrl(e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="https://youtube.com/..."/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500">Notes PDF URL</label>
                      <input type="text" value={editPdfUrl} onChange={(e) => setEditPdfUrl(e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="https://..."/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-purple-500 flex items-center gap-1">Animated Video URL <span className="text-[10px] bg-purple-100 text-purple-600 px-1 rounded">Primary</span></label>
                      <input type="text" value={editAnimatedVideoUrl} onChange={(e) => setEditAnimatedVideoUrl(e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="Optional animation link..."/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-purple-500 flex items-center gap-1">Interactive Activity URL <span className="text-[10px] bg-purple-100 text-purple-600 px-1 rounded">Primary</span></label>
                      <input type="text" value={editInteractiveActivityUrl} onChange={(e) => setEditInteractiveActivityUrl(e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-500" placeholder="Optional activity link..."/>
                    </div>
                    <div className="space-y-2 md:col-span-2 flex items-center gap-2 mt-2">
                      <input type="checkbox" checked={editQuiz} onChange={(e) => setEditQuiz(e.target.checked)} className="w-4 h-4 rounded text-purple-600 border-gray-300 cursor-pointer" id={`quiz-${chap.id}`}/>
                      <label htmlFor={`quiz-${chap.id}`} className="text-sm font-bold text-slate-700 cursor-pointer">Quiz Available</label>
                    </div>
                  </div>
                  
                  {/* Real Video Management Section */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-600" /> Manage Videos ({chapterVideos.length})
                      </h5>
                    </div>
                    
                    {chapterVideos.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {chapterVideos.map(video => (
                          <div key={video.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <Play className="w-4 h-4 fill-current" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{video.videoTitle}</p>
                                <p className="text-xs font-bold text-slate-500">
                                  {video.teacherName} • {video.language.toUpperCase()} • {video.videoType}
                                </p>
                              </div>
                            </div>
                            <button onClick={() => handleDeleteVideo(video.id)} className="text-red-500 hover:text-red-700 p-2 cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="bg-slate-100 p-4 rounded-xl space-y-3">
                      <h6 className="text-xs font-bold text-slate-600 uppercase">Add New Video</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input type="text" value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} placeholder="Video Title" className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-purple-500 outline-none"/>
                        <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="YouTube URL" className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-purple-500 outline-none"/>
                        <input type="text" value={newVideoTeacher} onChange={(e) => setNewVideoTeacher(e.target.value)} placeholder="Teacher / Channel Name" className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-purple-500 outline-none"/>
                        <div className="flex gap-2">
                          <select value={newVideoLanguage} onChange={(e) => setNewVideoLanguage(e.target.value)} className="w-1/2 bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-purple-500 outline-none cursor-pointer">
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                          </select>
                          <select value={newVideoType} onChange={(e) => setNewVideoType(e.target.value)} className="w-1/2 bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-purple-500 outline-none cursor-pointer">
                            <option value="explanation">Explanation</option>
                            <option value="revision">Revision</option>
                            <option value="practice">Practice</option>
                          </select>
                        </div>
                      </div>
                      <button onClick={handleAddVideo} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg text-sm w-full hover:bg-slate-900 cursor-pointer">
                        Add Video to Chapter
                      </button>
                    </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {chap.videoUrl ? (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded flex items-center gap-1"><Check className="w-3 h-3"/> Video Attached</span>
                    ) : (
                      <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded">No Video</span>
                    )}
                    {chap.notesPdfUrl ? (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded flex items-center gap-1"><Check className="w-3 h-3"/> Notes Attached</span>
                    ) : (
                      <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded">No Notes</span>
                    )}
                    {chap.quiz_available ? (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded flex items-center gap-1"><Check className="w-3 h-3"/> Quiz Active</span>
                    ) : (
                      <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded">No Quiz</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderUserManagement = () => (
    <>
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => setActiveTab('overview')}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#0038FF]">User Management</h2>
          <p className="text-sm text-slate-600 mt-1">Manage students, parents, and administrative accounts.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Total Users</h4>
            <p className="text-3xl font-black text-slate-800 mt-2">1,248</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Students</h4>
            <p className="text-3xl font-black text-slate-800 mt-2">842</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Parents</h4>
            <p className="text-3xl font-black text-slate-800 mt-2">395</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Admins</h4>
            <p className="text-3xl font-black text-slate-800 mt-2">11</p>
         </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-bold text-slate-800">User Directory</h3>
           <select 
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 outline-none cursor-pointer"
           >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="parent">Parents</option>
              <option value="admin">Admins</option>
           </select>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Join Date</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-800">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-700' :
                      user.role === 'parent' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-[#0038FF]'
                    }`}>{user.role}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{user.joinDate}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>{user.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-slate-400 hover:text-[#0038FF] transition-colors p-1" title="Edit User"><Edit2 className="w-4 h-4"/></button>
                    <button className="text-slate-400 hover:text-red-500 transition-colors p-1 ml-2" title="Delete User"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
             <div className="text-center py-8 text-slate-500 font-medium">No users found for this role.</div>
          )}
        </div>
      </div>
    </>
  );

  const [sysAppName, setSysAppName] = useState(() => localStorage.getItem('sysAppName') || 'AbhiShiksha');
  const [sysLang, setSysLang] = useState(() => localStorage.getItem('sysLang') || 'en');
  const [sysDark, setSysDark] = useState(() => localStorage.getItem('sysDark') === 'true');
  const [sysNotif, setSysNotif] = useState(() => localStorage.getItem('sysNotif') !== 'false');
  
  const handleSaveSettings = () => {
     localStorage.setItem('sysAppName', sysAppName);
     localStorage.setItem('sysLang', sysLang);
     localStorage.setItem('sysDark', sysDark.toString());
     localStorage.setItem('sysNotif', sysNotif.toString());
     alert('System settings saved successfully!');
  };

  const renderSystemSettings = () => (
    <>
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => setActiveTab('overview')}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#0038FF]">System Settings</h2>
          <p className="text-sm text-slate-600 mt-1">Configure global application parameters.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 max-w-2xl">
         <div className="space-y-6">
            <div>
               <label className="text-sm font-bold text-slate-700 block mb-2">Application Name</label>
               <input type="text" value={sysAppName} onChange={e => setSysAppName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold focus:border-[#0038FF] outline-none" />
            </div>
            <div>
               <label className="text-sm font-bold text-slate-700 block mb-2">Default Language</label>
               <select value={sysLang} onChange={e => setSysLang(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold focus:border-[#0038FF] outline-none cursor-pointer">
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
               </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
               <div>
                  <h4 className="text-sm font-bold text-slate-800">Dark Mode Support</h4>
                  <p className="text-xs text-slate-500 mt-1">Allow users to toggle dark mode</p>
               </div>
               <button onClick={() => setSysDark(!sysDark)} className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${sysDark ? 'bg-[#0038FF]' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${sysDark ? 'left-7' : 'left-1'}`} />
               </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
               <div>
                  <h4 className="text-sm font-bold text-slate-800">Push Notifications</h4>
                  <p className="text-xs text-slate-500 mt-1">Enable system-wide announcements</p>
               </div>
               <button onClick={() => setSysNotif(!sysNotif)} className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${sysNotif ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${sysNotif ? 'left-7' : 'left-1'}`} />
               </button>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
               <button onClick={handleSaveSettings} className="bg-[#0038FF] hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl cursor-pointer shadow-md w-full sm:w-auto">
                  Save Settings
               </button>
            </div>
         </div>
      </div>
    </>
  );

  const renderVideoManagement = () => {
    const classDataForVideo = CLASSES_DATA[parseInt(videoClass)];
    const availableSubjectsForVideo = classDataForVideo?.subjects?.length > 0 
      ? classDataForVideo.subjects 
      : classDataForVideo?.streams 
        ? Object.values(classDataForVideo.streams).flat().filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
        : [];
        
    const videoBooks = Array.from(new Set(videoChapters.map((c: any) => c.book_name).filter(b => b))) as string[];
    const chaptersForBook = (videoBooks.length > 0 && videoBook) ? videoChapters.filter(c => c.book_name === videoBook) : videoChapters;

    return (
      <>
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-red-500 flex items-center gap-2">
               <Video className="w-6 h-6" /> Video Management
            </h2>
            <p className="text-sm text-slate-600 mt-1">Directly manage videos by selecting Class, Stream, Subject, Book, and Chapter.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Class / Grade</label>
              <select 
                value={videoClass} 
                onChange={(e) => setVideoClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {[12,11,10,9,8,7,6,5,4,3,2,1].map(c => (
                  <option key={c} value={c.toString()}>Class {c}</option>
                ))}
              </select>
            </div>
            
            {(videoClass === '11' || videoClass === '12') && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Stream (Optional)</label>
                <select 
                  value={videoStream} 
                  onChange={(e) => setVideoStream(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="">None / Common</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Humanities">Humanities</option>
                </select>
              </div>
            )}
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Subject</label>
              <select 
                value={videoSubject} 
                onChange={(e) => setVideoSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {availableSubjectsForVideo.map(subj => (
                  <option key={subj.id} value={subj.nameEn}>
                    {language === 'hi' && subj.nameHi ? subj.nameHi : subj.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoBooks.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Book</label>
                <select 
                  value={videoBook} 
                  onChange={(e) => {
                    setVideoBook(e.target.value);
                    const newChaps = videoChapters.filter(c => c.book_name === e.target.value);
                    if (newChaps.length > 0) setVideoChapter(newChaps[0].chapter_name);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {videoBooks.map(book => (
                    <option key={book} value={book}>{book}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Chapter</label>
              <select 
                value={videoChapter} 
                onChange={(e) => setVideoChapter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {chaptersForBook.length === 0 && <option value="">No chapters found</option>}
                {chaptersForBook.map(chap => (
                  <option key={chap.id} value={chap.chapter_name}>
                    {chap.chapter_number}. {chap.chapter_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {videoChapter && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 border-t-4 border-t-red-500">
             <div className="flex justify-between items-center mb-6">
                <h5 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-500" /> Chapter Playlist ({chapterVideos.length})
                </h5>
             </div>
              
             {chapterVideos.length > 0 && (
                <div className="space-y-3 mb-8">
                  {chapterVideos.map(video => (
                    <div key={video.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-800">{video.videoTitle}</p>
                          <p className="text-xs font-bold text-slate-500 mt-1">
                            {video.teacherName} • {video.language.toUpperCase()} • {video.videoType}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteVideo(video.id)} className="text-red-500 hover:text-red-700 p-2 cursor-pointer bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-slate-100 p-5 rounded-2xl space-y-4">
                <h6 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                   <Plus className="w-4 h-4 text-red-500" /> Add New Video Manually
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">Video Title</label>
                     <input type="text" value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} placeholder="Title..." className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-red-500 outline-none"/>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">YouTube URL</label>
                     <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="https://..." className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-red-500 outline-none"/>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">Teacher / Channel</label>
                     <input type="text" value={newVideoTeacher} onChange={(e) => setNewVideoTeacher(e.target.value)} placeholder="Name..." className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-red-500 outline-none"/>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">Language</label>
                     <select value={newVideoLanguage} onChange={(e) => setNewVideoLanguage(e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-red-500 outline-none cursor-pointer">
                       <option value="en">English</option>
                       <option value="hi">Hindi</option>
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">Type</label>
                     <select value={newVideoType} onChange={(e) => setNewVideoType(e.target.value)} className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-red-500 outline-none cursor-pointer">
                       <option value="explanation">Explanation</option>
                       <option value="revision">Revision</option>
                       <option value="practice">Practice</option>
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">Duration (MM:SS)</label>
                     <input type="text" value={newVideoDuration} onChange={(e) => setNewVideoDuration(e.target.value)} placeholder="Optional" className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm focus:border-red-500 outline-none"/>
                  </div>
                </div>
                <button onClick={handleAddVideo} className="px-4 py-3 mt-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl text-sm w-full hover:shadow-lg hover:shadow-red-500/30 cursor-pointer flex items-center justify-center gap-2 transition-all">
                  <Play className="w-4 h-4 fill-current" /> Save Video to Chapter
                </button>
              </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'content-menu' && renderContentMenu()}
        {activeTab === 'add-motivation' && renderAddMotivation()}
        {activeTab === 'manage-courses' && renderManageCourses()}
        {activeTab === 'add-course' && renderAddCourse()}
        {activeTab === 'curriculum-management' && renderCurriculumManagement()}
        {activeTab === 'user-management' && renderUserManagement()}
        {activeTab === 'system-settings' && renderSystemSettings()}
        {activeTab === 'video-management' && renderVideoManagement()}
      </div>
    </div>
  );
};

export default AdminDashboard;
