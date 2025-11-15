import { useState, useEffect } from 'react';
import {
  getAllFeedbacks,
  updateFeedbackStatus,
  addAdminResponse,
  deleteFeedback,
  getFeedbackStats,
  downloadFeedbacksCSV,
} from '@/services/feedbackService';
import { Feedback, FeedbackStats } from '@/types/feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  MessageCircle,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Heart,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  User,
} from 'lucide-react';

export function FeedbackManager() {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = () => {
    const allFeedbacks = getAllFeedbacks();
    setFeedbacks(allFeedbacks);
    setStats(getFeedbackStats());
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const statusMatch = filterStatus === 'all' || f.status === filterStatus;
    const typeMatch = filterType === 'all' || f.type === filterType;
    return statusMatch && typeMatch;
  });

  const handleStatusChange = (id: string, newStatus: Feedback['status']) => {
    if (updateFeedbackStatus(id, newStatus)) {
      loadFeedbacks();
      toast({
        title: 'Status atualizado',
        description: 'O status do feedback foi atualizado com sucesso.',
      });
    }
  };

  const handleOpenResponse = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setAdminResponse(feedback.adminResponse || '');
    setResponseDialogOpen(true);
  };

  const handleSaveResponse = () => {
    if (!selectedFeedback || !adminResponse.trim()) {
      toast({
        title: 'Resposta vazia',
        description: 'Por favor, escreva uma resposta antes de salvar.',
        variant: 'destructive',
      });
      return;
    }

    if (addAdminResponse(selectedFeedback.id, adminResponse, 'admin@cvbuilder.com')) {
      loadFeedbacks();
      setResponseDialogOpen(false);
      setAdminResponse('');
      setSelectedFeedback(null);
      toast({
        title: 'Resposta salva',
        description: 'Sua resposta foi salva com sucesso.',
      });
    }
  };

  const handleDelete = () => {
    if (!selectedFeedback) return;

    if (deleteFeedback(selectedFeedback.id)) {
      loadFeedbacks();
      setDeleteDialogOpen(false);
      setSelectedFeedback(null);
      toast({
        title: 'Feedback excluído',
        description: 'O feedback foi excluído com sucesso.',
      });
    }
  };

  const handleExport = () => {
    downloadFeedbacksCSV();
    toast({
      title: 'Exportação concluída',
      description: 'Os feedbacks foram exportados para CSV.',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sugestao':
        return <Lightbulb className="h-4 w-4" />;
      case 'bug':
        return <AlertCircle className="h-4 w-4" />;
      case 'dificuldade':
        return <MessageCircle className="h-4 w-4" />;
      case 'elogio':
        return <Heart className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'sugestao':
        return 'bg-blue-500';
      case 'bug':
        return 'bg-red-500';
      case 'dificuldade':
        return 'bg-yellow-500';
      case 'elogio':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novo':
        return <Badge className="bg-blue-500">Novo</Badge>;
      case 'lido':
        return <Badge className="bg-yellow-500">Lido</Badge>;
      case 'resolvido':
        return <Badge className="bg-green-500">Resolvido</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.novos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lidos</CardTitle>
              <Eye className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lidos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvidos}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Feedbacks Recebidos</CardTitle>
              <CardDescription>
                Gerencie sugestões, bugs e mensagens dos usuários
              </CardDescription>
            </div>
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label>Filtrar por Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="novo">Novos</SelectItem>
                  <SelectItem value="lido">Lidos</SelectItem>
                  <SelectItem value="resolvido">Resolvidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label>Filtrar por Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="sugestao">Sugestões</SelectItem>
                  <SelectItem value="bug">Bugs</SelectItem>
                  <SelectItem value="dificuldade">Dificuldades</SelectItem>
                  <SelectItem value="elogio">Elogios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de Feedbacks */}
          <div className="space-y-4">
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum feedback encontrado</p>
              </div>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg ${getTypeBadgeColor(feedback.type)}`}>
                            {getTypeIcon(feedback.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{feedback.name}</h3>
                              {getStatusBadge(feedback.status)}
                              <Badge variant="outline" className="text-xs capitalize">
                                {feedback.type}
                              </Badge>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {feedback.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(feedback.timestamp).toLocaleString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Select
                            value={feedback.status}
                            onValueChange={(value) =>
                              handleStatusChange(feedback.id, value as Feedback['status'])
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="novo">Novo</SelectItem>
                              <SelectItem value="lido">Lido</SelectItem>
                              <SelectItem value="resolvido">Resolvido</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenResponse(feedback)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      {/* Mensagem */}
                      <div className="pl-14">
                        <p className="text-sm whitespace-pre-wrap">{feedback.message}</p>
                      </div>

                      {/* Resposta do Admin */}
                      {feedback.adminResponse && (
                        <div className="pl-14 mt-4 p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                            <User className="h-4 w-4" />
                            Resposta do Admin
                            {feedback.respondedAt && (
                              <span className="text-xs text-muted-foreground">
                                - {new Date(feedback.respondedAt).toLocaleString('pt-BR')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{feedback.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Resposta */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Responder Feedback</DialogTitle>
            <DialogDescription>
              Envie uma resposta para {selectedFeedback?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Mensagem original:</p>
                <p className="text-sm whitespace-pre-wrap">{selectedFeedback.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Sua Resposta</Label>
                <Textarea
                  id="response"
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows={6}
                  placeholder="Digite sua resposta..."
                  className="resize-none"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveResponse}>Salvar Resposta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este feedback? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
