import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SensorChart from '../components/SensorChart';
import { Activity, Briefcase, TrendingUp, Droplets, Thermometer, Wind, AlertCircle, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [sensorData, setSensorData] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.role === 'farmer') {
                    const res = await axios.get('http://localhost:5000/api/sensors');
                    setSensorData(res.data);
                } else {
                    const res = await axios.get('http://localhost:5000/api/jobs');
                    setJobs(res.data);
                }
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.role]);

    const handlePredict = async () => {
        if (sensorData.length === 0) return;
        const latest = sensorData[0];
        try {
            const res = await axios.post('http://localhost:5001/predict-yield', {
                soilPh: latest.soilPh,
                moisture: latest.moisture,
                temperature: latest.temperature,
                n: latest.npk.n,
                p: latest.npk.p,
                k: latest.npk.k
            });
            setPrediction(res.data);
        } catch (err) {
            console.error('Prediction failed', err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-slow-spin shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
        </div>
    );

    const isDemo = sensorData.some(d => d.isDemo);

    return (
        <div className="pt-28 pb-12 px-6 max-w-7xl mx-auto space-y-8 animate-fade">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-4xl font-black tracking-tight">Agricultural Intelligence</h1>
                        {isDemo && (
                            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold rounded-full flex items-center gap-1">
                                <Info size={12} /> DEMO MODE
                            </span>
                        )}
                    </div>
                    <p className="text-slate-400">
                        Operational overview for <span className="text-emerald-400 font-bold underline decoration-emerald-500/30">{user.name}</span>
                    </p>
                </div>
                {user.role === 'farmer' && (
                    <button 
                        onClick={handlePredict} 
                        className="btn-primary shadow-[0_0_30px_rgba(16,185,129,0.3)] py-4 px-8 group"
                    >
                        <div className="flex items-center gap-3">
                            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                            Run AI Yield Analysis
                        </div>
                    </button>
                )}
            </header>

            <AnimatePresence>
                {prediction && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass p-10 border-emerald-500/40 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-emerald-500/20 via-emerald-500/5 to-transparent overflow-hidden relative group"
                    >
                        <div className="absolute right-0 top-0 text-emerald-500/5 -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700">
                            <TrendingUp size={300} />
                        </div>
                        <div className="z-10">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4 tracking-widest uppercase">
                                <Activity size={16} /> Neural Network Prediction
                            </div>
                            <h2 className="text-5xl font-black mb-3">
                                Yield: <span className="bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">{prediction.predicted_yield}</span> <span className="text-2xl font-light">tons/ha</span>
                            </h2>
                            <p className="text-slate-300 text-xl max-w-xl leading-relaxed">
                                Our ML model suggests your soil conditions are optimal. Predicted harvest quality is <span className="text-emerald-400 font-bold italic">Grade A+</span>.
                            </p>
                        </div>
                        <div className="mt-8 md:mt-0 flex flex-col items-center gap-3">
                           <div className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white font-black text-xs tracking-widest">
                                HIGH CONFIDENCE
                           </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {user.role === 'farmer' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Visual Analytics */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SensorChart data={sensorData} title="Moisture Fluctuations" dataKey="moisture" color="#34d399" />
                        <SensorChart data={sensorData} title="Thermal Telemetry" dataKey="temperature" color="#fbbf24" />
                        <SensorChart data={sensorData} title="pH Level Variance" dataKey="soilPh" color="#a78bfa" />
                        
                        <div className="glass p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-50" />
                           <img 
                                src="/agri_telemetry_icons_3d_1776603580634.png" 
                                className="w-56 h-32 object-contain mb-6 group-hover:scale-110 transition-transform duration-500 opacity-80" 
                                alt="Diagnostic Visuals"
                           />
                           <div className="z-10 ring-1 ring-white/10 bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
                                <h3 className="text-2xl font-black mb-2 flex items-center justify-center gap-2">
                                    <AlertCircle size={24} className="text-emerald-500" />
                                    Diagnostics
                                </h3>
                                <p className="text-slate-400">All 14 field nodes are online and reporting health at 99.8% uptime.</p>
                           </div>
                        </div>
                    </div>
                    
                    {/* Live Feed */}
                    <div className="lg:col-span-4">
                        <div className="glass p-10 h-full border-white/5 relative bg-gradient-to-b from-slate-800/80 to-slate-900/40">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
                                    <Activity size={28} className="text-emerald-500 animate-pulse" />
                                    Live Stream
                                </h3>
                                <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black rounded uppercase tracking-tighter">
                                    Encrypted
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {[
                                    { label: 'Humidity', value: sensorData[0]?.humidity, unit: '%', icon: Wind, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                                    { label: 'Nitrogen', value: sensorData[0]?.npk.n, unit: 'ppm', icon: Droplets, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                                    { label: 'Phosphorus', value: sensorData[0]?.npk.p, unit: 'ppm', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                    { label: 'Potassium', value: sensorData[0]?.npk.k, unit: 'ppm', icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' }
                                ].map((item, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/20 hover:bg-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                                <item.icon size={24} />
                                            </div>
                                            <span className="text-lg font-bold text-slate-200">{item.label}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-white">{item.value?.toFixed(1) || 0}</span>
                                            <span className="text-[10px] text-slate-500 ml-1 font-black uppercase">{item.unit}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="mt-12 p-6 glass border-emerald-500/20 bg-emerald-500/5 rounded-3xl">
                                <p className="text-xs text-emerald-400 font-bold mb-4 uppercase tracking-[0.2em]">Environmental Advisory</p>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Current trends suggest increasing moisture retention in Sector 4. Monitor closely for optimal harvest.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map((job, idx) => (
                        <motion.div 
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="glass p-10 flex flex-col border-white/5 hover:border-emerald-500/40 transition-all group bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-emerald-500/10 rounded-3xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Briefcase size={28} />
                                </div>
                                <span className="bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-emerald-500/20">
                                    {job.type}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tight">{job.title}</h3>
                            <p className="text-slate-400 mb-10 line-clamp-3 leading-relaxed text-lg">{job.description}</p>
                            <div className="flex justify-between items-center mt-auto pt-8 border-t border-white/10">
                                <div>
                                    <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Package</span>
                                    <span className="text-2xl font-black text-emerald-400">{job.salary}</span>
                                </div>
                                <button className="btn-primary px-8 py-3 rounded-2xl font-black shadow-lg shadow-emerald-500/20">
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
