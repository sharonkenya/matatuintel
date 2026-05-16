/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Send, 
  MessageSquare,
  Navigation,
  Info,
  TrendingUp,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Report {
  origin_stage: string | null;
  destination_stage: string | null;
  route_number: string | null;
  status: 'smooth' | 'heavy_traffic' | 'long_queue' | 'no_cars' | 'fare_hike';
  fare_amount?: number | null;
  confidence: 'High' | 'Medium' | 'Low';
  notes: string;
  timestamp: string;
  sender: string;
}

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [smsInput, setSmsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 10000); // Poll every 10s
    
    // Agent initiation
    const initiateChat = async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsTyping(false);
      setMessages([{
        role: 'agent',
        content: "Habari! Naitwa Matatu Intel Agent. I'm here to help you navigate these Nairobi streets without stress. \n\nUko wapi sai na unataka kwenda wapi? Nipee starting point nikupange vizuri, or just report what's happening hapo stage.",
        timestamp: new Date()
      }]);
    };
    
    initiateChat();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isTyping]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendSms = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText || smsInput;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setSmsInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/sms/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'User_Simulator', text: textToSend }),
      });
      const data = await res.json();
      
      const agentMessage: Message = {
        role: 'agent',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
      fetchReports();
    } catch (err) {
      console.error('Failed to send SMS', err);
      setMessages(prev => [...prev, {
        role: 'agent',
        content: 'Error communicating with the matatu brain. Check your network or server logs.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: "to Ruai from CBD", icon: <Navigation size={14} /> },
    { label: "Check 46 Kawangware", icon: <Bus size={14} /> },
    { label: "Manyanga zimejaa Town", icon: <AlertTriangle size={14} /> },
    { label: "Fare hike at Ngara", icon: <TrendingUp size={14} /> },
  ];

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'smooth': return 'text-green-600 bg-green-50 border-green-100/50 shadow-sm shadow-green-500/5';
      case 'heavy_traffic': return 'text-orange-600 bg-orange-50 border-orange-100/50 shadow-sm shadow-orange-500/5';
      case 'long_queue': return 'text-indigo-600 bg-indigo-50 border-indigo-100/50 shadow-sm shadow-indigo-500/5';
      case 'no_cars': return 'text-rose-600 bg-rose-50 border-rose-100/50 shadow-sm shadow-rose-500/5';
      case 'fare_hike': return 'text-amber-600 bg-amber-50 border-amber-100/50 shadow-sm shadow-amber-500/5';
      default: return 'text-slate-500 bg-slate-50 border-slate-100/50';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'smooth': return <CheckCircle2 size={16} />;
      case 'heavy_traffic': return <AlertTriangle size={16} />;
      case 'long_queue': return <Clock size={16} />;
      case 'no_cars': return <Bus size={16} />;
      case 'fare_hike': return <TrendingUp size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-yellow-200">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-50 shadow-sm/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 p-2.5 rounded-2xl shadow-lg shadow-yellow-400/20 rotate-3">
              <Bus className="text-slate-900" size={24} strokeWidth={3} />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-slate-900 uppercase">Matatu Intel</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Nairobi Network</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-[10px] font-black text-yellow-600 uppercase">Live Ops</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase">System Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-xs font-bold text-slate-700">Healthy</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <TrendingUp size={14} className="text-yellow-400" />
              {reports.length} Reports Active
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Intelligence Input (Chat) */}
        <div className="lg:col-span-5 flex flex-col h-[calc(100vh-160px)]">
          <div className="flex flex-col flex-1 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            {/* Terminal Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Navigation size={16} />
                </div>
                <div>
                  <h2 className="font-bold text-sm tracking-tight">Intelligence Terminal</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Session Active</p>
                </div>
              </div>
              <Info size={16} className="text-slate-300 cursor-help" />
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {messages.length === 0 && !isTyping && (
                <div className="flex items-center justify-center h-full opacity-20 flex-col gap-4">
                  <MessageSquare size={48} />
                  <p className="text-sm font-bold uppercase tracking-widest">Initializing Feed...</p>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] rounded-[1.5rem] px-5 py-4 text-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none shadow-lg shadow-slate-900/10' 
                      : 'bg-[#F1F5F9] text-slate-800 rounded-tl-none border border-slate-200/50 shadow-sm'
                  }`}>
                    {msg.role === 'agent' && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gen-Insight</span>
                      </div>
                    )}
                    <span className="leading-relaxed whitespace-pre-wrap">{msg.content}</span>
                    <div className={`text-[9px] mt-2 font-bold uppercase tracking-wider opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {(loading || isTyping) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input & Quick Actions */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
              <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendSms(undefined, action.label)}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-600 hover:bg-yellow-400 hover:border-yellow-400 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                  >
                    <span className="opacity-50">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendSms} className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={smsInput}
                    onChange={(e) => setSmsInput(e.target.value)}
                    placeholder="Message the network..."
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all outline-none shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !smsInput.trim() || isTyping}
                  className="bg-slate-900 text-white rounded-2xl px-6 hover:bg-yellow-400 hover:text-slate-900 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center group"
                >
                  <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Live Matrix Feed */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="font-black text-3xl tracking-tight text-slate-900">Nairobi Pulse</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                {reports.length} Real-Time Crowd Signals
              </p>
            </div>
            <button 
              onClick={fetchReports}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
            >
              <History size={18} />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] pr-2 custom-scrollbar">
            {reports.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                  <MapPin size={32} />
                </div>
                <div>
                  <p className="text-slate-900 font-bold">Waiting for Ingestion</p>
                  <p className="text-slate-400 text-xs mt-1">Updates from commuters appear here instantly.</p>
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {reports.map((report, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-yellow-400/50 transition-all duration-300 flex flex-col md:flex-row gap-6 relative overflow-hidden"
                  >
                    <div className="flex-1 relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border group-hover:scale-105 transition-transform ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {(report.status || 'unknown').replace('_', ' ')}
                        </span>
                        
                        {report.route_number && (
                          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest italic flex items-center gap-2">
                             <div className="w-1 h-3 bg-yellow-400 rounded-full" />
                             {report.route_number}
                          </div>
                        )}

                        {report.fare_amount && (
                          <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest flex items-center gap-1 border border-green-200">
                             KES {report.fare_amount}
                          </div>
                        )}

                        <span className="text-[10px] font-black text-slate-300 ml-auto uppercase tracking-[0.2em]">
                          {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-lg font-black tracking-tight text-slate-800">
                             {report.origin_stage || 'Unknown Intel'}
                          </p>
                          {report.destination_stage && (
                            <div className="flex items-center gap-3">
                              <div className="h-[2px] w-4 bg-slate-200 rounded-full" />
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Bound for {report.destination_stage}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 group-hover:bg-white transition-colors">
                        <p className="text-xs font-bold text-slate-500 italic leading-relaxed">
                          "{report.notes}"
                        </p>
                      </div>
                    </div>

                    <div className="md:w-32 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 relative z-10 shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <CheckCircle2 size={12} className={report.confidence === 'High' ? 'text-green-500' : 'text-slate-300'} />
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Certainty</p>
                        </div>
                        <p className={`text-sm font-black italic uppercase tracking-tighter ${report.confidence === 'High' ? 'text-green-600' : 'text-slate-400'}`}>
                          {report.confidence}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
