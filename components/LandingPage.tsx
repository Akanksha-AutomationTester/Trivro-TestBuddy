
import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle, Zap, Shield, ArrowRight, Star, BarChart3, Globe, Layers, PlayCircle, X, ExternalLink, FileText, Lock, Phone, Mail } from 'lucide-react';
import PricingPage from './PricingPage';

interface Props {
  onGetStarted: () => void;
}

interface InfoModalData {
  title: string;
  content: React.ReactNode;
}

const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');
  const [infoModal, setInfoModal] = useState<InfoModalData | null>(null);

  // Set the video source with the current origin to prevent configuration errors (Error 153)
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    setVideoSrc(`https://www.youtube.com/embed/BngPWSxzF-w?rel=0&modestbranding=1&origin=${origin}`);
  }, []);

  const openPrivacyPolicy = () => {
    setInfoModal({
      title: "Privacy Policy",
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p><strong>Last Updated: October 2024</strong></p>
          <p>At Trivro AI ("we", "our", or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our TestBuddy application.</p>
          
          <h4 className="text-white font-semibold mt-4">1. Information We Collect</h4>
          <p>We collect information you provide directly to us, such as when you create an account, subscribe to a plan, or contact customer support. This may include your name, email address, and payment information.</p>
          
          <h4 className="text-white font-semibold mt-4">2. How We Use Your Information</h4>
          <p>We use the information we collect to operate, maintain, and improve our services, to process transactions, and to communicate with you about your account and our services.</p>
          
          <h4 className="text-white font-semibold mt-4">3. Data Security</h4>
          <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet is 100% secure.</p>
          
          <h4 className="text-white font-semibold mt-4">4. Contact Us</h4>
          <p>If you have any questions about this Privacy Policy, please contact us at support@trivro.in.</p>
        </div>
      )
    });
  };

  const openTerms = () => {
    setInfoModal({
      title: "Terms of Service",
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p><strong>Effective Date: October 2024</strong></p>
          <p>Please read these Terms of Service ("Terms") carefully before using Trivro TestBuddy.</p>
          
          <h4 className="text-white font-semibold mt-4">1. Acceptance of Terms</h4>
          <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
          
          <h4 className="text-white font-semibold mt-4">2. Use License</h4>
          <p>Trivro AI grants you a personal, non-transferable, non-exclusive license to use the software for your internal business or personal QA testing purposes.</p>
          
          <h4 className="text-white font-semibold mt-4">3. Subscriptions</h4>
          <p>Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (such as monthly or annually).</p>
          
          <h4 className="text-white font-semibold mt-4">4. Limitation of Liability</h4>
          <p>In no event shall Trivro AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
        </div>
      )
    });
  };

  const openSupport = () => {
    setInfoModal({
      title: "Contact Support",
      content: (
        <div className="space-y-6 text-slate-300">
          <p>Our dedicated support team is available Mon-Fri, 9 AM - 6 PM IST to assist you with any technical issues or billing inquiries.</p>
          
          <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4 border border-slate-700">
            <div className="bg-indigo-900/50 p-3 rounded-full">
              <Mail className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Email Us</p>
              <a href="mailto:support@trivro.in" className="text-white font-medium hover:text-indigo-400 transition-colors">support@trivro.in</a>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4 border border-slate-700">
            <div className="bg-indigo-900/50 p-3 rounded-full">
              <Phone className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Call Us</p>
              <a href="tel:+919274741994" className="text-white font-medium hover:text-indigo-400 transition-colors">+91 9274741994</a>
            </div>
          </div>

          <div className="text-xs text-center text-slate-500 mt-4">
            Office Address: Trivro AI ,Ahmedabad, India.
          </div>
        </div>
      )
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden font-sans">
      
      {/* Video Modal (YouTube) */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <a 
                href="https://www.youtube.com/watch?v=BngPWSxzF-w" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/50 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all backdrop-blur-md flex items-center gap-2 text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Open in YouTube
              </a>
              <button 
                onClick={() => setShowVideo(false)}
                className="bg-black/50 hover:bg-slate-700 text-white p-2 rounded-full transition-all backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="aspect-video w-full">
              <iframe 
                className="w-full h-full"
                src={videoSrc} 
                title="Trivro AI Intro"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* General Info Modal (Privacy, Terms, Support) */}
      {infoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">{infoModal.title}</h3>
              <button 
                onClick={() => setInfoModal(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {infoModal.content}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl flex justify-end">
              <button 
                onClick={() => setInfoModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-500/30 px-4 py-1.5 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4">
            <SparklesIcon className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-200 text-sm font-medium">Part of the Trivro AI Ecosystem</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Automate QA with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Trivro TestBuddy</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Generate enterprise-grade test cases, detailed bug reports, and IEEE-829 documentation in seconds. Trusted by 12,500+ QA professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-full shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 flex items-center gap-2"
            >
              Experience Trivro TestBuddy Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowVideo(true)}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 hover:text-indigo-400 text-white text-lg font-medium rounded-full border border-slate-700 transition-all flex items-center gap-2 group"
            >
              <PlayCircle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              Watch Intro
            </button>
          </div>
        </div>
      </section>

      {/* About Trivro AI */}
      <section className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Trivro TestBuddy?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We replace the chaos of spreadsheets and manual documentation with intelligent automation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Generation</h3>
              <p className="text-slate-400">Instantly convert vague requirements into detailed functional, regression, and security test suites.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Standardized Reporting</h3>
              <p className="text-slate-400">Create bug reports that developers love. Structured, technical, and following international standards.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Coverage Analysis</h3>
              <p className="text-slate-400">Identify gaps in your testing strategy with our smart coverage detection algorithms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-indigo-950/30 border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Visual Watch Button Container (Replaces Video Embed) */}
            <div className="lg:w-5/12 w-full">
              <div 
                className="relative group w-full cursor-pointer"
                onClick={() => setShowVideo(true)}
              >
                {/* Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                
                {/* Card Content */}
                <div className="relative w-full aspect-video bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col items-center justify-center group-hover:border-indigo-500/50 transition-all">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                   
                   <div className="relative z-10 flex flex-col items-center transform group-hover:scale-105 transition-transform duration-300">
                     <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 mb-4 group-hover:bg-red-600 group-hover:border-red-500 transition-colors shadow-xl">
                       <PlayCircle className="w-10 h-10 text-white fill-current" />
                     </div>
                     <span className="text-lg font-bold text-white tracking-wide">Watch Founder's Message</span>
                     <span className="text-sm text-indigo-300 mt-1">Introduction to Trivro AI</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="lg:w-7/12 w-full">
              <div className="inline-flex items-center gap-2 text-indigo-400 font-bold tracking-wider uppercase text-sm mb-4">
                <Star className="w-4 h-4 fill-current" />
                Visionary Leadership
              </div>
              <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
                "Marketing and QA shouldn't be chaos. <br/>
                <span className="text-indigo-400">It should be intelligent.</span>"
              </h2>
              
              <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">Akanksha Raj Trivedi</strong> is the visionary Founder & CEO behind <span className="text-white">Trivro AI</span>, a next-generation AI Marketing Ecosystem built to empower early-stage founders, freelancers, and small businesses.
                </p>
                <p>
                  Coming from a strong background in QA, automation, and AI tools consulting, Akanksha brings a rare blend of technical expertise and business intuition. Before building Trivro AI, she trained professionals and teams on how to use AI tools to grow faster, work smarter, and scale without chaos.
                </p>
                <p>
                  Her journey began with limited resources but unlimited ambition. She saw how small businesses struggled with expensive tools. To solve this, she created Trivro AI — an ecosystem of <strong className="text-white">51+ AI tools</strong> that replaces multiple subscriptions and reduces costs by 50%+.
                </p>
                <div className="pl-6 border-l-4 border-indigo-500 italic text-slate-400 my-8">
                  "I am driven by one mission: to make powerful technology accessible to everyone — regardless of budget, experience, or team size."
                </div>
                <p>
                  Her leadership blends elegance, clarity, and innovation, positioning Trivro AI as the future of AI-driven automation.
                </p>
              </div>

              <div className="mt-10 flex gap-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">51+</span>
                  <span className="text-sm text-slate-400">AI Tools</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">50%</span>
                  <span className="text-sm text-slate-400">Cost Reduction</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">Global</span>
                  <span className="text-sm text-slate-400">Impact</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Embedded Pricing Section */}
      <section className="bg-slate-900 py-12">
        <PricingPage isPublic={true} />
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Bot className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">Trivro AI</span>
          </div>
          <div className="text-slate-500 text-sm">
            &copy; 2024 Trivro AI Ecosystem. All rights reserved.
          </div>
          <div className="flex gap-6 text-slate-400 text-sm">
            <button onClick={openPrivacyPolicy} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={openTerms} className="hover:text-white transition">Terms of Service</button>
            <button onClick={openSupport} className="hover:text-white transition">Contact Support</button>
          </div>
        </div>
      </footer>

    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default LandingPage;
