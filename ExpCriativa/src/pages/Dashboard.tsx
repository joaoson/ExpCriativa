import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import OverviewChart from '@/components/dashboard/OverviewChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, HandHeart, BadgeDollarSign, Calendar, ChartBarBig, ChartPie } from 'lucide-react';
import { DonationStats, fetchDonationStats } from '@/service/data-query-service';
import {
  fetchCurrentOrgProfile,
  OrgProfile,
} from '@/service/organization-settings-service';

const Dashboard = () => {
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;  
  
  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  
  return (
    <div className="flex h-screen overflow-hidden">
    <Sidebar organizationName={orgProfile?.orgName ? `${orgProfile.orgName}` : 'Charity'}/>
      <div className="flex-1 overflow-y-auto">
        <Header />
        <div className="flex flex-col space-y-6 p-6 animate-fade-in">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">
              {orgProfile?.orgName ? `${orgProfile.orgName} Dashboard` : 'Dashboard'}
            </h1>
            <p className="text-muted-foreground">Welcome to your organization's donation management portal</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Donations" 
              value={currency.format(stats?.totalDonations ?? 0)}
              icon={<BadgeDollarSign size={20} />} 
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard 
              title="Total Donors" 
              value={stats?.donorCount?.toLocaleString() ?? '—'}
              icon={<Users size={20} />} 
              trend={{ value: 4, isPositive: true }}
            />
            <StatCard 
              title="Monthly Growth" 
              value="8.7%" 
              icon={<ChartBarBig size={20} />} 
              trend={{ value: 2.5, isPositive: true }}
            />
            <StatCard 
              title="Avg. Donation" 
              value={currency.format(stats?.avgDonation ?? 0)}
              icon={<HandHeart size={20} />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <OverviewChart />
            <RecentActivity />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Fulfillment Rate</p>
                      <div className="flex items-center">
                        <span className="text-lg font-bold">92%</span>
                        <span className="ml-2 text-xs font-medium text-emerald-600">+2%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full w-36">
                      <div className="h-2 bg-lumen-500 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Recurring Donations</p>
                      <div className="flex items-center">
                        <span className="text-lg font-bold">45%</span>
                        <span className="ml-2 text-xs font-medium text-emerald-600">+5.5%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full w-36">
                      <div className="h-2 bg-lumen-500 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Donor Retention</p>
                      <div className="flex items-center">
                        <span className="text-lg font-bold">78%</span>
                        <span className="ml-2 text-xs font-medium text-rose-600">-3%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full w-36">
                      <div className="h-2 bg-lumen-500 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Donation Method Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <ChartPie className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Payment method breakdown</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;