"use client";
import React, { useState } from 'react';
import { ShieldAlert, Activity, Lock, Search, TrendingUp, Database, Zap, Brain, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Types
interface Log {
    id: number;
    timestamp: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    source: string;
    event: string;
    ip: string;
    action: 'BLOCKED' | 'QUARANTINED' | 'FLAGGED' | 'ALLOWED';
}

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
}

interface SIEMLogsTabProps {
    logs: Log[];
    selectedLog: Log | null;
    setSelectedLog: (log: Log) => void;
}

interface MetricCardProps {
    title: string;
    value: string;
    status: 'excellent' | 'good' | 'warning';
}

interface ThreatTrend {
    time: string;
    phishing: number;
    malware: number;
    spam: number;
}

interface AttackVector {
    name: string;
    value: number;
    color: string;
}

interface DetectionAccuracy {
    model: string;
    accuracy: number;
}

interface AIRecommendation {
    id: number;
    priority: 'HIGH' | 'MEDIUM' | 'CRITICAL';
    title: string;
    description: string;
    confidence: number;
}

// Mock SIEM Log Data
const SIEM_LOGS: Log[] = [
    { id: 1, timestamp: '2026-01-11 00:45:23', severity: 'CRITICAL', source: 'Email Gateway', event: 'Phishing attempt detected', ip: '203.0.113.45', action: 'BLOCKED' },
    { id: 2, timestamp: '2026-01-11 00:44:18', severity: 'HIGH', source: 'Web Filter', event: 'Malicious URL access attempt', ip: '198.51.100.22', action: 'QUARANTINED' },
    { id: 3, timestamp: '2026-01-11 00:43:52', severity: 'MEDIUM', source: 'Email Gateway', event: 'Suspicious attachment scanned', ip: '192.0.2.178', action: 'FLAGGED' },
    { id: 4, timestamp: '2026-01-11 00:42:31', severity: 'LOW', source: 'Browser Extension', event: 'Safe URL verified', ip: '203.0.113.89', action: 'ALLOWED' },
    { id: 5, timestamp: '2026-01-11 00:41:15', severity: 'CRITICAL', source: 'API Gateway', event: 'BEC attack pattern identified', ip: '198.51.100.67', action: 'BLOCKED' },
];

// Analytics Data
const THREAT_TRENDS: ThreatTrend[] = [
    { time: '00:00', phishing: 12, malware: 5, spam: 45 },
    { time: '04:00', phishing: 8, malware: 3, spam: 32 },
    { time: '08:00', phishing: 25, malware: 12, spam: 78 },
    { time: '12:00', phishing: 42, malware: 18, spam: 95 },
    { time: '16:00', phishing: 35, malware: 15, spam: 82 },
    { time: '20:00', phishing: 28, malware: 9, spam: 61 },
];

const ATTACK_VECTORS: AttackVector[] = [
    { name: 'Email Phishing', value: 45, color: '#ef4444' },
    { name: 'Malicious URLs', value: 28, color: '#f59e0b' },
    { name: 'Smishing', value: 15, color: '#eab308' },
    { name: 'BEC', value: 12, color: '#3b82f6' },
];

const DETECTION_ACCURACY: DetectionAccuracy[] = [
    { model: 'DistilBERT', accuracy: 98.5 },
    { model: 'Random Forest', accuracy: 94.2 },
    { model: 'URL CNN', accuracy: 96.8 },
    { model: 'Gemini AI', accuracy: 99.2 },
];

// AI Recommendations
const AI_RECOMMENDATIONS: AIRecommendation[] = [
    { id: 1, priority: 'HIGH', title: 'Increase Email Gateway Filtering', description: 'Detected 42% spike in phishing attempts from domain *.microsoft-security-update.com. Recommend adding to blocklist.', confidence: 0.95 },
    { id: 2, priority: 'MEDIUM', title: 'Update User Training', description: 'Users in Finance dept clicked 3 suspicious links this week. Schedule phishing awareness training.', confidence: 0.87 },
    { id: 3, priority: 'CRITICAL', title: 'Potential Zero-Day Campaign', description: 'Gemini AI identified novel attack pattern using QR codes in PDF attachments. Immediate investigation required.', confidence: 0.92 },
];

export default function Dashboard() {
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <main className="flex min-h-screen flex-col p-6 bg-slate-950 text-white">
            {/* Header */}
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                        ANTIGRAVITY SOC - ENTERPRISE SIEM
                    </h1>
                    <p className="text-slate-400 mt-1">AI-Powered Threat Intelligence & Security Operations Center</p>
                </div>
                <div className="flex gap-4">
                    <span className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 text-green-400">
                        <Activity size={18} className="animate-pulse" /> All Systems Operational
                    </span>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-800">
                {['overview', 'analytics', 'siem-logs', 'ai-insights'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === tab
                                ? 'text-blue-400 border-b-2 border-blue-400'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Threats Blocked (24h)" value="1,284" change="+12%" icon={<ShieldAlert className="text-red-500" />} />
                <StatCard title="Emails Scanned" value="45.2k" change="+8%" icon={<Search className="text-blue-500" />} />
                <StatCard title="Active Agents" value="342" change="+5%" icon={<Lock className="text-emerald-500" />} />
                <StatCard title="AI Accuracy" value="99.8%" change="+0.3%" icon={<Brain className="text-purple-500" />} />
            </div>

            {/* Main Content Based on Active Tab */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'siem-logs' && <SIEMLogsTab logs={SIEM_LOGS} selectedLog={selectedLog} setSelectedLog={setSelectedLog} />}
            {activeTab === 'ai-insights' && <AIInsightsTab />}
        </main>
    );
}

function StatCard({ title, value, change, icon }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl backdrop-blur flex justify-between items-center hover:border-slate-700 transition-all"
        >
            <div>
                <div className="text-slate-400 text-sm mb-1">{title}</div>
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-green-400 text-xs mt-1">{change} vs yesterday</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                {icon}
            </div>
        </motion.div>
    )
}

function OverviewTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Threat Trends Chart */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-400" /> Threat Trends (24h)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={THREAT_TRENDS}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Legend />
                        <Area type="monotone" dataKey="phishing" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="malware" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="spam" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Attack Vectors Pie Chart */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Database size={20} className="text-purple-400" /> Attack Vector Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={ATTACK_VECTORS}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {ATTACK_VECTORS.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function AnalyticsTab() {
    return (
        <div className="space-y-6">
            {/* Model Performance */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400" /> ML Model Performance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={DETECTION_ACCURACY}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="model" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" domain={[90, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Bar dataKey="accuracy" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="False Positive Rate" value="0.2%" status="excellent" />
                <MetricCard title="Avg Detection Time" value="142ms" status="good" />
                <MetricCard title="Threat Intelligence Feeds" value="12 Active" status="good" />
            </div>
        </div>
    );
}

function SIEMLogsTab({ logs, selectedLog, setSelectedLog }: SIEMLogsTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Log Table */}
            <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-cyan-400" /> Security Event Logs
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-700">
                            <tr className="text-left text-slate-400">
                                <th className="pb-3">Timestamp</th>
                                <th className="pb-3">Severity</th>
                                <th className="pb-3">Source</th>
                                <th className="pb-3">Event</th>
                                <th className="pb-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr
                                    key={log.id}
                                    onClick={() => setSelectedLog(log)}
                                    className={`border-b border-slate-800 hover:bg-slate-800 cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-slate-800' : ''
                                        }`}
                                >
                                    <td className="py-3 font-mono text-xs">{log.timestamp}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                                log.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                                    log.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-green-500/20 text-green-400'
                                            }`}>
                                            {log.severity}
                                        </span>
                                    </td>
                                    <td className="py-3">{log.source}</td>
                                    <td className="py-3">{log.event}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.action === 'BLOCKED' ? 'bg-red-500/20 text-red-400' :
                                                log.action === 'QUARANTINED' ? 'bg-orange-500/20 text-orange-400' :
                                                    log.action === 'FLAGGED' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-green-500/20 text-green-400'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Log Details */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Event Details</h3>
                {selectedLog ? (
                    <div className="space-y-4">
                        <div>
                            <div className="text-slate-400 text-sm">Event ID</div>
                            <div className="font-mono">EVT-{selectedLog.id.toString().padStart(6, '0')}</div>
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm">Source IP</div>
                            <div className="font-mono">{selectedLog.ip}</div>
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm">Full Description</div>
                            <div className="text-sm">{selectedLog.event}</div>
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                                Investigate Further
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-500 text-center py-10">
                        Select a log entry to view details
                    </div>
                )}
            </div>
        </div>
    );
}

function AIInsightsTab() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                    <Brain size={24} className="text-purple-400" /> Gemini AI Security Recommendations
                </h3>
                <p className="text-slate-400">AI-powered insights based on real-time threat analysis and historical patterns</p>
            </div>

            {AI_RECOMMENDATIONS.map((rec) => (
                <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${rec.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                    rec.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {rec.priority}
                            </span>
                            <h4 className="text-lg font-semibold">{rec.title}</h4>
                        </div>
                        <div className="text-sm text-slate-400">
                            Confidence: <span className="text-green-400 font-bold">{(rec.confidence * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                    <p className="text-slate-300 mb-4">{rec.description}</p>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                            Implement Recommendation
                        </button>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                            View Analysis
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function MetricCard({ title, value, status }: MetricCardProps) {
    const statusColors = {
        excellent: 'text-green-400',
        good: 'text-blue-400',
        warning: 'text-yellow-400',
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="text-slate-400 text-sm mb-2">{title}</div>
            <div className={`text-2xl font-bold ${statusColors[status]}`}>{value}</div>
        </div>
    );
}
