import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MonthlyChart = ({ data }) => {
  const hasRealData = data && data.length > 0;
    
    const chartData = hasRealData ? data : [
        { name: 'Sin datos', total: 0 }
    ];

  return (
        <div className="w-full h-[300px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip 
                        cursor={{ fill: '#1e293b' }}
                        contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            border: '1px solid #334155', 
                            borderRadius: '12px',
                            color: '#fff' 
                        }}
                        itemStyle={{ color: '#6366f1' }}
                    />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                // El último mes siempre resaltado en Indigo brillante
                                fill={index === chartData.length - 1 && hasRealData ? '#6366f1' : '#312e81'} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyChart;