
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, CheckCircle, Users, Loader2, HardDrive, BookOpen } from 'lucide-react';
import { Course, Department, Student } from '../../types';
import { generateStudents } from '../../data/studentData';

interface AttendanceSheetProps {
  course: Course;
  dept: Department;
  onBack: () => void;
}

interface StorageData {
  classesHeld: number;
  students: Student[];
}

const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ course, dept, onBack }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classesHeld, setClassesHeld] = useState<number>(0);
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const storageKey = `attendance_data_${dept.id}_${course.code.toLowerCase()}`;

  useEffect(() => {
    const fetchAttendance = () => {
      setIsLoading(true);
      
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const data: StorageData = JSON.parse(cached);
        // Ensure backward compatibility or initial state
        setStudents(data.students || []);
        setClassesHeld(data.classesHeld || 0);
      } else {
        const generated = generateStudents(dept.id);
        setStudents(generated);
        setClassesHeld(0);
        const initialData: StorageData = { classesHeld: 0, students: generated };
        localStorage.setItem(storageKey, JSON.stringify(initialData));
      }
      
      setTimeout(() => setIsLoading(false), 600);
    };

    fetchAttendance();
  }, [dept.id, course.code, storageKey]);

  const toggleStudent = (id: string) => {
    const next = new Set(markedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setMarkedIds(next);
  };

  const handleSave = () => {
    if (markedIds.size === 0) return;
    setIsSaving(true);
    
    const nextClassesHeld = classesHeld + 1;
    
    const updatedStudents = students.map(s => {
      const isPresent = markedIds.has(s.id);
      const newClassesAttended = isPresent ? s.classesAttended + 1 : s.classesAttended;
      
      // Percentage = (Attended / Total Held) * 100
      const newPerc = (newClassesAttended / nextClassesHeld) * 100;
      
      return { 
        ...s, 
        classesAttended: newClassesAttended,
        attendancePercentage: Math.round(newPerc * 100) / 100 
      };
    });
    
    setTimeout(() => {
      setStudents(updatedStudents);
      setClassesHeld(nextClassesHeld);
      
      const saveData: StorageData = {
        classesHeld: nextClassesHeld,
        students: updatedStudents
      };
      localStorage.setItem(storageKey, JSON.stringify(saveData));
      
      setIsSaving(false);
      setShowSuccess(true);
      setMarkedIds(new Set());
      
      setTimeout(() => setShowSuccess(false), 3000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 size={40} className="text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Loading Device Records...</p>
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
                Local Archive <HardDrive size={10} />
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
                 <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">{students.length} Total Registered</p>
               </div>
             </div>
             <div className="text-right">
               <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Device Status</p>
               <p className="text-lg font-black uppercase">Online Safe</p>
             </div>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1 flex items-center justify-between bg-blue-700/40 rounded-[20px] p-4 border border-blue-400/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-green-300">Internal Storage Enabled</span>
                </div>
                <div className="text-[9px] font-black uppercase text-blue-200">
                  {markedIds.size} Selected Today
                </div>
             </div>
             
             <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-[20px] border border-white/5">
                <BookOpen size={16} className="text-yellow-400" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-tighter text-blue-200">Classes Held</span>
                  <span className="text-sm font-black text-white leading-none">{classesHeld} Sessions</span>
                </div>
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
                 <div className="text-right flex flex-col items-end">
                    <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">
                      {student.classesAttended} / {classesHeld}
                    </p>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${student.attendancePercentage >= 70 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
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
                <span>Syncing Record...</span>
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle size={20} />
                <span>Attendance Logged</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Sync Record</span>
              </>
            )}
          </button>

          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center max-w-xs leading-relaxed">
            Data is stored locally on this device. <br/> Records will persist until the browser cache is cleared.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;
