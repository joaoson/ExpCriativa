import React, { useEffect, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import OverviewChart from '@/components/dashboard/OverviewChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import PaymentMethodChart from '@/components/dashboard/PaymentMethodChart';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, HandHeart, BadgeDollarSign, ChartBarBig } from 'lucide-react';

import {
  DonationStats,
  fetchDonationStats,
  DonationFullResult,
  fetchDonationfull,
} from '@/service/data-query-service';
import {
  fetchCurrentOrgProfile,
  OrgProfile,
} from '@/service/organization-settings-service';

const Dashboard = () => {
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donations, setDonations] = useState<DonationFullResult | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileData, statsData] = await Promise.all([
          fetchCurrentOrgProfile(),
          fetchDonationStats({ orgId: localStorage.getItem('userId') }),
        ]);
        setOrgProfile(profileData);
        setStats(statsData);

        const donationsApi = await fetchDonationfull({
          orgId: localStorage.getItem('userId'),
        });
        setDonations(donationsApi);
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

  /** ─────────────────────────────────────────────────────────────────── **/

  return (
    /* ✦ dark-mode additions — bg + text colours transition cleanly */
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar uses its own colours; leave untouched */}
      <Sidebar
        organizationName={
          orgProfile?.orgName ? `${orgProfile.orgName}` : 'Charity'
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Header already has dark-aware hover states; nothing else to do */}
        <Header />

        {/* ✦ container background shade for both modes */}
        <div className="flex flex-col space-y-6 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm transition-colors">
          {/* Title + subtitle */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">
              {orgProfile?.orgName
                ? `${orgProfile.orgName} Dashboard`
                : 'Dashboard'}
            </h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Welcome to your organization's donation management portal
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Donations"
              value={currency.format(stats?.totalDonations ?? 0)}
              icon={<BadgeDollarSign size={20} />}
            />
            <StatCard
              title="Total Donors"
              value={stats?.donorCount?.toLocaleString() ?? '—'}
              icon={<Users size={20} />}
            />
            <StatCard
              title="Monthly Growth"
              value="8.7%"
              icon={<ChartBarBig size={20} />}
            />
            <StatCard
              title="Avg. Donation"
              value={currency.format(stats?.avgDonation ?? 0)}
              icon={<HandHeart size={20} />}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <OverviewChart />
            <RecentActivity />
          </div>

          {/* Donation-method pie chart */}
          <Card className="bg-white dark:bg-gray-800 transition-colors">
            <CardHeader>
              <CardTitle>Donation Method Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[220px]">
                <PaymentMethodChart donations={donations?.donations} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
