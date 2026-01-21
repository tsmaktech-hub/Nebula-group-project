
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CloudUpload, CheckCircle, GraduationCap, Users, Loader2, Globe } from 'lucide-react';
import { Course, Department, Student } from '../../types';
import { generateStudents } from '../../data/studentData';

const CLOUD_BUCKET = 'lasustech_attendance_v1_8822';
const CLOUD_URL = `https://kvdb.io/${CLOUD_BUCKET}/`;

interface AttendanceSheetProps {
  course: Course;
  dept: Department;
  onBack: () => void;
}

const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ course, dept, onBack }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const storageKey = `attendance_${dept.id}_${course.code.toLowerCase()}`;

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        // Attempt to fetch from Cloud first for cross-device consistency
        const response = await fetch(`${CLOUD_URL}${storageKey}`);
        if (response.ok) {
          const cloudData = await response.json();
          if (cloudData && Array.isArray(cloudData)) {
            setStudents(cloudData);
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback: Check local or generate new
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          setStudents(JSON.parse(cached));
        } else {
          const generated = generateStudents(dept.id);
          setStudents(generated);
          localStorage.setItem(storageKey, JSON.stringify(generated));
        }
      } catch (err) {
        console.error("Cloud fetch failed, using local fallback", err);
        const cached = localStorage.getItem(storageKey);
        if (cached) setStudents(JSON.parse(cached));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [dept.id, course.code, storageKey]);

  const toggleStudent = (id: string) => {
    const next = new Set(markedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setMarkedIds(next);
  };

  const handleSave = async () => {
    if (markedIds.size === 0) return;
    setIsSaving(true);
    
    try {
      const updatedStudents = students.map(s => {
        if (markedIds.has(s.id)) {
          const increment = 100 / 14; 
          const newPerc = Math.min(100, s.attendancePercentage + increment);
          return { ...s, attendancePercentage: Math.round(newPerc * 100) / 100 };
        }
        return s;
      });
      
      // 1. Update Cloud
      await fetch(`${CLOUD_URL}${storageKey}`, {
        method: 'POST',
        body: JSON.stringify(updatedStudents)
      });
      
      // 2. Update Local
      setStudents(updatedStudents);
      localStorage.setItem(storageKey, JSON.stringify(updatedStudents));
      
      setIsSaving(false);
      setShowSuccess(true);
      setMarkedIds(new Set());
      
      setTimeout(() => setShowSuccess(false), 3000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert("Sync Failed: Record could not be pushed to Cloud. Check internet connection.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 size={40} className="text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Fetching Cloud Records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-32">
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
              <p className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
                Cloud Session <Globe size={10} />
              </p>
              <h1 className="text-2xl font-black text-slate-800 leading-tight">
                {course.title} ({course.code})
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-[35px] overflow-hidden shadow-2xl shadow-blue-100 text-white p-8">
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                 <Users size={28} />
               </div>
               <div>
                 <h2 className="text-xl font-black">Student Roster</h2>
                 <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">{students.length} Candidates Synced</p>
               </div>
             </div>
             <div className="text-right">
               <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Global Status</p>
               <p className="text-lg font-black uppercase">Online</p>
             </div>
           </div>
           
           <div className="flex items-center justify-between bg-blue-700/40 rounded-[20px] p-4 border border-blue-400/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-green-300">Sync with Institution Cloud</span>
              </div>
              <div className="text-[9px] font-black uppercase text-blue-200">
                {markedIds.size} Marked Present
              </div>
           </div>
        </div>
      </div>

      <div className="px-6">
        <div className="bg-slate-50 rounded-t-[24px] px-6 py-4 flex justify-between border-b border-slate-200 sticky top-[74px] z-40 backdrop-blur-md bg-white/80">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Information</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendance Status</span>
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

              <div className="flex items-center gap-4 sm:gap-8">
                 <div className="text-right">
                    <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Score</p>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${student.attendancePercentage > 70 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {student.attendancePercentage}%
                    </span>
                 </div>

                 <button 
                    onClick={() => toggleStudent(student.id)}
                    className={`w-12 h-7 sm:w-14 sm:h-8 rounded-full transition-all relative ${markedIds.has(student.id) ? 'bg-green-500 shadow-lg shadow-green-100' : 'bg-slate-200'}`}
                 >
                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all flex items-center justify-center ${markedIds.has(student.id) ? 'left-5.5 sm:left-7' : 'left-0.5 sm:left-1'}`}>
                      {markedIds.has(student.id) && <CheckCircle size={14} className="text-green-500" />}
                    </div>
                 </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 py-10">
          <div className="w-12 h-1 bg-slate-200 rounded-full mb-4"></div>
          
          <button
            onClick={handleSave}
            disabled={isSaving || markedIds.size === 0}
            className={`w-full max-w-sm py-5 rounded-2xl flex items-center justify-center gap-4 font-bold text-sm uppercase tracking-widest shadow-2xl transition-all transform active:scale-95 border-b-4 ${
              isSaving || markedIds.size === 0 
                ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-800 shadow-blue-200'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Broadcasting to Cloud...</span>
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle size={20} />
                <span>Cloud Sync Complete</span>
              </>
            ) : (
              <>
                <CloudUpload size={20} />
                <span>Sync Attendance Record</span>
              </>
            )}
          </button>

          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center max-w-xs leading-relaxed">
            Universal Institutional Storage Enabled • Records are synchronized across all devices in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;
