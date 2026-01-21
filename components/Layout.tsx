
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
        <header className="bg-white border-b-2 border-blue-600 sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
          {/* Left Side: University Branding */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-100 transition-transform hover:scale-105">
              <GraduationCap size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-blue-900 tracking-tight leading-none uppercase">
                LASUSTECH
              </h1>
              <div className="hidden xs:flex items-center gap-1.5 text-green-600 mt-0.5">
                <CloudCheck size={10} />
                <span className="text-[8px] font-bold uppercase tracking-wider text-nowrap">Cloud Secured Registry</span>
              </div>
            </div>
          </div>
          
          {/* Right Side: Lecturer Info and Logout Action */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="flex flex-col items-end leading-tight text-right">
              <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                lead lecturer:
              </span>
              <span className="font-black text-blue-800 text-xs md:text-sm uppercase tracking-tight">
                {user.name}
              </span>
            </div>
            
            <div className="h-8 w-px bg-slate-100 hidden xs:block"></div>

            <div className="flex items-center">
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm group active:scale-90"
                title="Logout Session"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>
          
          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-sm rounded-[35px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center text-red-500 shadow-inner">
                  <AlertTriangle size={32} />
                </div>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-2 leading-tight">
                Confirm Logout
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10">
                Do you really want to logout? This will end your current session and you'll need to re-authenticate to manage records.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  YES, LOGOUT
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-4 rounded-2xl transition-all active:scale-95"
                >
                  STAY CONNECTED
                </button>
              </div>
            </div>
            
            {/* Modal Decorative Accent */}
            <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 w-full"></div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pb-12">
        {children}
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto px-6 py-12 bg-white border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-2 mb-8">
          <div className="w-10 h-1.5 bg-red-500 rounded-full"></div>
          <div className="w-10 h-1.5 bg-yellow-400 rounded-full"></div>
          <div className="w-10 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-10 h-1.5 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="text-center space-y-3 mb-8">
          <h3 className="text-blue-900 font-black text-sm tracking-widest uppercase px-6 leading-relaxed max-w-sm">
            Lagos State University of Science and Technology
          </h3>
          <p className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase">
            Digital Academic Services
          </p>
        </div>

        <div className="pt-8 border-t border-slate-50 w-full flex flex-col items-center">
          <p className="text-blue-600 font-black text-[11px] tracking-widest uppercase mb-2">
            Engineered by <span className="text-blue-900 text-lg ml-1 font-black italic">NEBULA group</span>
          </p>
          <div className="flex items-center gap-2 text-slate-300 text-[9px] font-bold uppercase tracking-tighter">
            <span>SECURED UNIVERSITY CLOUD</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <span>V2.5 STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
