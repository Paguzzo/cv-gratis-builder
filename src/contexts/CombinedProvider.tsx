import React from 'react';
import { BaseProvider } from './BaseContext';
import { PersonalInfoProvider } from './PersonalInfoContext';
import { CurriculumProvider } from './CurriculumContext';
import { EducationProvider } from './EducationContext';
import { ExperienceProvider } from './ExperienceContext';
import { SkillsProvider } from './SkillsContext';
import { ExtrasProvider } from './ExtrasContext';
import { TemplateProvider } from './TemplateContext';

interface CombinedProviderProps {
  children: React.ReactNode;
}

export function CombinedProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseProvider>
      <TemplateProvider>
        <CurriculumProvider>
          <PersonalInfoProvider>
            <EducationProvider>
              <ExperienceProvider>
                <SkillsProvider>
                  <ExtrasProvider>
                    {children}
                  </ExtrasProvider>
                </SkillsProvider>
              </ExperienceProvider>
            </EducationProvider>
          </PersonalInfoProvider>
        </CurriculumProvider>
      </TemplateProvider>
    </BaseProvider>
  );
} 