/**
 * Template: Creative Premium (premium-creative)
 * Design ousado, criativo com layout assimétrico e cores vibrantes
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
  Sparkles,
  Palette,
  Zap,
  Heart
} from 'lucide-react';

interface PremiumCreativeProps {
  data: CurriculumData;
  config?: any;
}

export const PremiumCreative: React.FC<PremiumCreativeProps> = ({ data, config }) => {
  const { personalInfo, objective, experience, education, skills, languages, courses, projects, achievements } = data;
  const photo = getPhotoOrPlaceholder(data);

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white overflow-hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* CREATIVE ASYMMETRIC HEADER */}
      <header className="relative">
        {/* Colorful Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 p-8 print:p-6 flex items-end justify-between gap-8">
          <div className="flex-1 text-white">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <p className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Creative Professional
              </p>
            </div>

            <h1 className="text-6xl font-black mb-3 leading-tight tracking-tight drop-shadow-lg">
              {personalInfo.name}
            </h1>

            {personalInfo.position && (
              <p className="text-2xl font-bold text-pink-200 mb-6">{personalInfo.position}</p>
            )}

            {/* Contact */}
            <div className="space-y-2 text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg inline-flex">
                  <Mail className="w-4 h-4" />
                  <span>{formatEmail(personalInfo.email)}</span>
                </div>
              )}

              {personalInfo.phone && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg inline-flex ml-2">
                  <Phone className="w-4 h-4" />
                  <span>{formatPhone(personalInfo.phone)}</span>
                </div>
              )}

              {personalInfo.address && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg inline-flex ml-2">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* PHOTO - Positioned creatively */}
          <div className="flex-shrink-0 transform rotate-3">
            {photo.type === 'photo' ? (
              <img
                src={photo.value}
                alt={personalInfo.name}
                className="w-40 h-40 rounded-3xl object-cover border-8 border-white shadow-2xl"
              />
            ) : (
              <div className="w-40 h-40 rounded-3xl bg-white text-purple-600 flex items-center justify-center text-5xl font-black shadow-2xl">
                {getInitials(personalInfo.name)}
              </div>
            )}
          </div>
        </div>

        {/* Wavy divider */}
        <div className="relative">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z" fill="currentColor"></path>
          </svg>
        </div>
      </header>

      <div className="px-8 py-6 print:px-6 -mt-8">
        {/* OBJECTIVE */}
        {objective?.description && (
          <section className="mb-8 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-2 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
            <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center transform -rotate-6">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Minha Paixão
                </h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed pl-15">
                {objective.description}
              </p>
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {hasData(experience) && (
          <section className="mb-8">
            <h2 className="text-3xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-purple-600" />
              Experiências
            </h2>

            <div className="space-y-5">
              {experience.map((exp, idx) => (
                <div key={exp.id} className="relative">
                  <div className={`absolute -left-6 top-2 w-12 h-12 rounded-2xl flex items-center justify-center transform ${idx % 2 === 0 ? 'rotate-6' : '-rotate-6'}`}
                       style={{
                         background: `linear-gradient(135deg, ${['#ec4899', '#8b5cf6', '#6366f1', '#06b6d4'][idx % 4]}, ${['#f472b6', '#a78bfa', '#818cf8', '#22d3ee'][idx % 4]})`
                       }}>
                    <span className="text-white font-black text-lg">{idx + 1}</span>
                  </div>

                  <div className="ml-8 bg-white p-5 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-purple-300 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-black text-lg text-gray-900">{exp.position}</h3>
                        <p className="text-sm font-bold text-purple-600">{exp.company}</p>
                      </div>
                      <span className="text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full whitespace-nowrap shadow-md">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
                      </span>
                    </div>

                    {exp.description && (
                      <div className="text-sm text-gray-700 space-y-1.5">
                        {exp.description.split('\n').map((line, idx) => (
                          line.trim() && (
                            <p key={idx} className="leading-relaxed flex items-start gap-2">
                              <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
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

        {/* ASYMMETRIC TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* LEFT COLUMN - 2/3 */}
          <div className="col-span-2 space-y-8">
            {/* SKILLS */}
            {hasData(skills) && (
              <section>
                <h2 className="text-2xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 flex items-center gap-3">
                  <Palette className="w-7 h-7 text-green-600" />
                  Habilidades
                </h2>

                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, idx) => (
                    <div key={skill.id}
                         className="px-5 py-3 rounded-2xl font-bold text-white shadow-lg transform hover:scale-105 transition-transform"
                         style={{
                           background: `linear-gradient(135deg, ${['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][idx % 5]}, ${['#34d399', '#60a5fa', '#a78bfa', '#fbbf24', '#f87171'][idx % 5]})`,
                           transform: idx % 3 === 0 ? 'rotate(2deg)' : idx % 3 === 1 ? 'rotate(-2deg)' : 'rotate(0deg)'
                         }}>
                      <span className="text-sm">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PROJECTS */}
            {hasData(projects) && (
              <section>
                <h2 className="text-2xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-blue-600" />
                  Projetos Criativos
                </h2>

                <div className="space-y-3">
                  {projects.map((project, idx) => (
                    <div key={project.id} className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-200 shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black text-sm text-gray-900">{project.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{project.description}</p>
                          {project.year && (
                            <span className="text-xs font-bold text-blue-600 mt-2 inline-block">{project.year}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN - 1/3 */}
          <div className="space-y-6">
            {/* EDUCATION */}
            {hasData(education) && (
              <section className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200 shadow-lg">
                <h2 className="text-lg font-black mb-4 text-orange-700 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Educação
                </h2>

                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="bg-white p-3 rounded-xl">
                      <p className="text-xs font-black text-gray-900">{edu.course}</p>
                      <p className="text-xs text-orange-700 font-bold">{edu.institution}</p>
                      <p className="text-xs text-gray-600 mt-1">{translateEducationLevel(edu.level)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* LANGUAGES */}
            {hasData(languages) && (
              <section className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 rounded-2xl border-2 border-pink-200 shadow-lg">
                <h2 className="text-lg font-black mb-4 text-pink-700 flex items-center gap-2">
                  <LanguagesIcon className="w-5 h-5" />
                  Idiomas
                </h2>

                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="bg-white p-3 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-black text-gray-900">{lang.name}</span>
                      <span className="text-xs text-pink-700 font-bold">{translateLanguageLevel(lang.level)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* COURSES */}
            {hasData(courses) && (
              <section className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-2xl border-2 border-purple-200 shadow-lg">
                <h2 className="text-lg font-black mb-4 text-purple-700 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certificados
                </h2>

                <div className="space-y-2">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white p-3 rounded-xl">
                      <p className="text-xs font-black text-gray-900">{course.name}</p>
                      {course.institution && (
                        <p className="text-xs text-purple-600 font-bold">{course.institution}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        {hasData(achievements) && (
          <section>
            <h2 className="text-2xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 flex items-center gap-3">
              <Award className="w-7 h-7 text-red-600" />
              Conquistas
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, idx) => (
                <div key={achievement.id}
                     className="p-4 rounded-2xl shadow-lg border-2"
                     style={{
                       background: `linear-gradient(135deg, ${['#fef3c7', '#fce7f3', '#ddd6fe', '#ccfbf1'][idx % 4]}, white)`,
                       borderColor: ['#fbbf24', '#ec4899', '#8b5cf6', '#14b8a6'][idx % 4]
                     }}>
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 flex-shrink-0" style={{ color: ['#f59e0b', '#db2777', '#7c3aed', '#0d9488'][idx % 4] }} />
                    <div>
                      <p className="font-black text-sm text-gray-900">{achievement.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                    </div>
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
