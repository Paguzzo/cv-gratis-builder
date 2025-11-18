import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  value?: string;
  onChange: (photo: string) => void;
  className?: string;
  disabled?: boolean;
}

export function PhotoUpload({ value, onChange, className, disabled }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onChange(base64);
      setIsLoading(false);
    };
    reader.onerror = () => {
      alert('Erro ao carregar a imagem.');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <Avatar className="w-24 h-24 cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
          <AvatarImage src={value} alt="Foto do perfil" className="object-cover" />
          <AvatarFallback className="bg-muted">
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </AvatarFallback>
        </Avatar>
        
        {value && !disabled && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={disabled || isLoading}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {value ? 'Alterar foto' : 'Adicionar foto'}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          Opcional • JPG, PNG até 5MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
} 