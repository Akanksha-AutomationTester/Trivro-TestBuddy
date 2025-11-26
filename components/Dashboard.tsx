
import React from 'react';
import { AppMode } from '../types';
import { FileText, Bug, ShieldCheck, Zap, Database, CreditCard, Sparkles, Rocket } from 'lucide-react';

interface Props {
  setMode: (mode: AppMode) => void;
}

const Dashboard: React.FC<Props> = ({ setMode }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Your AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">QA Lead</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Trivro TestBuddy automates the tedious parts of testing. Generate full suites, write perfect bug reports, and streamline your QA workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div 
          onClick={() => setMode(AppMode.TEST_CASE_GEN)}
          className="bg-slate-800 border border-slate-700 p-8 rounded-2xl hover:bg-slate-750 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer group"
        >
          <div className="bg-indigo-900/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Test Generator</h3>
          <p className="text-slate-400 leading-relaxed text-sm">
            Convert requirements into functional, regression, and security test cases instantly. Supports BDD format.
          </p>
        </div>

        <div 
          onClick={() => setMode(AppMode.BUG_REPORT_GEN)}
          className="bg-slate-800 border border-slate-700 p-8 rounded-2xl hover:bg-slate-750 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all cursor-pointer group"
        >
          <div className="bg-red-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Bug className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Bug Reporter</h3>
          <p className="text-slate-400 leading-relaxed text-sm">
            Turn rough notes into IEEE-829 standard bug reports with root cause suggestions and severity analysis.
          </p>
        </div>

        <div 
          onClick={() => setMode(AppMode.PRICING)}
          className="bg-slate-800 border border-slate-700 p-8 rounded-2xl hover:bg-slate-750 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all cursor-pointer group"
        >
          <div className="bg-yellow-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Rocket className="w-7 h-7 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Premium Plans</h3>
          <p className="text-slate-400 leading-relaxed text-sm">
            Unlock unlimited generation or <strong>Create a Customized AI App</strong> with your own domain.
            <span className="block mt-2 text-yellow-400 font-medium flex items-center gap-1"><Sparkles className="w-3 h-3"/> Custom Apps @ $249</span>
          </p>
        </div>

      </div>

      <div className="mt-20 border-t border-slate-800 pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-slate-500" />
            <span className="text-slate-500 text-sm font-medium">OWASP Security Checks</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-slate-500" />
            <span className="text-slate-500 text-sm font-medium">Performance Insights</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Database className="w-6 h-6 text-slate-500" />
            <span className="text-slate-500 text-sm font-medium">Test Data Generation</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <CreditCard className="w-6 h-6 text-slate-500" />
            <span className="text-slate-500 text-sm font-medium">Secure Payments</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
