import { Card } from '@/components/ui/card';
import { useCurriculum } from '@/contexts/CurriculumContext';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CurriculumPreview() {
  const { state } = useCurriculum();
  const { data } = state;

  return (
    <Card className="h-fit sticky top-6 bg-background shadow-lg">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {data.personalInfo.name || 'Seu Nome'}
          </h1>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            {data.personalInfo.email && (
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.whatsapp && (
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {data.personalInfo.whatsapp}
              </div>
            )}
            {data.personalInfo.address && (
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                {data.personalInfo.address}
              </div>
            )}
          </div>
        </div>

        {/* Objetivo Profissional */}
        {data.objective.description && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Objetivo Profissional
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.objective.description}
            </p>
          </div>
        )}

        {/* Educação */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Formação
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-primary pl-3">
                  <h3 className="font-medium text-foreground">{edu.course}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiência */}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Experiência Profissional
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-primary pl-3">
                  <h3 className="font-medium text-foreground">{exp.position}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {exp.startDate} - {exp.current ? 'Atual' : exp.endDate}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Habilidades */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Idiomas */}
        {data.languages.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Idiomas
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="text-sm text-foreground">{lang.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {lang.level.charAt(0).toUpperCase() + lang.level.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cursos */}
        {data.courses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Cursos Relevantes
            </h2>
            <div className="space-y-2">
              {data.courses.map((course) => (
                <div key={course.id} className="text-sm">
                  <span className="font-medium text-foreground">• {course.name}</span>
                  {course.institution && (
                    <span className="text-muted-foreground"> - {course.institution}</span>
                  )}
                  {course.year && (
                    <span className="text-muted-foreground"> ({course.year})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projetos */}
        {data.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Projetos
            </h2>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-medium text-foreground">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conquistas */}
        {data.achievements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Conquistas & Realizações
            </h2>
            <div className="space-y-3">
              {data.achievements.map((achievement) => (
                <div key={achievement.id}>
                  <h3 className="font-medium text-foreground">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data.personalInfo.name && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              Preencha as informações ao lado para ver seu currículo
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}