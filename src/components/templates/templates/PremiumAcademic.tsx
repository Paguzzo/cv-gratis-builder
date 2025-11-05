/**
 * Template: Academic Premium (premium-academic)
 * Focado em formação acadêmica, publicações e pesquisas
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
  FileText,
  BookMarked,
  Library,
  Microscope
} from 'lucide-react';

interface PremiumAcademicProps {
  data: CurriculumData;
  config?: any;
}

export const PremiumAcademic: React.FC<PremiumAcademicProps> = ({ data, config }) => {
  const { personalInfo, objective, experience, education, skills, languages, courses, projects, achievements } = data;
  const photo = getPhotoOrPlaceholder(data);

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white" style={{ fontFamily: 'Georgia, serif' }}>
      {/* CLASSIC ACADEMIC HEADER */}
      <header className="text-center border-b-4 border-double border-gray-800 pb-6 pt-8 px-8 bg-gradient-to-b from-gray-50 to-white">
        {/* PHOTO */}
        <div className="flex justify-center mb-4">
          {photo.type === 'photo' ? (
            <img
              src={photo.value}
              alt={personalInfo.name}
              className="w-32 h-32 rounded-sm object-cover border-4 border-gray-800 shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-sm bg-gray-800 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
              {getInitials(personalInfo.name)}
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-wide">{personalInfo.name}</h1>

        {personalInfo.position && (
          <p className="text-xl text-gray-700 font-serif italic mb-4">{personalInfo.position}</p>
        )}

        {/* CONTACT INFO */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{formatEmail(personalInfo.email)}</span>
            </div>
          )}

          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{formatPhone(personalInfo.phone)}</span>
            </div>
          )}

          {personalInfo.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{personalInfo.address}</span>
            </div>
          )}
        </div>
      </header>

      <div className="px-8 py-6 print:px-6">
        {/* OBJECTIVE / RESEARCH INTERESTS */}
        {objective?.description && (
          <section className="mb-6 border-l-4 border-gray-700 pl-6 bg-gray-50 py-4">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Microscope className="w-5 h-5" />
              Perfil Acadêmico
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed font-serif">
              {objective.description}
            </p>
          </section>
        )}

        {/* EDUCATION - DESTAQUE PRINCIPAL */}
        {hasData(education) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-800 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Formação Acadêmica
            </h2>

            <div className="space-y-5">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-gray-400 pl-6 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-base text-gray-900">{translateEducationLevel(edu.level)}</h3>
                      <p className="text-base text-gray-800 font-serif italic">{edu.course}</p>
                      <p className="text-sm text-gray-700 mt-1">{edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-600 font-semibold whitespace-nowrap bg-gray-100 px-3 py-1 rounded">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS & COURSES */}
        {hasData(courses) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-800 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Certificações e Especializações
            </h2>

            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{course.name}</p>
                      {course.institution && (
                        <p className="text-xs text-gray-700 font-serif italic mt-1">{course.institution}</p>
                      )}
                    </div>
                    {course.year && (
                      <span className="text-xs text-gray-600 font-semibold">{course.year}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESEARCH PROJECTS / PROJECTS */}
        {hasData(projects) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-800 flex items-center gap-2">
              <Library className="w-6 h-6" />
              Projetos de Pesquisa
            </h2>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border-l-4 border-blue-400 pl-6 py-2 bg-blue-50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
                    {project.year && (
                      <span className="text-xs text-blue-700 font-semibold">{project.year}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-serif">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACADEMIC ACHIEVEMENTS / PUBLICATIONS */}
        {hasData(achievements) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-800 flex items-center gap-2">
              <BookMarked className="w-6 h-6" />
              Publicações e Conquistas Acadêmicas
            </h2>

            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-amber-50 p-4 rounded border-l-4 border-amber-500">
                  <p className="font-bold text-sm text-gray-900 mb-1">{achievement.title}</p>
                  <p className="text-xs text-gray-700 font-serif italic leading-relaxed">{achievement.description}</p>
                  {achievement.year && (
                    <span className="text-xs text-amber-700 font-semibold mt-2 inline-block">{achievement.year}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {hasData(experience) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-800 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Experiência Profissional e Acadêmica
            </h2>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-green-400 pl-6 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{exp.position}</h3>
                      <p className="text-sm text-gray-700 font-serif italic">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-600 font-semibold whitespace-nowrap">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
                    </span>
                  </div>

                  {exp.description && (
                    <div className="text-xs text-gray-700 space-y-1 font-serif">
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

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-2 gap-8">
          {/* SKILLS */}
          {hasData(skills) && (
            <section>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider mb-3 pb-2 border-b border-gray-600">
                Competências
              </h2>

              <div className="space-y-1.5">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
                    <span className="text-xs text-gray-800 font-serif">{skill.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {hasData(languages) && (
            <section>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider mb-3 pb-2 border-b border-gray-600">
                Idiomas
              </h2>

              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center justify-between">
                    <span className="text-xs text-gray-800 font-serif">{lang.name}</span>
                    <span className="text-xs text-gray-600 font-semibold">{translateLanguageLevel(lang.level)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ACADEMIC FOOTER */}
      <footer className="border-t-2 border-gray-300 mt-8 py-4 px-8 bg-gray-50 text-center">
        <p className="text-xs text-gray-600 font-serif italic">
          Currículo Acadêmico - {personalInfo.name}
        </p>
      </footer>
    </div>
  );
};
