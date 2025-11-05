/**
 * Template: Moderno Gratuito (free-modern)
 * Design clean e profissional single-column
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
  formatDriverLicense
} from '../TemplateUtils';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  BookOpen,
  Award,
  Target,
  Car
} from 'lucide-react';

interface FreeModernProps {
  data: CurriculumData;
  config?: any;
}

export const FreeModern: React.FC<FreeModernProps> = ({ data, config }) => {
  const { personalInfo, objective, experience, education, skills, languages, courses, projects, achievements } = data;
  const photo = getPhotoOrPlaceholder(data);

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white p-8 print:p-6 font-sans">
      {/* HEADER */}
      <header className="mb-8 text-center border-b-4 border-blue-500 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          {personalInfo.name}
        </h1>

        {personalInfo.position && (
          <p className="text-xl text-gray-600 mb-4 font-medium">
            {personalInfo.position}
          </p>
        )}

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>{formatEmail(personalInfo.email)}</span>
            </div>
          )}

          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>{formatPhone(personalInfo.phone)}</span>
            </div>
          )}

          {personalInfo.address && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{personalInfo.address}</span>
            </div>
          )}

          {personalInfo.hasDriverLicense && (
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4 text-blue-500" />
              <span>{formatDriverLicense(true, personalInfo.driverLicenseCategories)}</span>
            </div>
          )}
        </div>
      </header>

      {/* OBJECTIVE */}
      {objective?.description && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Objetivo Profissional
            </h2>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {objective.description}
            </p>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {hasData(experience) && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Experiência Profissional
            </h2>
          </div>

          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-gray-200 pl-4 hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                    <p className="text-sm text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-1 rounded">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
                  </span>
                </div>

                {exp.description && (
                  <div className="text-sm text-gray-700 space-y-1">
                    {exp.description.split('\n').map((line, idx) => (
                      line.trim() && (
                        <p key={idx} className="leading-relaxed">{line}</p>
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
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Formação Acadêmica
            </h2>
          </div>

          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-gray-200 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.course}</h3>
                    <p className="text-sm text-blue-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{translateEducationLevel(edu.level)}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {hasData(skills) && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Habilidades
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-md font-medium border border-blue-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* LANGUAGES */}
      {hasData(languages) && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Languages className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Idiomas
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                <span className="text-sm font-medium text-gray-900">{lang.name}</span>
                <span className="text-xs text-gray-600">{translateLanguageLevel(lang.level)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COURSES */}
      {hasData(courses) && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Cursos e Certificações
            </h2>
          </div>

          <div className="space-y-2">
            {courses.map((course) => (
              <div key={course.id} className="text-sm border-l-2 border-gray-200 pl-3">
                <p className="font-medium text-gray-900">{course.name}</p>
                {course.institution && (
                  <p className="text-xs text-gray-600">{course.institution} {course.year && `• ${course.year}`}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {hasData(projects) && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Projetos
            </h2>
          </div>

          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="border-l-2 border-gray-200 pl-3">
                <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
                <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                {project.year && (
                  <span className="text-xs text-gray-500">{project.year}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACHIEVEMENTS */}
      {hasData(achievements) && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Conquistas
            </h2>
          </div>

          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="border-l-2 border-gray-200 pl-3">
                <h3 className="font-bold text-sm text-gray-900">{achievement.title}</h3>
                <p className="text-xs text-gray-700 mt-1">{achievement.description}</p>
                {achievement.year && (
                  <span className="text-xs text-gray-500">{achievement.year}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WATERMARK */}
      <footer className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-center text-gray-400">
          Criado em <strong className="text-blue-500">CVGrátis.com</strong> - Currículo Profissional Online
        </p>
      </footer>
    </div>
  );
};
