
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Department } from '../../types';

interface LevelListProps {
  department: Department;
  onBack: () => void;
  onSelect: (level: number) => void;
}

const LevelList: React.FC<LevelListProps> = ({ department, onBack, onSelect }) => {
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
              Student Level Classification
            </p>
            <h1 className="text-4xl font-black text-slate-800 leading-tight">
              {department.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {department.levels.map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className="aspect-square bg-white rounded-[40px] shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center group hover:scale-105 transition-all p-6 text-center border-b-4 border-transparent hover:border-blue-500"
          >
            <span className="text-6xl font-black text-blue-900 leading-none mb-4 group-hover:text-blue-600">
              {level}
            </span>
            <span className="text-[10px] font-black text-yellow-600 tracking-[0.4em] uppercase opacity-70">
              Level
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelList;
