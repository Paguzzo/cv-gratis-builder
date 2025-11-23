import React from 'react';
import { Template } from '@/types/templates';
import { CurriculumData } from '@/types/curriculum';

interface PastelTemplateProps {
  data: CurriculumData;
  template: Template;
}

export function PastelTemplate({ data, template }: PastelTemplateProps) {
  const { personalInfo, objective, education, experience, skills, languages, courses, projects, achievements } = data;

  return (
    <div className="max-w-[210mm] mx-auto bg-white text-sm leading-normal flex">
      {/* Sidebar Esquerda - Bege/Amarelo Suave */}
      <div className="w-72 bg-gradient-to-b from-yellow-100 to-amber-50 px-6 py-8">
        {/* Foto */}
        {personalInfo.photo && (
          <div className="text-center mb-6">
            <div className={`w-24 h-24 mx-auto overflow-hidden border-3 border-white shadow-md ${
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

        {/* Nome */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-amber-900 mb-2">
            {personalInfo.name}
          </h1>
        </div>

        {/* Contatos */}
        <section className="mb-8">
          <h2 className="text-amber-800 font-bold mb-4 text-sm uppercase tracking-wide">
            Contatos
          </h2>
          <div className="space-y-3 text-amber-700 text-xs">
            {personalInfo.address && (
              <div className="flex items-start gap-2">
                <span className="text-amber-600">📍</span>
                <div>{personalInfo.address}</div>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-start gap-2">
                <span className="text-amber-600">📱</span>
                <div>{personalInfo.phone}</div>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <span className="text-amber-600">✉️</span>
                <div className="break-all">{personalInfo.email}</div>
              </div>
            )}
          </div>
        </section>

        {/* Habilidades Pessoais */}
        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-amber-800 font-bold mb-4 text-sm uppercase tracking-wide">
              Habilidades Pessoais
            </h2>
            <div className="space-y-2">
              {skills.slice(0, 6).map((skill, index) => (
                <div key={index} className="text-xs text-amber-700">
                  • {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Competências Complementares */}
        {courses.length > 0 && (
          <section className="mb-8">
            <h2 className="text-amber-800 font-bold mb-4 text-sm uppercase tracking-wide">
              Competências Complementares
            </h2>
            <div className="space-y-2">
              {courses.slice(0, 4).map((course, index) => (
                <div key={index} className="text-xs text-amber-700">
                  • {course.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Idiomas */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-amber-800 font-bold mb-4 text-sm uppercase tracking-wide">
              Idiomas
            </h2>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                <div key={index} className="text-xs text-amber-700">
                  {lang.name}, {lang.level.toLowerCase()}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Coluna Principal - Conteúdo */}
      <div className="flex-1 min-w-0 px-6 py-8 overflow-hidden">
        {/* Perfil Pessoal */}
        {objective?.description && (
          <section className="mb-8">
            <h2 className="text-amber-700 font-bold text-lg mb-4 border-b-2 border-amber-200 pb-2">
              Perfil Pessoal
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm break-words">
              {objective.description}
            </p>
          </section>
        )}

        {/* Experiência Profissional */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-amber-700 font-bold text-lg mb-6 border-b-2 border-amber-200 pb-2">
              Experiência Profissional
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {exp.position}
                      </h3>
                      <div className="text-amber-600 font-medium text-sm">
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs font-medium whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.endDate || 'Atual'}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 leading-relaxed text-sm mt-2 break-words">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formação Acadêmica */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-amber-700 font-bold text-lg mb-6 border-b-2 border-amber-200 pb-2">
              Formação Acadêmica
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {edu.course}
                      </h3>
                      <div className="text-gray-600 text-sm">
                        {edu.institution}
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs font-medium whitespace-nowrap ml-4">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cursos Complementares */}
        {courses.length > 4 && (
          <section className="mb-8">
            <h2 className="text-amber-700 font-bold text-lg mb-6 border-b-2 border-amber-200 pb-2">
              Cursos Complementares
            </h2>
            <div className="space-y-3">
              {courses.slice(4).map((course, index) => (
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
            <h2 className="text-amber-700 font-bold text-lg mb-6 border-b-2 border-amber-200 pb-2">
              Projetos
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-600 leading-relaxed text-sm mt-1 break-words">
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
            <h2 className="text-amber-700 font-bold text-lg mb-6 border-b-2 border-amber-200 pb-2">
              Conquistas
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {achievement.title}
                  </h3>
                  {achievement.description && (
                    <p className="text-gray-600 leading-relaxed text-sm mt-1 break-words">
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
  );
} 