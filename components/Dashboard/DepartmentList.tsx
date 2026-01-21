
import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { College, Department } from '../../types';

interface DepartmentListProps {
  college: College;
  onBack: () => void;
  onSelect: (dept: Department) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ college, onBack, onSelect }) => {
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
              College Administrative Units
            </p>
            <h1 className="text-3xl font-black text-slate-800 leading-tight">
              {college.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {college.departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onSelect(dept)}
            className="bg-white p-6 rounded-[28px] shadow-lg shadow-slate-100 border border-slate-50 flex items-center justify-between group hover:shadow-xl transition-all"
          >
            <div>
              <h3 className="text-lg font-extrabold text-slate-700 group-hover:text-blue-600 transition-colors">
                {dept.name}
              </h3>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                Select Unit <ChevronRight size={10} />
              </p>
            </div>
            <div className="text-yellow-500 opacity-20 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <ChevronRight size={20} />
                <ChevronRight size={20} className="-ml-3" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepartmentList;
