/**
 * Template: Professional Premium
 * Design executivo moderno com sidebar colorido e layout sofisticado
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
  Target,
  Star,
  CheckCircle2
} from 'lucide-react';

interface ProfessionalTemplateProps {
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
      <div className="space-y-2 text-sm leading-relaxed">
        {bullets.map((bullet, index) => (
          <p key={index} className="flex items-start gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-1 flex-shrink-0" />
            <span>{bullet}</span>
          </p>
        ))}
      </div>
    );
  }

  return <p className="text-sm leading-relaxed">{description}</p>;
};

export function ProfessionalTemplate({ data, template }: ProfessionalTemplateProps) {
  const { personalInfo, objective, education, experience, skills, languages, courses, projects, achievements } = data;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex min-h-screen">
        {/* Sidebar Esquerda - Gradiente Moderno */}
        <div className="w-72 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 text-white px-6 py-8 print:py-6">
          {/* Foto */}
          {personalInfo.photo && (
            <div className="mb-6 flex justify-center">
              <div className={`w-32 h-32 overflow-hidden border-4 border-emerald-400 shadow-xl ${
                personalInfo.isRoundPhoto ? 'rounded-full' : 'rounded-2xl'
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
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">
              {personalInfo.name}
            </h1>
            {personalInfo.position && (
              <div className="text-emerald-300 text-base font-semibold uppercase tracking-wide">
                {personalInfo.position}
              </div>
            )}
          </div>

          {/* Contatos */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base uppercase tracking-wide">Contato</h2>
            </div>
            <div className="space-y-3 text-sm">
              {personalInfo.email && (
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
                  <Mail className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span className="break-all text-gray-200">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
                  <Phone className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
                  <MapPin className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200">{personalInfo.address}</span>
                </div>
              )}
            </div>
          </section>

          {/* Sobre */}
          {objective?.description && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-base uppercase tracking-wide">Sobre</h2>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                {objective.description}
              </p>
            </section>
          )}

          {/* Habilidades */}
          {skills.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-base uppercase tracking-wide">Skills</h2>
              </div>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
                    <Star className="w-3 h-3 text-emerald-300 flex-shrink-0" />
                    <span className="text-sm text-gray-200">{skill.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Idiomas */}
          {languages.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <LanguagesIcon className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-base uppercase tracking-wide">Idiomas</h2>
              </div>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="bg-white/10 p-2 rounded-lg">
                    <div className="font-semibold text-sm text-emerald-300">{lang.name}</div>
                    <div className="text-xs text-gray-300">{lang.level}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certificações */}
          {courses.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-base uppercase tracking-wide">Certificados</h2>
              </div>
              <div className="space-y-2">
                {courses.map((course, index) => (
                  <div key={index} className="text-sm text-gray-200 bg-white/10 p-2 rounded-lg">
                    <div className="font-medium">{course.name}</div>
                    {course.year && (
                      <div className="text-xs text-emerald-300">{course.year}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Coluna Principal */}
        <div className="flex-1 bg-gray-50 p-8 print:p-6">
          {/* Experiência Profissional */}
          {experience.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Experiência</h2>
              </div>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                        <p className="text-emerald-600 font-semibold text-base">{exp.company}</p>
                      </div>
                      <span className="text-xs text-white bg-emerald-600 px-3 py-1 rounded-full whitespace-nowrap">
                        {exp.startDate} - {exp.endDate || 'Atual'}
                      </span>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 mt-3">
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
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Formação</h2>
              </div>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-base text-gray-900">{edu.course}</h3>
                        <p className="text-blue-600 font-medium text-sm">{edu.institution}</p>
                      </div>
                      <span className="text-xs text-blue-600 font-semibold whitespace-nowrap">
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Projetos</h2>
              </div>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-purple-500">
                    <h3 className="font-bold text-base text-gray-900">{project.name}</h3>
                    {project.description && (
                      <p className="text-gray-700 text-sm leading-relaxed mt-2">
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Conquistas</h2>
              </div>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <h3 className="font-bold text-base text-gray-900">{achievement.title}</h3>
                    {achievement.description && (
                      <p className="text-gray-700 text-sm leading-relaxed mt-2">
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