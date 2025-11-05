/**
 * Template: Clássico Gratuito (free-classic)
 * Design tradicional e conservador single-column
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
  formatDriverLicense
} from '../TemplateUtils';

interface FreeClassicProps {
  data: CurriculumData;
  config?: any;
}

export const FreeClassic: React.FC<FreeClassicProps> = ({ data, config }) => {
  const { personalInfo, objective, experience, education, skills, languages, courses, projects, achievements } = data;

  return (
    <div className="w-full max-w-[210mm] mx-auto bg-white p-8 print:p-6" style={{ fontFamily: 'Georgia, serif' }}>
      {/* HEADER - Traditional Left-Aligned */}
      <header className="mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
          {personalInfo.name}
        </h1>

        {personalInfo.position && (
          <p className="text-lg text-gray-700 mb-3">
            {personalInfo.position}
          </p>
        )}

        {/* Contact Info - Traditional Format */}
        <div className="text-sm text-gray-700 space-y-1">
          {personalInfo.email && (
            <p>Email: {formatEmail(personalInfo.email)}</p>
          )}

          {personalInfo.phone && (
            <p>Telefone: {formatPhone(personalInfo.phone)}</p>
          )}

          {personalInfo.address && (
            <p>Endereço: {personalInfo.address}</p>
          )}

          {personalInfo.hasDriverLicense && (
            <p>{formatDriverLicense(true, personalInfo.driverLicenseCategories)}</p>
          )}
        </div>
      </header>

      {/* OBJECTIVE */}
      {objective?.description && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Objetivo Profissional
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed text-justify">
            {objective.description}
          </p>
        </section>
      )}

      {/* EXPERIENCE */}
      {hasData(experience) && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Experiência Profissional
          </h2>

          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-2">
                  <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                    {exp.position}
                  </h3>
                  <p className="text-sm text-gray-700 italic">
                    {exp.company} • {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
                  </p>
                </div>

                {exp.description && (
                  <div className="text-sm text-gray-800 space-y-1 ml-4">
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
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-400 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Formação Acadêmica
          </h2>

          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                  {edu.course}
                </h3>
                <p className="text-sm text-gray-700">
                  {edu.institution} • {translateEducationLevel(edu.level)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {hasData(skills) && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Habilidades
          </h2>

          <p className="text-sm text-gray-800">
            {skills.map(skill => skill.name).join(' • ')}
          </p>
        </section>
      )}

      {/* LANGUAGES */}
      {hasData(languages) && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Idiomas
          </h2>

          <div className="space-y-1 text-sm text-gray-800">
            {languages.map((lang) => (
              <p key={lang.id}>
                <strong>{lang.name}:</strong> {translateLanguageLevel(lang.level)}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* COURSES */}
      {hasData(courses) && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Cursos e Certificações
          </h2>

          <div className="space-y-2 text-sm text-gray-800">
            {courses.map((course) => (
              <div key={course.id}>
                <p className="font-medium">{course.name}</p>
                {course.institution && (
                  <p className="text-xs text-gray-600">
                    {course.institution} {course.year && `• ${course.year}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {hasData(projects) && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Projetos
          </h2>

          <div className="space-y-2 text-sm text-gray-800">
            {projects.map((project) => (
              <div key={project.id}>
                <p className="font-bold">{project.name}</p>
                <p className="text-xs">{project.description}</p>
                {project.year && (
                  <p className="text-xs text-gray-600">{project.year}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACHIEVEMENTS */}
      {hasData(achievements) && (
        <section className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-400 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            Conquistas e Prêmios
          </h2>

          <div className="space-y-2 text-sm text-gray-800">
            {achievements.map((achievement) => (
              <div key={achievement.id}>
                <p className="font-bold">{achievement.title}</p>
                <p className="text-xs">{achievement.description}</p>
                {achievement.year && (
                  <p className="text-xs text-gray-600">{achievement.year}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WATERMARK */}
      <footer className="mt-6 pt-3 border-t border-gray-300">
        <p className="text-xs text-center text-gray-500">
          Criado em <strong>CVGrátis.com</strong> - Currículo Profissional Online
        </p>
      </footer>
    </div>
  );
};
