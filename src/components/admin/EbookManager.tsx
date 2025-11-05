import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileText,
  Download,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Mail,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  uploadEbook,
  getEbookData,
  isEbookConfigured,
  sendEbookToLead,
  getEbookLeads,
  getEbookStatistics,
  removeEbook,
  downloadEbook
} from '@/services/ebookService';

export default function EbookManager() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [ebookInfo, setEbookInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Carregar dados do ebook
  const loadEbookData = useCallback(() => {
    const data = getEbookData();
    const statistics = getEbookStatistics();
    const leadsList = getEbookLeads();

    setEbookInfo(data);
    setStats(statistics);
    setLeads(leadsList);
  }, []);

  useEffect(() => {
    loadEbookData();
  }, [loadEbookData]);

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  // Handle file upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const result = await uploadEbook(file);

      if (result.success) {
        toast({
          title: "✅ Ebook carregado!",
          description: result.message,
        });
        loadEbookData();
      } else {
        toast({
          title: "❌ Erro no upload",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Erro ao processar arquivo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Enviar email de teste
  const handleSendTest = async () => {
    if (!testEmail || !testName) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e email para enviar teste",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      const result = await sendEbookToLead(testName, testEmail);

      if (result.success) {
        toast({
          title: "✅ Email enviado!",
          description: result.message,
        });
        setTestEmail('');
        setTestName('');
        loadEbookData(); // Recarregar para mostrar novo lead
      } else {
        toast({
          title: "❌ Erro ao enviar",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Erro ao enviar email de teste",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // Remover ebook
  const handleRemoveEbook = () => {
    if (confirm('⚠️ Tem certeza que deseja remover o ebook? Ele não será mais enviado para novos leads.')) {
      removeEbook();
      toast({
        title: "🗑️ Ebook removido",
        description: "O ebook foi removido com sucesso",
      });
      loadEbookData();
    }
  };

  // Download do ebook
  const handleDownload = () => {
    downloadEbook();
    toast({
      title: "📥 Download iniciado",
      description: "O arquivo será baixado em instantes",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Ebook</CardTitle>
            {isEbookConfigured() ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEbookConfigured() ? (
                <Badge className="bg-green-100 text-green-800">Configurado</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">Não Configurado</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats?.ebookFileName || 'Nenhum arquivo'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enviados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSent || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Emails com ebook enviados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamanho do Arquivo</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.ebookSize || '—'}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Tamanho do PDF
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upload de Ebook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload do Ebook (PDF)
          </CardTitle>
          <CardDescription>
            Faça upload do PDF que será enviado automaticamente para os leads do popup de bônus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Área de upload */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-medium mb-2">
              {isDragging ? 'Solte o arquivo aqui' : 'Arraste o PDF aqui'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ou clique no botão abaixo para selecionar
            </p>
            <Input
              id="file-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Processando...' : 'Selecionar PDF'}
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              Tamanho máximo: 10MB | Formato: PDF
            </p>
          </div>

          {/* Informações do ebook atual */}
          {ebookInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-green-800">{ebookInfo.fileName}</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Tamanho: {stats?.ebookSize} • Enviado em: {formatDate(ebookInfo.uploadDate)}
                    </p>
                    {ebookInfo.description && (
                      <p className="text-sm text-green-600 mt-1">
                        📖 {ebookInfo.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleRemoveEbook}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Alerta se não tiver ebook */}
          {!ebookInfo && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Nenhum ebook configurado</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Faça upload do PDF acima. Ele será enviado automaticamente para todos que se cadastrarem no popup de bônus.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enviar Email de Teste */}
      {isEbookConfigured() && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Enviar Email de Teste
            </CardTitle>
            <CardDescription>
              Teste o envio automático do ebook para verificar se está funcionando
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-name">Nome</Label>
                <Input
                  id="test-name"
                  placeholder="Seu nome"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-email">Email</Label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={handleSendTest}
              disabled={isSending}
              className="mt-4 w-full md:w-auto"
            >
              {isSending ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Email de Teste
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de Leads que receberam o ebook */}
      {leads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Leads que Receberam o Ebook
            </CardTitle>
            <CardDescription>
              {leads.length} {leads.length === 1 ? 'pessoa recebeu' : 'pessoas receberam'} o ebook
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leads.slice().reverse().slice(0, 10).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enviado
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(lead.sentAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {leads.length > 10 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Mostrando 10 de {leads.length} leads
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
