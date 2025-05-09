import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchDonationChartData, MonthlyDonationData } from '../../service/donation-chart-service';

const timeRanges = ['Last 12 months', 'Last 6 months', 'Last 30 days'];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].name}
            </span>
            <span className="font-bold text-lumen-500">
              {payload[0].value}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-muted-foreground">
              {payload[1].name}
            </span>
            <span className="font-bold text-blue-400">
              {payload[1].value}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const OverviewChart = () => {
  const [timeRange, setTimeRange] = useState('Last 12 months');
  const [chartData, setChartData] = useState<MonthlyDonationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      try {
        const data = await fetchDonationChartData({ 
          orgId: 1, // Use the appropriate organization ID
          timeRange: timeRange as 'Last 12 months' | 'Last 6 months' | 'Last 30 days'
        });
        setChartData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [timeRange]);

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex items-center justify-center h-[300px]">
          <p>Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex items-center justify-center h-[300px]">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analytics Overview</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a timeframe" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -18,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tickFormatter={(value) => isMobile ? value.substring(0, 1) : value}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                name="Donations"
                dataKey="donations" 
                stroke="#0ea5e9"
                strokeWidth={2.5} 
                dot={false} 
                activeDot={{ r: 6, fill: "#0ea5e9" }} 
              />
              <Line 
                type="monotone"
                name="Total Amount" 
                dataKey="TotalAmount" 
                stroke="#60a5fa" 
                strokeWidth={2.5} 
                dot={false} 
                activeDot={{ r: 6, fill: "#60a5fa" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewChart;