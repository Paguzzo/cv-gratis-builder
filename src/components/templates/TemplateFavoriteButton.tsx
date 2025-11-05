// Favorite button component for templates
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TemplateFavoriteButtonProps {
  templateId: string;
  isFavorite: boolean;
  onToggle: (templateId: string) => void;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function TemplateFavoriteButton({
  templateId,
  isFavorite,
  onToggle,
  className,
  variant = 'ghost',
  size = 'icon'
}: TemplateFavoriteButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(templateId);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'transition-all duration-200',
        isFavorite && 'text-red-500 hover:text-red-600',
        !isFavorite && 'text-gray-400 hover:text-red-400',
        className
      )}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all',
          isFavorite && 'fill-current'
        )}
      />
    </Button>
  );
}
