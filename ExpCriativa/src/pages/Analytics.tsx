import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp as ChartLine, PieChart as ChartPie, Database, Calendar, Users, BadgeDollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import {
  fetchCurrentOrgProfile,
  OrgProfile,
} from '@/service/organization-settings-service';
// Import your actual services
import { fetchDonationChartData } from '@/service/donation-chart-service';
import { fetchDonationStats, fetchOrganizations } from '@/service/data-query-service';

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

  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
    const [stats, setStats] = useState<DonationStats | null>(null);
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          
          // Load both organization profile and donation stats
          const [profileData, statsData] = await Promise.all([
            fetchCurrentOrgProfile(),
            fetchDonationStats({ orgId: localStorage.getItem("userId") })
          ]);
          
          setOrgProfile(profileData);
          setStats(statsData);
          
        } catch (err) {
          if (err instanceof Error) setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, []);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'Last 12 months' | 'Last 6 months' | 'Last 30 days'>('Last 12 months');
  console.log(stats)
    
    const currency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

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
const donorGrowthData = chartData.map((item, index) => {
  // Only add new donors if there are actual donations
  const newDonors = item.donations > 0 ? item.donations : 0;
  
  return {
    month: item.month,
    newDonors: newDonors,
    cumulativeDonors: chartData.slice(0, index + 1).reduce((sum, curr) => {
      // Only count donors from months with actual donations
      return sum + (curr.donations > 0 ? Math.max(1, Math.floor(curr.donations / 2)) : 0);
    }, 0)
  };
});
if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;  
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
      <Sidebar organizationName={orgProfile?.orgName ? `${orgProfile.orgName}` : 'Charity'}/>
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
    <Sidebar organizationName={orgProfile?.orgName ? `${orgProfile.orgName}` : 'Charity'}/>
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
                <div className="text-2xl font-bold">{formatCurrency(stats.totalDonations)}</div>
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
                <div className="text-2xl font-bold">{stats.donorCount}</div>
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
                <div className="text-2xl font-bold">{formatCurrency(stats.avgDonation)}</div>
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