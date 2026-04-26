import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SensorChart from '../components/SensorChart';
import ProfitSimulator from '../components/ProfitSimulator';
import FarmingChatbot from '../components/FarmingChatbot';
import { Activity, Briefcase, TrendingUp, Droplets, Thermometer, Wind, AlertCircle, Info, Sparkles, Plus, X, MapPin, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, updateProfile } = useAuth();
    const [sensorData, setSensorData] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [spoilageAlert, setSpoilageAlert] = useState(null);
    const [showJobForm, setShowJobForm] = useState(false);
    const [editingJobId, setEditingJobId] = useState(null);
    const [jobForm, setJobForm] = useState({ title: '', description: '', location: '', salary: '', type: 'Harvesting', contact: '' });
    const [loading, setLoading] = useState(true);
    const [nearbyOnly, setNearbyOnly] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [profileLoc, setProfileLoc] = useState('');
    const [showWeatherForm, setShowWeatherForm] = useState(false);
    const [weatherLoc, setWeatherLoc] = useState('');
    const [showManualLogForm, setShowManualLogForm] = useState(false);
    const [manualLog, setManualLog] = useState({ soilPh: 7, moisture: 50, temperature: 25, humidity: 50, n: 50, p: 50, k: 50 });

    const fetchData = async () => {
        if (!user) return;
        try {
            if (user.role === 'farmer') {
                const res = await axios.get('http://localhost:5000/api/sensors');
                setSensorData(res.data);
                const jobsRes = await axios.get('http://localhost:5000/api/jobs');
                setJobs(jobsRes.data.filter(j => j.employerId === user.id || j.employerId === user._id));
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

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleFetchWeather = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/sensors/weather', { location: weatherLoc });
            setShowWeatherForm(false);
            setWeatherLoc('');
            alert('Weather data fetched and logged!');
            fetchData();
        } catch (err) {
            alert('Failed to fetch weather: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleManualLog = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/sensors', {
                soilPh: manualLog.soilPh,
                moisture: manualLog.moisture,
                temperature: manualLog.temperature,
                humidity: manualLog.humidity,
                npk: { n: manualLog.n, p: manualLog.p, k: manualLog.k }
            });
            setShowManualLogForm(false);
            alert('Manual field data logged successfully!');
            fetchData();
        } catch (err) {
            alert('Failed to log data: ' + (err.response?.data?.message || err.message));
        }
    };

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

    const handleSpoilageCheck = async () => {
        if (sensorData.length === 0) return;
        const latest = sensorData[0];
        try {
            const res = await axios.post('http://localhost:5001/predict-spoilage', {
                temperature: latest.temperature,
                humidity: latest.humidity
            });
            setSpoilageAlert(res.data);
        } catch (err) {
            console.error('Spoilage prediction failed', err);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            if (editingJobId) {
                await axios.put(`http://localhost:5000/api/jobs/${editingJobId}`, jobForm);
                alert('Job updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/jobs', jobForm);
                alert('Job posted successfully!');
            }
            setShowJobForm(false);
            setEditingJobId(null);
            setJobForm({ title: '', description: '', location: '', salary: '', type: 'Harvesting', contact: '' });
            const jobsRes = await axios.get('http://localhost:5000/api/jobs');
            setJobs(jobsRes.data.filter(j => j.employerId === user.id || j.employerId === user._id));
        } catch (err) {
            console.error('Failed to save job', err);
            alert(`Failed to save job: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleEditJob = (job) => {
        setEditingJobId(job._id);
        setJobForm({ title: job.title, description: job.description, location: job.location, salary: job.salary, type: job.type, contact: job.contact || '' });
        setShowJobForm(true);
    };

    const handleApply = async (jobId) => {
        try {
            await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`);
            alert('Application submitted successfully!');
            const res = await axios.get('http://localhost:5000/api/jobs');
            setJobs(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(user.id || user._id, profileLoc);
            setShowProfile(false);
        } catch (err) {
            console.error('Error updating profile', err);
        }
    };

    if (loading || !user) return (
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
                        {sensorData.length === 0 && user.role === 'farmer' && (
                            <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-full flex items-center gap-1">
                                <AlertCircle size={12} /> NO SENSOR DATA
                            </span>
                        )}
                    </div>
                    <p className="text-slate-400">
                        Operational overview for <span className="text-emerald-400 font-bold underline decoration-emerald-500/30">{user.name}</span>
                    </p>
                </div>
                {user.role === 'farmer' && (
                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={() => {
                                setEditingJobId(null);
                                setJobForm({ title: '', description: '', location: '', salary: '', type: 'Harvesting', contact: '' });
                                setShowJobForm(true);
                            }} 
                            className="btn-secondary shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-blue-500/50 text-blue-400 py-4 px-6 group flex items-center gap-2 rounded-2xl hover:bg-blue-500/10 transition-all"
                        >
                            <Plus size={20} className="group-hover:scale-110 transition-transform" />
                            Post Job
                        </button>
                        <button 
                            onClick={handleSpoilageCheck} 
                            className="btn-secondary shadow-[0_0_20px_rgba(245,158,11,0.2)] border border-amber-500/50 text-amber-400 py-4 px-6 group flex items-center gap-2 rounded-2xl hover:bg-amber-500/10 transition-all"
                        >
                            <Thermometer size={20} className="group-hover:scale-110 transition-transform" />
                            Post-Harvest Monitoring
                        </button>
                        <button 
                            onClick={handlePredict} 
                            className="btn-primary shadow-[0_0_30px_rgba(16,185,129,0.3)] py-4 px-8 group rounded-2xl flex items-center gap-3"
                        >
                            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                            Run AI Yield Analysis
                        </button>
                    </div>
                )}
                {user.role === 'farmer' && (
                    <div className="flex flex-wrap gap-4 mt-4 w-full">
                        <button 
                            onClick={() => setShowWeatherForm(true)} 
                            className="bg-sky-500/10 border border-sky-500/30 text-sky-400 py-3 px-6 rounded-2xl flex items-center gap-2 hover:bg-sky-500/20 transition-all font-bold text-sm"
                        >
                            <MapPin size={18} /> Get Local Weather Data
                        </button>
                        <button 
                            onClick={() => setShowManualLogForm(true)} 
                            className="bg-purple-500/10 border border-purple-500/30 text-purple-400 py-3 px-6 rounded-2xl flex items-center gap-2 hover:bg-purple-500/20 transition-all font-bold text-sm"
                        >
                            <ClipboardList size={18} /> Manual Soil Kit Entry
                        </button>
                    </div>
                )}
            </header>

            <AnimatePresence>
                {showWeatherForm && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="glass p-8 max-w-md w-full relative border border-white/10"
                        >
                            <button onClick={() => setShowWeatherForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><MapPin className="text-sky-400" /> Location-based Weather</h2>
                            <p className="text-sm text-slate-400 mb-6">Enter your farm's location (e.g. "Karnal", "Pune") to fetch real-time weather and estimate soil moisture automatically.</p>
                            <form onSubmit={handleFetchWeather} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-1">City or District</label>
                                    <input required type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="e.g. Karnal" value={weatherLoc} onChange={e => setWeatherLoc(e.target.value)} />
                                </div>
                                <button type="submit" className="w-full bg-sky-500 text-white py-4 rounded-xl mt-4 font-black hover:bg-sky-600 transition-colors">Fetch & Log Data</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {showManualLogForm && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="glass p-8 max-w-md w-full relative border border-white/10 max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={() => setShowManualLogForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><ClipboardList className="text-purple-400" /> Manual Field Data</h2>
                            <p className="text-sm text-slate-400 mb-6">Enter the exact readings from your physical soil testing kit.</p>
                            <form onSubmit={handleManualLog} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Soil pH (0-14)</label>
                                        <input required type="number" step="0.1" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={manualLog.soilPh} onChange={e => setManualLog({...manualLog, soilPh: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Moisture (%)</label>
                                        <input required type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={manualLog.moisture} onChange={e => setManualLog({...manualLog, moisture: e.target.value})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Temperature (°C)</label>
                                        <input required type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={manualLog.temperature} onChange={e => setManualLog({...manualLog, temperature: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Humidity (%)</label>
                                        <input required type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={manualLog.humidity} onChange={e => setManualLog({...manualLog, humidity: e.target.value})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Nitrogen</label>
                                        <input required type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={manualLog.n} onChange={e => setManualLog({...manualLog, n: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Phosphorus</label>
                                        <input required type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={manualLog.p} onChange={e => setManualLog({...manualLog, p: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Potassium</label>
                                        <input required type="number" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={manualLog.k} onChange={e => setManualLog({...manualLog, k: e.target.value})} />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-purple-500 text-white py-4 rounded-xl mt-4 font-black hover:bg-purple-600 transition-colors">Log Soil Data</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {showJobForm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="glass p-8 max-w-md w-full relative border border-white/10"
                        >
                            <button onClick={() => setShowJobForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-black mb-6">{editingJobId ? 'Edit Farm Job' : 'Post a Farm Job'}</h2>
                            <form onSubmit={handlePostJob} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-1">Job Title</label>
                                    <input required type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Need 5 harvesters" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-1">Description</label>
                                    <textarea required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" placeholder="Details about the work..." rows="3" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})}></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Location</label>
                                        <input required type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" placeholder="Farm location" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Contact Phone</label>
                                        <input required type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. 9876543210" value={jobForm.contact} onChange={e => setJobForm({...jobForm, contact: e.target.value})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Wages/Salary</label>
                                        <input required type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" placeholder="₹500/day" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-400 mb-1">Type</label>
                                        <select className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                                            <option>Harvesting</option>
                                            <option>Irrigation</option>
                                            <option>Fertilizer</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="w-full btn-primary py-4 rounded-xl mt-4 font-black">{editingJobId ? 'Save Changes' : 'Post Job'}</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
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
                {spoilageAlert && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`glass p-10 border-${spoilageAlert.risk_level === 'High' ? 'red' : spoilageAlert.risk_level === 'Medium' ? 'amber' : 'emerald'}-500/40 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-${spoilageAlert.risk_level === 'High' ? 'red' : spoilageAlert.risk_level === 'Medium' ? 'amber' : 'emerald'}-500/20 via-transparent to-transparent overflow-hidden relative group mt-4`}
                    >
                        <div className="absolute right-0 top-0 text-white/5 -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700">
                            <AlertCircle size={300} />
                        </div>
                        <div className="z-10">
                            <div className={`flex items-center gap-2 text-${spoilageAlert.risk_level === 'High' ? 'red' : spoilageAlert.risk_level === 'Medium' ? 'amber' : 'emerald'}-400 font-bold text-sm mb-4 tracking-widest uppercase`}>
                                <Thermometer size={16} /> Post-Harvest Storage Analysis
                            </div>
                            <h2 className="text-4xl font-black mb-3">
                                Spoilage Risk: <span className={`text-${spoilageAlert.risk_level === 'High' ? 'red' : spoilageAlert.risk_level === 'Medium' ? 'amber' : 'emerald'}-400`}>{spoilageAlert.risk_level}</span>
                            </h2>
                            <p className="text-slate-300 text-xl max-w-xl leading-relaxed">
                                {spoilageAlert.alert}
                            </p>
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

                    <div className="lg:col-span-12 mt-6">
                        <ProfitSimulator />
                    </div>

                    <div className="lg:col-span-12 mt-8">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <Briefcase size={28} className="text-blue-500" />
                            Your Posted Jobs
                        </h3>
                        {jobs.length === 0 ? (
                            <div className="glass p-8 text-center text-slate-400 border-white/5">
                                You haven't posted any jobs yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {jobs.map((job) => (
                                    <motion.div 
                                        key={job._id}
                                        className="glass p-8 flex flex-col border-white/5 hover:border-blue-500/30 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-500/20">
                                                {job.type}
                                            </span>
                                            <span className="text-slate-500 text-xs">{job.applicants?.length || 0} applicants</span>
                                        </div>
                                        <h3 className="text-xl font-black mb-2">{job.title}</h3>
                                        <p className="text-slate-400 mb-6 text-sm line-clamp-2">{job.description}</p>
                                        
                                        {job.applicants && job.applicants.length > 0 && (
                                            <div className="mb-6 bg-slate-900/50 rounded-xl p-3 border border-white/5 max-h-32 overflow-y-auto">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Applicants</h4>
                                                <div className="space-y-2">
                                                    {job.applicants.map(app => (
                                                        <div key={app._id || app} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg">
                                                            <span className="text-sm text-white font-bold">{app.name || 'Unknown User'}</span>
                                                            <span className="text-xs text-emerald-400 font-bold">{app.phone || 'No Phone'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="text-emerald-400 font-bold">{job.salary}</span>
                                            <button onClick={() => handleEditJob(job)} className="text-blue-400 hover:text-white font-bold text-sm bg-white/5 px-4 py-2 rounded-xl">Edit Job</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Labourer Dashboard Header & Toggles */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                        <div>
                            <h2 className="text-2xl font-black flex items-center gap-3">
                                <Briefcase size={28} className="text-emerald-500" /> 
                                Local Farm Work
                            </h2>
                            <p className="text-sm text-slate-400 mt-1 flex items-center gap-3">
                                Your Location: <span className="text-emerald-400 font-bold tracking-wide">{user.location || "Rampur, Karnal"}</span>
                                <button 
                                    onClick={() => {
                                        setProfileLoc(user.location || "Rampur, Karnal");
                                        setShowProfile(true);
                                    }}
                                    className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors border border-emerald-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest"
                                >
                                    Edit Settings
                                </button>
                            </p>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex items-center gap-4 bg-slate-800/80 p-2 rounded-2xl border border-white/5">
                            <span className="text-sm font-bold text-slate-300 pl-2">Nearby Jobs Only</span>
                            <button 
                                onClick={() => setNearbyOnly(!nearbyOnly)}
                                className={`w-14 h-8 rounded-full relative transition-colors duration-300 outline-none ${nearbyOnly ? 'bg-emerald-500' : 'bg-slate-600'}`}
                            >
                                <motion.div 
                                    className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-md"
                                    animate={{ left: nearbyOnly ? '30px' : '4px' }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jobs.map((j) => {
                            const jobLoc = j.location ? j.location.toLowerCase() : '';
                            const uLoc = (user.location || "Rampur, Karnal").toLowerCase();
                            let proximity = { label: 'Far', score: 1, color: 'text-red-400', bg: 'bg-red-500/10', circle: 'bg-red-500' };
                            
                            const village = uLoc.split(',')[0]?.trim();
                            const district = uLoc.split(',')[1]?.trim() || 'karnal';

                            if (jobLoc.includes(village) || jobLoc === uLoc) {
                                proximity = { label: 'Very Near', score: 3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', circle: 'bg-emerald-500' };
                            } else if (jobLoc.includes(district)) {
                                proximity = { label: 'Near', score: 2, color: 'text-amber-400', bg: 'bg-amber-500/10', circle: 'bg-amber-500' };
                            }

                            return { ...j, proximity };
                        })
                        .filter(j => nearbyOnly ? j.proximity.score >= 2 : true)
                        .sort((a, b) => b.proximity.score - a.proximity.score) // Closest jobs first
                        .map((job, idx) => (
                            <motion.div 
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -8 }}
                                className={`glass p-10 flex flex-col border border-white/5 hover:border-${job.proximity.color.split('-')[1]}-500/40 transition-all group bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl relative overflow-hidden`}
                            >
                                {/* Recommended Badge logic: If it pays well and is very near */}
                                {job.proximity.score === 3 && job.salary.includes('600') && (
                                    <div className="absolute -right-12 top-6 bg-emerald-500 text-white font-black text-[10px] py-1 px-12 transform rotate-45 shadow-lg">
                                        TOP PICK
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-emerald-500/10 rounded-3xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <Briefcase size={28} />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase border border-emerald-500/20">
                                            {job.type}
                                        </span>
                                        {/* Proximity Pill */}
                                        <span className={`px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase border border-white/5 ${job.proximity.bg} ${job.proximity.color} flex items-center gap-2`}>
                                            <span className={`w-2 h-2 rounded-full ${job.proximity.circle} animate-pulse`} />
                                            {job.proximity.label}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black mb-2 tracking-tight">{job.title}</h3>
                                <p className="text-slate-400 text-sm font-bold mb-6">📍 {job.location || 'Unknown Location'}</p>
                                
                                <p className="text-slate-500 mb-8 line-clamp-3 leading-relaxed text-sm flex-1">{job.description}</p>
                                
                                <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/10">
                                    <div>
                                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Wages</span>
                                        <span className="text-2xl font-black text-emerald-400">{job.salary}</span>
                                        {job.contact && <span className="block text-[10px] mt-1 text-slate-400 font-bold bg-slate-800 rounded px-2 py-1"><span className="text-slate-500 font-normal">☎</span> {job.contact}</span>}
                                    </div>
                                    <button 
                                        onClick={() => handleApply(job._id)}
                                        disabled={job.applicants?.some(a => (a._id || a) === user.id)}
                                        className={`px-8 py-3 rounded-2xl font-black shadow-lg transition-all ${job.applicants?.some(a => (a._id || a) === user.id) ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed' : 'btn-primary shadow-emerald-500/20 hover:-translate-y-1'}`}
                                    >
                                        {job.applicants?.some(a => (a._id || a) === user.id) ? 'Applied' : 'Apply'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Profile Settings Modal */}
            <AnimatePresence>
                {showProfile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                            onClick={() => setShowProfile(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-3xl z-10 w-full max-w-md shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setShowProfile(false)}
                                className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-black text-white mb-2">Profile Settings</h2>
                            <p className="text-sm text-slate-400 mb-8">Update your saved location to find jobs immediately near you.</p>

                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Base Location (Village, District)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="e.g. Rampur, Karnal"
                                        value={profileLoc}
                                        onChange={(e) => setProfileLoc(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                        <Info size={12} /> Format exactly as "Village, District" for best results
                                    </p>
                                </div>
                                
                                <button type="submit" className="w-full btn-primary py-4 rounded-xl font-black shadow-lg shadow-emerald-500/20 hover:-translate-y-1 transition-transform">
                                    Save Profile Settings
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Dashboard;
