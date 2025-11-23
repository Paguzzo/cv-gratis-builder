/**
 * Template: Infographic Premium (premium-infographic)
 * Design moderno com ícones, gráficos e timeline visual
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
  Target,
  TrendingUp,
  Circle,
  CheckCircle2
} from 'lucide-react';

interface PremiumInfographicProps {
  data: CurriculumData;
  config?: any;
}

export const PremiumInfographic: React.FC<PremiumInfographicProps> = ({ data, config }) => {
  const { personalInfo, objective, experience, education, skills, languages, courses, projects, achievements } = data;
  const photo = getPhotoOrPlaceholder(data);

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* HEADER COM GRADIENTE */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-8 print:p-6">
        <div className="flex items-center gap-6">
          {/* PHOTO */}
          <div className="flex-shrink-0">
            {photo.type === 'photo' ? (
              <img
                src={photo.value}
                alt={personalInfo.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white text-purple-600 flex items-center justify-center text-4xl font-bold shadow-2xl">
                {getInitials(personalInfo.name)}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <h1 className="text-4xl font-bold mb-2 truncate">{personalInfo.name}</h1>
            {personalInfo.position && (
              <p className="text-xl font-medium text-purple-100 truncate">{personalInfo.position}</p>
            )}

            {/* CONTACT ICONS */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <Mail className="w-4 h-4" />
                  <span>{formatEmail(personalInfo.email)}</span>
                </div>
              )}

              {personalInfo.phone && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <Phone className="w-4 h-4" />
                  <span>{formatPhone(personalInfo.phone)}</span>
                </div>
              )}

              {personalInfo.address && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 print:p-6">
        {/* OBJECTIVE */}
        {objective?.description && (
          <section className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Objetivo Profissional</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed pl-13 break-words">
              {objective.description}
            </p>
          </section>
        )}

        {/* EXPERIENCE TIMELINE */}
        {hasData(experience) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Experiência Profissional</h2>
            </div>

            <div className="relative pl-8">
              {/* TIMELINE LINE */}
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-pink-300"></div>

              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={exp.id} className="relative">
                    {/* TIMELINE DOT */}
                    <div className="absolute -left-[1.85rem] top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow"></div>

                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                          <p className="text-sm text-purple-600 font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full whitespace-nowrap">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
                        </span>
                      </div>

                      {exp.description && (
                        <div className="text-xs text-gray-700 space-y-1 mt-3">
                          {exp.description.split('\n').map((line, idx) => (
                            line.trim() && (
                              <p key={idx} className="leading-relaxed flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                                <span>{line}</span>
                              </p>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {hasData(education) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Formação Acadêmica</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {education.map((edu) => (
                <div key={edu.id} className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.course}</h3>
                      <p className="text-sm text-blue-700 font-medium">{edu.institution}</p>
                      <p className="text-xs text-gray-600 mt-1">{translateEducationLevel(edu.level)}</p>
                    </div>
                    <span className="text-xs text-blue-600 font-semibold whitespace-nowrap">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS WITH PROGRESS BARS */}
        {hasData(skills) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Habilidades Técnicas</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill, idx) => {
                const progress = 95 - (idx * 3); // Gradual decrease
                return (
                  <div key={skill.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{skill.name}</span>
                      <span className="text-xs text-green-600 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* LANGUAGES */}
        {hasData(languages) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <LanguagesIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Idiomas</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <div key={lang.id} className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-200 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{lang.name}</span>
                  <span className="text-xs text-orange-700 bg-white px-2 py-1 rounded-full">{translateLanguageLevel(lang.level)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* COURSES & CERTIFICATIONS */}
        {hasData(courses) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Certificações</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {courses.map((course) => (
                <div key={course.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{course.name}</p>
                      {course.institution && (
                        <p className="text-xs text-indigo-600">{course.institution}</p>
                      )}
                      {course.year && (
                        <span className="text-xs text-gray-500">{course.year}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {hasData(projects) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Projetos Destacados</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border-l-4 border-pink-500">
                  <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
                  <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                  {project.year && (
                    <span className="text-xs text-pink-600 font-semibold">{project.year}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {hasData(achievements) && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Conquistas</h2>
            </div>

            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <Award className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-gray-900">{achievement.title}</p>
                    <p className="text-xs text-gray-700">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
