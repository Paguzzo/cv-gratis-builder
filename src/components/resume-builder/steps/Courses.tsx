import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useExtras } from '@/contexts/ExtrasContext';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const coursesSchema = z.object({
  courses: z.array(z.object({
    name: z.string().min(1, 'Nome do curso é obrigatório'),
    institution: z.string().optional(),
    year: z.string().optional()
  }))
});

type CoursesFormData = z.infer<typeof coursesSchema>;

export function Courses() {
  const { state, setCourses } = useExtras();
  
  const form = useForm<CoursesFormData>({
    resolver: zodResolver(coursesSchema),
    defaultValues: {
      courses: state.courses.length > 0 ? state.courses : []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'courses'
  });

  const watchedCourses = form.watch('courses');

  useEffect(() => {
    const validCourses = watchedCourses.filter(course => 
      course.name
    );
    setCourses(validCourses.map((course, index) => ({
      id: `course-${index}`,
      name: course.name,
      institution: course.institution,
      year: course.year
    })));
  }, [watchedCourses, setCourses]);

  const addCourse = () => {
    append({
      name: '',
      institution: '',
      year: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Cursos Relevantes</h2>
        <p className="text-muted-foreground">
          Adicione cursos complementares, certificações e treinamentos relevantes
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          {fields.length === 0 && (
            <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
              <p>Nenhum curso adicionado ainda.</p>
              <p className="text-sm">Clique no botão abaixo para adicionar um curso.</p>
            </div>
          )}

          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">
                  Curso {index + 1}
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
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`courses.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Curso *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Certificação em Marketing Digital"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`courses.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instituição</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Google, Coursera, SENAC..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`courses.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano de Conclusão</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 2024"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addCourse}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Curso
          </Button>
        </div>
      </Form>

      {/* Sugestões de cursos */}
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Exemplos de cursos relevantes:</h4>
        <ul className="space-y-1">
          <li>• Certificações profissionais (Google, Microsoft, Adobe, etc.)</li>
          <li>• Cursos online (Coursera, Udemy, edX, etc.)</li>
          <li>• Treinamentos corporativos</li>
          <li>• Workshops e seminários</li>
          <li>• Certificações técnicas específicas da área</li>
        </ul>
      </div>
    </div>
  );
}