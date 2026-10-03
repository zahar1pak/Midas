import React from 'react';
import StatsOverview from '../components/stats/StatsOverview';
import ChartCard from '../components/stats/ChartCard';
import CategoryBreakdown from '../components/stats/CategoryBreakdown';

const StatsPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-4 max-w-4xl mx-auto">
      <StatsOverview />
      <ChartCard />
      <CategoryBreakdown />
    </div>
  );
};

export default StatsPage;
