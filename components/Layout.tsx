
import React, { useState } from 'react';
import { LogOut, GraduationCap, CloudCheck, AlertTriangle, X } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
  activeCourse?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeCourse }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout?.();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      {user && (
        <header className="bg-white border-b-2 border-blue-600 sticky top-0 z-50 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between shadow-sm">
          {/* Left Side: University Branding */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg text-white shadow-md shadow-blue-100 transition-transform hover:scale-105 cursor-default">
              <GraduationCap size={20} className="sm:size-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-lg font-black text-blue-900 tracking-tight leading-none uppercase">
                LASUSTECH
              </h1>
              <div className="hidden xs:flex items-center gap-1 text-green-600 mt-0.5">
                <CloudCheck size={8} className="sm:size-[10px]" />
                <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-nowrap">Secured</span>
              </div>
            </div>
          </div>
          
          {/* Right Side: Lecturer Info and Logout Action */}
          <div className="flex items-center gap-2 sm:gap-5">
            <div className="flex flex-col items-end leading-tight text-right">
              <span className="hidden xs:block text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">
                lead lecturer:
              </span>
              <span className="font-black text-blue-700 text-[10px] sm:text-sm uppercase tracking-tight max-w-[120px] sm:max-w-none truncate">
                {user.name}
              </span>
            </div>
            
            <div className="h-6 sm:h-8 w-px bg-slate-100"></div>

            <div className="flex items-center">
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-red-50 text-red-500 rounded-lg sm:rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm group active:scale-95"
                title="Logout Account"
              >
                <LogOut size={16} className="sm:size-5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>
          
          <div className="relative bg-white w-full max-w-sm rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="p-6 sm:p-10">
              <div className="flex justify-between items-start mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                  <AlertTriangle size={24} className="sm:size-8" />
                </div>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-300 transition-colors"
                >
                  <X size={18} className="sm:size-5" />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 sm:mb-3 leading-tight">
                Confirm Logout
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed mb-8 sm:mb-10">
                Do you really want to logout? You will need to re-enter your Security Key to access your lecturer portal again.
              </p>

              <div className="flex flex-col gap-2 sm:gap-3">
                <button 
                  onClick={confirmLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 sm:py-4.5 rounded-xl sm:rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <LogOut size={16} />
                  YES, LOGOUT
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-3.5 sm:py-4.5 rounded-xl sm:rounded-2xl transition-all active:scale-95 text-xs sm:text-sm"
                >
                  STAY CONNECTED
                </button>
              </div>
            </div>
            
            <div className="h-1.5 sm:h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 w-full"></div>
          </div>
        </div>
      )}

      {/* Page Content Container */}
      <main className="flex-grow pb-8 sm:pb-12">
        {children}
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto px-4 sm:px-6 py-8 sm:py-12 bg-white border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-2 mb-6 sm:mb-8">
          <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-red-500 rounded-full"></div>
          <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-yellow-400 rounded-full"></div>
          <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-10 px-4">
          <h3 className="text-blue-900 font-black text-[10px] sm:text-sm tracking-widest uppercase leading-relaxed max-w-md">
            Lagos State University of Science and Technology
          </h3>
          <p className="text-blue-500 text-[8px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase">
            Official Academic Registry Portal
          </p>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-slate-50 w-full flex flex-col items-center">
          <p className="text-blue-600 font-black text-[9px] sm:text-[11px] tracking-widest uppercase mb-1 sm:mb-2">
            Engineered by <span className="text-blue-900 text-base sm:text-lg ml-1 font-black italic">NEBULA group</span>
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-slate-300 text-[7px] sm:text-[9px] font-bold uppercase tracking-tighter">
            <span>SECURED INSTITUTIONAL CLOUD</span>
            <span className="hidden xs:block w-1 h-1 bg-slate-200 rounded-full"></span>
            <span>V2.5.1 STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
