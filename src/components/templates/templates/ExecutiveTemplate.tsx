import React from 'react';
import { CurriculumData } from '@/types/curriculum';
import { Template } from '@/types/templates';

interface ExecutiveTemplateProps {
  data: CurriculumData;
  template: Template;
}

export function ExecutiveTemplate({ data, template }: ExecutiveTemplateProps) {
  const { personalInfo, objective, education, experience, skills, languages, courses, projects, achievements } = data;

  return (
    <div className="max-w-[210mm] mx-auto bg-white text-sm leading-normal flex">
      {/* Sidebar Esquerda - Azul Escuro */}
      <div className="w-72 bg-slate-700 text-white px-6 py-8">
        {/* Foto */}
        {personalInfo.photo && (
          <div className="text-center mb-8">
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

        {/* Nome */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">
            {personalInfo.name}
          </h1>
          <div className="text-slate-300 text-sm font-medium uppercase tracking-wider">
            GERENTE DE NEGÓCIOS
          </div>
        </div>

        {/* Dados Pessoais */}
        <section className="mb-8">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide border-b border-slate-600 pb-2">
            Dados Pessoais
          </h2>
          <div className="space-y-3 text-slate-300 text-xs">
            <div>
              <span className="text-white font-medium">Data de Nascimento:</span>
              <div>01/01/1990</div>
            </div>
            <div>
              <span className="text-white font-medium">Estado Civil:</span>
              <div>Solteiro(a)</div>
            </div>
            <div>
              <span className="text-white font-medium">Nacionalidade:</span>
              <div>Brasileiro(a)</div>
            </div>
          </div>
        </section>

        {/* Contato */}
        <section className="mb-8">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide border-b border-slate-600 pb-2">
            Contato
          </h2>
          <div className="space-y-3 text-slate-300 text-xs">
            {personalInfo.phone && (
              <div>
                <span className="text-white font-medium">Telefone:</span>
                <div>{personalInfo.phone}</div>
              </div>
            )}
            {personalInfo.email && (
              <div>
                <span className="text-white font-medium">Email:</span>
                <div className="break-all">{personalInfo.email}</div>
              </div>
            )}
            {personalInfo.address && (
              <div>
                <span className="text-white font-medium">Endereço:</span>
                <div>{personalInfo.address}</div>
              </div>
            )}
          </div>
        </section>

        {/* Idiomas */}
        {languages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide border-b border-slate-600 pb-2">
              Idiomas
            </h2>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                <div key={index} className="text-xs text-slate-300">
                  {lang.name}, {lang.level.toLowerCase()}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Habilidades Técnicas */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide border-b border-slate-600 pb-2">
              Habilidades
            </h2>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="text-xs text-slate-300">
                  • {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Coluna Principal - Conteúdo */}
      <div className="flex-1 min-w-0 px-6 py-8 overflow-hidden">
        {/* Perfil/Objetivo */}
        {objective?.description && (
          <section className="mb-8">
            <h2 className="text-slate-800 font-bold text-base mb-4 uppercase tracking-wide border-b-2 border-slate-400 pb-2">
              Perfil
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm break-words">
              {objective.description}
            </p>
          </section>
        )}

        {/* Experiência Profissional */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-slate-800 font-bold text-base mb-6 uppercase tracking-wide border-b-2 border-slate-400 pb-2">
              Experiência
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-sm uppercase">
                        {exp.position}
                      </h3>
                      <div className="text-slate-700 font-semibold text-sm">
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-slate-600 text-xs font-medium whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.endDate || 'Atual'}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-slate-700 leading-relaxed text-sm mt-2 break-words">
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
            <h2 className="text-slate-800 font-bold text-base mb-6 uppercase tracking-wide border-b-2 border-slate-400 pb-2">
              Formação
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {edu.course}
                    </h3>
                    <div className="text-slate-700 text-sm">
                      {edu.institution}
                    </div>
                  </div>
                  <div className="text-slate-600 text-xs font-medium whitespace-nowrap ml-4">
                    {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cursos e Certificações */}
        {courses.length > 0 && (
          <section className="mb-8">
            <h2 className="text-slate-800 font-bold text-base mb-6 uppercase tracking-wide border-b-2 border-slate-400 pb-2">
              Cursos
            </h2>
            <div className="space-y-3">
              {courses.map((course, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 text-sm">
                      {course.name}
                    </h3>
                    {course.institution && (
                      <div className="text-slate-700 text-xs">
                        {course.institution}
                      </div>
                    )}
                  </div>
                  {course.year && (
                    <div className="text-slate-600 text-xs font-medium whitespace-nowrap ml-4">
                      {course.year}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projetos e Conquistas */}
        {(projects.length > 0 || achievements.length > 0) && (
          <section>
            <h2 className="text-slate-700 font-bold text-base mb-6 uppercase tracking-wide border-b-2 border-slate-300 pb-2">
              Conquistas
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-slate-600 leading-relaxed text-sm mt-1 break-words">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
              {achievements.map((achievement, index) => (
                <div key={`achievement-${index}`}>
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {achievement.title}
                  </h3>
                  {achievement.description && (
                    <p className="text-slate-600 leading-relaxed text-sm mt-1 break-words">
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