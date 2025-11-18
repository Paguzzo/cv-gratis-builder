import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSkills } from '@/contexts/SkillsContext';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const languagesSchema = z.object({
  languages: z.array(z.object({
    name: z.string().min(1, 'Nome do idioma é obrigatório'),
    level: z.enum(['basico', 'intermediario', 'avancado', 'fluente', 'nativo'])
  }))
});

type LanguagesFormData = z.infer<typeof languagesSchema>;

const levelLabels = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
  fluente: 'Fluente',
  nativo: 'Nativo'
};

const commonLanguages = [
  'Inglês',
  'Espanhol',
  'Francês',
  'Alemão',
  'Italiano',
  'Japonês',
  'Mandarim',
  'Russo',
  'Árabe',
  'Coreano'
];

export function Languages() {
  const { state, setLanguages } = useSkills();
  
  const form = useForm<LanguagesFormData>({
    resolver: zodResolver(languagesSchema),
    defaultValues: {
      languages: state.languages.length > 0 ? state.languages : []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'languages'
  });

  const watchedLanguages = form.watch('languages');

  useEffect(() => {
    const validLanguages = watchedLanguages.filter(lang => 
      lang.name && lang.level
    );
    setLanguages(validLanguages.map((lang, index) => ({
      id: `lang-${index}`,
      name: lang.name,
      level: lang.level
    })));
  }, [watchedLanguages, setLanguages]);

  const addLanguage = () => {
    append({
      name: '',
      level: 'basico' as const
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Idiomas</h2>
        <p className="text-muted-foreground">
          Adicione os idiomas que você domina e seu nível de proficiência
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          {fields.length === 0 && (
            <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
              <p>Nenhum idioma adicionado ainda.</p>
              <p className="text-sm">Clique no botão abaixo para adicionar um idioma.</p>
            </div>
          )}

          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">
                  Idioma {index + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`languages.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o idioma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {commonLanguages.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`languages.${index}.level`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível de Proficiência</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(levelLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addLanguage}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Idioma
          </Button>
        </div>
      </Form>

      {/* Informação adicional */}
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Dica sobre níveis de proficiência:</h4>
        <ul className="space-y-1">
          <li><strong>Básico:</strong> Conhecimento fundamental, conversação simples</li>
          <li><strong>Intermediário:</strong> Comunicação adequada em situações comuns</li>
          <li><strong>Avançado:</strong> Comunicação fluida em contextos profissionais</li>
          <li><strong>Fluente:</strong> Domínio quase nativo do idioma</li>
          <li><strong>Nativo:</strong> Idioma materno ou equivalente</li>
        </ul>
      </div>
    </div>
  );
}