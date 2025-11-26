
import React, { useState } from 'react';
import { User } from '../types';
import { Bot, Mail, Lock, User as UserIcon, ArrowRight, Loader2, Eye, EyeOff, Users, CheckCircle, CreditCard, ArrowLeft, Unlock, Phone } from 'lucide-react';
import PricingPage from './PricingPage';

interface Props {
  onLogin: (user: User) => void;
  onBackToHome?: () => void;
}

const ADMIN_EMAIL = "akanksha.trivedi@trivro.in";

const AuthPage: React.FC<Props> = ({ onLogin, onBackToHome }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  
  // Gate State for Signup
  const [hasAccessCode, setHasAccessCode] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Helper to simulate a backend database
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('trivro_db_users');
    return users ? JSON.parse(users) : [];
  };

  const handleUnlockAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCodeInput.trim().toUpperCase() === 'GROWWITHTRIVRO') {
      setHasAccessCode(true);
      setPromoError('');
    } else {
      setPromoError('Invalid Promo Code. Please contact support to purchase.');
    }
  };

  const handleSignup = (users: any[]) => {
    // Check if user exists
    if (users.find((u: any) => u.email === email)) {
      setError("User already exists with this email address.");
      setLoading(false);
      return;
    }

    // Register new user
    const newUser = { email, password, name, joinedAt: new Date().toISOString() };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('trivro_db_users', JSON.stringify(updatedUsers));

    // Simulate Email Notification to Admin
    console.log(`[System] Sending signup notification to ${ADMIN_EMAIL} for user: ${email}`);
    
    setSuccessMsg(`Account created successfully! Admin Dashboard updated.`);
    setLoading(false);
    
    // Clear form and switch to login after a delay
    setTimeout(() => {
      setIsLogin(true);
      setSuccessMsg('');
      setPassword('');
      // Reset gate for security
      setHasAccessCode(false);
      setPromoCodeInput('');
    }, 3000);
  };

  const handleLoginAuth = (users: any[]) => {
    // SPECIAL ADMIN CHECK
    if (email === ADMIN_EMAIL) {
      if (password === "Trivro@123") {
         const adminUser: User = { email: ADMIN_EMAIL, name: "Akanksha Trivedi (Admin)" };
         localStorage.setItem('trivro_user', JSON.stringify(adminUser));
         onLogin(adminUser);
         setLoading(false);
         return;
      } else {
        setError("Invalid Admin Credentials.");
        setLoading(false);
        return;
      }
    }

    // Normal User Check
    const validUser = users.find((u: any) => u.email === email && u.password === password);

    if (validUser) {
      // Login Success
      const sessionUser: User = {
        email: validUser.email,
        name: validUser.name,
      };
      
      localStorage.setItem('trivro_user', JSON.stringify(sessionUser));
      onLogin(sessionUser);
    } else {
      // Login Failed
      const userExists = users.find((u: any) => u.email === email);
      if (userExists) {
        setError("Incorrect password.");
      } else {
        setError("Account not found. Please sign up first.");
      }
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    // Validation
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    // Simulate Network Delay
    setTimeout(() => {
      const users = getRegisteredUsers();

      if (isLogin) {
        handleLoginAuth(users);
      } else {
        handleSignup(users);
      }
    }, 1000);
  };

  if (showPricing) {
    return (
      <div className="min-h-screen bg-slate-900 pt-10">
        <PricingPage isPublic={true} onBack={() => setShowPricing(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[100px]"></div>
      </div>

      {onBackToHome && (
        <button 
          onClick={onBackToHome}
          className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 z-20 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      )}

      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 mb-8">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Trivro TestBuddy</h1>
          <p className="text-slate-400">AI-Powered QA Lead Assistant</p>
        </div>

        {successMsg ? (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center mb-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-green-400 font-semibold mb-1">Success!</h3>
            <p className="text-slate-300 text-sm mb-2">{successMsg}</p>
            <p className="text-slate-500 text-xs">Redirecting to login...</p>
          </div>
        ) : (
          <>
            {/* Logic: If Signup Mode AND Access Code NOT verified, show Gate */}
            {!isLogin && !hasAccessCode ? (
               <div className="animate-in fade-in slide-in-from-bottom-4">
                 <div className="text-center mb-6 border border-indigo-500/30 bg-indigo-900/20 p-4 rounded-xl">
                    <Lock className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold mb-1">Premium Access Required</h3>
                    <p className="text-xs text-slate-400 mb-3">To create an account, you need a valid subscription.</p>
                    
                    <div className="bg-slate-900/50 p-3 rounded-lg text-left space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Mail className="w-3 h-3 text-indigo-400" />
                        <span className="select-all">support@trivro.in</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                         <Phone className="w-3 h-3 text-indigo-400" />
                         <span className="select-all">9274741994</span>
                      </div>
                    </div>

                    <form onSubmit={handleUnlockAccess} className="flex gap-2">
                       <input 
                         type="text" 
                         value={promoCodeInput} 
                         onChange={(e) => setPromoCodeInput(e.target.value)}
                         placeholder="Promo Code" 
                         className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none uppercase placeholder:normal-case"
                       />
                       <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg">
                         <Unlock className="w-4 h-4" />
                       </button>
                    </form>
                    {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
                 </div>
               </div>
            ) : (
              // Standard Form (Login OR Verified Signup)
              <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-600 text-white rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-600 text-white rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                      placeholder="qa@trivro.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-600 text-white rounded-lg py-2.5 pl-10 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-1 rounded-md transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center animate-shake">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm mb-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMsg('');
                setEmail('');
                setPassword('');
                setName('');
                setPromoError('');
                setHasAccessCode(false); // Reset access gate when switching
                setPromoCodeInput('');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              disabled={loading || !!successMsg}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
          
          <div className="border-t border-slate-700 pt-4">
            <button
              onClick={() => setShowPricing(true)}
              className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 w-full transition-colors group"
            >
              <CreditCard className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
              View Plans & Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Social Proof / User Count Badge */}
      <div className="relative z-10 flex items-center gap-4 bg-slate-800/60 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700 shadow-xl animate-bounce-in">
        <div className="flex -space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-slate-800">JD</div>
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-slate-800">AS</div>
          <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-slate-800">MK</div>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold border-2 border-slate-800">+99</div>
        </div>
        <div className="border-l border-slate-600 pl-4 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
             <Users className="w-4 h-4 text-indigo-400" />
             <span className="text-sm font-bold text-white">12,500+</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">QA Engineers use TestBuddy</span>
        </div>
      </div>

    </div>
  );
};

export default AuthPage;
