/**
 * Template: Tech Premium (premium-tech)
 * Design tech com sidebar verde e elementos modernos
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
  Github,
  Linkedin,
  Globe,
  Terminal
} from 'lucide-react';

interface PremiumTechProps {
  data: CurriculumData;
  config?: any;
}

export const PremiumTech: React.FC<PremiumTechProps> = ({ data, config }) => {
  const { personalInfo, objective, experience, education, skills, languages, courses, projects, achievements } = data;
  const photo = getPhotoOrPlaceholder(data);

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white flex print:flex-row" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      {/* SIDEBAR - 35% */}
      <aside className="w-[35%] bg-teal-700 text-white p-6 print:p-5">
        {/* PHOTO */}
        <div className="mb-6 flex justify-center">
          {photo.type === 'photo' ? (
            <img
              src={photo.value}
              alt={personalInfo.name}
              className="w-28 h-28 rounded-lg object-cover border-4 border-teal-500 shadow-xl"
            />
          ) : (
            <div className="w-28 h-28 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-teal-500 shadow-xl">
              {getInitials(personalInfo.name)}
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div className="mb-6 bg-teal-800 p-4 rounded-lg">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-teal-300 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            $ contact
          </h3>
          <div className="space-y-2 text-xs font-mono">
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-300" />
                <span className="break-all">{formatEmail(personalInfo.email)}</span>
              </div>
            )}

            {personalInfo.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-300" />
                <span>{formatPhone(personalInfo.phone)}</span>
              </div>
            )}

            {personalInfo.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-300" />
                <span>{personalInfo.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* TECH SKILLS */}
        {hasData(skills) && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-teal-300 flex items-center gap-2">
              <Code className="w-4 h-4" />
              $ tech-stack
            </h3>
            <div className="space-y-3">
              {skills.map((skill, idx) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono">{skill.name}</span>
                    <span className="text-teal-300">{90 - (idx * 5)}%</span>
                  </div>
                  <div className="w-full bg-teal-900 rounded h-2">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded transition-all"
                      style={{ width: `${90 - (idx * 5)}%` }}
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
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-teal-300 flex items-center gap-2">
              <LanguagesIcon className="w-4 h-4" />
              $ languages
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2">
                  <span className="text-teal-300">▸</span>
                  <span>{lang.name}</span>
                  <span className="text-teal-400 text-[10px]">[{translateLanguageLevel(lang.level)}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {hasData(courses) && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-teal-300 flex items-center gap-2">
              <Award className="w-4 h-4" />
              $ certifications
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {courses.map((course) => (
                <div key={course.id} className="bg-teal-800 p-2 rounded">
                  <p className="font-semibold text-cyan-300">✓ {course.name}</p>
                  {course.institution && (
                    <p className="text-[10px] text-teal-400">{course.institution}</p>
                  )}
                  {course.year && (
                    <p className="text-[10px] text-teal-500">{course.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT - 65% */}
      <main className="w-[65%] p-8 print:p-6 bg-gradient-to-br from-gray-50 to-white">
        {/* HEADER */}
        <header className="mb-6 pb-4 border-b-2 border-teal-600">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            {personalInfo.name}
          </h1>

          {personalInfo.position && (
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-teal-600" />
              <p className="text-xl text-teal-700 font-bold font-mono">
                {'>'} {personalInfo.position}
              </p>
            </div>
          )}
        </header>

        {/* OBJECTIVE */}
        {objective?.description && (
          <section className="mb-6 bg-teal-50 p-4 rounded-lg border-l-4 border-teal-600">
            <h2 className="text-sm font-bold text-teal-900 uppercase tracking-wide mb-2 font-mono">
              README.md
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {objective.description}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {hasData(experience) && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2 font-mono">
              <Briefcase className="w-5 h-5 text-teal-600" />
              {'>'} work_experience.log
            </h2>

            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-white p-4 rounded-lg border-l-4 border-teal-600 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base font-mono">{exp.position}</h3>
                      <p className="text-sm text-teal-700 font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                      {formatDate(exp.startDate)} → {formatDate(exp.endDate, exp.current)}
                    </span>
                  </div>

                  {exp.description && (
                    <div className="text-xs text-gray-700 space-y-1 font-mono">
                      {exp.description.split('\n').map((line, idx) => (
                        line.trim() && (
                          <p key={idx} className="leading-relaxed flex items-start gap-2">
                            <span className="text-teal-600">▸</span>
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

        {/* EDUCATION */}
        {hasData(education) && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2 font-mono">
              <GraduationCap className="w-5 h-5 text-teal-600" />
              {'>'} education.json
            </h2>

            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="bg-gray-50 p-3 rounded border-l-2 border-teal-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 font-mono text-sm">{edu.course}</h3>
                      <p className="text-xs text-gray-700">{edu.institution}</p>
                      <p className="text-[10px] text-teal-600 font-mono">{translateEducationLevel(edu.level)}</p>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {hasData(projects) && (
          <section className="mb-6">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2 font-mono">
              <Code className="w-5 h-5 text-teal-600" />
              {'>'} projects/
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border border-teal-200">
                  <h3 className="font-bold text-sm text-gray-900 font-mono flex items-center gap-2">
                    <Github className="w-4 h-4 text-teal-600" />
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                  {project.year && (
                    <span className="text-[10px] text-teal-600 font-mono">{project.year}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {hasData(achievements) && (
          <section>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2 font-mono">
              <Award className="w-5 h-5 text-teal-600" />
              {'>'} achievements[]
            </h2>

            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-2 text-xs">
                  <span className="text-teal-600 font-bold">✓</span>
                  <div>
                    <p className="font-bold text-gray-900 font-mono">{achievement.title}</p>
                    <p className="text-gray-700">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
