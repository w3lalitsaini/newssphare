"use client";

import { useState, useEffect } from "react";
import { 
  Cpu, 
  Play, 
  RefreshCw, 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Zap,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAIPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualKeyword, setManualKeyword] = useState("");
  const [runningAgent, setRunningAgent] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/auto-blog");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const runEngine = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auto-blog", {
        method: "POST",
        body: JSON.stringify({ action: "run-engine" })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Engine started! ${data.summary?.success || 0} blogs generated.`);
        fetchLogs();
      } else {
        toast.error(data.message || "Failed to start engine");
      }
    } catch (err) {
      toast.error("Network error");
    }
    setLoading(false);
  };

  const runAgent = async () => {
    if (!manualKeyword) return toast.error("Enter a keyword");
    setRunningAgent(true);
    try {
      const res = await fetch("/api/admin/auto-blog", {
        method: "POST",
        body: JSON.stringify({ action: "run-agent", keyword: manualKeyword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Blog generated successfully!");
        setManualKeyword("");
        fetchLogs();
      } else {
        toast.error(data.message || "Agent failed");
      }
    } catch (err) {
      toast.error("Network error");
    }
    setRunningAgent(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-indigo-600" />
            Agentic AI Blog Factory
          </h1>
          <p className="text-slate-500 mt-1">Manage and monitor your automated content generation pipeline.</p>
        </div>
        
        <button
          onClick={runEngine}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          Run Full Automation Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Manual Generation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Topic / Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={manualKeyword}
                    onChange={(e) => setManualKeyword(e.target.value)}
                    placeholder="e.g. Future of Quantum Computing"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <button
                onClick={runAgent}
                disabled={runningAgent || !manualKeyword}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {runningAgent ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Generate Single Blog
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <h3 className="text-indigo-900 font-bold mb-2">Automation Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-indigo-700">Cron Schedule</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded text-indigo-600 border border-indigo-200">*/10 * * * *</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-indigo-700">Frequency</span>
                <span className="text-indigo-900 font-semibold">Every 10 Minutes</span>
              </div>
              <div className="pt-2 border-t border-indigo-200 mt-2">
                <p className="text-xs text-indigo-600 leading-relaxed italic">
                  The system automatically fetches trending topics from Google Trends every 10 minutes and generates 2 blog posts per cycle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Console Logs */}
        <div className="lg:col-span-2">
          <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 h-[500px] flex flex-col">
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-slate-200 font-bold flex items-center gap-2 text-sm">
                <Terminal className="w-4 h-4 text-emerald-500" />
                Live Automation Console
              </h2>
              <button 
                onClick={fetchLogs}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 scrollbar-hide">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic p-4">Waiting for incoming logs...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className={`p-2 rounded border-l-2 ${
                    log.level === 'error' ? 'bg-red-500/10 border-red-500 text-red-400' :
                    log.level === 'warn' ? 'bg-amber-500/10 border-amber-500 text-amber-400' :
                    log.level === 'debug' ? 'bg-blue-500/10 border-blue-500 text-blue-400' :
                    'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  }`}>
                    <span className="opacity-50 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="font-bold mr-2 uppercase">{log.source}:</span>
                    {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
