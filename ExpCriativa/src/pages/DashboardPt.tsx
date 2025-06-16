// DashboardPt.tsx
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
import RecentActivityPt from '@/components/dashboard/RecentActivityPt';
import OverviewChartPt from '@/components/dashboard/OverviewChartPt';
import SidebarPt from '@/components/layout/SidebarPt';

const DashboardPt: React.FC = () => {
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

  if (loading) return <p>Carregando…</p>;
  if (error)   return <p style={{ color: 'red' }}>Erro: {error}</p>;

  // Formatação para Brasil (R$ e separador de milhar “.”)
  const moeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });

  /* ───────────────────────────────────────────────────────────────────── */

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <SidebarPt
        organizationName={
          orgProfile?.orgName ? `${orgProfile.orgName}` : 'Instituição'
        }
      />

      <div className="flex-1 overflow-y-auto">
        <Header />

        <div className="flex flex-col space-y-6 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm transition-colors">
          {/* Título + subtítulo */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">
              {orgProfile?.orgName
                ? `Painel • ${orgProfile.orgName}`
                : 'Painel de Doações'}
            </h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Bem-vindo ao portal de gestão de doações da sua organização
            </p>
          </div>

          {/* Cartões de estatísticas */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total de Doações"
              value={moeda.format(stats?.totalDonations ?? 0)}
              icon={<BadgeDollarSign size={20} />}
            />
            <StatCard
              title="Total de Doadores"
              value={
                stats?.donorCount !== undefined
                  ? stats.donorCount.toLocaleString('pt-BR')
                  : '—'
              }
              icon={<Users size={20} />}
            />
            <StatCard
              title="Crescimento Mensal"
              value="8,7%"
              icon={<ChartBarBig size={20} />}
            />
            <StatCard
              title="Doação Média"
              value={moeda.format(stats?.avgDonation ?? 0)}
              icon={<HandHeart size={20} />}
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <OverviewChartPt />
            <RecentActivityPt />
          </div>

          {/* Pizza de métodos de pagamento */}
          <Card className="bg-white dark:bg-gray-800 transition-colors">
            <CardHeader>
              <CardTitle>Distribuição por Método de Doação</CardTitle>
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

export default DashboardPt;
