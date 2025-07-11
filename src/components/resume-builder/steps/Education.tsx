import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurriculum } from '@/contexts/CurriculumContext';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const educationSchema = z.object({
  education: z.array(z.object({
    course: z.string().min(1, 'Nome do curso é obrigatório'),
    institution: z.string().min(1, 'Instituição é obrigatória'),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string().min(1, 'Data de fim é obrigatória'),
    level: z.enum(['fundamental', 'medio', 'tecnico', 'superior', 'pos-graduacao', 'mestrado', 'doutorado'])
  })).min(1, 'Adicione pelo menos uma formação')
});

type EducationFormData = z.infer<typeof educationSchema>;

const levelLabels = {
  fundamental: 'Ensino Fundamental',
  medio: 'Ensino Médio',
  tecnico: 'Ensino Técnico',
  superior: 'Ensino Superior',
  'pos-graduacao': 'Pós-Graduação',
  mestrado: 'Mestrado',
  doutorado: 'Doutorado'
};

export function Education() {
  const { state, updateEducation } = useCurriculum();
  
  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: state.data.education.length > 0 ? state.data.education : [
        {
          course: '',
          institution: '',
          startDate: '',
          endDate: '',
          level: 'superior' as const
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'education'
  });

  const watchedEducation = form.watch('education');

  useEffect(() => {
    const validEducation = watchedEducation.filter(edu => 
      edu.course && edu.institution && edu.startDate && edu.endDate
    );
    updateEducation(validEducation.map((edu, index) => ({
      id: `edu-${index}`,
      course: edu.course,
      institution: edu.institution,
      startDate: edu.startDate,
      endDate: edu.endDate,
      level: edu.level
    })));
  }, [watchedEducation, updateEducation]);

  const addEducation = () => {
    append({
      course: '',
      institution: '',
      startDate: '',
      endDate: '',
      level: 'superior' as const
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Educação</h2>
        <p className="text-muted-foreground">
          Adicione suas formações acadêmicas e cursos relevantes
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">
                  Formação {index + 1}
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
                    name={`education.${index}.course`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Curso</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Administração de Empresas"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instituição</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Universidade de São Paulo"
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
                    name={`education.${index}.level`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível</FormLabel>
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

                  <FormField
                    control={form.control}
                    name={`education.${index}.startDate`}
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
                    name={`education.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Conclusão</FormLabel>
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
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addEducation}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Formação
          </Button>
        </div>
      </Form>
    </div>
  );
}