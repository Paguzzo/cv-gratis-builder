import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { useExperience } from '@/contexts/ExperienceContext';
import { AIService } from '@/services/aiService';
import { Plus, Trash2, Briefcase, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const experienceSchema = z.object({
  experience: z.array(z.object({
    position: z.string().min(1, 'Cargo é obrigatório'),
    company: z.string().min(1, 'Empresa é obrigatória'),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string().optional(),
    current: z.boolean(),
    keywords: z.string(),
    description: z.string()
  }))
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export function Experience() {
  const { state, setExperience } = useExperience();
  const [isGeneratingAI, setIsGeneratingAI] = useState<number | null>(null);
  
  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience: state.data.length > 0 ? state.data : [
        {
          position: '',
          company: '',
          startDate: '',
          endDate: '',
          current: false,
          keywords: '',
          description: ''
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'experience'
  });

  const watchedExperience = form.watch('experience');

  useEffect(() => {
    const validExperience = watchedExperience.filter(exp => 
      exp.position && exp.company && exp.startDate
    );
    setExperience(validExperience.map((exp, index) => ({
      id: `exp-${index}`,
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      current: exp.current,
      keywords: exp.keywords,
      description: exp.description
    })));
  }, [watchedExperience, setExperience]);

  const addExperience = () => {
    append({
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      keywords: '',
      description: ''
    });
  };

  const generateDescription = async (index: number) => {
    const experience = watchedExperience[index];
    if (!experience.keywords || !experience.position) return;

    setIsGeneratingAI(index);

    try {
      // Usar GrokExperienceService diretamente
      const { GrokExperienceService } = await import('@/services/grokExperienceService');

      const response = await GrokExperienceService.generateExperienceDescription({
        position: experience.position,
        company: experience.company || 'Empresa',
        userDescription: experience.description || '',
        keywords: experience.keywords,
        startDate: experience.startDate || '',
        endDate: experience.endDate || '',
        isCurrent: experience.current || false
      });

      if (response.success && response.content) {
        form.setValue(`experience.${index}.description`, response.content);
      }
    } catch (error) {
      console.error('Erro ao gerar descrição:', error);
    } finally {
      setIsGeneratingAI(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Experiência Profissional</h2>
        <p className="text-muted-foreground">
          Adicione suas experiências de trabalho e transforme-as em descrições poderosas com nossa IA JobAI
        </p>
      </div>

      {/* Orientações da IA para Experiência */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">🚀</span>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-2">Como usar a IA JobAI para criar descrições de experiência impactantes:</h4>
            <div className="space-y-2 text-sm text-green-800">
              <p><strong>1. Preencha cargo e empresa:</strong> Informações básicas são essenciais para contextualizar a experiência.</p>
              <p><strong>2. Palavras-chave específicas:</strong> Liste tecnologias, metodologias ou competências usadas (ex: "Python, Scrum, análise de dados, automação").</p>
              <p><strong>3. Descrição base:</strong> Escreva o que você fazia no dia a dia. A IA transformará em conquistas estratégicas com métricas.</p>
              <p><strong>4. A IA criará:</strong> Bullets profissionais focados em resultados, liderança e impacto mensurável na empresa.</p>
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">
                  Experiência {index + 1}
                </CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Analista de Marketing"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Google Brasil"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início *</FormLabel>
                        <FormControl>
                          <MonthYearPicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="AAAA-MM"
                            className="cursor-pointer"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          📅 Clique para selecionar
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experience.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Fim</FormLabel>
                        <FormControl>
                          <MonthYearPicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="AAAA-MM"
                            disabled={watchedExperience[index]?.current}
                            className="cursor-pointer"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          📅 {watchedExperience[index]?.current ? 'Trabalho atual' : 'Clique para selecionar'}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experience.${index}.current`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (checked) {
                                form.setValue(`experience.${index}.endDate`, '');
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Trabalho atual
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`experience.${index}.keywords`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competências e tecnologias utilizadas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Python, SQL, liderança de equipes, metodologia ágil, gestão de projetos, automação"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        💡 <strong>Para melhores resultados:</strong> Use termos técnicos, ferramentas, metodologias e soft skills específicas da função
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>O que você fazia no dia a dia?</FormLabel>
                      <div className="space-y-3">
                        <FormControl>
                          <Textarea
                            placeholder="Descreva suas atividades, projetos e responsabilidades principais. Ex: 'Desenvolvia sistemas web, coordenava equipe de 5 pessoas, implementava melhorias nos processos...' A IA transformará isso em conquistas estratégicas com métricas de impacto."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            💡 <strong>Dica:</strong> Foque no que você <em>fazia</em>, não no que <em>conquistou</em> - a IA criará os resultados
                          </p>
                          
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={() => generateDescription(index)}
                            disabled={!watchedExperience[index]?.keywords || !watchedExperience[index]?.position || isGeneratingAI === index}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          >
                            {isGeneratingAI === index ? (
                              <>
                                <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full mr-2" />
                                Criando conquistas...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3 mr-2" />
                                🚀 Transformar com IA
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Experiência
          </Button>
        </div>
      </Form>
    </div>
  );
}