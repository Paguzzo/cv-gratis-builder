import { CurriculumProvider } from '@/contexts/CurriculumContext';
import { CurriculumBuilder } from '@/components/resume-builder/CurriculumBuilder';
import { CurriculumPreview } from '@/components/resume-builder/CurriculumPreview';

export default function CreateResume() {
  return (
    <CurriculumProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="order-2 lg:order-1">
              <CurriculumBuilder />
            </div>
            
            {/* Preview Section */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-6">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Preview do seu currículo
                </h2>
                <CurriculumPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CurriculumProvider>
  );
}