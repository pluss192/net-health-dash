import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Activity, Server, Cpu, HardDrive } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const socket = io('http://localhost:5000');

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on('metrics', (data) => {
      setMetrics(data);

      setHistory((prev) => {
        const timeLabel = new Date(data.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        const newPoint = { time: timeLabel };
        data.nodes.forEach((node) => {
          newPoint[node.name] = node.time !== null ? node.time : 0;
        });

        const updated = [...prev, newPoint];
        return updated.slice(-10); // Keep last 10 data points
      });
    });

    return () => socket.off('metrics');
  }, []);

  if (!metrics) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl font-mono animate-pulse">Connecting to Monitoring Node...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="text-emerald-400" /> Infrastructure Health Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time status feed & telemetry charts</p>
        </div>
        <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
          LIVE
        </span>
      </header>

      {/* Host Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
          <Cpu className="w-10 h-10 text-blue-400" />
          <div>
            <p className="text-slate-400 text-sm">Host CPU Load</p>
            <p className="text-2xl font-bold font-mono">{metrics.system.cpuLoad}%</p>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
          <HardDrive className="w-10 h-10 text-purple-400" />
          <div>
            <p className="text-slate-400 text-sm">Host RAM Utilization</p>
            <p className="text-2xl font-bold font-mono">{metrics.system.ramUsage}%</p>
          </div>
        </div>
      </div>

      {/* Real-Time Latency Chart */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl mb-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">Real-Time Latency History (ms)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              <Line type="monotone" dataKey="Google DNS" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Cloudflare DNS" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Local Gateway" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monitored Devices List */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Server className="text-slate-400" /> Monitored Devices & Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.nodes.map((node, index) => (
          <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{node.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{node.host}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded font-medium ${node.alive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {node.alive ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between text-sm">
              <span className="text-slate-400">Latency:</span>
              <span className="font-mono text-emerald-400">{node.time ? `${node.time} ms` : 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
