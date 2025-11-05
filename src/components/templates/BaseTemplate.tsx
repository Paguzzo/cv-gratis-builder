/**
 * Base Template Component
 * Componente base reutilizável para todos os templates
 */

import React from 'react';
import { CurriculumData } from '@/types/curriculum';
import {
  formatDate,
  formatPhone,
  formatEmail,
  translateEducationLevel,
  translateLanguageLevel,
  hasData
} from './TemplateUtils';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages,
  BookOpen,
  Target,
  Car
} from 'lucide-react';

export interface BaseTemplateProps {
  data: CurriculumData;
  className?: string;
  watermark?: boolean;
  config?: TemplateConfig;
}

export interface TemplateConfig {
  fontSize?: 'small' | 'medium' | 'large';
  lineHeight?: number;
  fontFamily?: string;
  primaryColor?: string;
  accentColor?: string;
  showPhoto?: boolean;
  showIcons?: boolean;
}

/**
 * Ícone de contato com texto
 */
export const ContactItem: React.FC<{
  icon: React.ReactNode;
  text: string;
  href?: string;
  className?: string;
}> = ({ icon, text, href, className = '' }) => {
  const content = (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      <span className="text-sm">{text}</span>
    </span>
  );

  if (href) {
    return (
      <a href={href} className="hover:opacity-70 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
};

/**
 * Seção de header/cabeçalho
 */
export const TemplateHeader: React.FC<{
  data: CurriculumData;
  config?: TemplateConfig;
  className?: string;
}> = ({ data, config, className = '' }) => {
  const { personalInfo } = data;
  const showIcons = config?.showIcons !== false;

  return (
    <div className={`template-header ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {personalInfo.name}
      </h1>

      {personalInfo.position && (
        <p className="text-lg text-gray-600 mb-4">
          {personalInfo.position}
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        {personalInfo.email && (
          <ContactItem
            icon={showIcons ? <Mail /> : null}
            text={formatEmail(personalInfo.email)}
            href={`mailto:${personalInfo.email}`}
          />
        )}

        {personalInfo.phone && (
          <ContactItem
            icon={showIcons ? <Phone /> : null}
            text={formatPhone(personalInfo.phone)}
            href={`tel:${personalInfo.phone}`}
          />
        )}

        {personalInfo.address && (
          <ContactItem
            icon={showIcons ? <MapPin /> : null}
            text={personalInfo.address}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Seção de objetivo profissional
 */
export const ObjectiveSection: React.FC<{
  data: CurriculumData;
  className?: string;
}> = ({ data, className = '' }) => {
  if (!data.objective?.description) return null;

  return (
    <section className={`template-section ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Target className="w-5 h-5" />
        Objetivo Profissional
      </h2>
      <p className="text-sm text-gray-700 leading-relaxed">
        {data.objective.description}
      </p>
    </section>
  );
};

/**
 * Seção de experiência profissional
 */
export const ExperienceSection: React.FC<{
  data: CurriculumData;
  className?: string;
}> = ({ data, className = '' }) => {
  if (!hasData(data.experience)) return null;

  return (
    <section className={`template-section ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5" />
        Experiência Profissional
      </h2>

      <div className="space-y-4">
        {data.experience.map((exp) => (
          <div key={exp.id} className="experience-item">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <p className="text-sm text-gray-600">{exp.company}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
              </span>
            </div>

            {exp.description && (
              <div className="text-sm text-gray-700 space-y-1">
                {exp.description.split('\n').map((line, idx) => (
                  <p key={idx} className="leading-relaxed">{line}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * Seção de educação
 */
export const EducationSection: React.FC<{
  data: CurriculumData;
  className?: string;
}> = ({ data, className = '' }) => {
  if (!hasData(data.education)) return null;

  return (
    <section className={`template-section ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5" />
        Formação Acadêmica
      </h2>

      <div className="space-y-3">
        {data.education.map((edu) => (
          <div key={edu.id} className="education-item">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{edu.course}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
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
  );
};

/**
 * Seção de habilidades
 */
export const SkillsSection: React.FC<{
  data: CurriculumData;
  className?: string;
  showProgress?: boolean;
}> = ({ data, className = '', showProgress = false }) => {
  if (!hasData(data.skills)) return null;

  return (
    <section className={`template-section ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Code className="w-5 h-5" />
        Habilidades
      </h2>

      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill) => (
          <span
            key={skill.id}
            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </section>
  );
};

/**
 * Seção de idiomas
 */
export const LanguagesSection: React.FC<{
  data: CurriculumData;
  className?: string;
}> = ({ data, className = '' }) => {
  if (!hasData(data.languages)) return null;

  return (
    <section className={`template-section ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Languages className="w-5 h-5" />
        Idiomas
      </h2>

      <div className="space-y-2">
        {data.languages.map((lang) => (
          <div key={lang.id} className="flex justify-between items-center">
            <span className="text-sm text-gray-900">{lang.name}</span>
            <span className="text-xs text-gray-600">{translateLanguageLevel(lang.level)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * Seção de cursos
 */
export const CoursesSection: React.FC<{
  data: CurriculumData;
  className?: string;
}> = ({ data, className = '' }) => {
  if (!hasData(data.courses)) return null;

  return (
    <section className={`template-section ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Cursos e Certificações
      </h2>

      <div className="space-y-2">
        {data.courses.map((course) => (
          <div key={course.id} className="text-sm">
            <p className="font-medium text-gray-900">{course.name}</p>
            {course.institution && (
              <p className="text-xs text-gray-600">{course.institution}</p>
            )}
            {course.year && (
              <span className="text-xs text-gray-500">{course.year}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * Seção de projetos
 */
export const ProjectsSection: React.FC<{
  data: CurriculumData;
  className?: string;
}> = ({ data, className = '' }) => {
  if (!hasData(data.projects)) return null;

  return (
    <section className={`template-section ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Code className="w-5 h-5" />
        Projetos
      </h2>

      <div className="space-y-3">
        {data.projects.map((project) => (
          <div key={project.id}>
            <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
            <p className="text-xs text-gray-700">{project.description}</p>
            {project.year && (
              <span className="text-xs text-gray-500">{project.year}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * Seção de conquistas
 */
export const AchievementsSection: React.FC<{
  data: CurriculumData;
  className?: string;
}> = ({ data, className = '' }) => {
  if (!hasData(data.achievements)) return null;

  return (
    <section className={`template-section ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Award className="w-5 h-5" />
        Conquistas
      </h2>

      <div className="space-y-3">
        {data.achievements.map((achievement) => (
          <div key={achievement.id}>
            <h3 className="font-bold text-sm text-gray-900">{achievement.title}</h3>
            <p className="text-xs text-gray-700">{achievement.description}</p>
            {achievement.year && (
              <span className="text-xs text-gray-500">{achievement.year}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * Watermark CVGrátis
 */
export const Watermark: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`watermark ${className}`}>
      <p className="text-xs text-gray-400 text-center">
        Criado em <strong>CVGrátis.com</strong> - Currículo Profissional Online
      </p>
    </div>
  );
};
