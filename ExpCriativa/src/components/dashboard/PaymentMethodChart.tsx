import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Define colors for different payment methods
const COLORS = {
  'PIX': '#0088FE',
  'Credit Card': '#00C49F',
  'Bank Transfer': '#FFBB28',
  'Cash': '#FF8042',
  'PayPal': '#8884D8',
  'Other': '#82CA9D'
};

const PaymentMethodChart = ({ donations }) => {
  // Process donations data to count payment methods

  console.log(donations)
  console.log(!Array.isArray(donations))
  const chartData = useMemo(() => {
    if (!donations || !Array.isArray(donations)) {
      return [];
    }

    // Count occurrences of each donation method
    const methodCounts = donations.reduce((acc, donation) => {
      const method = donation.donationMethod || 'Unknown';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    console.log(methodCounts)

    // Convert to array format for recharts
    return Object.entries(methodCounts).map(([method, count]) => ({
      name: method,
      value: count,
      percentage: ((Number(count) / donations.length) * 100).toFixed(1)
    }));
  }, [donations]);

  // Custom tooltip to show count and percentage
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">
            Count: {data.value} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderLabel = (entry) => {
    return `${entry.name}: ${entry.percentage}%`;
  };

  if (!chartData.length) {
    return (
      <div className="h-[220px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>No donation data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name] || COLORS['Other']} 
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend below the chart */}
      <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS[entry.name] || COLORS['Other'] }}
            />
            <span>{entry.name}: {entry.value.toString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodChart;