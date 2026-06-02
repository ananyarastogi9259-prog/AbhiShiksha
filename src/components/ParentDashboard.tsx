import React from 'react';
import { 
  BookOpen, Award, CheckCircle, Clock, Calendar, 
  TrendingUp, AlertCircle, BookOpen as BookOpenIcon
} from 'lucide-react';

interface ParentDashboardProps {
  language?: 'en' | 'hi';
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ language = 'en' }) => {
  // Dummy Data
  const student = {
    name: 'Aman Patel',
    grade: 'Class 9',
    school: 'CBSE Public School',
    streak: 5,
    coins: 140
  };

  const progress = {
    overallPercentage: 82,
    recentSubjects: ['Science', 'Mathematics', 'English']
  };

  const attendance = {
    daysPresent: 42,
    totalDays: 45,
    percentage: 93
  };

  const recentActivity = [
    { id: 1, text: 'Completed Science Quiz: Cell Biology', time: '2 hours ago', type: 'quiz' },
    { id: 2, text: 'Asked an AI doubt about Algebra', time: 'Yesterday', type: 'doubt' },
    { id: 3, text: 'Attended Math Live Class', time: '2 days ago', type: 'class' },
  ];

  return (
    <div className="w-full">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#0038FF]">Parent Dashboard</h2>
          <p className="text-sm text-slate-600 mt-1">Monitor your child's academic progress and activities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Student Overview Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#0038FF] to-[#27D8FF] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
              {student.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
            <p className="text-slate-500 font-medium">{student.grade} • {student.school}</p>
            
            <div className="flex gap-4 mt-6 w-full justify-center">
              <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 text-center">
                <p className="text-xs text-orange-600 font-bold uppercase">Streak</p>
                <p className="text-lg font-black text-orange-700">{student.streak} Days</p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 text-center">
                <p className="text-xs text-[#005BFF] font-bold uppercase">Coins</p>
                <p className="text-lg font-black text-[#0038FF]">{student.coins}</p>
              </div>
            </div>
          </div>

          {/* Progress Summary Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 col-span-1 md:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#27D8FF]" /> Academic Progress
                </h3>
                <p className="text-xs text-slate-500 mt-1">Overall curriculum completion.</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#0038FF]">{progress.overallPercentage}%</p>
                <p className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1"><CheckCircle className="w-3 h-3" /> On Track</p>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-[#0038FF] to-[#27D8FF] h-full rounded-full" style={{ width: `${progress.overallPercentage}%` }}></div>
            </div>

            <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Recent Subjects Accessed</h4>
            <div className="flex gap-2 flex-wrap">
              {progress.recentSubjects.map(sub => (
                <span key={sub} className="bg-[#0038FF]/5 border border-[#0038FF]/20 text-[#0038FF] px-3 py-1 rounded-full text-xs font-bold">
                  {sub}
                </span>
              ))}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* Attendance Summary */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-500" /> Attendance Overview
            </h3>
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div>
                <p className="text-sm font-bold text-indigo-900">Total Present</p>
                <p className="text-2xl font-black text-indigo-700">{attendance.daysPresent} <span className="text-sm font-medium text-indigo-400">/ {attendance.totalDays} Days</span></p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-indigo-200 flex items-center justify-center relative">
                 <span className="text-sm font-bold text-indigo-700">{attendance.percentage}%</span>
              </div>
            </div>
            {attendance.percentage > 90 ? (
               <p className="text-xs text-emerald-600 mt-4 flex items-center gap-1 font-medium"><CheckCircle className="w-4 h-4"/> Excellent attendance record!</p>
            ) : (
               <p className="text-xs text-amber-600 mt-4 flex items-center gap-1 font-medium"><AlertCircle className="w-4 h-4"/> Missed a few recent classes.</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-500" /> Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map(act => (
                <div key={act.id} className="flex gap-3 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-xl mt-1 ${act.type === 'quiz' ? 'bg-emerald-100 text-emerald-600' : act.type === 'doubt' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                     {act.type === 'quiz' ? <Award className="w-4 h-4"/> : act.type === 'doubt' ? <BookOpenIcon className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{act.text}</p>
                    <p className="text-xs text-slate-400 font-medium">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ParentDashboard;
