import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RubberSegment from '../ui/RubberSegment';
import Counter from '../ui/Counter';
import { useTransactionsStore } from '../../store/useTransactionsStore';

const DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const ChartCard: React.FC = () => {
  const [type, setType] = useState<string>('Расходы');
  const [timeRange, setTimeRange] = useState<string>('Неделя'); // Неделя | Месяц | Год
  const transactions = useTransactionsStore((state) => state.transactions);

  const isIncome = type === 'Доходы';

  // Compute dynamic curve data according to selected timeframe (Week, Month, Year)
  const chartData = React.useMemo(() => {
    const now = new Date();
    const result: { name: string; income: number; expense: number }[] = [];

    if (timeRange === 'Неделя') {
      // 7 days ending today
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        result.push({ name: DAYS[d.getDay()], income: 0, expense: 0 });
      }
      transactions.forEach((tx) => {
        const txTime = tx.timestamp || Date.now();
        const diffDays = Math.floor((now.getTime() - txTime) / (24 * 60 * 60 * 1000));
        if (diffDays >= 0 && diffDays < 7) {
          const idx = 6 - diffDays;
          if (result[idx]) {
            if (tx.type === 'income') result[idx].income += tx.amount;
            else result[idx].expense += tx.amount;
          }
        }
      });
    } else if (timeRange === 'Месяц') {
      // 4 weeks of current 30-day window
      result.push(
        { name: '1-я нед', income: 0, expense: 0 },
        { name: '2-я нед', income: 0, expense: 0 },
        { name: '3-я нед', income: 0, expense: 0 },
        { name: '4-я нед', income: 0, expense: 0 }
      );
      transactions.forEach((tx) => {
        const txTime = tx.timestamp || Date.now();
        const diffDays = Math.floor((now.getTime() - txTime) / (24 * 60 * 60 * 1000));
        if (diffDays >= 0 && diffDays < 28) {
          const weekIdx = 3 - Math.floor(diffDays / 7);
          if (result[weekIdx]) {
            if (tx.type === 'income') result[weekIdx].income += tx.amount;
            else result[weekIdx].expense += tx.amount;
          }
        }
      });
    } else {
      // Год (последние 6 или 12 месяцев)
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push({ name: MONTHS[d.getMonth()], income: 0, expense: 0 });
      }
      transactions.forEach((tx) => {
        const txDate = new Date(tx.timestamp || Date.now());
        const diffMonths = (now.getFullYear() - txDate.getFullYear()) * 12 + (now.getMonth() - txDate.getMonth());
        if (diffMonths >= 0 && diffMonths < 6) {
          const idx = 5 - diffMonths;
          if (result[idx]) {
            if (tx.type === 'income') result[idx].income += tx.amount;
            else result[idx].expense += tx.amount;
          }
        }
      });
    }

    return result;
  }, [transactions, timeRange]);

  const totalPeriodSum = chartData.reduce((acc, curr) => acc + (isIncome ? curr.income : curr.expense), 0);

  return (
    <div className="fintech-card p-4 sm:p-5 mb-4">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-black uppercase text-white tracking-wider m-0">
            Динамика {isIncome ? 'доходов' : 'трат'}
          </h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-[#8E8A9E] font-bold">Сумма за период ({timeRange}):</span>
            <span className={`text-sm font-black flex items-center ${isIncome ? 'text-[#32D74B]' : 'text-[#FF453A]'}`}>
              <span>{isIncome ? '+' : '-'}</span>
              <Counter key={`${type}-${timeRange}`} value={totalPeriodSum} fontSize={14} textColor={isIncome ? '#32D74B' : '#FF453A'} fontWeight={900} />
              <span className="text-xs ml-0.5">₽</span>
            </span>
          </div>
        </div>

        {/* Dual Switchers: Time Range & Type */}
        <div className="flex flex-wrap items-center gap-2">
          <RubberSegment
            items={['Неделя', 'Месяц', 'Год']}
            value={timeRange}
            onChange={(val) => setTimeRange(val)}
            trackColor="#0A0910"
            thumbColor="#7D39EB"
            textColor="#8E8A9E"
            activeTextColor="#FFFFFF"
            size="sm"
            radius={9999}
            inset={2}
            stretch={40}
            squash={2}
            speed={0.85}
          />

          <RubberSegment
            items={['Расходы', 'Доходы']}
            value={type}
            onChange={(val) => setType(val)}
            trackColor="#0A0910"
            thumbColor={isIncome ? '#32D74B' : '#FF453A'}
            textColor="#8E8A9E"
            activeTextColor="#0A0910"
            size="sm"
            radius={9999}
            inset={2}
            stretch={45}
            squash={2}
            speed={0.85}
          />
        </div>
      </div>
      
      <div style={{ height: '220px', width: '100%', marginTop: '10px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="name" stroke="#8E8A9E" fontSize={12} fontWeight={700} />
            <YAxis stroke="#8E8A9E" fontSize={12} fontWeight={700} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#13111C',
                border: '1px solid rgba(198, 255, 51, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                color: '#FFFFFF',
                fontWeight: 800
              }}
            />
            <Line 
              type="monotone" 
              dataKey={isIncome ? 'income' : 'expense'} 
              stroke={isIncome ? '#32D74B' : '#FF453A'} 
              strokeWidth={3}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-in-out"
              dot={{ stroke: '#0A0910', strokeWidth: 2, fill: isIncome ? '#32D74B' : '#FF453A', r: 4 }}
              activeDot={{ r: 6, fill: isIncome ? '#32D74B' : '#FF453A' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
