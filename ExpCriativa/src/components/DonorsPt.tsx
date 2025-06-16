// DonorsPt.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Users,
  Search,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  BadgeDollarSign,
  TrendingUp,
  AlertCircle,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import {
  fetchCurrentOrgProfile,
  OrgProfile,
} from '@/service/organization-settings-service';
import SidebarPt from './layout/SidebarPt';

/* ─────────────────────────── Config ─────────────────────────── */
const API_BASE_URL = 'https://localhost:7142';

/* ───── Tipagens vinda da API ───── */
interface DonationActivity {
  donationId: number;
  donationMethod: string;
  donationDate: string;
  donationAmount: number;
  status: number;
  donationIsAnonymous: boolean;
  donationDonorMessage: string;
  donorId: number;
  orgId: number;
  donorName: string;
  orgName: string;
  donorImageUrl: string;
  orgImageUrl: string;
}

interface Donor {
  donorId: number;
  userEmail: string;
  name: string;
  document?: string;
  phone?: string;
  birthDate?: string;
  imageUrl?: string;
  totalDonations: number;
  averageDonation: number;
  donationCount: number;
  lastDonationDate: string;
  isRecurring: boolean;
}

/* ---------------------------------------------------------------- */
/* Componente                                                        */
/* ---------------------------------------------------------------- */
const DonorsPt: React.FC = () => {
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<
    'name' | 'totalDonations' | 'lastDonation' | 'donationCount'
  >('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [donations, setDonations] = useState<DonationActivity[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);

  /* ─────────── API: carregar doações + doadores ─────────── */
  const fetchRecentDonations = async () => {
    const token = localStorage.getItem('accessToken');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const orgId = localStorage.getItem('userId');
    const resp = await fetch(`${API_BASE_URL}/api/Donations`, {
      method: 'GET',
      headers,
    });
    if (!resp.ok)
      throw new Error(`Erro da API: ${resp.status} • ${await resp.text()}`);

    const data = (await resp.json()) as DonationActivity[];
    const forOrg =
      orgId != null
        ? data.filter((d) => String(d.orgId) === String(orgId))
        : data;

    /* —— Buscar perfis —— */
    const ids = [...new Set(forOrg.map((d) => d.donorId))];
    const donorReqs = ids.map(async (id) => {
      const r = await fetch(`${API_BASE_URL}/api/Users/${id}`, { headers });
      if (!r.ok)
        return {
          donorId: id,
          userEmail: 'desconhecido@email.com',
          name: 'Do(a)dor(a) desconhecido(a)',
          totalDonations: 0,
          averageDonation: 0,
          donationCount: 0,
          lastDonationDate: '',
          isRecurring: false,
        };

      type Resp = {
        userEmail: string;
        donorProfile?: {
          name: string;
          document?: string;
          phone?: string;
          birthDate?: string;
          imageUrl?: string;
        };
      };
      const json: Resp = await r.json();
      const donorDonations = forOrg.filter((d) => d.donorId === id);
      const total = donorDonations.reduce((s, d) => s + d.donationAmount, 0);
      const count = donorDonations.length;
      const lastDate =
        count > 0
          ? donorDonations
              .sort(
                (a, b) =>
                  new Date(b.donationDate).getTime() -
                  new Date(a.donationDate).getTime(),
              )[0].donationDate
          : '';
      return {
        donorId: id,
        userEmail: json.userEmail,
        name: json.donorProfile?.name ?? 'Sem nome',
        document: json.donorProfile?.document,
        phone: json.donorProfile?.phone,
        birthDate: json.donorProfile?.birthDate,
        imageUrl: json.donorProfile?.imageUrl,
        totalDonations: total,
        averageDonation: count ? total / count : 0,
        donationCount: count,
        lastDonationDate: lastDate,
        isRecurring: count > 1,
      };
    });

    const donorsData = await Promise.all(donorReqs);
    setDonors(donorsData);

    const map = new Map<number, string>(
      donorsData.map((d) => [d.donorId, d.name]),
    );
    const enriched = forOrg.map((d) => ({
      ...d,
      donorName: map.get(d.donorId) ?? 'Desconhecido',
    }));
    const sorted = enriched
      .sort(
        (a, b) =>
          new Date(b.donationDate).getTime() -
          new Date(a.donationDate).getTime(),
      )
      .slice(0, 10);
    setDonations(sorted);
  };

  /* ─────────── Carregar na montagem ─────────── */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [profile] = await Promise.all([
          fetchCurrentOrgProfile(),
          fetchRecentDonations(),
        ]);
        setOrgProfile(profile);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'Erro desconhecido ao carregar',
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ─────────── Stats gerais ─────────── */
  const totalDonors = donors.length;
  const totalAmount = donors.reduce((s, d) => s + d.totalDonations, 0);
  const avgPerDonor = totalDonors ? totalAmount / totalDonors : 0;
  const recurring = donors.filter((d) => d.isRecurring).length;

  /* ─────────── Filtro + ordenação ─────────── */
  const filtered = donors
    .filter((d) => {
      if (!searchTerm) return true;
      const t = searchTerm.toLowerCase();
      return (
        d.name.toLowerCase().includes(t) ||
        d.userEmail.toLowerCase().includes(t)
      );
    })
    .sort((a, b) => {
      const getVal = (x: Donor) => {
        switch (sortBy) {
          case 'totalDonations':
            return x.totalDonations;
          case 'donationCount':
            return x.donationCount;
          case 'lastDonation':
            return new Date(x.lastDonationDate).getTime();
          default:
            return x.name;
        }
      };
      const diff = getVal(a) < getVal(b) ? -1 : getVal(a) > getVal(b) ? 1 : 0;
      return sortOrder === 'asc' ? diff : -diff;
    });

  /* ─────────── Helpers de formatação ─────────── */
  const fmtMoney = (v: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(v);

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'N/D';

  /* ─────────── Estados de carregamento / erro ─────────── */
  if (loading)
    return (
      <LayoutWrapper org={orgProfile?.orgName}>
        <LoadingState msg="Carregando dados de doadores…" />
      </LayoutWrapper>
    );

  if (error)
    return (
      <LayoutWrapper org={orgProfile?.orgName}>
        <ErrorState msg={error} />
      </LayoutWrapper>
    );

  /* ─────────── UI ─────────── */
  return (
    <LayoutWrapper org={orgProfile?.orgName}>
      <div className="flex flex-col space-y-6 p-6 animate-fade-in">
        <header className="flex flex-col">
          <h1 className="text-2xl font-bold">Doadores</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize os doadores da sua organização
          </p>
        </header>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SummaryCard
            title="Total de Doadores"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            value={totalDonors}
            subtitle="Contribuintes ativos"
          />
          <SummaryCard
            title="Total Doado"
            icon={<BadgeDollarSign className="h-4 w-4 text-muted-foreground" />}
            value={fmtMoney(totalAmount)}
            subtitle="De todos os doadores"
          />
          <SummaryCard
            title="Média por Doador"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            value={fmtMoney(avgPerDonor)}
            subtitle="Média vitalícia"
          />
          <SummaryCard
            title="Doadores Recorrentes"
            icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
            value={recurring}
            subtitle={
              totalDonors
                ? `${Math.round((recurring / totalDonors) * 100)}% do total`
                : '—'
            }
          />
        </div>

        {/* Busca e ordenação */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar doadores por nome ou email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as typeof sortBy)
              }
              className="px-3 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="name">Ordenar por Nome</option>
              <option value="totalDonations">Ordenar por Total Doado</option>
              <option value="donationCount">Ordenar por Nº de Doações</option>
              <option value="lastDonation">Ordenar por Última Doação</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Todos os Doadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <Th>Do(a)dor(a)</Th>
                    <Th>Contato</Th>
                    <Th>Documento</Th>
                    <Th>Total Doado</Th>
                    <Th>Doações</Th>
                    <Th>Última Doação</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr
                      key={d.donorId}
                      className="border-b hover:bg-gray-50"
                    >
                      {/* Nome + avatar */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <AvatarOrInitial
                            imageUrl={d.imageUrl}
                            name={d.name}
                          />
                          <div>
                            <p className="font-medium">{d.name}</p>
                            <p className="text-gray-500">ID: {d.donorId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contato */}
                      <td className="p-3">
                        <ContactInfo
                          email={d.userEmail}
                          phone={d.phone}
                        />
                      </td>

                      {/* Documento */}
                      <td className="p-3">
                        {d.document || (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Valores */}
                      <td className="p-3">
                        <div className="font-medium">
                          {fmtMoney(d.totalDonations)}
                        </div>
                        <div className="text-gray-500">
                          Avg: {fmtMoney(d.averageDonation)}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium">
                          {d.donationCount}
                        </div>
                        <div className="text-gray-500">doações</div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{fmtDate(d.lastDonationDate)}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        {d.isRecurring ? (
                          <BadgePill
                            text="Recorrente"
                            color="green"
                          />
                        ) : (
                          <BadgePill
                            text="Pontual"
                            color="gray"
                          />
                        )}
                      </td>

                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <EmptyState
                  search={!!searchTerm}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
};

/* ──────────────────────── Sub-componentes utilitários ─────────────────────── */
const LayoutWrapper: React.FC<{ org?: string; children: React.ReactNode }> = ({
  org,
  children,
}) => (
  <div className="flex h-screen overflow-hidden">
    <SidebarPt organizationName={org || 'Instituição'} />
    <div className="flex-1 overflow-y-auto">
      <Header />
      {children}
    </div>
  </div>
);

const LoadingState: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="flex items-center justify-center h-64 w-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p className="mt-4 text-muted-foreground">{msg}</p>
    </div>
  </div>
);

const ErrorState: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="flex items-center justify-center h-64 w-full">
    <div className="text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
      <p className="mt-4 text-red-600">Erro ao carregar: {msg}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tentar novamente
      </button>
    </div>
  </div>
);

const SummaryCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  subtitle: string;
}> = ({ title, icon, value, subtitle }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="text-left p-3 font-medium">{children}</th>
);

const AvatarOrInitial: React.FC<{ imageUrl?: string; name: string }> = ({
  imageUrl,
  name,
}) => (
  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={name}
        className="w-8 h-8 rounded-full object-cover"
      />
    ) : (
      <span className="text-sm font-medium text-blue-600">
        {name.charAt(0)}
      </span>
    )}
  </div>
);

const ContactInfo: React.FC<{ email: string; phone?: string }> = ({
  email,
  phone,
}) => (
  <div className="space-y-1">
    <div className="flex items-center">
      <Mail className="h-3 w-3 mr-1 text-gray-400" />
      <span className="truncate max-w-[150px]">{email}</span>
    </div>
    {phone && (
      <div className="flex items-center text-gray-500">
        <Phone className="h-3 w-3 mr-1 text-gray-400" />
        <span>{phone}</span>
      </div>
    )}
  </div>
);

const BadgePill: React.FC<{ text: string; color: 'green' | 'gray' }> = ({
  text,
  color,
}) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
      color === 'green'
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-100 text-gray-800'
    }`}
  >
    <UserCheck className="h-3 w-3 mr-1" />
    {text}
  </span>
);

const EmptyState: React.FC<{ search: boolean }> = ({ search }) => (
  <div className="text-center py-8">
    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500">
      {search
        ? 'Nenhum doador encontrado que corresponda à busca.'
        : 'Nenhum doador encontrado.'}
    </p>
    <Button variant="outline" size="sm" className="mt-4">
      <Plus className="h-3 w-3 mr-1" />
      Novo Doador
    </Button>
  </div>
);

export default DonorsPt;
