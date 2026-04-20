import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SensorChart = ({ data, title, dataKey, color }) => {
    return (
        <div className="glass p-6 h-[300px]">
            <h3 className="text-xl font-semibold mb-4 text-dim">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleTimeString()} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill={`url(#color${dataKey})`} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SensorChart;
