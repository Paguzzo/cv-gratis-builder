import React from 'react';
import { CurriculumData } from '@/types/curriculum';
import { Template } from '@/types/templates';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModernTemplateProps {
  data: CurriculumData;
  template: Template;
}

// Função para processar descrição com bullets
const formatDescription = (description: string) => {
  if (!description) return null;
  
  // Dividir por bullet points comuns e quebras de linha
  const bullets = description
    .split(/[•·‣▪▫◦‧⁃-]\s*|\n/)
    .filter(bullet => bullet.trim().length > 0)
    .map(bullet => bullet.trim());
  
  // Se tem mais de um item, renderizar como parágrafos separados
  if (bullets.length > 1) {
    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {bullets.map((bullet, index) => (
          <p key={index} className="text-sm">
            {bullet}
          </p>
        ))}
      </div>
    );
  }
  
  // Se é só um parágrafo, renderizar normalmente
  return <p className="text-sm leading-relaxed">{description}</p>;
};

export function ModernTemplate({ data, template }: ModernTemplateProps) {
  return (
    <div className="bg-white shadow-lg max-w-4xl mx-auto relative">
      {/* Watermark para template gratuito */}
      {!template.isPremium && (
        <div className="absolute top-4 right-4 opacity-20 text-xs text-gray-400 rotate-45">
          CVGrátis.com
        </div>
      )}
      
      <div className="p-8 space-y-6">
        {/* Header - apenas nome e foto centralizados */}
        <div className="border-b pb-6" style={{ borderColor: template.colors.accent }}>
          {data.personalInfo.photo && (
            <div className="mb-4 flex justify-center">
              <img 
                src={data.personalInfo.photo} 
                alt="Foto do perfil" 
                className={`w-24 h-24 object-cover border-2 ${
                  data.personalInfo.isRoundPhoto ? 'rounded-full' : 'rounded-lg'
                }`}
                style={{ borderColor: template.colors.accent }}
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold mb-4 text-center" style={{ color: template.colors.primary }}>
            {data.personalInfo.name || 'Seu Nome'}
          </h1>
          
          {/* Contatos centralizados com melhor espaçamento */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.whatsapp && (
              <div className="flex items-center gap-2 min-w-0">
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{data.personalInfo.whatsapp}</span>
              </div>
            )}
            {data.personalInfo.address && (
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">{data.personalInfo.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Resto do conteúdo alinhado à esquerda */}
        {data.objective?.description && (
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: template.colors.primary }}>
              Objetivo Profissional
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: template.colors.text }}>
              {data.objective.description}
            </p>
          </div>
        )}

        {/* Experiência */}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: template.colors.primary }}>
              Experiência Profissional
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-3 pl-4" style={{ borderColor: template.colors.accent }}>
                  <h3 className="font-semibold" style={{ color: template.colors.text }}>{exp.position}</h3>
                  <p className="text-sm font-medium" style={{ color: template.colors.secondary }}>{exp.company}</p>
                  <p className="text-xs mb-2" style={{ color: template.colors.secondary }}>
                    {exp.startDate} - {exp.current ? 'Atual' : exp.endDate}
                  </p>
                  {exp.description && (
                    <div style={{ color: template.colors.text }}>
                      {formatDescription(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educação */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: template.colors.primary }}>
              Formação Acadêmica
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-3 pl-4" style={{ borderColor: template.colors.accent }}>
                  <h3 className="font-semibold" style={{ color: template.colors.text }}>{edu.course}</h3>
                  <p className="text-sm" style={{ color: template.colors.secondary }}>{edu.institution}</p>
                  <p className="text-xs" style={{ color: template.colors.secondary }}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Habilidades */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: template.colors.primary }}>
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <Badge 
                  key={skill.id} 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: template.colors.accent + '20',
                    color: template.colors.accent
                  }}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Idiomas */}
        {data.languages.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: template.colors.primary }}>
              Idiomas
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang) => (
                <div key={lang.id} className="text-sm" style={{ color: template.colors.text }}>
                  {lang.name}, {lang.level.toLowerCase()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cursos */}
        {data.courses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: template.colors.primary }}>
              Cursos e Certificações
            </h2>
            <div className="space-y-2">
              {data.courses.map((course) => (
                <div key={course.id} className="text-sm">
                  <span className="font-medium" style={{ color: template.colors.text }}>• {course.name}</span>
                  {course.institution && (
                    <span style={{ color: template.colors.secondary }}> - {course.institution}</span>
                  )}
                  {course.year && (
                    <span style={{ color: template.colors.secondary }}> ({course.year})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projetos */}
        {data.projects.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: template.colors.primary }}>
              Projetos
            </h2>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id} className="text-sm">
                  <h3 className="font-medium" style={{ color: template.colors.text }}>{project.name}</h3>
                  <p style={{ color: template.colors.secondary }} className="mt-1">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conquistas */}
        {data.achievements.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: template.colors.primary }}>
              Conquistas
            </h2>
            <div className="space-y-2">
              {data.achievements.map((achievement) => (
                <div key={achievement.id} className="text-sm">
                  <h3 className="font-medium" style={{ color: template.colors.text }}>{achievement.title}</h3>
                  <p style={{ color: template.colors.secondary }} className="mt-1">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer para template gratuito */}
        {!template.isPremium && (
          <div className="text-center pt-6 border-t text-xs" style={{ color: template.colors.secondary }}>
            Criado com CVGrátis.com - Templates premium disponíveis
          </div>
        )}
      </div>
    </div>
  );
} 