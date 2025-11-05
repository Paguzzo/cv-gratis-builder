import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSkills } from '@/contexts/SkillsContext';
import { X, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const skillsSchema = z.object({
  search: z.string().optional()
});

type SkillsFormData = z.infer<typeof skillsSchema>;

const predefinedSkills = [
  // Habilidades Técnicas
  { name: 'JavaScript', category: 'technical' as const },
  { name: 'React', category: 'technical' as const },
  { name: 'Node.js', category: 'technical' as const },
  { name: 'Python', category: 'technical' as const },
  { name: 'SQL', category: 'technical' as const },
  { name: 'Excel', category: 'technical' as const },
  { name: 'PowerBI', category: 'technical' as const },
  { name: 'Photoshop', category: 'technical' as const },
  { name: 'AutoCAD', category: 'technical' as const },
  { name: 'WordPress', category: 'technical' as const },
  
  // Habilidades Interpessoais
  { name: 'Comunicação', category: 'soft' as const },
  { name: 'Liderança', category: 'soft' as const },
  { name: 'Trabalho em equipe', category: 'soft' as const },
  { name: 'Resolução de problemas', category: 'soft' as const },
  { name: 'Organização', category: 'soft' as const },
  { name: 'Criatividade', category: 'soft' as const },
  { name: 'Adaptabilidade', category: 'soft' as const },
  { name: 'Gestão de tempo', category: 'soft' as const },
  { name: 'Negociação', category: 'soft' as const },
  { name: 'Proatividade', category: 'soft' as const },
  
  // Outras
  { name: 'Marketing Digital', category: 'other' as const },
  { name: 'Gestão de Projetos', category: 'other' as const },
  { name: 'Vendas', category: 'other' as const },
  { name: 'Atendimento ao Cliente', category: 'other' as const },
  { name: 'Logística', category: 'other' as const },
  { name: 'Recursos Humanos', category: 'other' as const },
  { name: 'Contabilidade', category: 'other' as const },
  { name: 'Design Gráfico', category: 'other' as const }
];

export function Skills() {
  const { state, setSkills } = useSkills();
  const [selectedSkills, setSelectedSkills] = useState(state.skills);
  const [filteredSkills, setFilteredSkills] = useState(predefinedSkills);
  
  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      search: ''
    }
  });

  const searchValue = form.watch('search') || '';

  useEffect(() => {
    setSkills(selectedSkills);
  }, [selectedSkills, setSkills]);

  useEffect(() => {
    if (searchValue) {
      const filtered = predefinedSkills.filter(skill => 
        skill.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        !selectedSkills.some(selected => selected.name === skill.name)
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(predefinedSkills.filter(skill => 
        !selectedSkills.some(selected => selected.name === skill.name)
      ));
    }
  }, [searchValue, selectedSkills]);

  const addSkill = (skill: typeof predefinedSkills[0]) => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: skill.name,
      category: skill.category
    };
    setSelectedSkills(prev => [...prev, newSkill]);
    form.setValue('search', '');
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const addCustomSkill = () => {
    const customSkillName = searchValue.trim();
    if (customSkillName && !selectedSkills.some(skill => skill.name.toLowerCase() === customSkillName.toLowerCase())) {
      const newSkill = {
        id: `skill-${Date.now()}`,
        name: customSkillName,
        category: 'other' as const
      };
      setSelectedSkills(prev => [...prev, newSkill]);
      form.setValue('search', '');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSkills.length > 0) {
        addSkill(filteredSkills[0]);
      } else if (searchValue.trim()) {
        addCustomSkill();
      }
    }
  };

  const categoryLabels = {
    technical: 'Técnicas',
    soft: 'Interpessoais',
    language: 'Idiomas',
    other: 'Outras'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Habilidades</h2>
        <p className="text-muted-foreground">
          Selecione suas habilidades técnicas e interpessoais
        </p>
      </div>

      <Form {...form}>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesquisar Habilidades</FormLabel>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input
                    placeholder="Digite para pesquisar ou adicionar nova habilidade..."
                    className="pl-10"
                    {...field}
                    onKeyPress={handleKeyPress}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      {/* Habilidades Selecionadas */}
      {selectedSkills.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Habilidades Selecionadas</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
              >
                {skill.name}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeSkill(skill.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Sugestões de Habilidades */}
      {filteredSkills.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            {searchValue ? 'Resultados da Pesquisa' : 'Habilidades Sugeridas'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {filteredSkills.slice(0, 20).map((skill) => (
              <Button
                key={skill.name}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill)}
                className="h-auto px-3 py-2"
              >
                {skill.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Botão para adicionar habilidade customizada */}
      {searchValue && !filteredSkills.some(skill => skill.name.toLowerCase() === searchValue.toLowerCase()) && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Adicionar Nova Habilidade</h3>
          <Button
            type="button"
            variant="outline"
            onClick={addCustomSkill}
            className="w-full"
          >
            Adicionar "{searchValue}"
          </Button>
        </div>
      )}

      {selectedSkills.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <p>Nenhuma habilidade selecionada ainda.</p>
          <p className="text-sm">Use a busca acima para encontrar e adicionar habilidades.</p>
        </div>
      )}
    </div>
  );
}