import React from 'react';
import { Template } from '@/types/templates';
import { CurriculumData } from '@/types/curriculum';

interface FormalTemplateProps {
  data: CurriculumData;
  template: Template;
}

export function FormalTemplate({ data, template }: FormalTemplateProps) {
  const { personalInfo, objective, education, experience, skills, languages, courses, projects, achievements } = data;

  return (
    <div className="max-w-[210mm] mx-auto bg-gray-50 text-sm leading-normal p-8">
      {/* Header com Nome e Foto */}
      <header className="relative mb-8">
        {/* Nome no topo esquerdo */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black uppercase tracking-wide">
            {personalInfo.name}
          </h1>
        </div>

        {/* Foto quadrada com cantos arredondados no topo direito */}
        {personalInfo.photo && (
          <div className={`absolute top-0 right-0 w-20 h-20 overflow-hidden border-2 border-gray-300 ${
            personalInfo.isRoundPhoto ? 'rounded-full' : 'rounded-lg'
          }`}>
            <img 
              src={personalInfo.photo} 
              alt={personalInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Dados Pessoais */}
        <section>
          <h2 className="text-lg font-bold text-black mb-2 border-b-2 border-black pb-1">
            Dados Pessoais
          </h2>
          <div className="space-y-2 text-black mt-4">
            {personalInfo.address && (
              <div className="flex items-center gap-2">
                <span className="text-black">📍</span>
                <span>{personalInfo.address}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <span className="text-black">📞</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <span className="text-black">✉️</span>
                <span>{personalInfo.email}</span>
              </div>
            )}
          </div>
        </section>
      </header>

      {/* Objetivo */}
      {objective?.description && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 border-b-2 border-black pb-1">
            Objetivo
          </h2>
          <p className="text-black leading-relaxed mt-4">
            {objective.description}
          </p>
        </section>
      )}

      {/* Qualificação Profissional */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 border-b-2 border-black pb-1">
            Qualificação Profissional
          </h2>
          <div className="text-black mt-4">
            {skills.slice(0, 5).map((skill, index) => (
              <div key={index} className="mb-1">
                • {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experiência Profissional */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 border-b-2 border-black pb-1">
            Experiência Profissional
          </h2>
          <div className="space-y-4 mt-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="mb-2">
                  <h3 className="font-bold text-black">
                    {exp.startDate} - {exp.endDate || 'Atual'} - {exp.position}
                  </h3>
                  <div className="text-black">
                    {exp.company}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-black leading-relaxed ml-4">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Formação */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 border-b-2 border-black pb-1">
            Formação
          </h2>
          <div className="space-y-3 mt-4">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="text-black">
                  <span className="font-bold">{edu.endDate}</span> - {edu.course}
                </div>
                <div className="text-black ml-4">
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cursos adicionais */}
      {courses.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 border-b-2 border-black pb-1">
            Cursos adicionais
          </h2>
          <div className="space-y-2 mt-4">
            {courses.map((course, index) => (
              <div key={index} className="text-black">
                <span className="font-bold">{course.year}</span> - {course.name}
                {course.institution && (
                  <span> ({course.institution})</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projetos */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 border-b-2 border-black pb-1">
            Projetos
          </h2>
          <div className="space-y-3 mt-4">
            {projects.map((project, index) => (
              <div key={index}>
                <h3 className="font-bold text-black">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-black leading-relaxed ml-4">
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
        <section className="mb-8">
          <h2 className="text-lg font-bold text-black mb-2 border-b-2 border-black pb-1">
            Conquistas
          </h2>
          <div className="space-y-3 mt-4">
            {achievements.map((achievement, index) => (
              <div key={index}>
                <h3 className="font-bold text-black">
                  {achievement.title}
                </h3>
                {achievement.description && (
                  <p className="text-black leading-relaxed ml-4">
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
        <section>
          <h2 className="text-lg font-bold text-black mb-2 border-b-2 border-black pb-1">
            Idiomas
          </h2>
          <div className="space-y-2 mt-4">
            {languages.map((lang, index) => (
              <div key={index} className="text-black">
                {lang.name}, {lang.level.toLowerCase()}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
} 