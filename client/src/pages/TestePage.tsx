import { CombinedProvider } from '@/contexts/CombinedProvider';

export default function TestePage() {
  console.log('🔥🔥🔥 NOVA PÁGINA DE TESTE FUNCIONANDO! 🔥🔥🔥');
  
  // Teste dos componentes problemáticos
  let personalInfoStatus = "🔍 Testando PersonalInfo...";
  let curriculumBuilderStatus = "🔍 Testando CurriculumBuilder...";
  let curriculumPreviewStatus = "🔍 Testando CurriculumPreview...";
  
  try {
    const PersonalInfoModule = require('@/components/resume-builder/steps/PersonalInfo');
    console.log('✅ PersonalInfo importado:', PersonalInfoModule);
    personalInfoStatus = "✅ PersonalInfo - OK";
  } catch (error) {
    console.error('❌ PersonalInfo ERRO:', error);
    personalInfoStatus = `❌ PersonalInfo ERRO: ${error.message}`;
  }
  
  try {
    const CurriculumBuilderModule = require('@/components/resume-builder/CurriculumBuilder');
    console.log('✅ CurriculumBuilder importado:', CurriculumBuilderModule);
    curriculumBuilderStatus = "✅ CurriculumBuilder - OK";
  } catch (error) {
    console.error('🚨 CurriculumBuilder ERRO (PROBLEMA PRINCIPAL!):', error);
    curriculumBuilderStatus = `🚨 CurriculumBuilder ERRO: ${error.message}`;
  }
  
  try {
    const CurriculumPreviewModule = require('@/components/resume-builder/CurriculumPreview');
    console.log('✅ CurriculumPreview importado:', CurriculumPreviewModule);
    curriculumPreviewStatus = "✅ CurriculumPreview - OK";
  } catch (error) {
    console.error('❌ CurriculumPreview ERRO:', error);
    curriculumPreviewStatus = `❌ CurriculumPreview ERRO: ${error.message}`;
  }
  
  return (
    <CombinedProvider>
      <div className="min-h-screen bg-green-500 p-8">
        <div className="bg-white border-4 border-red-500 rounded-lg p-8">
          <h1 className="text-6xl font-bold mb-8 text-red-600 text-center">
            🚀 PÁGINA DE TESTE NOVA!
          </h1>
          
          <div className="bg-yellow-100 border-4 border-blue-500 rounded-lg p-6">
            <h2 className="text-4xl font-bold mb-4 text-blue-600">
              🔍 DIAGNÓSTICO DOS COMPONENTES:
            </h2>
            
            <div className="space-y-4 text-xl">
              <div className="p-4 bg-gray-100 border-2 border-black rounded">
                <strong>PersonalInfo:</strong> {personalInfoStatus}
              </div>
              
              <div className="p-4 bg-gray-100 border-2 border-black rounded">
                <strong>CurriculumBuilder:</strong> {curriculumBuilderStatus}
              </div>
              
              <div className="p-4 bg-gray-100 border-2 border-black rounded">
                <strong>CurriculumPreview:</strong> {curriculumPreviewStatus}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-red-100 border-2 border-red-500 rounded">
              <p className="font-bold text-red-800 text-xl">
                📝 INSTRUÇÕES: Abra o Console (F12) para ver os erros detalhados!
              </p>
              <p className="text-red-700 mt-2">
                O componente que mostrar ERRO é o que está causando a tela em branco!
              </p>
            </div>
          </div>
        </div>
      </div>
    </CombinedProvider>
  );
} 