import React, { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, IndianRupee, Sprout } from 'lucide-react';

const ProfitSimulator = () => {
  const [formData, setFormData] = useState({
    cropType: 'Wheat',
    landArea: 1, 
    yieldPerAcre: 2000, 
    marketPrice: 25, 
    cultivationCost: 15000, 
  });

  const [result, setResult] = useState(null);

  const calculateProfit = (e) => {
    e.preventDefault();
    const totalYield = formData.landArea * formData.yieldPerAcre; 
    const totalRevenue = totalYield * formData.marketPrice; 
    const netProfit = totalRevenue - formData.cultivationCost;
    
    setResult({
      totalRevenue,
      netProfit,
      isProfitable: netProfit >= 0
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cropType' ? value : Number(value)
    }));
  };

  return (
    <div className="glass p-10 border-white/5 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl rounded-3xl w-full">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Smart Profit Simulator</h2>
            <p className="text-slate-400 mt-1">Estimate your financial outcomes before cultivation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Form */}
        <form onSubmit={calculateProfit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-500" /> Crop Type
              </label>
              <select 
                name="cropType" 
                value={formData.cropType} 
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 appearance-none"
              >
                <option value="Wheat" className="bg-slate-800 text-white cursor-pointer">Wheat</option>
                <option value="Rice" className="bg-slate-800 text-white cursor-pointer">Rice</option>
                <option value="Maize" className="bg-slate-800 text-white cursor-pointer">Maize</option>
                <option value="Cotton" className="bg-slate-800 text-white cursor-pointer">Cotton</option>
                <option value="Sugarcane" className="bg-slate-800 text-white cursor-pointer">Sugarcane</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">Land Area (Acres)</label>
              <input 
                type="number" 
                name="landArea" 
                value={formData.landArea} 
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                min="0.1" step="0.1" required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">Expected Yield (kg/acre)</label>
              <input 
                type="number" 
                name="yieldPerAcre" 
                value={formData.yieldPerAcre} 
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                min="0" required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">Market Price (₹/kg)</label>
              <input 
                type="number" 
                name="marketPrice" 
                value={formData.marketPrice} 
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                min="0" required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-400">Total Cultivation Cost (₹)</label>
              <input 
                type="number" 
                name="cultivationCost" 
                value={formData.cultivationCost} 
                onChange={handleChange}
                placeholder="Include seeds, labor, fertilizer..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                min="0" required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full btn-primary py-4 rounded-xl mt-4 font-black shadow-lg shadow-emerald-500/20 hover:-translate-y-1 transition-transform"
          >
            Calculate Estimate
          </button>
        </form>

        {/* Results Panel */}
        <div className="bg-slate-900/50 rounded-2xl p-8 border border-white/5 flex flex-col justify-center shadow-inner relative overflow-hidden">
          {result ? (
            <div className="z-10 space-y-8 animate-in fade-in zoom-in duration-300">
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Total Estimated Revenue</h3>
                <div className="flex items-center text-3xl font-black text-white">
                  <IndianRupee className="w-7 h-7 mr-1 text-slate-400" />
                  {result.totalRevenue.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Estimated Net Profit/Loss</h3>
                <div className={`flex items-center text-5xl font-black ${result.isProfitable ? 'text-emerald-400' : 'text-red-500'}`}>
                  {result.isProfitable ? <TrendingUp className="w-10 h-10 mr-2" /> : <TrendingDown className="w-10 h-10 mr-2 relative top-1" />}
                  <IndianRupee className="w-9 h-9 mr-1" />
                  {Math.abs(result.netProfit).toLocaleString('en-IN')}
                </div>
                
                <div className={`mt-6 p-4 rounded-xl border ${result.isProfitable ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <p className={`text-sm tracking-wide leading-relaxed font-bold ${result.isProfitable ? 'text-emerald-300' : 'text-red-300'}`}>
                    {result.isProfitable 
                      ? `Great news! Scaling your operations to grow ${formData.cropType} looks like it will result in a positive financial ROI.` 
                      : `Warning: Cultivating ${formData.cropType} with these projections will likely result in a financial deficit.`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="z-10 text-center text-slate-500">
              <Calculator className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="font-medium text-lg text-slate-400">Enter your field parameters</p>
              <p className="text-sm mt-2 opacity-60">to project your harvest profitability</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitSimulator;
