import React from 'react';
import { CurriculumData } from '@/types/curriculum';
import { Template } from '@/types/templates';
import { Mail, Phone, MapPin, MessageCircle, Palette, Star, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreativeTemplateProps {
  data: CurriculumData;
  template: Template;
}

export function CreativeTemplate({ data, template }: CreativeTemplateProps) {
  return (
    <div className="bg-white shadow-lg max-w-4xl mx-auto relative overflow-hidden">
      {/* Header criativo */}
      <div className="relative p-8" style={{ backgroundColor: template.colors.primary }}>
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
          <Palette className="w-full h-full text-white" />
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
          <Star className="w-full h-full text-white" />
        </div>
        
        <div className="relative z-10 text-center text-white">
          {data.personalInfo.photo && (
            <div className="mb-6 flex justify-center">
              <img 
                src={data.personalInfo.photo} 
                alt="Foto do perfil" 
                className={`w-28 h-28 object-cover border-4 border-white shadow-2xl ${
                  data.personalInfo.isRoundPhoto ? 'rounded-full' : 'rounded-lg'
                }`}
              />
            </div>
          )}
          
          <h1 className="text-4xl font-bold mb-4">
            {data.personalInfo.name || 'Seu Nome'}
          </h1>
          
          <div 
            className="w-20 h-1 mx-auto mb-4"
            style={{ backgroundColor: template.colors.accent }}
          ></div>
          
          <div className="flex justify-center flex-wrap gap-6 text-sm">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {data.personalInfo.address}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Sobre */}
        {data.objective.description && (
          <div className="relative">
            <div 
              className="absolute -left-4 top-0 bottom-0 w-2 rounded"
              style={{ backgroundColor: template.colors.accent }}
            ></div>
            <div className="pl-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: template.colors.primary }}>
                <Palette className="w-6 h-6" />
                Perfil Criativo
              </h2>
              <p className="text-base leading-relaxed italic break-words" style={{ color: template.colors.text }}>
                "{data.objective.description}"
              </p>
            </div>
          </div>
        )}

        {/* Portfolio/Projetos */}
        {data.projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: template.colors.primary }}>
              Portfolio & Projetos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="p-6 rounded-lg relative overflow-hidden"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? template.colors.accent + '10' : template.colors.secondary + '10'
                  }}
                >
                  <div 
                    className="absolute top-0 right-0 w-16 h-16 opacity-20"
                    style={{ color: template.colors.accent }}
                  >
                    <Award className="w-full h-full" />
                  </div>
                  <h3 className="font-bold text-lg mb-3" style={{ color: template.colors.primary }}>
                    {project.name}
                  </h3>
                  <p className="text-sm leading-relaxed break-words" style={{ color: template.colors.text }}>
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiência em cards */}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: template.colors.primary }}>
              Experiência Profissional
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div 
                  key={exp.id} 
                  className={`p-6 rounded-lg transform ${index % 2 === 0 ? 'ml-0 mr-8' : 'ml-8 mr-0'}`}
                  style={{ 
                    backgroundColor: template.colors.primary + '08',
                    borderLeft: index % 2 === 0 ? `4px solid ${template.colors.accent}` : 'none',
                    borderRight: index % 2 === 1 ? `4px solid ${template.colors.accent}` : 'none'
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: template.colors.primary }}>
                        {exp.position}
                      </h3>
                      <p className="font-semibold" style={{ color: template.colors.secondary }}>
                        {exp.company}
                      </p>
                    </div>
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: template.colors.accent,
                        color: 'white'
                      }}
                    >
                      {exp.startDate} - {exp.current ? 'Atual' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm leading-relaxed break-words" style={{ color: template.colors.text }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills artísticas */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: template.colors.primary }}>
              Habilidades & Competências
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {data.skills.map((skill, index) => (
                <Badge 
                  key={skill.id} 
                  variant="secondary" 
                  className="text-sm px-4 py-2 font-medium transform hover:scale-105 transition-transform"
                  style={{ 
                    backgroundColor: [template.colors.accent, template.colors.secondary, template.colors.primary][index % 3] + '20',
                    color: [template.colors.accent, template.colors.secondary, template.colors.primary][index % 3],
                    border: `2px solid ${[template.colors.accent, template.colors.secondary, template.colors.primary][index % 3]}40`
                  }}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Educação */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ color: template.colors.primary }}>
                Formação
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div 
                    key={edu.id} 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: template.colors.accent + '10' }}
                  >
                    <h3 className="font-bold" style={{ color: template.colors.text }}>
                      {edu.course}
                    </h3>
                    <p className="text-sm" style={{ color: template.colors.secondary }}>
                      {edu.institution}
                    </p>
                    <p className="text-xs" style={{ color: template.colors.secondary }}>
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificações */}
          {data.courses.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ color: template.colors.primary }}>
                Cursos & Workshops
              </h2>
              <div className="space-y-3">
                {data.courses.map((course) => (
                  <div 
                    key={course.id} 
                    className="p-3 rounded"
                    style={{ backgroundColor: template.colors.secondary + '10' }}
                  >
                    <div className="font-medium text-sm" style={{ color: template.colors.text }}>
                      {course.name}
                    </div>
                    {course.institution && (
                      <div className="text-xs" style={{ color: template.colors.secondary }}>
                        {course.institution}
                        {course.year && ` • ${course.year}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio de Projetos */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ color: template.colors.primary }}>
                Portfolio & Projetos
              </h2>
              <div className="space-y-4">
                {data.projects.map((project) => (
                  <div 
                    key={project.id}
                    className="p-4 rounded-lg border-l-4 relative overflow-hidden"
                    style={{ 
                      borderLeftColor: template.colors.accent,
                      backgroundColor: template.colors.accent + '05'
                    }}
                  >
                    <div 
                      className="absolute top-0 right-0 w-8 h-8 opacity-10"
                      style={{ backgroundColor: template.colors.accent }}
                    ></div>
                    <h3 className="font-semibold mb-2" style={{ color: template.colors.text }}>
                      {project.name}
                    </h3>
                    <p className="text-sm" style={{ color: template.colors.secondary }}>
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conquistas & Prêmios */}
          {data.achievements.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ color: template.colors.primary }}>
                Conquistas & Prêmios
              </h2>
              <div className="space-y-3">
                {data.achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: template.colors.primary + '08' }}
                  >
                    <div className="relative">
                      <Star 
                        className="w-5 h-5 mt-0.5" 
                        style={{ color: template.colors.accent }} 
                        fill="currentColor"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: template.colors.text }}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: template.colors.secondary }}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 