import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FarmingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I am your AI farming assistant. You can ask me about crops, yield, disease, harvest, or storage.' }
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputText('');

        // Simulate AI thinking delay
        setTimeout(() => {
            const botResponse = generateResponse(userMsg);
            setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        }, 600);
    };

    const generateResponse = (input) => {
        const lowerInput = input.toLowerCase();
        
        // Simple NLP Intent Scoring System
        let scores = { crop: 0, yield: 0, pest: 0, harvest: 0, storage: 0, fertilizer: 0 };

        if (lowerInput.match(/(crop|grow|plant|seed|sow)/)) scores.crop += 1; // Generic intent gets lower weight
        if (lowerInput.match(/(yield|production|output)/)) scores.yield += 2;
        if (lowerInput.match(/(pest|disease|insect|bug|rot|fungus|worm)/)) scores.pest += 3; // Specific problem gets higher weight
        if (lowerInput.match(/(harvest|mature|cut|reap)/)) scores.harvest += 2;
        if (lowerInput.match(/(storage|store|warehouse|silo)/)) scores.storage += 2;
        if (lowerInput.match(/(fertilizer|npk|soil|urea|compost)/)) scores.fertilizer += 2;

        const maxIntent = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

        if (scores[maxIntent] === 0) {
            return "I am your farming assistant! Please try rephrasing your question to involve crops, yield, diseases, harvest, or storage so I can give you an expert answer.";
        }

        switch (maxIntent) {
            case 'pest': return "For organic pest control, spraying Neem oil mixed with mild soap water is highly effective against aphids and whiteflies. For severe fungal diseases, applying a recommended synthetic fungicide promptly is crucial.";
            case 'harvest': return "Optimal harvest timing depends on the crop. Look for visual signs like yellowing of leaves in wheat or a dropping moisture count in grains (below 14%). Harvesting at the right time significantly reduces post-harvest loss.";
            case 'storage': return "Proper post-harvest storage requires a cool, dry place. Keep relative humidity below 65% for grains to prevent mold. Ensure cross-ventilation and keep produce elevated on pallets away from pests.";
            case 'yield': return "Low yield is usually caused by inadequate soil nutrients, poor irrigation scheduling, or pest attacks. Ensure you are applying the right NPK ratios and maintaining soil moisture at 40-60%.";
            case 'fertilizer': return "Soil management is key. A balanced NPK fertilizer (like 10-26-26 for basal dose) is widely used. However, I highly recommend using the 'Sensors' dashboard to run a live soil pH test before application.";
            case 'crop': return "Based on general agricultural data, if your soil has good drainage, consider cash crops like Cotton or Maize. For water-heavy areas, Rice is suitable. Always test your NPK levels before planting.";
            default: return "I am your farming assistant. You can ask me about crops, yield, disease, harvest, or storage.";
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chatbot-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.2)] rounded-3xl w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-emerald-600/20 border-b border-white/5 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 rounded-full">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-tight">AgriBot Assistant</h3>
                                    <p className="text-xs text-emerald-400 font-medium tracking-wide">AI-Powered Farming Expert</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
                            {messages.map((msg, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                                            msg.sender === 'user' 
                                                ? 'bg-blue-600/90 text-white rounded-tr-none' 
                                                : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-slate-900">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask about crops, pests..."
                                    className="w-full bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 rounded-full pl-5 pr-14 py-3 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="absolute right-2 p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-full transition-colors flex items-center justify-center"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-white/10 transition-colors"
                >
                    <MessageSquare className="w-7 h-7" />
                </motion.button>
            )}
        </div>
    );
};

export default FarmingChatbot;
