import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Zap, Users, ArrowRight, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="pt-24 space-y-32 overflow-hidden">
            {/* Hero Section */}
            <section className="relative px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 py-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-center lg:text-left z-10"
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-sm mb-6"
                        >
                            <Zap size={16} />
                            <span>AI-POWERED AGRICULTURE</span>
                        </motion.div>
                        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
                            Smart Farming <br />
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
                                Redefined.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed">
                            Monitor soil health in real-time and predict harvest yields with 92% accuracy using our deep-learning neural networks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                            <Link to="/register" className="btn-primary text-xl px-10 py-5 flex items-center justify-center gap-3">
                                Start Your Farm <ArrowRight size={24} />
                            </Link>
                            <Link to="/login" className="glass px-10 py-5 text-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-semibold">
                                View Demo
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="flex-1 relative flex justify-center"
                    >
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full" />
                        <img 
                            src="/agri_3d_plant_glassmorphism_1776601611679.png" 
                            alt="Agri AI 3D Assets" 
                            className="w-[500px] h-[500px] object-contain drop-shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-float"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Features (Bento Grid) */}
            <section className="px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Precision Tools</h2>
                    <p className="text-slate-400">Everything you need to manage your agricultural assets.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div whileHover={{ y: -10 }} className="glass p-8 md:col-span-2 bg-gradient-to-br from-slate-800/50 to-emerald-900/20 border-emerald-500/30">
                        <Zap size={48} className="text-emerald-400 mb-6" />
                        <h3 className="text-3xl font-bold mb-4">Predictive Analytics</h3>
                        <p className="text-slate-400 text-lg max-w-lg">
                            Our proprietary Random Forest algorithms calculate expected yield based on pH, NPK levels, and historical weather patterns.
                        </p>
                    </motion.div>

                    <motion.div whileHover={{ y: -10 }} className="glass p-8 bg-gradient-to-br from-slate-800/50 to-blue-900/20 border-blue-500/30">
                        <ShieldCheck size={48} className="text-blue-400 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Live Monitoring</h3>
                        <p className="text-slate-400">Continuous telemetry feed (0.5s latency).</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -10 }} className="glass p-8 bg-gradient-to-br from-slate-800/50 to-amber-900/20 border-amber-500/30">
                        <Users size={48} className="text-amber-400 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Labour Hub</h3>
                        <p className="text-slate-400">Connecting farm owners with skilled daily-wage workers.</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -10 }} className="glass p-8 md:col-span-2 bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-purple-500/30 flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold mb-2">Grow with Tech</h3>
                            <p className="text-slate-400">Join 2.4k+ farmers today.</p>
                        </div>
                        <Link to="/register" className="btn-primary">Join Platform</Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/10 text-center text-slate-500">
                <div className="flex justify-center gap-2 mb-4 items-center font-bold text-white">
                    <Sprout size={20} className="text-emerald-500" />
                    AgriAI
                </div>
                <p>&copy; 2026 Smart Agriculture Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
