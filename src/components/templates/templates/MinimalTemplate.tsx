import React from 'react';
import { Template } from '@/types/templates';
import { CurriculumData } from '@/types/curriculum';

interface MinimalTemplateProps {
  data: CurriculumData;
  template: Template;
}

export function MinimalTemplate({ data, template }: MinimalTemplateProps) {
  const { personalInfo, objective, education, experience, skills, languages, courses, projects, achievements } = data;

  return (
    <div className="max-w-[210mm] mx-auto bg-white text-sm leading-normal flex">
      {/* Coluna Principal - Conteúdo */}
      <div className="flex-1 min-w-0 pr-6 py-8 pl-6 overflow-hidden">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-1 tracking-wide">
            {personalInfo.name}
          </h1>
          <div className="text-gray-600 text-base font-light mb-6">
            ADMINISTRAÇÃO
          </div>
        </header>

        {/* Objetivo Profissional */}
        {objective?.description && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
              Objetivo
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm break-words">
              {objective.description}
            </p>
          </section>
        )}

        {/* Formação */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
              Formação
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900 text-sm">{edu.course}</h3>
                  <div className="text-gray-600 text-sm">{edu.institution}</div>
                  <div className="text-gray-500 text-xs">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experiência Profissional */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
              Experiências Profissionais
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm uppercase">
                      {exp.position}
                    </h3>
                    <div className="text-gray-600 text-sm font-medium">{exp.company}</div>
                    <div className="text-gray-500 text-xs">
                      {exp.startDate} - {exp.endDate || 'Atual'}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 leading-relaxed text-sm break-words">
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
            <h2 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
              Cursos
            </h2>
            <div className="space-y-2">
              {courses.map((course, index) => (
                <div key={index}>
                  <h3 className="text-gray-900 text-sm">{course.name}</h3>
                  {course.institution && (
                    <div className="text-gray-600 text-xs">{course.institution}</div>
                  )}
                  {course.year && (
                    <div className="text-gray-500 text-xs">{course.year}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Barra Lateral Direita */}
      <div className="w-80 bg-gradient-to-b from-pink-300 to-pink-400 px-6 py-8 text-white">
        {/* Foto */}
        {personalInfo.photo && (
          <div className="text-center mb-8">
            <div className={`w-32 h-32 mx-auto overflow-hidden border-4 border-white/30 shadow-lg ${
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

        {/* Informações de Contato */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide">
            Contato
          </h2>
          <div className="space-y-3 text-sm">
            {personalInfo.phone && (
              <div className="flex items-center">
                <span className="w-4 h-4 mr-3">📞</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center">
                <span className="w-4 h-4 mr-3">✉️</span>
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-start">
                <span className="w-4 h-4 mr-3 mt-0.5">📍</span>
                <span>{personalInfo.address}</span>
              </div>
            )}
          </div>
        </section>

        {/* Habilidades */}
        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide">
              Habilidades
            </h2>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Idiomas */}
        {languages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide">
              Idiomas
            </h2>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                <div key={index} className="text-sm">
                  {lang.name}, {lang.level.toLowerCase()}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projetos e Conquistas */}
        {(projects.length > 0 || achievements.length > 0) && (
          <section>
            <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide">
              Conquistas
            </h2>
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-medium text-sm">{project.name}</h3>
                  {project.description && (
                    <p className="text-xs leading-relaxed mt-1 opacity-90">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
              {achievements.map((achievement, index) => (
                <div key={`achievement-${index}`}>
                  <h3 className="font-medium text-sm">{achievement.title}</h3>
                  {achievement.description && (
                    <p className="text-xs leading-relaxed mt-1 opacity-90">
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