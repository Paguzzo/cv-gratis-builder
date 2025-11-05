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
    <div className="w-full max-w-[210mm] mx-auto bg-white flex print:flex-row" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* SIDEBAR - 30% */}
      <aside className="w-[30%] bg-slate-800 text-white p-6 print:p-5">
        {/* PHOTO */}
        <div className="mb-6 flex justify-center">
          {photo.type === 'photo' ? (
            <img
              src={photo.value}
              alt={personalInfo.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-lg">
              {getInitials(personalInfo.name)}
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-blue-300">
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
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-blue-300 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Habilidades
            </h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="text-xs mb-1">{skill.name}</div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        {hasData(languages) && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-blue-300 flex items-center gap-2">
              <LanguagesIcon className="w-4 h-4" />
              Idiomas
            </h3>
            <div className="space-y-2 text-xs">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span>{lang.name}</span>
                  <span className="text-blue-300">{translateLanguageLevel(lang.level)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES */}
        {hasData(courses) && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-blue-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Certificações
            </h3>
            <div className="space-y-2 text-xs">
              {courses.map((course) => (
                <div key={course.id}>
                  <p className="font-medium">{course.name}</p>
                  {course.year && (
                    <p className="text-gray-400">{course.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT - 70% */}
      <main className="w-[70%] p-8 print:p-6">
        {/* HEADER */}
        <header className="mb-6 pb-4 border-b-2 border-slate-800">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
            {personalInfo.name}
          </h1>

          {personalInfo.position && (
            <p className="text-xl text-blue-600 font-semibold">
              {personalInfo.position}
            </p>
          )}
        </header>

        {/* OBJECTIVE */}
        {objective?.description && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                Perfil Profissional
              </h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">
              {objective.description}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {hasData(experience) && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                Experiência Executiva
              </h2>
            </div>

            <div className="space-y-5">
              {experience.map((exp, index) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-blue-600">
                  {/* Timeline dot */}
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-600"></div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{exp.position}</h3>
                      <p className="text-sm text-blue-600 font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap bg-slate-100 px-2 py-1 rounded">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
                    </span>
                  </div>

                  {exp.description && (
                    <div className="text-sm text-gray-700 space-y-1">
                      {exp.description.split('\n').map((line, idx) => (
                        line.trim() && (
                          <p key={idx} className="leading-relaxed">• {line}</p>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {hasData(education) && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                Formação Acadêmica
              </h2>
            </div>

            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{edu.course}</h3>
                    <p className="text-sm text-gray-700">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{translateEducationLevel(edu.level)}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS & ACHIEVEMENTS */}
        {(hasData(projects) || hasData(achievements)) && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                Conquistas e Projetos
              </h2>
            </div>

            <div className="space-y-3">
              {achievements?.map((achievement) => (
                <div key={achievement.id}>
                  <h3 className="font-bold text-sm text-slate-900">🏆 {achievement.title}</h3>
                  <p className="text-xs text-gray-700">{achievement.description}</p>
                </div>
              ))}

              {projects?.map((project) => (
                <div key={project.id}>
                  <h3 className="font-bold text-sm text-slate-900">📊 {project.name}</h3>
                  <p className="text-xs text-gray-700">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
