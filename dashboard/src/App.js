import React, { useState, useEffect } from 'react';

// Mock Data for visualization if API is not running during dev
const MOCK_ALERTS = [
    { id: 1, type: 'Email', source: 'billing@paypa1.com', risk: 0.95, timestamp: '10 mins ago' },
    { id: 2, type: 'URL', source: 'http://login-secure-bank.com', risk: 0.88, timestamp: '1 hour ago' },
    { id: 3, type: 'SMS', source: '+15550192834', risk: 0.72, timestamp: '2 hours ago' },
];

function App() {
    const [alerts, setAlerts] = useState(MOCK_ALERTS);
    const [stats, setStats] = useState({ checks: 1240, threats: 15, accuracy: '99.2%' });

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">🛡️ SOC Threat Dashboard</h1>
                <p className="text-gray-600">Real-time Anti-Phishing Monitoring</p>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm">Total Scans (24h)</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.checks}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-sm">Threats Detected</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.threats}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm">Model Accuracy</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.accuracy}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Recent Alerts Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold">Recent Alerts</h2>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm">
                                <th className="p-4">Type</th>
                                <th className="p-4">Source</th>
                                <th className="p-4">Risk Score</th>
                                <th className="p-4">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map(alert => (
                                <tr key={alert.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${alert.type === 'Email' ? 'bg-blue-100 text-blue-800' :
                                                alert.type === 'URL' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {alert.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-mono text-gray-700">{alert.source}</td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${alert.risk * 100}%` }}></div>
                                            </div>
                                            <span className="text-sm font-bold text-red-600">{alert.risk}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{alert.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Live Threat Map Placeholder */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Live Threat Stream</h2>
                    <div className="bg-gray-900 rounded-lg h-64 flex items-center justify-center text-gray-400 font-mono">
                        [ LIVE MAP VISUALIZATION PLACEHOLDER ]
                        <br />
                        Connecting to WebSocket...
                    </div>
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">System Status</h3>
                        <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> API Gateway: Online</div>
                            <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Model Engine: Online</div>
                            <div className="flex items-center"><span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span> Database: High Load</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
