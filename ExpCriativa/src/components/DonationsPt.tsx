// DonationsPt.tsx
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
  DollarSign,
  Search,
  Calendar,
  AlertCircle,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
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

const DonationsPt: React.FC = () => {
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<
    'donationDate' | 'donationAmount' | 'donorName' | 'status'
  >('donationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [donations, setDonations] = useState<DonationActivity[]>([]);

  /* ─────────── API: carregar doações ─────────── */
  const fetchDonations = async () => {
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

    /* —— Enriquecer com nome/imagem do doador —— */
    const ids = [...new Set(forOrg.map((d) => d.donorId))];
    const donorReqs = ids.map(async (id) => {
      const r = await fetch(`${API_BASE_URL}/api/Users/${id}`, { headers });
      if (!r.ok) return { donorId: id, name: 'Doador(a) desconhecido(a)', imageUrl: '' };

      type Resp = { donorProfile?: { name: string; imageUrl?: string } };
      const json: Resp = await r.json();
      return {
        donorId: id,
        name: json.donorProfile?.name ?? 'Sem nome',
        imageUrl: json.donorProfile?.imageUrl ?? '',
      };
    });

    const donors = await Promise.all(donorReqs);
    const map = new Map<number, { name: string; imageUrl?: string }>(
      donors.map((d) => [d.donorId, { name: d.name, imageUrl: d.imageUrl }]),
    );

    const enriched = forOrg.map((d) => ({
      ...d,
      donorName: map.get(d.donorId)?.name ?? 'Desconhecido',
      donorImageUrl: map.get(d.donorId)?.imageUrl ?? '',
    }));
    setDonations(enriched);
  };

  /* ─────────── Carregar na montagem ─────────── */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [profile] = await Promise.all([
          fetchCurrentOrgProfile(),
          fetchDonations(),
        ]);
        setOrgProfile(profile);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ─────────── Filtro + ordenação ─────────── */
  const filtered = donations
    .filter((d) => {
      if (!searchTerm) return true;
      const t = searchTerm.toLowerCase();
      return (
        d.donorName.toLowerCase().includes(t) ||
        d.donationMethod.toLowerCase().includes(t) ||
        d.donationDonorMessage?.toLowerCase().includes(t)
      );
    })
    .sort((a, b) => {
      const val = (x: DonationActivity) => {
        switch (sortBy) {
          case 'donationAmount':
            return x.donationAmount;
          case 'donorName':
            return x.donorName;
          case 'status':
            return x.status;
          default:
            return new Date(x.donationDate).getTime();
        }
      };
      const diff = val(a) < val(b) ? -1 : val(a) > val(b) ? 1 : 0;
      return sortOrder === 'asc' ? diff : -diff;
    });

  /* ─────────── Helpers ─────────── */
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
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'N/D';

  const badge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <BadgePill color="green" icon={<CheckCircle className="h-3 w-3 mr-1" />}>
            Concluída
          </BadgePill>
        );
      case 0:
        return (
          <BadgePill color="yellow" icon={<Clock className="h-3 w-3 mr-1" />}>
            Pendente
          </BadgePill>
        );
      case -1:
        return (
          <BadgePill color="red" icon={<XCircle className="h-3 w-3 mr-1" />}>
            Falhou
          </BadgePill>
        );
      default:
        return <BadgePill color="gray">Desconhecido</BadgePill>;
    }
  };

  /* ─────────── Estados de carregamento / erro ─────────── */
  if (loading)
    return (
      <FullPageWrapper org={orgProfile?.orgName}>
        <LoadingState msg="Carregando dados de doações…" />
      </FullPageWrapper>
    );

  if (error)
    return (
      <FullPageWrapper org={orgProfile?.orgName}>
        <ErrorState msg={error} />
      </FullPageWrapper>
    );

  /* ─────────── UI ─────────── */
  return (
    <FullPageWrapper org={orgProfile?.orgName}>
      <div className="flex flex-col space-y-6 p-6 animate-fade-in">
        <header className="flex flex-col">
          <h1 className="text-2xl font-bold">Doações</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as doações da sua organização
          </p>
        </header>

        {/* Busca + filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar doações por doador, método ou mensagem…"
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
              <option value="donationDate">Ordenar por Data</option>
              <option value="donationAmount">Ordenar por Valor</option>
              <option value="donorName">Ordenar por Doador</option>
              <option value="status">Ordenar por Status</option>
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
            <CardTitle>Todas as Doações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <Th>ID da Doação</Th>
                    <Th>Doador</Th>
                    <Th>Valor</Th>
                    <Th>Método</Th>
                    <Th>Data</Th>
                    <Th>Status</Th>
                    <Th>Mensagem</Th>
                    <Th>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.donationId} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium">#{d.donationId}</div>
                        {d.donationIsAnonymous && (
                          <div className="text-xs text-gray-500">Anônimo</div>
                        )}
                      </td>

                      {/* Doador + avatar */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <AvatarOrInitial
                            imageUrl={d.donorImageUrl}
                            name={d.donorName}
                          />
                          <div>
                            <p className="font-medium">{d.donorName}</p>
                            <p className="text-gray-500">ID: {d.donorId}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-medium text-green-600">
                        {fmtMoney(d.donationAmount)}
                      </td>

                      <td className="p-3">{d.donationMethod}</td>

                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{fmtDate(d.donationDate)}</span>
                        </div>
                      </td>

                      <td className="p-3">{badge(d.status)}</td>

                      <td className="p-3 max-w-[220px] truncate">
                        {d.donationDonorMessage || '—'}
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
                <EmptyState search={!!searchTerm} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FullPageWrapper>
  );
};

/* ────────────────────────── Utilitários / subcomponents ────────────────────────── */
const FullPageWrapper: React.FC<{ org?: string; children: React.ReactNode }> = ({
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
      <p className="mt-4 text-red-600">Erro ao carregar dados: {msg}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tentar novamente
      </button>
    </div>
  </div>
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

const BadgePill: React.FC<{
  color: 'green' | 'yellow' | 'red' | 'gray';
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ color, icon, children }) => {
  const colors: Record<
    'green' | 'yellow' | 'red' | 'gray',
    string
  > = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${colors[color]}`}
    >
      {icon}
      {children}
    </span>
  );
};

const EmptyState: React.FC<{ search: boolean }> = ({ search }) => (
  <div className="text-center py-8">
    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500">
      {search
        ? 'Nenhuma doação encontrada que corresponda à busca.'
        : 'Nenhuma doação encontrada.'}
    </p>
  </div>
);

export default DonationsPt;
