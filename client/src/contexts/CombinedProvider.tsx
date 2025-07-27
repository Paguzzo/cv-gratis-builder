import React from 'react';
import { BaseProvider } from './BaseContext';
import { PersonalInfoProvider } from './PersonalInfoContext';
import { EducationProvider } from './EducationContext';
import { ExperienceProvider } from './ExperienceContext';
import { SkillsProvider } from './SkillsContext';
import { ExtrasProvider } from './ExtrasContext';
import { TemplateProvider } from './TemplateContext';

interface CombinedProviderProps {
  children: React.ReactNode;
}

export function CombinedProvider({ children }: CombinedProviderProps) {
  return (
    <BaseProvider>
      <TemplateProvider>
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
      </TemplateProvider>
    </BaseProvider>
  );
} 