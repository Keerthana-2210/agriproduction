import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, MapPin, ArrowRight, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'farmer', location: '', phone: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="glass p-10 border-white/5 shadow-emerald-500/5 shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="bg-emerald-500/10 p-5 rounded-3xl text-emerald-500 ring-1 ring-emerald-500/20">
                            <UserPlus size={40} />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black text-center mb-2">Join AgriAI</h2>
                    <p className="text-slate-500 text-center mb-10">Start managing your farm with intelligent data.</p>
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 font-bold flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500" size={20} />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    className="input-field w-full pl-12 h-14"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500" size={20} />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className="input-field w-full pl-12 h-14"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500" size={20} />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field w-full pl-12 h-14"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500" size={20} />
                                <input
                                    name="phone"
                                    type="text"
                                    placeholder="Mobile number"
                                    className="input-field w-full pl-12 h-14"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Regional Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500" size={20} />
                                <input
                                    name="location"
                                    type="text"
                                    placeholder="City, State"
                                    className="input-field w-full pl-12 h-14"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Operations Role</label>
                            <div className="relative group">
                                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500" size={20} />
                                <select
                                    name="role"
                                    className="input-field w-full pl-12 h-14 appearance-none cursor-pointer"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="farmer">Agri-Farmer</option>
                                    <option value="labourer">Skilled Labourer</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="submit" className="btn-primary w-full h-14 text-lg mt-4 md:col-span-2 flex items-center justify-center gap-3 shadow-emerald-500/20">
                            Initialize Account <ArrowRight size={22} />
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-white/5 text-center">
                        <p className="text-slate-500">
                            Already registered? <Link to="/login" className="text-emerald-400 font-bold hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
