/**
 * Template: Executivo Premium (premium-executive)
 * Design corporativo two-column com sidebar escura
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
  Target
} from 'lucide-react';

interface PremiumExecutiveProps {
  data: CurriculumData;
  config?: any;
}

export const PremiumExecutive: React.FC<PremiumExecutiveProps> = ({ data, config }) => {
  const { personalInfo, objective, experience, education, skills, languages, courses, projects, achievements } = data;
  const photo = getPhotoOrPlaceholder(data);

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white flex print:flex-row shadow-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* SIDEBAR - 30% */}
      <aside className="w-[30%] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 print:p-5">
        {/* PHOTO */}
        <div className="mb-6 flex justify-center">
          {photo.type === 'photo' ? (
            <img
              src={photo.value}
              alt={personalInfo.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-2xl">
              {getInitials(personalInfo.name)}
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div className="mb-6 bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-blue-400">
            Contato
          </h3>
          <div className="space-y-2 text-xs">
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" />
                <span className="break-all">{formatEmail(personalInfo.email)}</span>
              </div>
            )}

            {personalInfo.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" />
                <span>{formatPhone(personalInfo.phone)}</span>
              </div>
            )}

            {personalInfo.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" />
                <span>{personalInfo.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* SKILLS */}
        {hasData(skills) && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-blue-400 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Habilidades
            </h3>
            <div className="space-y-3">
              {skills.map((skill, idx) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-blue-400 font-semibold">{95 - (idx * 5)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-2 rounded-full shadow-lg transition-all duration-300"
                      style={{ width: `${95 - (idx * 5)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        {hasData(languages) && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-blue-400 flex items-center gap-2">
              <LanguagesIcon className="w-4 h-4" />
              Idiomas
            </h3>
            <div className="space-y-2 text-xs">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-blue-400 font-semibold bg-blue-500/20 px-2 py-0.5 rounded">{translateLanguageLevel(lang.level)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES */}
        {hasData(courses) && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-blue-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Certificações
            </h3>
            <div className="space-y-2 text-xs">
              {courses.map((course) => (
                <div key={course.id} className="bg-slate-800/50 p-3 rounded-lg border-l-2 border-blue-500">
                  <p className="font-semibold text-blue-300">{course.name}</p>
                  {course.institution && (
                    <p className="text-gray-400 text-[10px] mt-1">{course.institution}</p>
                  )}
                  {course.year && (
                    <p className="text-blue-400 text-[10px] mt-0.5 font-medium">{course.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT - 70% */}
      <main className="w-[70%] p-8 print:p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* HEADER */}
        <header className="mb-6 pb-4 border-b-4 border-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-sm">
          <h1 className="text-5xl font-bold text-slate-900 mb-2 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            {personalInfo.name}
          </h1>

          {personalInfo.position && (
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {personalInfo.position}
            </p>
          )}
        </header>

        {/* OBJECTIVE */}
        {objective?.description && (
          <section className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-l-4 border-blue-600 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                Perfil Profissional
              </h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed text-justify pl-13">
              {objective.description}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {hasData(experience) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                Experiência Executiva
              </h2>
            </div>

            <div className="space-y-5">
              {experience.map((exp, index) => (
                <div key={exp.id} className="relative pl-6 border-l-4 border-gradient-to-b from-blue-600 via-indigo-600 to-purple-600">
                  {/* Timeline dot with gradient */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 border-2 border-white shadow-lg"></div>

                  <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{exp.position}</h3>
                        <p className="text-base text-blue-600 font-semibold">{exp.company}</p>
                      </div>
                      <span className="text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 rounded-full whitespace-nowrap shadow-md">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
                      </span>
                    </div>

                    {exp.description && (
                      <div className="text-sm text-gray-700 space-y-2 mt-3">
                        {exp.description.split('\n').map((line, idx) => (
                          line.trim() && (
                            <p key={idx} className="leading-relaxed flex items-start gap-2">
                              <span className="text-blue-600 font-bold">▸</span>
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
          </section>
        )}

        {/* EDUCATION */}
        {hasData(education) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                Formação Acadêmica
              </h2>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{edu.course}</h3>
                      <p className="text-sm text-gray-700 font-medium">{edu.institution}</p>
                      <p className="text-xs text-blue-600 font-semibold bg-blue-100 inline-block px-2 py-0.5 rounded mt-1">{translateEducationLevel(edu.level)}</p>
                    </div>
                    <span className="text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 rounded-full whitespace-nowrap shadow-md font-medium">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS & ACHIEVEMENTS */}
        {(hasData(projects) || hasData(achievements)) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                Conquistas e Projetos
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {achievements?.map((achievement) => (
                <div key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border-l-4 border-yellow-500 shadow-md hover:shadow-lg transition-all">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-2">{achievement.description}</p>
                </div>
              ))}

              {projects?.map((project) => (
                <div key={project.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-all">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                  {project.year && (
                    <span className="text-xs text-blue-600 font-semibold bg-blue-100 inline-block px-2 py-0.5 rounded mt-2">{project.year}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
