
import React from 'react';
import { Bot, FileText, Bug, LogOut, User as UserIcon, Users, CreditCard, Home } from 'lucide-react';
import { AppMode, User } from '../types';

interface Props {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  user?: User | null;
  onLogout?: () => void;
}

const ADMIN_EMAIL = "akanksha.trivedi@trivro.in";

const Navbar: React.FC<Props> = ({ currentMode, setMode, user, onLogout }) => {
  const navItems = [
    { mode: AppMode.TEST_CASE_GEN, label: 'Test Generator', icon: FileText },
    { mode: AppMode.BUG_REPORT_GEN, label: 'Bug Reporter', icon: Bug },
    { mode: AppMode.PRICING, label: 'Pricing & Plans', icon: CreditCard },
  ];

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
          onClick={() => setMode(user ? AppMode.DASHBOARD : AppMode.LANDING)}
        >
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Trivro TestBuddy</h1>
            <p className="text-xs text-indigo-400 font-medium">AI QA Lead Assistant</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {user ? (
            <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/50 p-1 rounded-xl overflow-x-auto max-w-full w-full sm:w-auto justify-center">
              <button
                onClick={() => setMode(AppMode.DASHBOARD)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${currentMode === AppMode.DASHBOARD 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              
              {navItems.map((item) => (
                <button
                  key={item.mode}
                  onClick={() => setMode(item.mode)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${currentMode === item.mode 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                </button>
              ))}

              {isAdmin && (
                 <button
                 onClick={() => setMode(AppMode.ADMIN_PANEL)}
                 className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                   ${currentMode === AppMode.ADMIN_PANEL 
                     ? 'bg-rose-600 text-white shadow-md' 
                     : 'text-rose-400 hover:text-white hover:bg-rose-900/30'}`}
               >
                 <Users className="w-4 h-4" />
                 <span className="hidden sm:inline">Admin</span>
                 <span className="sm:hidden">Admin</span>
               </button>
              )}
            </nav>
          ) : (
            <div className="flex gap-4">
               {/* Non-logged in users see simplified header or nothing, handled in App.tsx mainly */}
            </div>
          )}

          {user && (
            <div className="flex items-center gap-3 pl-0 sm:pl-4 sm:border-l border-slate-700">
              <div className="flex items-center gap-2 text-right hidden lg:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                 <UserIcon className="w-4 h-4" />
              </div>
              <button 
                onClick={onLogout}
                className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
