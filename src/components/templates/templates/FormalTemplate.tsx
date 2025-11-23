/**
 * Template: Formal Premium
 * Design corporativo com sidebar colorido vertical e layout elegante
 */

import React from 'react';
import { CurriculumData } from '@/types/curriculum';
import { Template } from '@/types/templates';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages as LanguagesIcon,
  User,
  BookOpen,
  Target
} from 'lucide-react';

interface FormalTemplateProps {
  data: CurriculumData;
  template: Template;
}

// Função para processar descrição com bullets
const formatDescription = (description: string) => {
  if (!description) return null;

  const bullets = description
    .split(/[•·‣▪▫◦‧⁃-]\s*|\n/)
    .filter(bullet => bullet.trim().length > 0)
    .map(bullet => bullet.trim());

  if (bullets.length > 1) {
    return (
      <ul className="space-y-1.5 text-sm leading-relaxed text-gray-700">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <p className="text-sm leading-relaxed text-gray-700">{description}</p>;
};

export function FormalTemplate({ data, template }: FormalTemplateProps) {
  const { personalInfo, objective, education, experience, skills, languages, courses, projects, achievements } = data;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="flex">
        {/* Sidebar Vertical com Gradiente Azul/Roxo */}
        <div className="w-80 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 print:p-6">
          {/* Foto */}
          {personalInfo.photo && (
            <div className="mb-8 flex justify-center">
              <div className={`w-40 h-40 overflow-hidden border-4 border-white shadow-2xl ${
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
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-white">
              {personalInfo.name}
            </h1>
            {personalInfo.position && (
              <p className="text-indigo-200 text-lg font-medium">
                {personalInfo.position}
              </p>
            )}
          </div>

          {/* Dados Pessoais */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-indigo-400">
              <User className="w-5 h-5" />
              <h2 className="font-bold text-base uppercase tracking-wider">Contato</h2>
            </div>
            <div className="space-y-3 text-sm">
              {personalInfo.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-indigo-200 flex-shrink-0 mt-0.5" />
                  <span className="break-all text-gray-100">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-indigo-200 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-100">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-indigo-200 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-100">{personalInfo.address}</span>
                </div>
              )}
            </div>
          </section>

          {/* Habilidades */}
          {skills.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-indigo-400">
                <Code className="w-5 h-5" />
                <h2 className="font-bold text-base uppercase tracking-wider">Competências</h2>
              </div>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="text-sm text-gray-100 bg-white/10 p-2 rounded">
                    • {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Idiomas */}
          {languages.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-indigo-400">
                <LanguagesIcon className="w-5 h-5" />
                <h2 className="font-bold text-base uppercase tracking-wider">Idiomas</h2>
              </div>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="bg-white/10 p-2 rounded">
                    <div className="font-semibold text-sm text-indigo-100">{lang.name}</div>
                    <div className="text-xs text-gray-300">{lang.level}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cursos */}
          {courses.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-indigo-400">
                <Award className="w-5 h-5" />
                <h2 className="font-bold text-base uppercase tracking-wider">Certificados</h2>
              </div>
              <div className="space-y-3">
                {courses.map((course, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-100">{course.name}</div>
                    {course.institution && (
                      <div className="text-xs text-indigo-200">{course.institution}</div>
                    )}
                    {course.year && (
                      <div className="text-xs text-gray-300">{course.year}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 min-w-0 p-8 print:p-6 bg-gray-50 overflow-hidden">
          {/* Objetivo */}
          {objective?.description && (
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-indigo-600 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Objetivo Profissional</h2>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-indigo-600">
                <p className="text-gray-700 leading-relaxed break-words">
                  {objective.description}
                </p>
              </div>
            </section>
          )}

          {/* Experiência Profissional */}
          {experience.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-indigo-600 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Experiência Profissional</h2>
              </div>
              <div className="space-y-5">
                {experience.map((exp, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                        <p className="text-indigo-600 font-semibold">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                        {exp.startDate} - {exp.endDate || 'Atual'}
                      </span>
                    </div>
                    {exp.description && (
                      <div className="mt-3">
                        {formatDescription(exp.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formação */}
          {education.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-indigo-600 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Formação Acadêmica</h2>
              </div>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-indigo-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-base text-gray-900">{edu.course}</h3>
                        <p className="text-indigo-600 font-medium">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projetos */}
          {projects.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-indigo-600 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Projetos</h2>
              </div>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-indigo-600">
                    <h3 className="font-bold text-base text-gray-900">{project.name}</h3>
                    {project.description && (
                      <p className="text-gray-700 leading-relaxed mt-2 text-sm break-words">
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-indigo-600 rounded"></div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Conquistas</h2>
              </div>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-indigo-600">
                    <h3 className="font-bold text-base text-gray-900">{achievement.title}</h3>
                    {achievement.description && (
                      <p className="text-gray-700 leading-relaxed mt-2 text-sm break-words">
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
