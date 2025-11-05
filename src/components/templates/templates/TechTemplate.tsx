import React from 'react';
import { CurriculumData } from '@/types/curriculum';
import { Template } from '@/types/templates';

interface TechTemplateProps {
  data: CurriculumData;
  template: Template;
}

export function TechTemplate({ data, template }: TechTemplateProps) {
  const { personalInfo, objective, education, experience, skills, languages, courses, projects, achievements } = data;

  // Função para renderizar barras de progresso das habilidades
  const renderSkillBar = (skillName: string, level: number = 4) => (
    <div key={skillName} className="mb-3">
      <div className="text-white text-sm mb-1">{skillName}</div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`w-3 h-3 rounded-full ${
              dot <= level ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-[210mm] mx-auto bg-white text-sm leading-normal flex">
      {/* Sidebar Esquerda - Verde/Teal */}
      <div className="w-72 bg-teal-600 text-white px-6 py-8">
        {/* Foto */}
        {personalInfo.photo && (
          <div className="text-center mb-6">
            <div className={`w-24 h-24 mx-auto overflow-hidden border-3 border-white/20 ${
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

        {/* Nome e Cargo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {personalInfo.name}
          </h1>
          <div className="text-teal-100 text-sm font-medium">
            Desenvolvedor Web
          </div>
        </div>

        {/* Contatos */}
        <section className="mb-8">
          <h2 className="text-white font-bold mb-4 text-base">
            Contatos
          </h2>
          <div className="space-y-3 text-teal-100 text-xs">
            {personalInfo.address && (
              <div className="flex items-start gap-2">
                <span className="text-white">📍</span>
                <div>{personalInfo.address}</div>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-start gap-2">
                <span className="text-white">📱</span>
                <div>{personalInfo.phone}</div>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <span className="text-white">✉️</span>
                <div className="break-all">{personalInfo.email}</div>
              </div>
            )}
          </div>
        </section>

        {/* Habilidades com Barras de Progresso */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-white font-bold mb-6 text-base">
              Habilidades
            </h2>
            <div className="space-y-4">
              {skills.slice(0, 8).map((skill, index) => {
                // Simular diferentes níveis de habilidade para demonstração
                const skillLevels = [5, 4, 4, 5, 3, 4, 3, 4];
                const level = skillLevels[index] || 4;
                return renderSkillBar(skill.name, level);
              })}
            </div>
          </section>
        )}
      </div>

      {/* Coluna Principal - Conteúdo */}
      <div className="flex-1 px-8 py-8">
        {/* Sobre */}
        {objective?.description && (
          <section className="mb-8">
            <h2 className="text-teal-600 font-bold text-lg mb-4">
              Sobre
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {objective.description}
            </p>
          </section>
        )}

        {/* Educação */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-teal-600 font-bold text-lg mb-6">
              Educação
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {edu.endDate} - {edu.course}
                    </h3>
                  </div>
                  <div className="text-gray-600 text-sm mb-2">
                    {edu.institution}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Carreira (Experiência) */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-teal-600 font-bold text-lg mb-6">
              Carreira
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {exp.position}
                      </h3>
                      <div className="text-teal-600 font-medium text-sm">
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs font-medium whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.endDate || 'presente'}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 leading-relaxed text-sm mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cursos e Certificações */}
        {courses.length > 0 && (
          <section className="mb-8">
            <h2 className="text-teal-600 font-bold text-lg mb-6">
              Cursos e Certificações
            </h2>
            <div className="space-y-3">
              {courses.map((course, index) => (
                <div key={index} className="flex justify-between items-start">
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
              ))}
            </div>
          </section>
        )}

        {/* Projetos */}
        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-teal-600 font-bold text-lg mb-6">
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
          <section>
            <h2 className="text-teal-600 font-bold text-lg mb-6">
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

        {/* Idiomas */}
        {languages.length > 0 && (
          <section className="mt-8">
            <h2 className="text-teal-600 font-bold text-lg mb-6">
              Idiomas
            </h2>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                <div key={index} className="text-sm text-gray-800">
                  {lang.name}, {lang.level.toLowerCase()}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 