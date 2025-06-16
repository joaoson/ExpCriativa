import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp as ChartLine, PieChart as ChartPie, Database, Calendar, Users, BadgeDollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

// Import your actual services
// const { fetchDonationChartData } = require('./services/donation-chart-service');
// const { fetchDonationStats, fetchOrganizations } = require('./services/data-query-service');

// Interfaces based on your services
interface MonthlyDonationData {
  month: string;
  donations: number;
  TotalAmount: number;
}

interface DonationStats {
  totalDonations: number;
  donorCount: number;
  avgDonation: number;
}

interface DonationChartFilters {
  orgId?: string | number | null;
  timeRange?: 'Last 12 months' | 'Last 6 months' | 'Last 30 days';
}

interface DonationStatsFilters {
  orgId?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
}

// Temporary service functions - replace these with your actual service imports
const fetchDonationChartData = async (filters: DonationChartFilters = {}): Promise<MonthlyDonationData[]> => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Calculate date range based on timeRange filter
  const endDate = new Date();
  let startDate = new Date();
  
  switch (filters.timeRange) {
    case 'Last 6 months':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case 'Last 30 days':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case 'Last 12 months':
    default:
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }

  // Format dates for API
  const formattedStartDate = startDate.toISOString().split('T')[0];
  const formattedEndDate = endDate.toISOString().split('T')[0];

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (filters.orgId) {
    queryParams.append('orgId', String(filters.orgId));
  }
  queryParams.append('startDate', formattedStartDate);
  queryParams.append('endDate', formattedEndDate);

  const queryString = queryParams.toString();
  const API_BASE_URL = 'https://localhost:7142';
  const requestUrl = `${API_BASE_URL}/api/Donations${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} ${errorData}`);
    }

    const donations = await response.json();
    
    // Process raw donation data into monthly aggregates
    const monthlyData = processMonthlyDonationData(donations, startDate, endDate);
    return monthlyData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while fetching donation chart data.');
  }
};

const fetchDonationStats = async (filters: DonationStatsFilters = {}): Promise<DonationStats> => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const queryParams = new URLSearchParams();
  if (filters.orgId) {
    queryParams.append('orgId', String(filters.orgId));
  }
  if (filters.startDate) {
    queryParams.append('startDate', filters.startDate);
  }
  if (filters.endDate) {
    queryParams.append('endDate', filters.endDate);
  }

  const queryString = queryParams.toString();
  const API_BASE_URL = 'https://localhost:7142';
  const requestUrl = `${API_BASE_URL}/api/Donations${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} ${errorData}`);
    }

    const donations = await response.json();

    let totalDonations = 0;
    const donorIds = new Set<number>();

    donations.forEach((donation: any) => {
      if (typeof donation.donationAmount === 'number') {
        totalDonations += donation.donationAmount;
      }
      if (typeof donation.donorId === 'number') {
        donorIds.add(donation.donorId);
      }
    });

    const donorCount = donorIds.size;
    const avgDonation = donorCount > 0 ? totalDonations / donorCount : 0;

    return {
      totalDonations: totalDonations,
      donorCount: donorCount,
      avgDonation: avgDonation,
    };
  } catch (error) {
    console.error('Error fetching donation statistics:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred while fetching donation statistics.');
  }
};

function processMonthlyDonationData(donations: any[], startDate: Date, endDate: Date): MonthlyDonationData[] {
  const months: MonthlyDonationData[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const monthKey = monthNames[currentDate.getMonth()];
    months.push({
      month: monthKey,
      donations: 0,
      TotalAmount: 0
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
    if (months.length >= 12) break;
  }
  
  donations.forEach(donation => {
    const donationDate = new Date(donation.donationDate);
    const monthIndex = donationDate.getMonth();
    const monthKey = monthNames[monthIndex];
    
    const monthData = months.find(m => m.month === monthKey);
    if (monthData) {
      monthData.donations += 1;
      monthData.TotalAmount += donation.donationAmount || 0;
    }
  });
  
  return months;
}

const Analytics = () => {
  const [chartData, setChartData] = useState<MonthlyDonationData[]>([]);
  const [donationStats, setDonationStats] = useState<DonationStats>({
    totalDonations: 0,
    donorCount: 0,
    avgDonation: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'Last 12 months' | 'Last 6 months' | 'Last 30 days'>('Last 12 months');

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [chartResult, statsResult] = await Promise.all([
          fetchDonationChartData({ timeRange }),
          fetchDonationStats({})
        ]);

        setChartData(chartResult);
        setDonationStats(statsResult);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error loading analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [timeRange]);

  // Generate donor growth data based on chart data
  const donorGrowthData = chartData.map((item, index) => ({
    month: item.month,
    newDonors: Math.max(1, Math.floor(item.donations / 2)),
    cumulativeDonors: chartData.slice(0, index + 1).reduce((sum, curr) => sum + Math.max(1, Math.floor(curr.donations / 2)), 0)
  }));

  // Generate demographic data (you may want to add actual demographic endpoints)
  const demographicData = [
    { name: 'Individual', value: 65, color: '#3b82f6' },
    { name: 'Corporate', value: 25, color: '#10b981' },
    { name: 'Foundation', value: 10, color: '#f59e0b' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <div className="flex flex-col space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading analytics data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <div className="flex flex-col space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <p className="mt-4 text-red-600">Error loading data: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="flex flex-col space-y-6 p-6 animate-fade-in">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Donation Analytics</h1>
            <p className="text-muted-foreground">Detailed metrics and insights for your organization</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(donationStats.totalDonations)}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Total amount raised
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donationStats.donorCount}</div>
                <p className="text-xs text-muted-foreground">
                  <Users className="inline h-3 w-3 mr-1" />
                  Unique contributors
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
                <ChartLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(donationStats.avgDonation)}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Per donor average
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-end">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'Last 12 months' | 'Last 6 months' | 'Last 30 days')}
              className="px-4 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 6 months">Last 6 months</option>
              <option value="Last 12 months">Last 12 months</option>
            </select>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={20} className="text-blue-500" />
                  <span>Donation Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Line 
                        type="monotone" 
                        dataKey="TotalAmount" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} className="text-green-500" />
                  <span>Donor Growth</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={donorGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="newDonors" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartPie size={20} className="text-orange-500" />
                  <span>Donor Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {demographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Financial Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Donation Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'donations' ? value : formatCurrency(value as number),
                        name === 'donations' ? 'Number of Donations' : 'Total Amount'
                      ]}
                    />
                    <Bar dataKey="donations" fill="#3b82f6" name="donations" />
                    <Bar dataKey="TotalAmount" fill="#10b981" name="TotalAmount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;