import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useCurriculum } from '@/contexts/CurriculumContext';
import { Plus, Trash2, Sparkles } from 'lucide-react';
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
  const { state, updateExperience } = useCurriculum();
  const [isGeneratingAI, setIsGeneratingAI] = useState<number | null>(null);
  
  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience: state.data.experience.length > 0 ? state.data.experience : [
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
    updateExperience(validExperience.map((exp, index) => ({
      id: `exp-${index}`,
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      current: exp.current,
      keywords: exp.keywords,
      description: exp.description
    })));
  }, [watchedExperience, updateExperience]);

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
      // Simular chamada de IA (implementar integração real depois)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedDescription = `• Responsável por ${experience.keywords.toLowerCase()}
• Desenvolveu e implementou soluções inovadoras no cargo de ${experience.position}
• Colaborou com equipes multifuncionais para alcançar objetivos estratégicos
• Contribuiu para o crescimento e sucesso da empresa através de iniciativas proativas`;

      form.setValue(`experience.${index}.description`, generatedDescription);
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
          Adicione suas experiências de trabalho e use IA para gerar descrições
        </p>
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
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            {...field}
                          />
                        </FormControl>
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
                          <Input
                            type="month"
                            {...field}
                            disabled={watchedExperience[index]?.current}
                          />
                        </FormControl>
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
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
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
                      <FormLabel>Palavras-chave</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: marketing digital, campanhas, análise de dados"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Descrição das Atividades</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateDescription(index)}
                          disabled={!watchedExperience[index]?.keywords || !watchedExperience[index]?.position || isGeneratingAI === index}
                          className="h-8"
                        >
                          {isGeneratingAI === index ? (
                            <>
                              <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full mr-2" />
                              Gerando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3 mr-2" />
                              Gerar com IA
                            </>
                          )}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva suas principais responsabilidades e conquistas..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
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