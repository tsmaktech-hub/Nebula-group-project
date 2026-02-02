
import React, { useState } from 'react';
import { User as UserIcon, Lock, Hash, ArrowRight, ShieldCheck, CheckCircle2, Loader2, AlertCircle, Globe, Database } from 'lucide-react';
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
    if (!isSupabaseConfigured) {
      setErrorMsg("Database keys (SUPABASE_URL/ANON_KEY) are not configured in the environment.");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const normalizedCode = formData.courseCode.trim().toUpperCase();

    try {
      if (isRegistering) {
        const { data: existing } = await supabase
          .from('lecturers')
          .select('id')
          .eq('course_code', normalizedCode)
          .eq('security_key', formData.password)
          .maybeSingle();

        if (existing) {
          setErrorMsg("This exact account (Course & Key) is already registered.");
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
      setErrorMsg(err.message || "An error occurred with the database connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[85vh]">
      {!isSupabaseConfigured && (
        <div className="mb-6 w-full max-w-md bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
          <Database className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-amber-900 font-black text-[10px] uppercase tracking-widest mb-1">Database Connection Required</p>
            <p className="text-amber-700 text-xs font-medium leading-relaxed">
              Supabase environment variables (SUPABASE_URL and SUPABASE_ANON_KEY) are missing. Cloud synchronization is currently disabled.
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 border border-slate-100 relative">
        <div className="absolute top-0 right-0 p-5">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Globe size={14} className="animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-nowrap">Cloud Sync</span>
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
            {isSupabaseConfigured ? 'Global Database Active' : 'Offline Mode Only'}
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
                    disabled={isLoading || !isSupabaseConfigured}
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
                  disabled={isLoading || !isSupabaseConfigured}
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
                  disabled={isLoading || !isSupabaseConfigured}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !isSupabaseConfigured}
              className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all group active:scale-95 text-sm mt-2 disabled:opacity-50 ${
                isSupabaseConfigured ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isRegistering ? 'Create Cloud Account' : 'Secure Access'}
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
            disabled={!isSupabaseConfigured}
            className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1 mx-auto disabled:opacity-50"
          >
            {isRegistering ? (
              <>Already registered? <span className="text-blue-500 underline">Login</span></>
            ) : (
              <>New lecturer? <span className="text-blue-500 underline">Create Account</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
