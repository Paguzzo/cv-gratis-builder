import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { userDataService, downloadUserData, viewCollectedData } from '@/services/userDataService';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { 
  Users, 
  Download, 
  Eye, 
  Calendar, 
  BarChart3, 
  Trash2, 
  Search,
  FileText,
  Mail,
  Phone,
  Clock,
  TrendingUp,
  AlertCircle,
  LogOut,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserEntry {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  actionType: 'download' | 'print' | 'email';
  timestamp: string;
  source: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [stats, setStats] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const { toast } = useToast();
  const { exitAdminMode } = useAdminAccess();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const database = userDataService.getDatabase();
    const statistics = userDataService.getStatistics();
    setUsers(database);
    setStats(statistics);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.whatsapp.includes(searchTerm);
    
    const matchesAction = selectedAction === 'all' || user.actionType === selectedAction;
    
    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    downloadUserData();
    toast({
      title: "Exportação iniciada",
      description: "Arquivo CSV será baixado em instantes.",
    });
  };

  const handleClearData = () => {
    if (confirm('⚠️ ATENÇÃO: Isso apagará TODOS os dados coletados. Esta ação não pode ser desfeita. Tem certeza?')) {
      if (confirm('🛑 CONFIRMAÇÃO FINAL: Todos os dados serão perdidos permanentemente. Continuar?')) {
        userDataService.clearDatabase();
        loadData();
        toast({
          title: "Dados limpos",
          description: "Banco de dados foi limpo com sucesso.",
          variant: "destructive"
        });
      }
    }
  };

  const handleViewInConsole = () => {
    viewCollectedData();
    toast({
      title: "Dados exibidos no console",
      description: "Abra o console do navegador (F12) para ver os dados detalhados.",
    });
  };

  const handleExitAdmin = () => {
    if (confirm('Deseja sair do painel administrativo?')) {
      exitAdminMode();
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'download':
        return <Badge className="bg-blue-100 text-blue-800"><Download className="w-3 h-3 mr-1" />Download</Badge>;
      case 'print':
        return <Badge className="bg-green-100 text-green-800"><FileText className="w-3 h-3 mr-1" />Impressão</Badge>;
      case 'email':
        return <Badge className="bg-purple-100 text-purple-800"><Mail className="w-3 h-3 mr-1" />Email</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão de sair */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                Painel Administrativo - CVGratis
                <Badge className="bg-red-100 text-red-800 ml-2">
                  <Shield className="w-3 h-3 mr-1" />
                  MODO ADMIN
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">
                Gerenciamento dos dados coletados dos usuários gratuitos
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleViewInConsole} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Ver no Console
              </Button>
              <Button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button 
                onClick={handleExitAdmin} 
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair do Admin
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Lista de Usuários</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="apis">Teste APIs</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.uniqueUsers || 0} emails únicos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.byAction?.download || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    PDFs baixados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impressões</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.byAction?.print || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Currículos impressos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emails</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.byAction?.email || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Enviados por email
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Últimos usuários */}
            <Card>
              <CardHeader>
                <CardTitle>Últimos Usuários Cadastrados</CardTitle>
                <CardDescription>
                  Os 5 usuários mais recentes que baixaram currículos gratuitos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(-5).reverse().map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {getActionBadge(user.actionType)}
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(user.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum usuário cadastrado ainda.</p>
                      <p className="text-sm">Os dados aparecerão aqui quando usuários baixarem templates gratuitos.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lista de Usuários */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filtros e Busca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por nome, email ou WhatsApp..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">Todas as ações</option>
                    <option value="download">Download</option>
                    <option value="print">Impressão</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista Completa de Usuários ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Nome</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">WhatsApp</th>
                        <th className="text-left p-2">Ação</th>
                        <th className="text-left p-2">Data/Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{user.name}</td>
                          <td className="p-2 text-gray-600">{user.email}</td>
                          <td className="p-2 text-gray-600">{user.whatsapp}</td>
                          <td className="p-2">{getActionBadge(user.actionType)}</td>
                          <td className="p-2 text-gray-500">{formatDate(user.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum usuário encontrado com os filtros atuais.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Ação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.byAction || {}).map(([action, count]) => (
                      <div key={action} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getActionBadge(action)}
                        </div>
                        <div className="text-2xl font-bold">{count as number}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleExportCSV} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Dados para Excel
                  </Button>
                  
                  <Button 
                    onClick={handleViewInConsole} 
                    variant="outline" 
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Dados no Console
                  </Button>
                  
                  <Button 
                    onClick={handleClearData} 
                    variant="destructive" 
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Todos os Dados
                  </Button>

                  <hr className="my-4" />
                  
                  <Button 
                    onClick={handleExitAdmin} 
                    variant="outline" 
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair do Modo Administrativo
                  </Button>
                  
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">⚡ Acesso via Console</h4>
                    <p className="text-sm text-yellow-700">
                      Para acessar dados via console do navegador (F12):
                    </p>
                    <div className="mt-2 p-2 bg-gray-900 text-green-400 text-xs rounded font-mono">
                      <div>cvgratisData.view() // Ver dados</div>
                      <div>cvgratisData.download() // Baixar CSV</div>
                      <div>cvgratisData.clear() // Limpar dados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {stats.lastUpdate && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Última atualização: {formatDate(stats.lastUpdate)}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 