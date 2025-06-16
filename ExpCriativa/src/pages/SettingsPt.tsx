import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import {
  fetchCurrentOrgProfile,
  updateOrgSettings,
  OrgProfile,
  UpdateOrgSettingsRequest,
} from '@/service/organization-settings-service';
import SidebarPt from '@/components/layout/SidebarPt';

const SettingsPt = () => {
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  /* Estado do formulário */
  const [formData, setFormData] = useState<UpdateOrgSettingsRequest>({
    orgName: '',
    phone: '',
    document: '',
    address: '',
    description: '',
    adminName: '',
    orgWebsiteUrl: '',
    orgFoundationDate: '',
    adminPhone: '',
  });

  /* Carregar perfil na montagem */
  useEffect(() => {
    loadOrgProfile();
  }, []);

  const loadOrgProfile = async () => {
    try {
      const profile = await fetchCurrentOrgProfile();
      setOrgProfile(profile);

      /* Helper para data */
      const formatDateForInput = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime()) || date.getFullYear() < 1900) return '';
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      setFormData({
        orgName: profile.orgName,
        phone: profile.phone,
        document: profile.document,
        address: profile.address,
        description: profile.description,
        adminName: profile.adminName,
        orgWebsiteUrl: profile.orgWebsiteUrl || '',
        orgFoundationDate: formatDateForInput(profile.orgFoundationDate),
        adminPhone: profile.adminPhone,
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Falha ao carregar o perfil da organização',
      });
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof UpdateOrgSettingsRequest,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const updated = await updateOrgSettings(formData);
      setOrgProfile(updated);
      setMessage({
        type: 'success',
        text: 'Configurações atualizadas com sucesso!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Falha ao atualizar as configurações. Tente novamente.',
      });
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarPt organizationName={orgProfile?.orgName || 'Instituição'} />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <div className="flex flex-col space-y-6 p-6 animate-fade-in">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações e preferências da sua organização
            </p>
          </div>

          {message && (
            <Alert
              className={
                message.type === 'error'
                  ? 'border-red-500 bg-red-50'
                  : 'border-green-500 bg-green-50'
              }
            >
              <AlertDescription
                className={
                  message.type === 'error' ? 'text-red-700' : 'text-green-700'
                }
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
            </TabsList>

            {/* ───────── Aba Geral ───────── */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Organização</CardTitle>
                  <CardDescription>
                    Atualize os dados da organização e informações
                    administrativas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Nome da Organização</Label>
                      <Input
                        id="orgName"
                        value={formData.orgName}
                        onChange={(e) =>
                          handleInputChange('orgName', e.target.value)
                        }
                        placeholder="Digite o nome da organização"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgWebsiteUrl">URL do Site</Label>
                      <Input
                        id="orgWebsiteUrl"
                        value={formData.orgWebsiteUrl}
                        onChange={(e) =>
                          handleInputChange('orgWebsiteUrl', e.target.value)
                        }
                        placeholder="https://sua-organizacao.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
                      }
                      placeholder="Digite o endereço"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        placeholder="Digite o telefone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="document">Documento/Registro</Label>
                      <Input
                        id="document"
                        value={formData.document}
                        onChange={(e) =>
                          handleInputChange('document', e.target.value)
                        }
                        placeholder="Número de registro"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange('description', e.target.value)
                      }
                      placeholder="Breve descrição da organização"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminName">Nome do Administrador</Label>
                      <Input
                        id="adminName"
                        value={formData.adminName}
                        onChange={(e) =>
                          handleInputChange('adminName', e.target.value)
                        }
                        placeholder="Digite o nome do administrador"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPhone">
                        Telefone do Administrador
                      </Label>
                      <Input
                        id="adminPhone"
                        value={formData.adminPhone}
                        onChange={(e) =>
                          handleInputChange('adminPhone', e.target.value)
                        }
                        placeholder="Telefone do administrador"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orgFoundationDate">Data de Fundação</Label>
                    <Input
                      id="orgFoundationDate"
                      type="date"
                      value={formData.orgFoundationDate}
                      onChange={(e) =>
                        handleInputChange(
                          'orgFoundationDate',
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <Button
                    className="mt-2"
                    onClick={handleSaveSettings}
                    disabled={saving}
                  >
                    {saving ? 'Salvando…' : 'Salvar Alterações'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ───────── Aba Notificações ───────── */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>
                    Gerencie suas configurações de notificação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <NotificationRow
                    title="Notificações por E-mail"
                    subtitle="Receba atualizações por e-mail sobre sua organização"
                  />
                  <NotificationRow
                    title="Alertas de Registro de Doadores"
                    subtitle="Seja notificado quando novos doadores se registrarem"
                  />
                  <NotificationRow
                    title="Relatórios de Doações"
                    subtitle="Relatórios semanais de atividade de doações"
                    defaultChecked={false}
                  />
                  <NotificationRow
                    title="Atualizações do Sistema"
                    subtitle="Seja notificado sobre atualizações da plataforma"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ───────── Aba Aparência ───────── */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Aparência</CardTitle>
                  <CardDescription>
                    Personalize a aparência do seu painel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tema */}
                    <div>
                      <Label>Tema</Label>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <ThemeBlock title="Claro" />
                        <ThemeBlock
                          title="Escuro"
                          className="bg-gray-900 text-white"
                        />
                        <ThemeBlock
                          title="Sistema"
                          className="bg-gradient-to-r from-white to-gray-100"
                        />
                      </div>
                    </div>

                    {/* Cor de destaque */}
                    <div>
                      <Label>Cor de Destaque</Label>
                      <div className="grid grid-cols-6 gap-2 pt-2">
                        <AccentColorBlock className="bg-lumen-500 ring-lumen-500" />
                        <AccentColorBlock className="bg-blue-500" />
                        <AccentColorBlock className="bg-purple-500" />
                        <AccentColorBlock className="bg-emerald-500" />
                        <AccentColorBlock className="bg-amber-500" />
                        <AccentColorBlock className="bg-rose-500" />
                      </div>
                    </div>

                    <Button className="mt-4">Salvar Preferências</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

/* ───────── Componentes Auxiliares ───────── */
const NotificationRow: React.FC<{
  title: string;
  subtitle: string;
  defaultChecked?: boolean;
}> = ({ title, subtitle, defaultChecked = true }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
    <Switch defaultChecked={defaultChecked} />
  </div>
);

const ThemeBlock: React.FC<{ title: string; className?: string }> = ({
  title,
  className = '',
}) => (
  <div
    className={`border hover:border-lumen-500 cursor-pointer rounded-md p-4 text-center ${className}`}
  >
    {title}
  </div>
);

const AccentColorBlock: React.FC<{ className: string }> = ({ className }) => (
  <div
    className={`h-10 rounded-md cursor-pointer ring-2 ring-offset-2 ${className}`}
  />
);

export default SettingsPt;
