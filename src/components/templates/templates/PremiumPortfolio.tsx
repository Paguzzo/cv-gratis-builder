/**
 * Template: Portfolio Premium (premium-portfolio)
 * Focado em projetos, portfolio e realizações visuais
 */

import React from 'react';
import { CurriculumData } from '@/types/curriculum';
import {
  formatDate,
  formatPhone,
  formatEmail,
  translateEducationLevel,
  translateLanguageLevel,
  hasData,
  getPhotoOrPlaceholder,
  getInitials
} from '../TemplateUtils';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Languages as LanguagesIcon,
  BookOpen,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Star,
  Lightbulb
} from 'lucide-react';

interface PremiumPortfolioProps {
  data: CurriculumData;
  config?: any;
}

export const PremiumPortfolio: React.FC<PremiumPortfolioProps> = ({ data, config }) => {
  const { personalInfo, objective, experience, education, skills, languages, courses, projects, achievements } = data;
  const photo = getPhotoOrPlaceholder(data);

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-gradient-to-br from-gray-50 to-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* HERO HEADER */}
      <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-10 print:p-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1 min-w-0 overflow-hidden">
              <h1 className="text-5xl font-bold mb-3 tracking-tight truncate">{personalInfo.name}</h1>
              {personalInfo.position && (
                <p className="text-2xl text-blue-400 font-medium mb-4 truncate">{personalInfo.position}</p>
              )}

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                {personalInfo.email && (
                  <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>{formatEmail(personalInfo.email)}</span>
                  </a>
                )}

                {personalInfo.phone && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span>{formatPhone(personalInfo.phone)}</span>
                  </div>
                )}

                {personalInfo.address && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{personalInfo.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PHOTO */}
            <div className="flex-shrink-0">
              {photo.type === 'photo' ? (
                <img
                  src={photo.value}
                  alt={personalInfo.name}
                  className="w-36 h-36 rounded-2xl object-cover border-4 border-blue-500 shadow-2xl"
                />
              ) : (
                <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                  {getInitials(personalInfo.name)}
                </div>
              )}
            </div>
          </div>

          {/* Objective */}
          {objective?.description && (
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-bold">Sobre Mim</h2>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed break-words">
                {objective.description}
              </p>
            </div>
          )}
        </div>
      </header>

      <div className="p-8 print:p-6">
        {/* PROJECTS GRID - DESTAQUE PRINCIPAL */}
        {hasData(projects) && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3 border-b-4 border-blue-500 pb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              Portfolio de Projetos
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {projects.map((project, idx) => (
                <div key={project.id} className="group bg-white p-5 rounded-xl shadow-md border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    {project.year && (
                      <span className="text-xs text-white bg-blue-500 px-3 py-1 rounded-full">{project.year}</span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {hasData(experience) && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3 border-b-4 border-green-500 pb-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              Experiência Profissional
            </h2>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-l-4 border-green-500 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                      <p className="text-sm text-green-700 font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-xs text-white bg-green-600 px-3 py-1 rounded-full whitespace-nowrap">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
                    </span>
                  </div>

                  {exp.description && (
                    <div className="text-sm text-gray-700 space-y-1.5">
                      {exp.description.split('\n').map((line, idx) => (
                        line.trim() && (
                          <p key={idx} className="leading-relaxed flex items-start gap-2">
                            <Star className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{line}</span>
                          </p>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS SHOWCASE */}
        {hasData(skills) && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3 border-b-4 border-purple-500 pb-2">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              Competências Técnicas
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-gradient-to-br from-purple-100 to-pink-100 px-4 py-3 rounded-lg text-center border-2 border-purple-200 hover:border-purple-500 transition-colors">
                  <span className="text-sm font-bold text-purple-900">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {hasData(achievements) && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3 border-b-4 border-yellow-500 pb-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              Conquistas e Prêmios
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-sm text-gray-900 mb-1">{achievement.title}</p>
                      <p className="text-xs text-gray-700">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-2 gap-6">
          {/* EDUCATION */}
          {hasData(education) && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3 border-b-2 border-blue-500 pb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Formação
              </h2>

              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-sm text-gray-900">{edu.course}</h3>
                    <p className="text-xs text-blue-700 font-medium">{edu.institution}</p>
                    <p className="text-xs text-gray-600 mt-1">{translateEducationLevel(edu.level)}</p>
                    <span className="text-xs text-gray-500">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LANGUAGES & COURSES */}
          <div className="space-y-6">
            {/* LANGUAGES */}
            {hasData(languages) && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3 border-b-2 border-orange-500 pb-2">
                  <LanguagesIcon className="w-5 h-5 text-orange-600" />
                  Idiomas
                </h2>

                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="bg-orange-50 p-3 rounded-lg border border-orange-200 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{lang.name}</span>
                      <span className="text-xs text-orange-700 bg-white px-2 py-1 rounded-full">{translateLanguageLevel(lang.level)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CERTIFICATIONS */}
            {hasData(courses) && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3 border-b-2 border-indigo-500 pb-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Certificados
                </h2>

                <div className="space-y-2">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                      <p className="text-sm font-semibold text-gray-900">{course.name}</p>
                      {course.institution && (
                        <p className="text-xs text-indigo-600">{course.institution}</p>
                      )}
                      {course.year && (
                        <span className="text-xs text-gray-500">{course.year}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
