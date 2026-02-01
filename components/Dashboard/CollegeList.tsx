
import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { College } from '../../types';

interface CollegeListProps {
  colleges: College[];
  onSelect: (college: College) => void;
}

const CollegeList: React.FC<CollegeListProps> = ({ colleges, onSelect }) => {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <div className="flex gap-3 mb-10 items-start">
        <div className="w-2 h-16 sm:h-20 bg-yellow-400 rounded-full"></div>
        <div>
          <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase mb-1">
            University Academic Structure
          </p>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-800">Colleges</h1>
        </div>
      </div>

      <div className="grid gap-6">
        {colleges.map((college) => (
          <button
            key={college.id}
            onClick={() => onSelect(college)}
            className="relative bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-xl shadow-slate-200/50 border-b-4 border-blue-500 text-left hover:scale-[1.02] transition-transform group overflow-hidden"
          >
            {/* Background Icon */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <Building2 size={120} />
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                <Building2 size={24} className="sm:size-8" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {college.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 sm:mt-2">
                  <span className="bg-yellow-50 text-yellow-600 text-[8px] sm:text-[9px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest">
                    {college.departments.length} Units
                  </span>
                  <span className="text-slate-300 text-[10px]">→</span>
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all sm:size-6" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CollegeList;
