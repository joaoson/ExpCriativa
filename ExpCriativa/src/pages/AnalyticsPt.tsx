import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart3,
  TrendingUp as ChartLine,
  PieChart as ChartPie,
  Users,
  BadgeDollarSign,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import {
  fetchCurrentOrgProfile,
  OrgProfile,
} from '@/service/organization-settings-service';
import { fetchDonationChartData } from '@/service/donation-chart-service';
import { fetchDonationStats } from '@/service/data-query-service';
import SidebarPt from '@/components/layout/SidebarPt';

/* ------------------------------------------------------------------ */
/* Interfaces (inalteradas)                                           */
/* ------------------------------------------------------------------ */
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

/* ─────────────────────────────────────────────────────────────────── */
/* Componente                                                          */
/* ─────────────────────────────────────────────────────────────────── */
const AnalyticsPt = () => {
  /* Estado */
  const [chartData, setChartData] = useState<MonthlyDonationData[]>([]);
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    donorCount: 0,
    avgDonation: 0,
  });
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<
    'Last 12 months' | 'Last 6 months' | 'Last 30 days'
  >('Last 12 months');

  /* Formatação de moeda (mantida em USD conforme original) */
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  /* Carrega perfil + estatísticas básicas */
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
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* Carrega dados de gráfico quando o período muda */
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [chartResult] = await Promise.all([
          fetchDonationChartData({ timeRange }),
        ]);

        setChartData(chartResult);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [timeRange]);

  /* Dados fictícios para a pizza de tipos de doadores */
  const demographicData = [
    { name: 'Individual', value: 65, color: '#3b82f6' },
    { name: 'Corporativa', value: 25, color: '#10b981' },
    { name: 'Fundação', value: 10, color: '#f59e0b' },
  ];

  /* Crescimento de doadores (lógica simples) */
  const donorGrowthData = chartData.map((item, index) => ({
    month: item.month,
    newDonors: item.donations,
    cumulativeDonors: chartData
      .slice(0, index + 1)
      .reduce((sum, curr) => sum + curr.donations, 0),
  }));

  /* ────────── Estados de carregamento/erro ────────── */
  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SidebarPt organizationName={orgProfile?.orgName || 'Charity'} />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <div className="flex flex-col space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                <p className="mt-4 text-muted-foreground">
                  Carregando dados de análise…
                </p>
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
        <Sidebar organizationName={orgProfile?.orgName || 'Charity'} />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <div className="flex flex-col space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <p className="mt-4 text-red-600">
                  Erro ao carregar dados: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ────────── Render principal ────────── */
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarPt organizationName={orgProfile?.orgName || 'Charity'} />
      <div className="flex-1 overflow-y-auto">
        <Header />

        <div className="flex flex-col space-y-6 p-6 animate-fade-in">
          {/* Cabeçalho da página */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Análise de Doações</h1>
            <p className="text-muted-foreground">
              Métricas detalhadas e insights para sua organização
            </p>
          </div>

          {/* Métricas principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total de Doações */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Doações
                </CardTitle>
                <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalDonations)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Valor arrecadado
                </p>
              </CardContent>
            </Card>

            {/* Total de Doadores */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Doadores
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.donorCount}</div>
                <p className="text-xs text-muted-foreground">
                  <Users className="inline h-3 w-3 mr-1" />
                  Contribuintes únicos
                </p>
              </CardContent>
            </Card>

            {/* Doação Média */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Doação Média
                </CardTitle>
                <ChartLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.avgDonation)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Média por doador
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Seletor de período */}
          <div className="flex justify-end">
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(
                  e.target.value as
                    | 'Last 12 months'
                    | 'Last 6 months'
                    | 'Last 30 days',
                )
              }
              className="px-4 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="Last 30 days">Últimos 30 dias</option>
              <option value="Last 6 months">Últimos 6 meses</option>
              <option value="Last 12 months">Últimos 12 meses</option>
            </select>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Tendência de Doações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine size={20} className="text-blue-500" />
                  <span>Tendência de Doações</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
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

            {/* Crescimento de Doadores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} className="text-green-500" />
                  <span>Crescimento de Doadores</span>
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

            {/* Tipos de Doadores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartPie size={20} className="text-orange-500" />
                  <span>Tipos de Doadores</span>
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
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {demographicData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Volume Mensal de Doações */}
          <Card>
            <CardHeader>
              <CardTitle>Volume Mensal de Doações</CardTitle>
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
                        name === 'donations'
                          ? value
                          : formatCurrency(value as number),
                        name === 'donations'
                          ? 'Número de Doações'
                          : 'Valor Total',
                      ]}
                    />
                    <Bar
                      dataKey="donations"
                      fill="#3b82f6"
                      name="donations"
                    />
                    <Bar
                      dataKey="TotalAmount"
                      fill="#10b981"
                      name="TotalAmount"
                    />
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

export default AnalyticsPt;
