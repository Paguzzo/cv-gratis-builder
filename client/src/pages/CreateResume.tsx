import { CombinedProvider } from '@/contexts/CombinedProvider';
import { CurriculumBuilder } from '@/components/resume-builder/CurriculumBuilder';

export default function CreateResume() {
  return (
    <CombinedProvider>
      <div className="min-h-screen bg-gray-50">
        <CurriculumBuilder />
      </div>
    </CombinedProvider>
  );
}