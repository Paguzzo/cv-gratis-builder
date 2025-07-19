import React from 'react';
import { Template } from '@/types/templates';
import { CurriculumData } from '@/types/curriculum';

interface ProfessionalTemplateProps {
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
      <div className="space-y-2 text-gray-600 leading-relaxed text-sm">
        {bullets.map((bullet, index) => (
          <p key={index} className="text-sm">
            {bullet}
          </p>
        ))}
      </div>
    );
  }
  
  // Se é só um parágrafo, renderizar normalmente
  return <p className="text-gray-600 leading-relaxed text-sm">{description}</p>;
};

export function ProfessionalTemplate({ data, template }: ProfessionalTemplateProps) {
  const { personalInfo, objective, education, experience, skills, languages, courses, projects, achievements } = data;

  return (
    <div className="max-w-[210mm] mx-auto bg-white text-sm leading-normal flex">
      {/* Sidebar Esquerda - Cinza Claro (Mais Estreita) */}
      <div className="w-60 bg-gray-100 px-5 py-6">
        {/* Nome */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {personalInfo.name}
          </h1>
          <div className="text-gray-600 text-sm font-medium">
            JORNALISTA
          </div>
        </div>

        {/* Contatos */}
        <section className="mb-6 relative pl-4">
          <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
          <h2 className="text-blue-600 font-bold mb-3 text-sm uppercase">
            Contatos
          </h2>
          <div className="space-y-2 text-gray-600 text-xs">
            {personalInfo.phone && (
              <div className="flex items-start gap-2">
                <span className="text-blue-600">📱</span>
                <div>{personalInfo.phone}</div>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <span className="text-blue-600">✉️</span>
                <div className="break-all">{personalInfo.email}</div>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-start gap-2">
                <span className="text-blue-600">📍</span>
                <div>{personalInfo.address}</div>
              </div>
            )}
          </div>
        </section>

        {/* Sobre Mim */}
        {objective?.description && (
          <section className="mb-6 relative pl-4">
            <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
            <h2 className="text-blue-600 font-bold mb-3 text-sm uppercase">
              Sobre Mim
            </h2>
            <p className="text-gray-600 text-xs leading-relaxed">
              {objective.description}
            </p>
          </section>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <section className="mb-6 relative pl-4">
            <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
            <h2 className="text-blue-600 font-bold mb-3 text-sm uppercase">
              Habilidades
            </h2>
            <div className="space-y-2">
              {skills.slice(0, 6).map((skill, index) => (
                <div key={index} className="text-xs text-gray-600">
                  • {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Idiomas */}
        {languages.length > 0 && (
          <section className="mb-6 relative pl-4">
            <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
            <h2 className="text-blue-600 font-bold mb-3 text-sm uppercase">
              Idiomas
            </h2>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                <div key={index} className="text-xs text-gray-700">
                  {lang.name}, {lang.level.toLowerCase()}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Extras */}
        {courses.length > 0 && (
          <section className="relative pl-4">
            <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
            <h2 className="text-blue-600 font-bold mb-3 text-sm uppercase">
              Extras
            </h2>
            <div className="space-y-2">
              {courses.slice(0, 4).map((course, index) => (
                <div key={index} className="text-xs text-gray-600">
                  • {course.name}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Coluna Principal */}
      <div className="flex-1">
        {/* Faixa Azul no Topo */}
        <div className="bg-blue-600 h-16 relative">
          {/* Foto Redonda ABAIXO da Faixa Azul com Contorno */}
          {personalInfo.photo && (
            <div className="absolute -bottom-8 left-8">
              <div className={`w-16 h-16 overflow-hidden border-4 border-blue-600 bg-white ${
                personalInfo.isRoundPhoto ? 'rounded-full' : 'rounded-lg'
              }`}>
                <img 
                  src={personalInfo.photo} 
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Conteúdo Principal */}
        <div className="px-8 py-12">
          {/* Formação Acadêmica */}
          {education.length > 0 && (
            <section className="mb-8 relative pl-4">
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
              <h2 className="text-blue-600 font-bold text-base mb-4 uppercase">
                Formação Acadêmica
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="text-gray-500 text-xs font-medium">
                      {edu.startDate} - {edu.endDate}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {edu.course}
                    </h3>
                    <div className="text-gray-600 text-sm">
                      {edu.institution}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experiência Profissional */}
          {experience.length > 0 && (
            <section className="mb-8 relative pl-4">
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
              <h2 className="text-blue-600 font-bold text-base mb-4 uppercase">
                Experiência Profissional
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <div className="text-gray-500 text-xs font-medium mb-1">
                      {exp.startDate} - {exp.endDate || 'Atual'}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {exp.position}
                    </h3>
                    <div className="text-blue-600 font-medium text-sm">
                      {exp.company}
                    </div>
                    {exp.description && (
                      <div className="mt-2">
                        {formatDescription(exp.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cursos Complementares */}
          {courses.length > 4 && (
            <section className="mb-8 relative pl-4">
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
              <h2 className="text-blue-600 font-bold text-base mb-4 uppercase">
                Cursos Complementares
              </h2>
              <div className="space-y-3">
                {courses.slice(4).map((course, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm">
                          {course.name}
                        </h3>
                        {course.institution && (
                          <div className="text-gray-600 text-xs">
                            {course.institution}
                          </div>
                        )}
                      </div>
                      {course.year && (
                        <div className="text-gray-500 text-xs font-medium whitespace-nowrap ml-4">
                          {course.year}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projetos */}
          {projects.length > 0 && (
            <section className="mb-8 relative pl-4">
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
              <h2 className="text-blue-600 font-bold text-base mb-4 uppercase">
                Projetos
              </h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-gray-600 leading-relaxed text-sm mt-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Conquistas */}
          {achievements.length > 0 && (
            <section className="relative pl-4">
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
              <h2 className="text-blue-600 font-bold text-base mb-4 uppercase">
                Conquistas
              </h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {achievement.title}
                    </h3>
                    {achievement.description && (
                      <p className="text-gray-600 leading-relaxed text-sm mt-1">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
} 