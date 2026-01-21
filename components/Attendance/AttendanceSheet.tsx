
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CloudUpload, CheckCircle, GraduationCap, Users } from 'lucide-react';
import { Course, Department, Student } from '../../types';
import { generateStudents } from '../../data/studentData';

interface AttendanceSheetProps {
  course: Course;
  dept: Department;
  onBack: () => void;
}

const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ course, dept, onBack }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Unique key per course per department for storage
    const storageKey = `attendance_${dept.id}_${course.code}`;
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      setStudents(JSON.parse(cached));
    } else {
      const generated = generateStudents(dept.id);
      setStudents(generated);
      localStorage.setItem(storageKey, JSON.stringify(generated));
    }
  }, [dept.id, course.code]);

  const toggleStudent = (id: string) => {
    const next = new Set(markedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setMarkedIds(next);
  };

  const handleSave = () => {
    if (markedIds.size === 0) return;
    setIsSaving(true);
    
    // Simulate Cloud Handshake
    setTimeout(() => {
      const storageKey = `attendance_${dept.id}_${course.code}`;
      const updatedStudents = students.map(s => {
        if (markedIds.has(s.id)) {
          // Attendance calculation: Each presence in 14 weeks adds 1/14 (approx 7.14%)
          const increment = 100 / 14; 
          const newPerc = Math.min(100, s.attendancePercentage + increment);
          return { ...s, attendancePercentage: Math.round(newPerc * 100) / 100 };
        }
        return s;
      });
      
      setStudents(updatedStudents);
      localStorage.setItem(storageKey, JSON.stringify(updatedStudents));
      
      setIsSaving(false);
      setShowSuccess(true);
      setMarkedIds(new Set()); // Reset marks for next session
      
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Scroll to top to show status
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Page Header */}
      <div className="px-6 py-10 bg-white shadow-sm mb-6 rounded-b-[40px]">
        <div className="flex gap-4 mb-8 items-start">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-[20px] border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-blue-500 transition-all mt-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-3">
            <div className="w-1.5 h-16 bg-blue-600 rounded-full"></div>
            <div>
              <p className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase mb-1">
                Academic Session Record
              </p>
              <h1 className="text-2xl font-black text-slate-800 leading-tight">
                {course.title} ({course.code})
              </h1>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-blue-600 rounded-[35px] overflow-hidden shadow-2xl shadow-blue-100 text-white p-8">
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                 <Users size={28} />
               </div>
               <div>
                 <h2 className="text-xl font-black">Student Roster</h2>
                 <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">{students.length} Registered Candidates</p>
               </div>
             </div>
             <div className="text-right">
               <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Semester Goal</p>
               <p className="text-lg font-black">14 WEEKS</p>
             </div>
           </div>
           
           <div className="flex items-center justify-between bg-blue-700/40 rounded-[20px] p-4 border border-blue-400/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-green-300">Syncing to Cloud</span>
              </div>
              <div className="text-[9px] font-black uppercase text-blue-200">
                {markedIds.size} Marked Present
              </div>
           </div>
        </div>
      </div>

      {/* Registry Table */}
      <div className="px-6">
        <div className="bg-slate-50 rounded-t-[24px] px-6 py-4 flex justify-between border-b border-slate-200 sticky top-[74px] z-40 backdrop-blur-md bg-white/80">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Information</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mark Attendance</span>
        </div>

        <div className="bg-white rounded-b-[24px] shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden mb-12">
          {students.map((student) => (
            <div key={student.id} className="py-5 px-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
              <div className="flex-grow">
                <h4 className="font-extrabold text-slate-700 text-base group-hover:text-blue-600 transition-colors">
                  {student.name}
                </h4>
                <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.1em] mt-0.5">
                  {student.matricNo}
                </p>
              </div>

              <div className="flex items-center gap-8">
                 {/* Progress indicator */}
                 <div className="text-right">
                    <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Progress</p>
                    <div className="flex items-center gap-2">
                       <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${student.attendancePercentage > 70 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {student.attendancePercentage}%
                       </span>
                    </div>
                 </div>

                 {/* Checkbox */}
                 <button 
                    onClick={() => toggleStudent(student.id)}
                    className={`w-14 h-8 rounded-full transition-all relative ${markedIds.has(student.id) ? 'bg-green-500 shadow-lg shadow-green-100' : 'bg-slate-200'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all flex items-center justify-center ${markedIds.has(student.id) ? 'left-7' : 'left-1'}`}>
                      {markedIds.has(student.id) && <CheckCircle size={14} className="text-green-500" />}
                    </div>
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button (After the last name) */}
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="w-12 h-1 bg-slate-200 rounded-full mb-4"></div>
          
          <button
            onClick={handleSave}
            disabled={isSaving || markedIds.size === 0}
            className={`w-full max-w-sm py-6 rounded-[30px] flex items-center justify-center gap-4 font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all transform active:scale-95 border-b-4 ${
              isSaving || markedIds.size === 0 
                ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-800 shadow-blue-200'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading to Cloud...</span>
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle size={24} />
                <span>Attendance Logged</span>
              </>
            ) : (
              <>
                <CloudUpload size={24} />
                <span>Sync Attendance Record</span>
              </>
            )}
          </button>

          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center max-w-xs leading-relaxed">
            Authorized session for Week {Math.floor(Math.random() * 14) + 1} • Records are finalized and pushed to LASUSTECH central database upon sync.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;
