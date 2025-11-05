import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExtras } from '@/contexts/ExtrasContext';
import { Plus, Trash2, Trophy, Briefcase } from 'lucide-react';
import { useEffect } from 'react';

const projectsAchievementsSchema = z.object({
  projects: z.array(z.object({
    name: z.string().min(1, 'Nome do projeto é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória')
  })),
  achievements: z.array(z.object({
    title: z.string().min(1, 'Título da conquista é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória')
  }))
});

type ProjectsAchievementsFormData = z.infer<typeof projectsAchievementsSchema>;

export function ProjectsAchievements() {
  const { state, setProjects, setAchievements } = useExtras();
  
  const form = useForm<ProjectsAchievementsFormData>({
    resolver: zodResolver(projectsAchievementsSchema),
    defaultValues: {
      projects: state.projects.length > 0 ? state.projects : [],
      achievements: state.achievements.length > 0 ? state.achievements : []
    }
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: 'projects'
  });

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control: form.control,
    name: 'achievements'
  });

  const watchedProjects = form.watch('projects');
  const watchedAchievements = form.watch('achievements');

  useEffect(() => {
    const validProjects = watchedProjects.filter(project => 
      project.name && project.description
    );
    setProjects(validProjects.map((project, index) => ({
      id: `project-${index}`,
      name: project.name,
      description: project.description
    })));
  }, [watchedProjects, setProjects]);

  useEffect(() => {
    const validAchievements = watchedAchievements.filter(achievement => 
      achievement.title && achievement.description
    );
    setAchievements(validAchievements.map((achievement, index) => ({
      id: `achievement-${index}`,
      title: achievement.title,
      description: achievement.description
    })));
  }, [watchedAchievements, setAchievements]);

  const addProject = () => {
    appendProject({
      name: '',
      description: ''
    });
  };

  const addAchievement = () => {
    appendAchievement({
      title: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Projetos & Conquistas</h2>
        <p className="text-muted-foreground">
          Destaque seus projetos pessoais, acadêmicos e principais conquistas profissionais
        </p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Projetos
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Conquistas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Form {...form}>
            <div className="space-y-4">
              {projectFields.length === 0 && (
                <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum projeto adicionado ainda.</p>
                  <p className="text-sm">Adicione projetos pessoais, acadêmicos ou profissionais.</p>
                </div>
              )}

              {projectFields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg">
                      Projeto {index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Projeto</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: E-commerce para produtos artesanais"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o projeto, tecnologias utilizadas, objetivos e resultados..."
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
                onClick={addProject}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Projeto
              </Button>
            </div>
          </Form>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Form {...form}>
            <div className="space-y-4">
              {achievementFields.length === 0 && (
                <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conquista adicionada ainda.</p>
                  <p className="text-sm">Destaque suas principais realizações profissionais.</p>
                </div>
              )}

              {achievementFields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg">
                      Conquista {index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`achievements.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título da Conquista</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Funcionário do Mês - Dezembro 2023"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`achievements.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o contexto, critérios e impacto da conquista..."
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
                onClick={addAchievement}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Conquista
              </Button>
            </div>
          </Form>
        </TabsContent>
      </Tabs>

      {/* Dicas */}
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Dicas para esta seção:</h4>
        <div className="space-y-2">
          <div>
            <strong>Projetos:</strong>
            <ul className="ml-4 space-y-1">
              <li>• Trabalhos acadêmicos relevantes</li>
              <li>• Projetos pessoais (sites, apps, etc.)</li>
              <li>• Trabalhos voluntários</li>
              <li>• Iniciativas de melhoria no trabalho</li>
            </ul>
          </div>
          <div>
            <strong>Conquistas:</strong>
            <ul className="ml-4 space-y-1">
              <li>• Prêmios e reconhecimentos</li>
              <li>• Metas alcançadas</li>
              <li>• Melhorias implementadas</li>
              <li>• Resultados mensuráveis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}