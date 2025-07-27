import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthYearPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTHS = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

export function MonthYearPicker({ 
  value, 
  onChange, 
  placeholder = "Selecione mês/ano",
  className,
  disabled = false
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    if (value) {
      return value.split('-')[0] || new Date().getFullYear().toString();
    }
    return new Date().getFullYear().toString();
  });
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    if (value) {
      return value.split('-')[1] || '01';
    }
    return '01';
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const formatDisplayValue = (monthYearValue: string) => {
    if (!monthYearValue) return '';
    const [year, month] = monthYearValue.split('-');
    const monthName = MONTHS.find(m => m.value === month)?.label || '';
    return `${monthName} ${year}`;
  };

  const handleConfirm = () => {
    const newValue = `${selectedYear}-${selectedMonth}`;
    onChange?.(newValue);
    setIsOpen(false);
  };

  // Primeiro tenta usar input nativo type="month"
  const supportsMonthInput = React.useMemo(() => {
    const input = document.createElement('input');
    input.type = 'month';
    return input.type === 'month';
  }, []);

  // Se o navegador suporta input month nativo, usa ele
  if (supportsMonthInput) {
    return (
      <Input
        type="month"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn("cursor-pointer", className)}
        disabled={disabled}
        onFocus={(e) => {
          e.target.showPicker?.();
        }}
      />
    );
  }

  // Fallback para navegadores que não suportam
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? formatDisplayValue(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Selecionar Mês e Ano</div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Mês</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleConfirm} size="sm" className="flex-1">
              Confirmar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              size="sm"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 