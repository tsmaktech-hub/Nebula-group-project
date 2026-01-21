
import React, { useState } from 'react';
import { User as UserIcon, Lock, Hash, ArrowRight, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { User } from '../../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    courseCode: '',
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_lecturers') || '[]');
      
      if (registeredUsers.some((u: any) => u.courseCode === formData.courseCode)) {
        alert("This course code is already registered to a lecturer.");
        return;
      }

      const newUser = { 
        ...formData, 
        username: formData.courseCode,
        syncDate: new Date().toISOString() 
      };
      
      registeredUsers.push(newUser);
      localStorage.setItem('registered_lecturers', JSON.stringify(registeredUsers));
      
      setSuccessMsg('Registration Successful! Account created on this device.');
      setTimeout(() => {
        setIsRegistering(false);
        setSuccessMsg('');
        setFormData({ ...formData, password: '' });
      }, 2000);

    } else {
      const registeredUsers: User[] = JSON.parse(localStorage.getItem('registered_lecturers') || '[]');
      const user = registeredUsers.find(u => u.courseCode === formData.courseCode && u.password === formData.password);
      
      if (user) {
        onLogin(user);
      } else {
        alert("Authentication failed. Note: Accounts are currently stored locally on the device they were created on. Please 'Create Account' on this phone if you haven't yet.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[85vh]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 border border-slate-100 relative">
        <div className="absolute top-0 right-0 p-5">
          <div className="flex items-center gap-1.5 text-blue-500/30">
            <ShieldCheck size={14} />
            <span className="text-[8px] font-black uppercase tracking-widest">Secured</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 mb-4 rotate-3">
            <UserIcon size={28} className="text-white -rotate-3 sm:size-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 text-center leading-tight">
            {isRegistering ? 'Lecturer Signup' : 'Lecturer Login'}
          </h1>
          <p className="text-blue-500 font-bold text-[9px] tracking-[0.3em] uppercase mt-1">
            LASUSTECH CLOUD PORTAL
          </p>
        </div>

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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all group active:scale-95 text-sm mt-2"
            >
              {isRegistering ? 'Initialize Account' : 'Secure Access'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        <div className="mt-8 text-center space-y-4">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setSuccessMsg('');
              setFormData({ name: '', courseCode: '', username: '', password: '' });
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
            <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <Info size={10} className="text-slate-400" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                Device-specific storage active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
