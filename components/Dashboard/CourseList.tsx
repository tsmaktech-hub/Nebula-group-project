
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
          className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-500 transition-all mt-2"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-3">
          <div className="w-2 h-20 bg-yellow-400 rounded-full"></div>
          <div>
            <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase mb-1">
              Course Registry Index
            </p>
            <h1 className="text-3xl font-black text-slate-800 leading-tight">
              {department.name} ({level}L)
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onSelect(course)}
            className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-100 border border-slate-50 flex items-center gap-6 group hover:shadow-2xl transition-all text-left"
          >
            <div className="w-20 h-20 bg-blue-900 rounded-3xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200 border-b-4 border-yellow-400">
              {course.code.slice(0, 3)}
            </div>
            <div className="flex-grow">
              <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">{course.code}</p>
              <h3 className="text-xl font-extrabold text-slate-800 leading-tight mb-2 group-hover:text-blue-600">
                {course.title}
              </h3>
              <span className="bg-green-50 text-green-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
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
