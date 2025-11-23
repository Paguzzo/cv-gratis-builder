import React from 'react';
import { Template } from '@/types/templates';
import { CurriculumData } from '@/types/curriculum';

interface ClassicTemplateProps {
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
      <div className="space-y-2 text-gray-700 text-sm leading-relaxed">
        {bullets.map((bullet, index) => (
          <p key={index} className="text-sm">
            {bullet}
          </p>
        ))}
      </div>
    );
  }
  
  // Se é só um parágrafo, renderizar normalmente
  return <p className="text-gray-700 text-sm leading-relaxed">{description}</p>;
};

export function ClassicTemplate({ data, template }: ClassicTemplateProps) {
  const { personalInfo, objective, education, experience, skills, languages, courses, projects, achievements } = data;

  return (
    <div className="max-w-[210mm] mx-auto bg-white text-sm leading-relaxed shadow-lg">
      {/* Header */}
      <header className="text-center py-8 border-b-2 border-gray-800">
        {personalInfo.photo && (
          <div className={`w-24 h-24 mx-auto mb-4 border-2 border-gray-300 overflow-hidden ${
            personalInfo.isRoundPhoto ? 'rounded-full' : 'rounded-lg'
          }`}>
            <img 
              src={personalInfo.photo} 
              alt={personalInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider mb-2">
          {personalInfo.name}
        </h1>
        
        <div className="text-gray-600 text-sm space-y-2">
          <div className="flex justify-center items-center gap-x-6 gap-y-2 flex-wrap">
            {personalInfo.email && (
              <span className="break-all">✉ {personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="whitespace-nowrap">☎ {personalInfo.phone}</span>
            )}
            {personalInfo.whatsapp && (
              <span className="whitespace-nowrap">💬 {personalInfo.whatsapp}</span>
            )}
          </div>
          {personalInfo.address && (
            <div className="break-words">📍 {personalInfo.address}</div>
          )}
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Objetivo Profissional */}
        {objective?.description && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-400 pb-1 mb-3">
              Objetivo Profissional
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify break-words">
              {objective.description}
            </p>
          </section>
        )}

        {/* Experiência Profissional */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-400 pb-1 mb-3">
              Experiência Profissional
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                    <span className="text-gray-600 text-xs whitespace-nowrap ml-2">
                      {exp.startDate} - {exp.endDate || 'Atual'}
                    </span>
                  </div>
                  <div className="text-gray-600 font-medium mb-2">{exp.company}</div>
                  {exp.description && (
                    <div>
                      {formatDescription(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formação Acadêmica */}
        {education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-400 pb-1 mb-3">
              Formação Acadêmica
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{edu.course}</h3>
                    <div className="text-gray-600">{edu.institution}</div>
                  </div>
                  <span className="text-gray-600 text-xs whitespace-nowrap ml-2">
                    {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-400 pb-1 mb-3">
              Competências e Habilidades
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  <span className="text-gray-700">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Idiomas */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-400 pb-1 mb-3">
              Idiomas
            </h2>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                <div key={index} className="text-gray-700">
                  {lang.name}, {lang.level.toLowerCase()}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cursos e Certificações */}
        {courses.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-400 pb-1 mb-3">
              Cursos e Certificações
            </h2>
            <div className="space-y-2">
              {courses.map((course, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{course.name}</h3>
                    <div className="text-gray-600 text-sm">{course.institution}</div>
                  </div>
                  {course.year && (
                    <span className="text-gray-600 text-xs whitespace-nowrap ml-2">
                      {course.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projetos e Conquistas */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-400 pb-1 mb-3">
              Projetos e Conquistas
            </h2>
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-800">{project.name}</h3>
                  {project.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mt-1 break-words">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
              {achievements.map((achievement, index) => (
                <div key={`achievement-${index}`}>
                  <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                  {achievement.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mt-1 break-words">
                      {achievement.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Watermark para template gratuito */}
      <div className="text-center py-2 border-t border-gray-200">
        <span className="text-xs text-gray-400">
          Currículo criado em CVGratis.com.br
        </span>
      </div>
    </div>
  );
} 