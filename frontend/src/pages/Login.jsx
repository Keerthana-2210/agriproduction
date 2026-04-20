import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-20">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="glass p-10 border-white/5 shadow-emerald-500/5 shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="bg-emerald-500/10 p-5 rounded-3xl text-emerald-500 ring-1 ring-emerald-500/20">
                            <LogIn size={40} />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black text-center mb-2">Welcome</h2>
                    <p className="text-slate-500 text-center mb-10">Access your agricultural command center.</p>
                    
                    {error && (
                        <motion.div 
                            initial={{ x: -20 }} animate={{ x: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-sm font-bold flex items-center gap-3"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Domain</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="input-field w-full pl-12 h-14 text-lg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field w-full pl-12 h-14 text-lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full h-14 text-lg mt-4 flex items-center justify-center gap-3">
                            Authenticate <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-white/5 text-center">
                        <p className="text-slate-500">
                            No credentials? <Link to="/register" className="text-emerald-400 font-bold hover:underline">Provision account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
