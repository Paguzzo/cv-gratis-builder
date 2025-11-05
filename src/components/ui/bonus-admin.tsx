import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Gift,
  Users,
  Download,
  Mail,
  Calendar,
  Search,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BonusUser {
  email: string;
  name: string;
  timestamp: string;
}

const BonusAdmin: React.FC = () => {
  const [bonusUsers, setBonusUsers] = useState<BonusUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadBonusUsers();
  }, []);

  const loadBonusUsers = () => {
    // Recuperar dados de localStorage
    const allKeys = Object.keys(localStorage);
    const users: BonusUser[] = [];

    allKeys.forEach(key => {
      if (key.startsWith('bonus-user-')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.email && userData.name) {
            users.push(userData);
          }
        } catch (e) {
          console.error('Error parsing bonus user data:', e);
        }
      }
    });

    // Ordenar por timestamp (mais recentes primeiro)
    users.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setBonusUsers(users);
  };

  const filteredUsers = bonusUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent = [
      ['Nome', 'Email', 'Data de Cadastro'],
      ...bonusUsers.map(user => [
        user.name,
        user.email,
        new Date(user.timestamp).toLocaleString('pt-BR')
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bonus-users-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Exportação concluída",
      description: `${bonusUsers.length} usuários exportados com sucesso.`,
    });
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados de bônus? Esta ação não pode ser desfeita.')) {
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('bonus-user-')) {
          localStorage.removeItem(key);
        }
      });
      setBonusUsers([]);
      toast({
        title: "Dados limpos",
        description: "Todos os dados de bônus foram removidos.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cadastros</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bonusUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Usuários que solicitaram o bônus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bonusUsers.filter(u => {
                const today = new Date().toDateString();
                const userDate = new Date(u.timestamp).toDateString();
                return today === userDate;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Novos cadastros hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bonusUsers.filter(u => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(u.timestamp) > weekAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cadastros nos últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Usuários do Bônus</CardTitle>
          <CardDescription>
            Usuários que se cadastraram para receber o Guia Secreto de Entrevistas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button onClick={handleClearData} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div
                  key={`${user.email}-${index}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Gift className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(user.timestamp)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium mb-2">
                  {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum cadastro ainda'}
                </p>
                <p className="text-sm">
                  {searchTerm
                    ? 'Tente uma busca diferente'
                    : 'Os usuários que solicitarem o bônus aparecerão aqui'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BonusAdmin;
