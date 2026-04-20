import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto glass flex justify-between items-center px-8 py-4 border-emerald-500/20">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-emerald-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                        <Sprout size={28} className="text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                        AgriAI
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">Home</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 font-medium transition-colors">
                                <LayoutDashboard size={20} />
                                Dashboard
                            </Link>
                            <div className="h-6 w-px bg-white/10 mx-2" />
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                                    <LogOut size={22} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="px-6 py-2.5 text-slate-300 hover:text-white font-semibold transition-all">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary flex items-center gap-2 border border-emerald-400/30">
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu (simplified) */}
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:hidden absolute top-24 left-6 right-6 glass p-6 flex flex-col gap-4 z-50"
                >
                    <Link to="/" onClick={() => setIsOpen(false)} className="py-2 text-lg">Home</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="py-2 text-lg">Dashboard</Link>
                            <button onClick={handleLogout} className="text-left py-2 text-lg text-red-400">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="py-2 text-lg">Login</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-center">Register</Link>
                        </>
                    )}
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
