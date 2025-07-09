import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCurriculum } from '@/contexts/CurriculumContext';
import { Sparkles, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const objectiveSchema = z.object({
  keywords: z.string().min(3, 'Digite pelo menos 3 caracteres'),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres'),
});

type ObjectiveForm = z.infer<typeof objectiveSchema>;

export function ProfessionalObjective() {
  const { state, updateObjective } = useCurriculum();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<ObjectiveForm>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: state.data.objective,
  });

  // Update context when form values change
  useEffect(() => {
    const subscription = form.watch((data) => {
      updateObjective(data);
    });
    return () => subscription.unsubscribe();
  }, [form, updateObjective]);

  const generateWithAI = async () => {
    const keywords = form.getValues('keywords');
    if (!keywords) return;

    setIsGenerating(true);
    
    try {
      // Simulate AI generation for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedText = `Profissional dedicado e motivado com interesse em ${keywords}. Busco oportunidades para aplicar conhecimentos e contribuir para o crescimento da empresa, desenvolvendo habilidades e agregando valor através de comprometimento e resultados consistentes.`;
      
      form.setValue('description', generatedText);
      updateObjective({ description: generatedText });
    } catch (error) {
      console.error('Error generating objective:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objetivo Profissional</CardTitle>
        <CardDescription>
          Descreva seus objetivos de carreira. Nossa IA pode ajudar você a criar um objetivo profissional impactante.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palavras-chave da sua área de interesse *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: vendas, atendimento, tecnologia, marketing..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={generateWithAI}
                disabled={!form.watch('keywords') || isGenerating}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGenerating ? 'Gerando...' : 'Gerar com IA'}
              </Button>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo Profissional *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva seus objetivos profissionais, o que você busca e como pode contribuir..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}