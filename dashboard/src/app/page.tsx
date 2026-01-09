"use client";
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Lock, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data (In production, fetch from API)
const MOCK_ALERTS = [
    { id: 1, type: 'Email', source: 'ceo-urgent@microsoft-security-update.com', risk: 0.98, intent: 'Credential Theft', ai_exp: 'High urgency + Brand impersonation detected.' },
    { id: 2, type: 'URL', source: 'http://192.168.0.1/auth', risk: 0.85, intent: 'Network Intrusion', ai_exp: 'IP-based login page.' },
    { id: 3, type: 'Email', source: 'payroll@internal-hr.com', risk: 0.12, intent: 'Legitimate', ai_exp: 'Internal domain verified.' },
];

export default function Dashboard() {
    const [alerts, setAlerts] = useState(MOCK_ALERTS);
    const [selectedAlert, setSelectedAlert] = useState<any>(null);

    return (
        <main className="flex min-h-screen flex-col p-8 bg-slate-950 text-white">
            {/* Header */}
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        ANTIGRAVITY SOC
                    </h1>
                    <p className="text-slate-400">AI-Powered Threat Intelligence Console</p>
                </div>
                <div className="flex gap-4">
                    <span className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 text-green-400">
                        <Activity size={18} /> System Online
                    </span>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Threats Blocked" value="1,284" icon={<ShieldAlert className="text-red-500" />} />
                <StatCard title="Emails Scanned" value="45.2k" icon={<Search className="text-blue-500" />} />
                <StatCard title="Active Agents" value="342" icon={<Lock className="text-emerald-500" />} />
                <StatCard title="AI Accuracy" value="99.8%" icon={<Activity className="text-purple-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Feed */}
                <div className="lg:col-span-2 col-span-3 bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <ShieldAlert size={20} className="text-blue-400" /> Live Threat Feed
                    </h2>
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={alert.id}
                                onClick={() => setSelectedAlert(alert)}
                                className={`p-4 rounded-lg border border-slate-800 cursor-pointer transition-all hover:bg-slate-800
                            ${selectedAlert?.id === alert.id ? 'bg-slate-800 ring-1 ring-blue-500' : 'bg-slate-900'}
                        `}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${alert.risk > 0.8 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                            }`}>
                                            {alert.type}
                                        </span>
                                        <span className="font-mono text-sm text-slate-300">{alert.source}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">Risk Score</div>
                                        <div className={`font-bold ${alert.risk > 0.8 ? 'text-red-400' : 'text-slate-200'}`}>
                                            {alert.risk.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI Analysis Panel */}
                <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit sticky top-8">
                    <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Gemini AI Analysis
                    </h2>

                    {selectedAlert ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="p-4 bg-slate-950 rounded-lg border border-purple-500/30">
                                <div className="text-xs text-purple-400 mb-1">INTENT RECOGNITION</div>
                                <div className="font-semibold text-lg">{selectedAlert.intent}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm text-slate-400">Reasoning Chain:</div>
                                <p className="text-slate-200 text-sm leading-relaxed">
                                    {selectedAlert.ai_exp}
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-800">
                                <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                                    Quarantine Entity
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-500 text-center py-10 italic">
                            Select a threat to view specific AI breakdown.
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: any }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl backdrop-blur flex justify-between items-center">
            <div>
                <div className="text-slate-400 text-sm mb-1">{title}</div>
                <div className="text-3xl font-bold">{value}</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                {icon}
            </div>
        </div>
    )
}
