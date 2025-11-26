import React, { useState, useRef, useEffect, useCallback } from 'react';
import { analyzeScreenFrame } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { MonitorPlay, StopCircle, Camera, Loader2, PlayCircle, Clock, Activity, AlertCircle, WifiOff } from 'lucide-react';

const ScreenShareQA: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [autoMode, setAutoMode] = useState(false);
  const autoIntervalRef = useRef<number | null>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (autoIntervalRef.current) {
        window.clearInterval(autoIntervalRef.current);
      }
    };
  }, [stream]);

  // Attach stream to video element whenever stream state changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(e => {
          console.error("Error playing video stream:", e);
        });
      };
    }
  }, [stream]);

  // Start Screen Sharing
  const startCapture = async () => {
    // Check for Secure Context (HTTPS or localhost)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      alert("Security Error: Screen sharing requires a secure connection (HTTPS). Please enable SSL or run on localhost.");
      return;
    }

    // Check Browser Support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      alert("Screen sharing is not supported in this browser. Please use Chrome, Edge, or Firefox on Desktop.");
      return;
    }

    try {
      // Simplified constraints for maximum compatibility
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true, 
        audio: false
      });
      
      setStream(displayStream);
      setIsSharing(true);

      // Handle stream end (user clicks "Stop sharing" in browser UI)
      displayStream.getVideoTracks()[0].onended = () => {
        stopCapture();
      };
    } catch (err) {
      console.error("Error starting screen capture:", err);
      // Don't alert if user just cancelled the system dialog
      if ((err as Error).name !== 'NotAllowedError' && (err as Error).name !== 'AbortError') {
        alert("Could not start screen share. Reason: " + (err as Error).message);
      }
    }
  };

  // Stop Sharing
  const stopCapture = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsSharing(false);
    setAutoMode(false); 
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  }, [stream]);

  // Capture Frame and Analyze
  const analyzeCurrentFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !isSharing || analyzing) return;

    // Ensure we have data
    if (videoRef.current.readyState < 2) {
      console.warn("Video not ready yet");
      return; 
    }

    setAnalyzing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set explicit dimensions based on video source
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx && canvas.width > 0 && canvas.height > 0) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get data URL
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      
      const prompt = `
        You are watching a user's screen in real-time.
        Timestamp: ${new Date().toLocaleTimeString()}

        Action:
        1. Describe what is happening on the screen.
        2. Detect any UI inconsistencies, alignment issues, or visual bugs.
        3. Identify any potential usability or accessibility issues.
        4. If a form or feature is visible, generate 3 high-priority test cases (Table format).
        5. If an error message is visible, draft a quick Bug Report.
        
        Be concise and actionable.
      `;

      try {
        const result = await analyzeScreenFrame(base64Image, prompt);
        setAnalysisResult(prev => `### Analysis at ${new Date().toLocaleTimeString()}\n\n${result}\n\n---\n\n` + prev);
      } catch (e) {
        setAnalysisResult(prev => `### Error at ${new Date().toLocaleTimeString()}\n\nFailed to analyze frame. Please try again.\n\n---\n\n` + prev);
      }
    }
    
    setAnalyzing(false);
  };

  // Effect for Auto Mode
  useEffect(() => {
    if (autoMode && isSharing) {
      analyzeCurrentFrame(); // Run once immediately
      autoIntervalRef.current = window.setInterval(() => {
        analyzeCurrentFrame();
      }, 15000); 
    } else {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    }

    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, [autoMode, isSharing]); 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      
      {/* Video Preview Column */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl relative flex-1 min-h-[400px] flex items-center justify-center group">
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted 
            className={`w-full h-full object-contain bg-black ${!isSharing ? 'hidden' : 'block'}`}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {!isSharing && (
            <div className="text-center p-8 z-10">
              <div className="bg-indigo-600/20 p-4 rounded-full inline-block mb-4">
                <MonitorPlay className="w-12 h-12 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Start Live QA Session</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Share your screen to let Trivro TestBuddy analyze your UI, detect bugs, and generate test cases in real-time.
              </p>
              <button 
                onClick={startCapture}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <MonitorPlay className="w-5 h-5" />
                Share Screen
              </button>
            </div>
          )}

          {isSharing && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-4">
               <button 
                onClick={analyzeCurrentFrame}
                disabled={analyzing}
                className="bg-white text-slate-900 hover:bg-slate-200 font-semibold py-2 px-6 rounded-full shadow-lg flex items-center gap-2 disabled:opacity-50 transform hover:scale-105 transition-all"
              >
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                Analyze Frame
              </button>

              <button 
                onClick={() => setAutoMode(!autoMode)}
                className={`${autoMode ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'} hover:opacity-90 font-semibold py-2 px-6 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105`}
              >
                {autoMode ? <Clock className="w-4 h-4 animate-pulse" /> : <PlayCircle className="w-4 h-4" />}
                {autoMode ? 'Auto-Pilot ON (15s)' : 'Enable Auto-Pilot'}
              </button>

              <button 
                onClick={stopCapture}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <StopCircle className="w-4 h-4" />
                Stop Sharing
              </button>
            </div>
          )}
        </div>
        
        {/* Instructions / Status */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isSharing ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className="text-slate-300 font-medium">Status: {isSharing ? 'Live Session Active' : 'Ready to Connect'}</span>
          </div>
          {isSharing ? (
             <span className="text-xs text-indigo-400 font-mono bg-indigo-950/50 px-2 py-1 rounded border border-indigo-900">
               {autoMode ? "Auto-Pilot: Analyzing every 15s" : "Manual Mode: Click Analyze to scan"}
             </span>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertCircle className="w-3 h-3" />
              <span>Browser permission required</span>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Output Column */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col h-full shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 sticky top-0 bg-slate-800 pb-2 border-b border-slate-700 z-10">
          <Activity className="w-5 h-5 text-emerald-400" />
          Live Insights
        </h2>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {analysisResult ? (
            <MarkdownRenderer content={analysisResult} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60 text-center p-4">
              <Camera className="w-12 h-12 mb-3 text-slate-600" />
              <p className="mb-2 text-slate-400 font-medium">No analysis yet</p>
              <p className="text-sm">Start sharing and click "Analyze Frame" to let the AI inspect your screen for bugs and usability issues.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ScreenShareQA;