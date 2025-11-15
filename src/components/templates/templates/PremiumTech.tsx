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
    <div className="w-full max-w-[210mm] mx-auto bg-white flex print:flex-row shadow-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* SIDEBAR - 35% */}
      <aside className="w-[35%] bg-gradient-to-b from-teal-800 via-teal-700 to-cyan-900 text-white p-6 print:p-5">
        {/* PHOTO */}
        <div className="mb-6 flex justify-center">
          {photo.type === 'photo' ? (
            <img
              src={photo.value}
              alt={personalInfo.name}
              className="w-28 h-28 rounded-lg object-cover border-4 border-teal-500 shadow-xl"
            />
          ) : (
            <div className="w-28 h-28 rounded-lg bg-gradient-to-br from-cyan-400 via-teal-500 to-green-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-cyan-400 shadow-2xl transform hover:scale-105 transition-transform">
              {getInitials(personalInfo.name)}
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div className="mb-6 bg-gradient-to-r from-teal-800 to-cyan-900 p-4 rounded-lg shadow-xl border-l-4 border-cyan-400">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-cyan-300 flex items-center gap-2">
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
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-cyan-300 flex items-center gap-2">
              <Code className="w-4 h-4" />
              $ tech-stack
            </h3>
            <div className="space-y-3">
              {skills.map((skill, idx) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-mono font-semibold">{skill.name}</span>
                    <span className="text-cyan-300 font-bold bg-cyan-500/20 px-2 py-0.5 rounded">{90 - (idx * 5)}%</span>
                  </div>
                  <div className="w-full bg-teal-900 rounded-full h-2.5 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-cyan-400 via-teal-400 to-green-400 h-2.5 rounded-full shadow-lg transition-all duration-500 hover:shadow-cyan-400/50"
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
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-cyan-300 flex items-center gap-2">
              <LanguagesIcon className="w-4 h-4" />
              $ languages
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between bg-teal-800/50 p-2.5 rounded-lg border-l-2 border-cyan-400 hover:bg-teal-800 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">▸</span>
                    <span className="font-semibold">{lang.name}</span>
                  </div>
                  <span className="text-cyan-300 text-[10px] bg-cyan-500/20 px-2 py-1 rounded font-bold">[{translateLanguageLevel(lang.level)}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {hasData(courses) && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-cyan-300 flex items-center gap-2">
              <Award className="w-4 h-4" />
              $ certifications
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {courses.map((course) => (
                <div key={course.id} className="bg-gradient-to-r from-teal-800 to-cyan-900 p-3 rounded-lg border-l-2 border-cyan-400 shadow-lg hover:shadow-cyan-500/50 transition-all">
                  <p className="font-bold text-cyan-300 flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    {course.name}
                  </p>
                  {course.institution && (
                    <p className="text-[10px] text-teal-300 mt-1">{course.institution}</p>
                  )}
                  {course.year && (
                    <p className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/20 inline-block px-2 py-0.5 rounded mt-1">{course.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT - 65% */}
      <main className="w-[65%] p-8 print:p-6 bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50">
        {/* HEADER */}
        <header className="mb-6 pb-4 border-b-4 border-gradient-to-r from-cyan-600 via-teal-600 to-green-600 shadow-sm">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
            {personalInfo.name}
          </h1>

          {personalInfo.position && (
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-teal-600" />
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-green-600 bg-clip-text text-transparent font-mono">
                {'>'} {personalInfo.position}
              </p>
            </div>
          )}
        </header>

        {/* OBJECTIVE */}
        {objective?.description && (
          <section className="mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 p-5 rounded-xl border-l-4 border-cyan-600 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-teal-600 rounded flex items-center justify-center shadow-md">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-base font-bold text-teal-900 uppercase tracking-wide font-mono">
                README.md
              </h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed pl-10">
              {objective.description}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {hasData(experience) && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide font-mono">
                {'>'} work_experience.log
              </h2>
            </div>

            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-white p-5 rounded-xl border-l-4 border-cyan-600 shadow-lg hover:shadow-xl hover:border-teal-500 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg font-mono">{exp.position}</h3>
                      <p className="text-base text-teal-700 font-bold">{exp.company}</p>
                    </div>
                    <span className="text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-1.5 rounded-lg shadow-md font-mono">
                      {formatDate(exp.startDate)} → {formatDate(exp.endDate, exp.current)}
                    </span>
                  </div>

                  {exp.description && (
                    <div className="text-sm text-gray-700 space-y-2 font-mono mt-3">
                      {exp.description.split('\n').map((line, idx) => (
                        line.trim() && (
                          <p key={idx} className="leading-relaxed flex items-start gap-2">
                            <span className="text-cyan-600 font-bold">▸</span>
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
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide font-mono">
                {'>'} education.json
              </h2>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="bg-gradient-to-r from-gray-50 to-cyan-50 p-4 rounded-xl border-l-4 border-teal-500 shadow-md hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 font-mono text-base">{edu.course}</h3>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                      <p className="text-xs text-teal-600 font-semibold bg-teal-100 inline-block px-2 py-0.5 rounded mt-1 font-mono">{translateEducationLevel(edu.level)}</p>
                    </div>
                    <span className="text-xs text-white bg-gradient-to-r from-cyan-600 to-teal-600 px-3 py-1 rounded-lg shadow-md font-mono font-medium">
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
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide font-mono">
                {'>'} projects/
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border-l-4 border-green-500 shadow-lg hover:shadow-xl hover:from-cyan-100 hover:to-teal-100 transition-all duration-300">
                  <h3 className="font-bold text-base text-gray-900 font-mono flex items-center gap-2">
                    <Github className="w-5 h-5 text-teal-600" />
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                  {project.year && (
                    <span className="text-xs text-teal-600 font-semibold bg-teal-100 inline-block px-2 py-0.5 rounded mt-2 font-mono">{project.year}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {hasData(achievements) && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide font-mono">
                {'>'} achievements[]
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-l-4 border-yellow-500 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="font-bold text-gray-900 font-mono text-base">{achievement.title}</p>
                      <p className="text-gray-700 text-sm mt-1">{achievement.description}</p>
                    </div>
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
