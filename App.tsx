

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TestCaseGen from './components/TestCaseGen';
import BugReportGen from './components/BugReportGen';
import PricingPage from './components/PricingPage';
import AdminUserList from './components/AdminUserList';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import { AppMode, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('trivro_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setMode(AppMode.DASHBOARD);
      } catch (e) {
        localStorage.removeItem('trivro_user');
      }
    } else {
        setMode(AppMode.LANDING);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setMode(AppMode.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('trivro_user');
    setUser(null);
    setMode(AppMode.LANDING);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-indigo-500">Loading...</div>;
  }

  // If user is not logged in
  if (!user) {
    // If they clicked "Get Started" on Landing Page, show AuthPage
    if (mode === AppMode.DASHBOARD || mode === AppMode.AUTH) { // 'AUTH' is now in Enum
       return <AuthPage onLogin={handleLogin} onBackToHome={() => setMode(AppMode.LANDING)} />;
    }
    // Default to Landing Page
    return <LandingPage onGetStarted={() => setMode(AppMode.DASHBOARD)} />;
  }

  // Authenticated Routes
  const renderContent = () => {
    switch (mode) {
      case AppMode.TEST_CASE_GEN:
        return <TestCaseGen />;
      case AppMode.BUG_REPORT_GEN:
        return <BugReportGen />;
      case AppMode.PRICING:
        return <PricingPage />;
      case AppMode.ADMIN_PANEL:
        return <AdminUserList />;
      case AppMode.LANDING: // If user clicks Logo/Home
      case AppMode.DASHBOARD:
      default:
        return <Dashboard setMode={setMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500/30">
      <Navbar currentMode={mode} setMode={setMode} user={user} onLogout={handleLogout} />
      <main className={mode === AppMode.LANDING ? '' : 'max-w-7xl mx-auto p-4 md:p-6 lg:p-8'}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;