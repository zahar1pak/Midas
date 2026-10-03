import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getCategoryPixelIcon } from '../ui/PixelIcons';
import { useTransactionsStore } from '../../store/useTransactionsStore';

const CATEGORY_COLORS: Record<string, string> = {
  'Супермаркеты': '#32D74B',
  'Еда и кафе': '#C6FF33',
  'Транспорт': '#60A5FA',
  'Развлечения': '#7D39EB',
  'Одежда': '#FFA012',
  'Подписки': '#F472B6',
  'Прочее': '#8E8A9E'
};

const CategoryBreakdown: React.FC = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Group all expense items by category
  const { categoryData, categoryItems, totalExpense } = React.useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};
    const itemsMap: Record<string, typeof expenses> = {};

    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      if (!itemsMap[t.category]) itemsMap[t.category] = [];
      itemsMap[t.category].push(t);
    });

    const list = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#C6FF33',
      icon: getCategoryPixelIcon(name, 16)
    }));

    list.sort((a, b) => b.value - a.value);
    const total = list.reduce((acc, curr) => acc + curr.value, 0);

    return { categoryData: list, categoryItems: itemsMap, totalExpense: total };
  }, [transactions]);

  const toggleExpand = (catName: string) => {
    setExpandedCategory(expandedCategory === catName ? null : catName);
  };

  return (
    <div className="fintech-card p-4 sm:p-5 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-black uppercase text-white tracking-wider m-0">
            Траты по категориям
          </h2>
          <div className="text-[11px] text-[#8E8A9E] font-medium mt-0.5">
            Нажми на категорию, чтобы раскрыть покупки
          </div>
        </div>
        <span className="text-xs font-bold text-[#8E8A9E]">
          Всего: {totalExpense.toLocaleString('ru-RU')} ₽
        </span>
      </div>
      
      {categoryData.length === 0 ? (
        <div className="text-center py-8 text-[#8E8A9E] text-xs font-bold">
          Нет записей о расходах для формирования диаграммы
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div style={{ height: '220px', width: '100%', maxWidth: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="transparent"
                  isAnimationActive={true}
                  animationDuration={800}
                  label={({ name, value }) => `${name}: ${value.toLocaleString('ru-RU')} ₽`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#13111C',
                    border: '1px solid rgba(198, 255, 51, 0.3)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontWeight: 800
                  }}
                  formatter={(val: any) => [`${Number(val).toLocaleString('ru-RU')} ₽`, 'Расход']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Interactive Expandable Category List */}
          <div className="w-full flex flex-col gap-2">
            {categoryData.map((item, idx) => {
              const isExpanded = expandedCategory === item.name;
              const purchases = categoryItems[item.name] || [];

              return (
                <div
                  key={idx}
                  className="flex flex-col rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden transition-all"
                >
                  {/* Category Header Row (Clickable) */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.name)}
                    className="flex justify-between items-center p-3 text-left hover:bg-white/[0.02] transition-colors w-full"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{item.name}</span>
                        <span className="text-[10px] text-[#8E8A9E] font-medium">
                          {purchases.length} {purchases.length === 1 ? 'операция' : 'операций'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8E8A9E]">
                        {totalExpense > 0 ? `${Math.round((item.value / totalExpense) * 100)}%` : '0%'}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-white">
                        {item.value.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="text-[#8E8A9E]">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Purchases Detailed List */}
                  {isExpanded && (
                    <div className="p-2.5 pt-0 border-t border-white/[0.04] bg-black/30 flex flex-col gap-1.5">
                      {purchases.map((p) => (
                        <div
                          key={p.id}
                          className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02] text-xs"
                        >
                          <div>
                            <div className="font-extrabold text-white">{p.description}</div>
                            <div className="text-[10px] text-[#8E8A9E]">{p.date}</div>
                          </div>
                          <div className="font-black text-[#FF453A]">
                            -{p.amount.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;
