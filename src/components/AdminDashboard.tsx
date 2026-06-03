import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, UserCheck, ShieldAlert, Settings,
  Clock, Plus, Filter, TrendingUp, Video, FileText, Zap, Megaphone, ArrowLeft, Trash2, Edit2
} from 'lucide-react';
import type { Course } from '../types';

interface AdminDashboardProps {
  language?: 'en' | 'hi';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content-menu' | 'add-motivation' | 'add-course' | 'manage-courses'>('overview');
  
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
  
  // Dummy Data
  const metrics = {
    totalStudents: '1,420',
    totalParents: '845',
    totalCourses: '42'
  };

  const recentActivity = [
    { id: 1, text: 'New Teacher Account Registered', time: '10 mins ago', type: 'user' },
    { id: 2, text: 'Science Course Material Updated', time: '2 hours ago', type: 'course' },
    { id: 3, text: '15 New Students Joined', time: 'Yesterday', type: 'student' },
    { id: 4, text: 'System Backup Completed', time: '2 days ago', type: 'system' }
  ];

  const renderOverview = () => (
    <>
      {/* Page Title */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-[#0038FF]">Administrator Portal</h2>
          <p className="text-sm text-slate-600 mt-1">Platform overview and management.</p>
        </div>
        <button className="hidden sm:flex bg-[#0038FF] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md items-center gap-2 transition-all cursor-pointer">
           <Filter className="w-4 h-4"/> Generate Report
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-[#0038FF]">
              <Users className="w-6 h-6" />
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Students</p>
            <h3 className="text-3xl font-black text-slate-800">{metrics.totalStudents}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Parents</p>
            <h3 className="text-3xl font-black text-slate-800">{metrics.totalParents}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex flex-col justify-between">
           <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Courses</p>
            <h3 className="text-3xl font-black text-slate-800">{metrics.totalCourses}</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-amber-500" /> Quick Actions
          </h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('manage-courses')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors group cursor-pointer"
            >
               <div className="flex items-center gap-3">
                  <div className="bg-[#0038FF] text-white p-2 rounded-lg">
                     <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[#0038FF]">Manage Courses</span>
               </div>
               <Plus className="w-4 h-4 text-[#0038FF] group-hover:scale-110 transition-transform" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group cursor-pointer">
               <div className="flex items-center gap-3">
                  <div className="bg-slate-700 text-white p-2 rounded-lg">
                     <Users className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700">User Management</span>
               </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group cursor-pointer">
               <div className="flex items-center gap-3">
                  <div className="bg-slate-400 text-white p-2 rounded-lg">
                     <Settings className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700">System Settings</span>
               </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-[#27D8FF]" /> System Activity
          </h3>
          
          <div className="space-y-5">
            {recentActivity.map(act => (
              <div key={act.id} className="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className={`p-2.5 rounded-xl shrink-0 ${act.type === 'user' ? 'bg-indigo-100 text-indigo-600' : act.type === 'course' ? 'bg-purple-100 text-purple-600' : act.type === 'student' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                   {act.type === 'user' ? <UserCheck className="w-5 h-5"/> : act.type === 'course' ? <BookOpen className="w-5 h-5" /> : act.type === 'student' ? <Users className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                </div>
                <div className="flex-grow pt-1">
                  <p className="text-sm font-bold text-slate-800">{act.text}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{act.time}</p>
                </div>
                <button className="text-xs font-bold text-[#0038FF] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 mt-1 cursor-pointer">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

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

        <button className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Add Video Chapter</h3>
          <p className="text-xs text-slate-500 mt-2">Upload a new video lesson to an existing course.</p>
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

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'content-menu' && renderContentMenu()}
        {activeTab === 'add-motivation' && renderAddMotivation()}
        {activeTab === 'manage-courses' && renderManageCourses()}
        {activeTab === 'add-course' && renderAddCourse()}
      </div>
    </div>
  );
};

export default AdminDashboard;
