/**
 * Template Utilities
 * Funções auxiliares para renderização de templates
 */

import { CurriculumData } from '@/types/curriculum';

/**
 * Formata data para MM/YYYY ou "Atual"
 */
export const formatDate = (date: string, current?: boolean): string => {
  if (current) return 'Atual';
  if (!date) return '';

  try {
    const [year, month] = date.split('-');
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex]}/${year}`;
  } catch {
    return date;
  }
};

/**
 * Formata telefone para (XX) XXXXX-XXXX
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';

  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, '');

  // Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  return phone;
};

/**
 * Gera iniciais do nome (para avatares)
 */
export const getInitials = (name: string): string => {
  if (!name) return '';

  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Formata endereço completo
 */
export const formatAddress = (address?: string): string => {
  if (!address) return '';
  return address.trim();
};

/**
 * Calcula tempo de experiência
 */
export const calculateDuration = (startDate: string, endDate: string, current: boolean): string => {
  try {
    const start = new Date(startDate);
    const end = current ? new Date() : new Date(endDate);

    const months = (end.getFullYear() - start.getFullYear()) * 12 +
                   (end.getMonth() - start.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
    } else if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    } else {
      return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
    }
  } catch {
    return '';
  }
};

/**
 * Traduz nível de educação
 */
export const translateEducationLevel = (level: string): string => {
  const levels: Record<string, string> = {
    'fundamental': 'Ensino Fundamental',
    'medio': 'Ensino Médio',
    'tecnico': 'Técnico',
    'superior': 'Ensino Superior',
    'pos-graduacao': 'Pós-Graduação',
    'mestrado': 'Mestrado',
    'doutorado': 'Doutorado'
  };
  return levels[level] || level;
};

/**
 * Traduz nível de idioma
 */
export const translateLanguageLevel = (level: string): string => {
  const levels: Record<string, string> = {
    'basico': 'Básico',
    'intermediario': 'Intermediário',
    'avancado': 'Avançado',
    'fluente': 'Fluente',
    'nativo': 'Nativo'
  };
  return levels[level] || level;
};

/**
 * Traduz categoria de habilidade
 */
export const translateSkillCategory = (category: string): string => {
  const categories: Record<string, string> = {
    'technical': 'Técnicas',
    'soft': 'Comportamentais',
    'language': 'Idiomas',
    'other': 'Outras'
  };
  return categories[category] || category;
};

/**
 * Verifica se há dados suficientes para renderizar seção
 */
export const hasData = (data: any[] | undefined): boolean => {
  return Array.isArray(data) && data.length > 0;
};

/**
 * Gera cor aleatória para avatar (baseada no nome)
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // green
    '#06b6d4', // cyan
    '#6366f1', // indigo
    '#f97316', // orange
  ];

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/**
 * Limpa e valida email
 */
export const formatEmail = (email: string): string => {
  if (!email) return '';
  return email.trim().toLowerCase();
};

/**
 * Formata WhatsApp (adiciona +55 se necessário)
 */
export const formatWhatsApp = (whatsapp: string): string => {
  if (!whatsapp) return '';

  const numbers = whatsapp.replace(/\D/g, '');

  // Se não começa com 55, adiciona
  if (!numbers.startsWith('55')) {
    return `+55 ${formatPhone(numbers)}`;
  }

  return `+${numbers.slice(0, 2)} ${formatPhone(numbers.slice(2))}`;
};

/**
 * Verifica se currículo tem foto
 */
export const hasPhoto = (data: CurriculumData): boolean => {
  return !!(data.personalInfo?.photo && data.personalInfo.photo.trim() !== '');
};

/**
 * Obtém foto ou retorna placeholder
 */
export const getPhotoOrPlaceholder = (data: CurriculumData): { type: 'photo' | 'placeholder', value: string } => {
  if (hasPhoto(data)) {
    return { type: 'photo', value: data.personalInfo.photo! };
  }

  return {
    type: 'placeholder',
    value: getInitials(data.personalInfo.name)
  };
};

/**
 * Formata lista de categorias de CNH
 */
export const formatDriverLicense = (
  hasLicense?: boolean,
  categories?: string[]
): string => {
  if (!hasLicense) return '';
  if (!categories || categories.length === 0) return 'CNH';
  return `CNH ${categories.join(', ')}`;
};

/**
 * Conta total de itens no currículo
 */
export const getTotalItems = (data: CurriculumData): number => {
  return (
    (data.experience?.length || 0) +
    (data.education?.length || 0) +
    (data.skills?.length || 0) +
    (data.languages?.length || 0) +
    (data.courses?.length || 0) +
    (data.projects?.length || 0) +
    (data.achievements?.length || 0)
  );
};

/**
 * Verifica se é currículo de 1 página ou 2
 */
export const isPrintable = (data: CurriculumData): boolean => {
  const total = getTotalItems(data);
  return total <= 25; // Aproximadamente 1 página
};

/**
 * Gera ID único para elementos
 */
export const generateId = (): string => {
  return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
