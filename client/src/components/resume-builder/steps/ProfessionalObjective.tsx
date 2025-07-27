import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useSkills } from '@/contexts/SkillsContext';
import { AIService } from '@/services/aiService';
import { Sparkles, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const objectiveSchema = z.object({
  keywords: z.string().min(3, 'Digite pelo menos 3 caracteres'),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres'),
  seekingFor: z.string().optional(),
});

type ObjectiveForm = z.infer<typeof objectiveSchema>;

export function ProfessionalObjective() {
  const { state, updateObjective } = useSkills();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<ObjectiveForm>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: state.objective,
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
    const userText = form.getValues('description') || '';
    
    if (!keywords) return;

    setIsGenerating(true);
    
    try {
      const generatedText = await AIService.generateText('objective', userText, keywords);
      
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
          Crie um objetivo profissional poderoso com nossa IA JobAI. Para obter o melhor resultado, siga as orientações abaixo e deixe nossa inteligência artificial transformar suas informações em um texto estratégico e impactante.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Orientações da IA */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Como usar a IA JobAI para criar um objetivo profissional impactante:</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>1. Palavras-chave estratégicas:</strong> Liste 3-5 competências principais da sua área (ex: "gestão de equipes, vendas B2B, liderança, resultados"). Essas palavras serão integradas naturalmente no texto.</p>
                <p><strong>2. Texto base opcional:</strong> Escreva brevemente sobre sua experiência ou objetivo. A IA usará isso como base para criar um texto mais elaborado e estratégico.</p>
                <p><strong>3. A IA criará:</strong> Um objetivo profissional fluido, técnico e otimizado para ATS, posicionando você como solução para as necessidades das empresas.</p>
              </div>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palavras-chave estratégicas da sua área *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: gestão de equipes, vendas consultivas, liderança, análise de dados, resultados" 
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Dica: Use termos técnicos e competências específicas que os recrutadores procuram na sua área
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seekingFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>O que você busca (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Oportunidades em gestão comercial, Crescimento profissional, Novos desafios em tecnologia" 
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Dica: Seja específico sobre o tipo de oportunidade ou cargo que deseja
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto base para a IA (opcional)</FormLabel>
                  <div className="space-y-3">
                    <FormControl>
                      <Textarea 
                        placeholder="Escreva brevemente sobre sua experiência ou objetivo profissional. Ex: 'Tenho 5 anos em vendas B2B, focado em clientes corporativos e relacionamento duradouro...' A IA usará este texto como base para criar um objetivo poderoso e estratégico."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        💡 <strong>Dica:</strong> Quanto mais específico e detalhado você for, melhor será o resultado da IA
                      </p>
                      
                      <Button
                        type="button"
                        onClick={generateWithAI}
                        disabled={!form.watch('keywords') || isGenerating}
                        variant="default"
                        size="sm"
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        {isGenerating ? 'Criando magia...' : '✨ Gerar com IA JobAI'}
                      </Button>
                    </div>
                  </div>
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