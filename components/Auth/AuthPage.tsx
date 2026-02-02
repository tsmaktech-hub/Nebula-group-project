
import React, { useState } from 'react';
import { User as UserIcon, Lock, Hash, ArrowRight, CheckCircle2, Loader2, AlertCircle, Globe } from 'lucide-react';
import { User } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

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

    const normalizedCode = formData.courseCode.trim().toUpperCase();

    try {
      if (isRegistering) {
        const { data: existing, error: checkError } = await supabase
          .from('lecturers')
          .select('id')
          .eq('course_code', normalizedCode)
          .eq('security_key', formData.password)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existing) {
          setErrorMsg("This lecturer account (Course & Key) is already registered.");
          setIsLoading(false);
          return;
        }

        const { error: insertError } = await supabase
          .from('lecturers')
          .insert([{ 
            name: formData.name, 
            course_code: normalizedCode, 
            security_key: formData.password 
          }]);

        if (insertError) throw insertError;

        setSuccessMsg('Account Initialized Successfully! You can now log in.');
        setTimeout(() => {
          setIsRegistering(false);
          setSuccessMsg('');
          setIsLoading(false);
          setFormData({ ...formData, password: '' });
        }, 2000);

      } else {
        const { data: lecturer, error } = await supabase
          .from('lecturers')
          .select('*')
          .eq('course_code', normalizedCode)
          .eq('security_key', formData.password)
          .maybeSingle();

        if (error) throw error;
        
        if (!lecturer) {
          setErrorMsg("Invalid Course Code or Security Key combination.");
          setIsLoading(false);
          return;
        }
        
        onLogin({
          name: lecturer.name,
          courseCode: lecturer.course_code,
          username: lecturer.course_code,
          password: lecturer.security_key
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Institutional Cloud Connection Error. Please verify your internet connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[85vh]">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden p-6 sm:p-10 border border-slate-100 relative">
        <div className="absolute top-0 right-0 p-6 flex gap-2">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Globe size={14} className="animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Cloud Active</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 rotate-3">
            <UserIcon size={32} className="text-white -rotate-3" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 text-center leading-tight">
            {isRegistering ? 'Initialize Portal' : 'Lecturer Login'}
          </h1>
          <p className="text-blue-500 font-black text-[9px] tracking-[0.4em] uppercase mt-2">
            LASUSTECH Academic Sync
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 text-xs font-bold leading-tight">{errorMsg}</p>
          </div>
        )}

        {successMsg ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-slate-600 font-extrabold text-sm px-4">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                    <UserIcon size={18} />
                  </div>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-800 font-bold text-sm"
                    placeholder="e.g. Dr. Samuel Kola"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest pl-1">Course Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                  <Hash size={18} />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-800 font-black uppercase text-sm"
                  placeholder="e.g. MTH102"
                  required
                  value={formData.courseCode}
                  onChange={(e) => setFormData({...formData, courseCode: e.target.value.toUpperCase()})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest pl-1">Security Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-800 font-bold text-sm"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95 text-sm uppercase tracking-[0.2em] mt-4 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isRegistering ? 'Register Cloud Account' : 'Secure Access'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setSuccessMsg('');
              setErrorMsg('');
              setFormData({ ...formData, password: '' });
            }}
            className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            {isRegistering ? (
              <>Already have a key? <span className="text-blue-600 underline">Login</span></>
            ) : (
              <>New lecturer? <span className="text-blue-600 underline">Get Registered</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
