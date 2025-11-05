interface UserData {
  name: string;
  email: string;
  whatsapp: string;
}

interface UserDatabaseEntry extends UserData {
  id: string;
  actionType: 'download' | 'print' | 'email' | 'whatsapp';
  timestamp: string;
  source: string;
  ipAddress?: string;
  userAgent?: string;
}

class UserDataService {
  private readonly STORAGE_KEY = 'cvgratis-users-database';
  private readonly EXPORT_KEY = 'cvgratis-database-export';

  // Salvar dados do usuário no "banco"
  async saveUser(userData: UserData, actionType: 'download' | 'print' | 'email' | 'whatsapp'): Promise<UserDatabaseEntry> {
    // 🔧 DEBUG: Logs detalhados para rastrear salvamento
    console.log('👤 UserData recebida:', userData);
    console.log('🎯 ActionType:', actionType);
    
    const entry: UserDatabaseEntry = {
      id: this.generateId(),
      ...userData,
      actionType,
      timestamp: new Date().toISOString(),
      source: 'cvgratis-free-template',
      userAgent: navigator.userAgent,
    };

    const database = this.getDatabase();
    console.log('📦 Database ANTES do push:', database.length, 'itens');
    
    database.push(entry);
    this.saveDatabase(database);
    
    console.log('📦 Database DEPOIS do push:', database.length, 'itens');
    console.log('✅ Entry salva:', entry);

    // Log para desenvolvimento
    console.log('✅ Usuário salvo no banco:', entry);
    
    return entry;
  }

  // 🔧 DEBUG: Método de teste para verificar se sistema funciona
  testSaveUser(): void {
    console.log('🧪 TESTE DEBUG - Simulando salvamento de usuário...');
    
    const testUserData = {
      name: 'Teste Debug',
      email: 'teste@debug.com',
      whatsapp: '11999999999'
    };
    
    this.saveUser(testUserData, 'download').then(result => {
      console.log('✅ TESTE CONCLUÍDO - Usuário de teste salvo:', result);
      console.log('📊 Total na database agora:', this.getDatabase().length);
    }).catch(error => {
      console.error('❌ ERRO NO TESTE:', error);
    });
  }

  // Obter todos os usuários do "banco"
  getDatabase(): UserDatabaseEntry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler banco de dados:', error);
      return [];
    }
  }

  // Salvar banco de dados
  private saveDatabase(database: UserDatabaseEntry[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(database));
      this.updateExportData(database);
    } catch (error) {
      console.error('Erro ao salvar banco de dados:', error);
    }
  }

  // Atualizar dados para exportação (formato planilha)
  private updateExportData(database: UserDatabaseEntry[]): void {
    const exportData = database.map(entry => ({
      'Nome': entry.name,
      'Email': entry.email,
      'WhatsApp': entry.whatsapp,
      'Ação': entry.actionType,
      'Data/Hora': new Date(entry.timestamp).toLocaleString('pt-BR'),
      'Fonte': entry.source
    }));

    localStorage.setItem(this.EXPORT_KEY, JSON.stringify(exportData));
  }

  // Exportar dados como CSV (para planilha)
  exportToCSV(): string {
    const database = this.getDatabase();
    
    if (database.length === 0) {
      return 'Nenhum dado para exportar';
    }

    const headers = ['Nome', 'Email', 'WhatsApp', 'Ação', 'Data/Hora', 'Fonte'];
    const rows = database.map(entry => [
      entry.name,
      entry.email,
      entry.whatsapp,
      entry.actionType,
      new Date(entry.timestamp).toLocaleString('pt-BR'),
      entry.source
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  // Baixar CSV
  downloadCSV(): void {
    const csvContent = this.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `cvgratis-usuarios-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Estatísticas do banco
  getStatistics() {
    const database = this.getDatabase();
    const total = database.length;
    
    const byAction = database.reduce((acc, entry) => {
      acc[entry.actionType] = (acc[entry.actionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDate = database.reduce((acc, entry) => {
      const date = entry.timestamp.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniqueEmails = new Set(database.map(entry => entry.email)).size;

    return {
      total,
      uniqueUsers: uniqueEmails,
      byAction,
      byDate,
      lastUpdate: database.length > 0 ? database[database.length - 1].timestamp : null
    };
  }

  // Verificar se usuário já existe no banco
  userExists(email: string): boolean {
    const database = this.getDatabase();
    return database.some(entry => entry.email.toLowerCase() === email.toLowerCase());
  }

  // Limpar banco de dados (cuidado!)
  clearDatabase(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.EXPORT_KEY);
    console.log('🗑️ Banco de dados limpo');
  }

  // Gerar ID único
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Instância singleton
export const userDataService = new UserDataService();

// 🔧 DEBUG: Expor no console para testes (apenas em desenvolvimento)
if (typeof window !== 'undefined') {
  (window as any).debugUserDataService = userDataService;
}

// Funções de conveniência para exportação
export function viewCollectedData() {
  const stats = userDataService.getStatistics();
  console.log('📊 Estatísticas CVGratis:', stats);
  
  const database = userDataService.getDatabase();
  console.table(database);
  
  return { stats, database };
}

// Função helper para baixar dados coletados
export function downloadUserData() {
  userDataService.downloadCSV();
}

// Disponibilizar globalmente para desenvolvimento
if (typeof window !== 'undefined') {
  (window as any).cvgratisData = {
    view: viewCollectedData,
    download: downloadUserData,
    clear: () => userDataService.clearDatabase(),
    service: userDataService
  };
} 