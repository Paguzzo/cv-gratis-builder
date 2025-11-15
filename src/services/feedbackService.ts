import { Feedback, FeedbackFormData, FeedbackStats } from '@/types/feedback';

const STORAGE_KEY = 'cv_builder_feedbacks';

// Gera ID único
const generateId = (): string => {
  return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Salva feedback no localStorage
export const saveFeedback = async (formData: FeedbackFormData): Promise<Feedback> => {
  const feedback: Feedback = {
    id: generateId(),
    name: formData.name,
    email: formData.email,
    type: formData.type,
    message: formData.message,
    page: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    status: 'novo',
  };

  // Salva no localStorage
  const feedbacks = getAllFeedbacks();
  feedbacks.unshift(feedback); // Adiciona no início
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));

  // TODO: Enviar notificação por email ao admin
  try {
    await notifyAdmin(feedback);
  } catch (error) {
    console.warn('Erro ao notificar admin:', error);
  }

  return feedback;
};

// Busca todos os feedbacks
export const getAllFeedbacks = (): Feedback[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar feedbacks:', error);
    return [];
  }
};

// Busca feedback por ID
export const getFeedbackById = (id: string): Feedback | null => {
  const feedbacks = getAllFeedbacks();
  return feedbacks.find(f => f.id === id) || null;
};

// Atualiza status do feedback
export const updateFeedbackStatus = (
  id: string,
  status: Feedback['status']
): boolean => {
  try {
    const feedbacks = getAllFeedbacks();
    const index = feedbacks.findIndex(f => f.id === id);

    if (index === -1) return false;

    feedbacks[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return false;
  }
};

// Adiciona resposta do admin
export const addAdminResponse = (
  id: string,
  response: string,
  adminEmail: string
): boolean => {
  try {
    const feedbacks = getAllFeedbacks();
    const index = feedbacks.findIndex(f => f.id === id);

    if (index === -1) return false;

    feedbacks[index].adminResponse = response;
    feedbacks[index].respondedAt = new Date().toISOString();
    feedbacks[index].respondedBy = adminEmail;
    feedbacks[index].status = 'resolvido';

    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
    return true;
  } catch (error) {
    console.error('Erro ao adicionar resposta:', error);
    return false;
  }
};

// Deleta feedback
export const deleteFeedback = (id: string): boolean => {
  try {
    const feedbacks = getAllFeedbacks();
    const filtered = feedbacks.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Erro ao deletar feedback:', error);
    return false;
  }
};

// Busca estatísticas
export const getFeedbackStats = (): FeedbackStats => {
  const feedbacks = getAllFeedbacks();

  const stats: FeedbackStats = {
    total: feedbacks.length,
    novos: feedbacks.filter(f => f.status === 'novo').length,
    lidos: feedbacks.filter(f => f.status === 'lido').length,
    resolvidos: feedbacks.filter(f => f.status === 'resolvido').length,
    porTipo: {
      sugestao: feedbacks.filter(f => f.type === 'sugestao').length,
      bug: feedbacks.filter(f => f.type === 'bug').length,
      dificuldade: feedbacks.filter(f => f.type === 'dificuldade').length,
      elogio: feedbacks.filter(f => f.type === 'elogio').length,
    },
  };

  return stats;
};

// Notifica admin por email (pode ser implementado depois)
const notifyAdmin = async (feedback: Feedback): Promise<void> => {
  // TODO: Integrar com serviço de email existente
  console.log('Nova sugestão/feedback recebido:', {
    tipo: feedback.type,
    de: feedback.name,
    email: feedback.email,
  });
};

// Exporta feedbacks para CSV
export const exportFeedbacksToCSV = (): string => {
  const feedbacks = getAllFeedbacks();

  if (feedbacks.length === 0) return '';

  const headers = [
    'ID',
    'Data/Hora',
    'Nome',
    'Email',
    'Tipo',
    'Mensagem',
    'Página',
    'Status',
    'Resposta Admin',
    'Data Resposta',
  ];

  const rows = feedbacks.map(f => [
    f.id,
    new Date(f.timestamp).toLocaleString('pt-BR'),
    f.name,
    f.email,
    f.type,
    `"${f.message.replace(/"/g, '""')}"`, // Escape aspas
    f.page,
    f.status,
    f.adminResponse ? `"${f.adminResponse.replace(/"/g, '""')}"` : '',
    f.respondedAt ? new Date(f.respondedAt).toLocaleString('pt-BR') : '',
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  return csv;
};

// Download CSV
export const downloadFeedbacksCSV = (): void => {
  const csv = exportFeedbacksToCSV();
  if (!csv) return;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `feedbacks_${Date.now()}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
