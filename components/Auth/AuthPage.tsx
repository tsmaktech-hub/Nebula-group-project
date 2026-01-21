
import React, { useState } from 'react';
import { User as UserIcon, Lock, Hash, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
      // Simulate Cloud Storage via LocalStorage + Session Sync
      const registeredUsers = JSON.parse(localStorage.getItem('registered_lecturers') || '[]');
      
      // Check if course code already exists
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
      
      // Show success and redirect to login
      setSuccessMsg('Registration Successful! Redirecting to Cloud Login...');
      setTimeout(() => {
        setIsRegistering(false);
        setSuccessMsg('');
        setFormData({ ...formData, password: '' }); // Clear password for login
      }, 2000);

    } else {
      // Login logic via Cloud Simulation
      const registeredUsers: User[] = JSON.parse(localStorage.getItem('registered_lecturers') || '[]');
      const user = registeredUsers.find(u => u.courseCode === formData.courseCode && u.password === formData.password);
      
      if (user) {
        onLogin(user);
      } else {
        alert("Authentication failed. Please check your Assigned Course Code and Security Key.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[80vh]">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden p-10 border border-slate-100 relative">
        <div className="absolute top-0 right-0 p-6">
          <div className="flex items-center gap-1.5 text-blue-500/20">
            <ShieldCheck size={16} />
            <span className="text-[8px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-blue-600 rounded-[30px] flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 rotate-3">
            <UserIcon size={48} className="text-white -rotate-3" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 text-center leading-tight">
            {isRegistering ? 'Lecturer Signup' : 'Lecturer Login'}
          </h1>
          <p className="text-blue-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-2">
            LASUSTECH CLOUD PORTAL
          </p>
        </div>

        {successMsg ? (
          <div className="py-20 flex flex-col items-center text-center space-y-4 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-slate-600 font-bold">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest pl-2">Lead Lecturer Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-400">
                    <UserIcon size={18} />
                  </div>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] py-4 pl-14 pr-4 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-800 font-bold"
                    placeholder="e.g. Dr. Samuel Kola"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest pl-2">
                Assigned Course Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-400">
                  <Hash size={18} />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] py-4 pl-14 pr-4 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-800 font-bold uppercase"
                  placeholder="e.g. CHM102"
                  required
                  value={formData.courseCode}
                  onChange={(e) => setFormData({...formData, courseCode: e.target.value.toUpperCase()})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest pl-2">Security Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] py-4 pl-14 pr-4 focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-slate-800 font-bold"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-xl shadow-blue-200 transition-all group active:scale-95"
            >
              {isRegistering ? 'INITIALIZE ACCOUNT' : 'SECURE ACCESS'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setSuccessMsg('');
              setFormData({ name: '', courseCode: '', username: '', password: '' });
            }}
            className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
          >
            {isRegistering ? (
              <>Already have an account? <span className="text-blue-500 underline">Login</span></>
            ) : (
              <>First time lecturer? <span className="text-blue-500 underline">Create Account</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
