
import React, { useState } from 'react';
import { User as UserIcon, Lock, Hash, ArrowRight, ShieldCheck, CheckCircle2, Globe, Loader2, AlertCircle } from 'lucide-react';
import { User } from '../../types';

// Institutional Cloud Configuration
// Note: In production, these would be environment variables and use a dedicated backend like Firebase/Supabase
const CLOUD_BUCKET = 'lasustech_registry_v1_8822';
const CLOUD_URL = `https://kvdb.io/${CLOUD_BUCKET}/`;

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    courseCode: '',
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const normalizedCode = formData.courseCode.trim().toLowerCase();

    try {
      if (isRegistering) {
        // 1. Check if course already exists in Cloud
        const checkRes = await fetch(`${CLOUD_URL}${normalizedCode}`);
        if (checkRes.ok) {
          const existing = await checkRes.json();
          if (existing) {
            setErrorMsg("This Course Code is already registered. Please login instead.");
            setIsLoading(false);
            return;
          }
        }

        const newUser = { 
          ...formData, 
          username: formData.courseCode,
          courseCode: formData.courseCode.toUpperCase(),
          syncDate: new Date().toISOString() 
        };
        
        // 2. Push to Cloud using PUT (Standard for KVDB)
        const saveRes = await fetch(`${CLOUD_URL}${normalizedCode}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });

        if (!saveRes.ok) throw new Error("Cloud sync failed");
        
        setSuccessMsg('Registration Successful! Account is now synced to the Cloud.');
        setTimeout(() => {
          setIsRegistering(false);
          setSuccessMsg('');
          setIsLoading(false);
          setFormData({ ...formData, password: '' });
        }, 2000);

      } else {
        // Login Logic - Pull from Cloud
        const response = await fetch(`${CLOUD_URL}${normalizedCode}`);
        
        if (response.status === 404) {
          setErrorMsg("Account not found. If this is your first time, please use the 'Create Account' option below.");
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Cloud connection interrupted.");
        }
        
        const cloudUser: User = await response.json();
        
        if (cloudUser && cloudUser.password === formData.password) {
          // Sync local storage for persistence on this device
          localStorage.setItem('lasustech_user', JSON.stringify(cloudUser));
          onLogin(cloudUser);
        } else {
          setErrorMsg("Security key is incorrect for this Course Code.");
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Connection Error: Unable to reach LASUSTECH Cloud. Check your data connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[85vh]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 border border-slate-100 relative">
        <div className="absolute top-0 right-0 p-5">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Globe size={14} className="animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest">Global Cloud</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 mb-4 rotate-3">
            <UserIcon size={28} className="text-white -rotate-3 sm:size-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 text-center leading-tight">
            {isRegistering ? 'Initialize Account' : 'Lecturer Login'}
          </h1>
          <p className="text-blue-500 font-bold text-[9px] tracking-[0.3em] uppercase mt-1">
            Attendance portal v2.1
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 text-xs font-bold leading-tight">{errorMsg}</p>
          </div>
        )}

        {successMsg ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in fade-in duration-500">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-slate-600 font-bold text-sm px-4">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-1">
                <label className="text-[9px] font-black text-blue-950 uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                    <UserIcon size={16} />
                  </div>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-11 pr-4 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-800 font-bold text-sm"
                    placeholder="e.g. Dr. Samuel Kola"
                    required
                    disabled={isLoading}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-black text-blue-950 uppercase tracking-widest pl-1">
                Course Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                  <Hash size={16} />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-11 pr-4 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-800 font-bold uppercase text-sm"
                  placeholder="e.g. CHM102"
                  required
                  disabled={isLoading}
                  value={formData.courseCode}
                  onChange={(e) => setFormData({...formData, courseCode: e.target.value.toUpperCase()})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-blue-950 uppercase tracking-widest pl-1">Security Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-11 pr-4 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-800 font-bold text-sm"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all group active:scale-95 text-sm mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isRegistering ? 'Initialize Account' : 'Secure Access'}
              {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        )}

        <div className="mt-8 text-center space-y-4">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setSuccessMsg('');
              setErrorMsg('');
              setFormData({ ...formData, password: '' });
            }}
            className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1 mx-auto"
          >
            {isRegistering ? (
              <>Already registered? <span className="text-blue-500 underline">Login</span></>
            ) : (
              <>New lecturer? <span className="text-blue-500 underline">Create Account</span></>
            )}
          </button>

          <div className="pt-4 border-t border-slate-50">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <Globe size={10} className="text-blue-400" />
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-tighter">
                Institutional Sync Active (Cross-Device)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
