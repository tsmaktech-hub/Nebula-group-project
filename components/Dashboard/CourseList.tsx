
import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Department, Course } from '../../types';

interface CourseListProps {
  department: Department;
  level: number;
  onBack: () => void;
  onSelect: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ department, level, onBack, onSelect }) => {
  const courses = department.courses[level] || [];

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <div className="flex gap-4 mb-10 items-start">
        <button 
          onClick={onBack}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-500 transition-all mt-1"
        >
          <ArrowLeft size={18} className="sm:size-5" />
        </button>
        <div className="flex gap-3">
          <div className="w-1.5 h-16 sm:h-20 bg-yellow-400 rounded-full"></div>
          <div>
            <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase mb-1">
              Course Registry Index
            </p>
            <h1 className="text-xl sm:text-3xl font-black text-slate-800 leading-tight">
              {department.name} ({level}L)
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onSelect(course)}
            className="bg-white p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-xl shadow-slate-100 border border-slate-50 flex items-center gap-4 sm:gap-6 group hover:shadow-2xl transition-all text-left"
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-blue-900 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white font-black text-base sm:text-lg shadow-lg shadow-blue-200 border-b-4 border-yellow-400 shrink-0">
              {course.code.slice(0, 3)}
            </div>
            <div className="flex-grow">
              <p className="text-[9px] sm:text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-0.5 sm:mb-1">{course.code}</p>
              <h3 className="text-base sm:text-xl font-extrabold text-slate-800 leading-tight mb-1 sm:mb-2 group-hover:text-blue-600">
                {course.title}
              </h3>
              <span className="bg-green-50 text-green-600 text-[8px] sm:text-[9px] font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-widest">
                Semester {course.semester}
              </span>
            </div>
          </button>
        ))}
        {courses.length === 0 && (
          <div className="text-center py-20 text-slate-400 font-medium">
            No courses found for this level and semester.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
