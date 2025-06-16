// RecentActivityPt.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

/* ─────────────────────────────────────────────────────────────────── */
/* Tipagem vinda da sua API                                            */
/* ─────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────── */
const API_BASE_URL = 'https://localhost:7142';

const getToken = (): string | null => localStorage.getItem('accessToken');

/* Badge visual */
const getBadgeVariant = (
  method: string,
): 'default' | 'outline' | 'secondary' | 'destructive' => {
  const variants: Record<
    string,
    'default' | 'outline' | 'secondary' | 'destructive'
  > = {
    'Credit Card': 'default',
    PayPal: 'secondary',
    'Bank Transfer': 'outline',
    Cash: 'secondary',
    Cryptocurrency: 'default',
  };
  return variants[method] || 'outline';
};

/* ───────── Tempo “há x minutos” — agora em pt-BR ───────── */
const formatTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 0) return 'agora mesmo';

    const min = Math.floor(diff / 6e4);
    const hrs = Math.floor(diff / 3.6e6);
    const dias = Math.floor(diff / 8.64e7);

    if (min < 1) return 'agora mesmo';
    if (min < 60) return `há ${min} minuto${min === 1 ? '' : 's'}`;
    if (hrs < 24) return `há ${hrs} hora${hrs === 1 ? '' : 's'}`;
    if (dias < 30) return `há ${dias} dia${dias === 1 ? '' : 's'}`;
    return date.toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
};

/* Moeda em reais */
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(amount);

const RecentActivityPt: React.FC = () => {
  const [donations, setDonations] = useState<DonationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      const token = getToken();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const orgId = localStorage.getItem('userId');
        const response = await fetch(`${API_BASE_URL}/api/Donations`, {
          method: 'GET',
          headers,
        });
        if (!response.ok)
          throw new Error(
            `Erro da API: ${response.status} ${await response.text()}`,
          );

        const data = (await response.json()) as DonationActivity[];
        const filtered =
          orgId != null
            ? data.filter((d) => String(d.orgId) === String(orgId))
            : data;

        /* Agrupa donors para buscar nomes */
        const uniqueIds = [...new Set(filtered.map((d) => d.donorId))];
        const donors = await Promise.all(
          uniqueIds.map(async (id) => {
            const r = await fetch(`${API_BASE_URL}/api/Users/${id}`, {
              headers,
            });
            if (!r.ok) return { id, name: 'Do(a)dor(a) desconhecido(a)' };
            type Resp = { donorProfile?: { name: string } };
            const json: Resp = await r.json();
            return { id, name: json.donorProfile?.name ?? 'Sem nome' };
          }),
        );
        const donorMap = new Map<number, string>(
          donors.map((x) => [x.id, x.name]),
        );

        const enriched = filtered.map((d) => ({
          ...d,
          donorName: donorMap.get(d.donorId) ?? 'Do(a)dor(a) desconhecido(a)',
        }));

        const sorted = enriched
          .sort(
            (a, b) =>
              new Date(b.donationDate).getTime() -
              new Date(a.donationDate).getTime(),
          )
          .slice(0, 10);

        setDonations(sorted);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro desconhecido ao buscar doações.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDonations();
  }, []);

  /* ────────── Estados de carregamento / erro ────────── */
  if (loading)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">Carregando doações…</p>
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-red-500">Erro: {error}</p>
        </CardContent>
      </Card>
    );

  if (donations.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">
            Nenhuma doação recente encontrada.
          </p>
        </CardContent>
      </Card>
    );

  /* ────────── Lista de doações ────────── */
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {donations.map((d) => (
            <div key={d.donationId} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={d.donorImageUrl}
                  alt={d.donationIsAnonymous ? 'Anônimo' : d.donorName}
                />
                <AvatarFallback className="bg-lumen-100 text-lumen-700">
                  {d.donationIsAnonymous
                    ? 'A'
                    : (d.donorName?.charAt(0).toUpperCase() ?? '?')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <p className="text-sm leading-none">
                  <span className="font-semibold">
                    {d.donationIsAnonymous ? 'Anônimo' : d.donorName}
                  </span>
                  <span className="text-gray-500"> doou </span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(d.donationAmount)}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(d.donationDate)}
                </p>
              </div>

              <Badge variant={getBadgeVariant(d.donationMethod)}>
                {d.donationMethod}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityPt;
