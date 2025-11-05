# 🚀 PLANO DE AÇÃO - INTERNACIONALIZAÇÃO ESPANHOL LATAM

**Versão Base:** v1.0-pt-BR (commit: b87706f)
**Data Início:** 05/11/2025
**Duração Estimada:** 6-8 semanas
**Status:** 🟡 AGUARDANDO APROVAÇÃO

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Fase 1: Foundation](#fase-1-foundation-semana-1-2)
4. [Fase 2: Core Builder](#fase-2-core-builder-semana-3-4)
5. [Fase 3: AI & Templates](#fase-3-ai--templates-semana-5-6)
6. [Fase 4: Content & Legal](#fase-4-content--legal-semana-7-8)
5. [Fase 5: Testing & Launch](#fase-5-testing--launch-semana-9-10)
7. [Checklist Final](#checklist-final)
8. [Rollback Plan](#plano-de-rollback)

---

## 🎯 VISÃO GERAL

### Objetivo
Adicionar suporte completo a **Espanhol LATAM (es-419)** mantendo 100% da funcionalidade em português.

### Princípios
- ✅ **NUNCA remover português** - apenas adicionar espanhol
- ✅ **Não alterar funcionalidades** - apenas traduzir
- ✅ **Preservar dados de usuários** - backward compatibility
- ✅ **Qualidade sobre velocidade** - especialmente em prompts IA

### Entregáveis
- ✅ Seletor de idioma (globo) na homepage
- ✅ Todo texto traduzido para espanhol
- ✅ Prompts IA otimizados para espanhol
- ✅ Documentos legais profissionalmente traduzidos
- ✅ Sistema funcionando perfeitamente em ambos idiomas

---

## 🔧 PRÉ-REQUISITOS

### Ferramentas Necessárias
```bash
# Node.js e npm já instalados
node --version  # deve ser >= 18
npm --version   # deve ser >= 9
```

### Conhecimentos Necessários
- ✅ React + TypeScript
- ✅ React Context API
- ✅ i18next (aprenderemos juntos)
- ⚠️ Espanhol LATAM (contratar profissional para prompts IA)

### Recursos Externos a Contratar
- [ ] **Copywriter Espanhol LATAM** - para prompts IA
  - Orçamento: $500-1000
  - Prazo: 1-2 semanas
  - Entregas: 3 prompts principais + iterações

- [ ] **Tradutor Jurídico** - para documentos legais
  - Orçamento: $900 (3 docs × $300)
  - Prazo: 1 semana
  - Entregas: Privacy Policy, Terms of Service, Cookie Policy

- [ ] **Beta Testers Nativos** (3-5 pessoas)
  - Orçamento: $0 (voluntários) ou $200 (incentivos)
  - Prazo: 1 semana
  - Entregas: Feedback de usabilidade

---

## 📦 FASE 1: FOUNDATION (Semana 1-2)

### Objetivo
Criar infraestrutura i18n e migrar componentes piloto

### Estimativa
- ⏰ 20-30 horas
- 📅 10-15 dias

---

### STEP 1.1: Setup Git Branch (30 min)

```bash
# Garantir que estamos na v1.0
cd cv-gratis-builder
git status

# Criar branch de trabalho
git checkout -b feature/i18n-spanish-latam
git push -u origin feature/i18n-spanish-latam
```

**Checklist:**
- [ ] Branch criado
- [ ] Push para remote
- [ ] Proteção de branch configurada (se aplicável)

---

### STEP 1.2: Instalar Dependências (15 min)

```bash
# Instalar bibliotecas i18n
npm install react-i18next i18next i18next-browser-languagedetector

# Verificar instalação
npm list react-i18next
```

**Versões esperadas:**
- `react-i18next`: ^13.x
- `i18next`: ^23.x
- `i18next-browser-languagedetector`: ^7.x

**Checklist:**
- [ ] Dependências instaladas
- [ ] package.json atualizado
- [ ] package-lock.json commitado
- [ ] `npm run dev` ainda funciona

---

### STEP 1.3: Criar Estrutura de Arquivos (1 hora)

```bash
# Criar diretórios
mkdir -p src/locales/pt-BR
mkdir -p src/locales/es-419
mkdir -p src/i18n
```

**Arquivos a criar:**

#### 1. `src/i18n/config.ts`
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import ptBRCommon from '../locales/pt-BR/common.json';
import ptBRHelp from '../locales/pt-BR/help.json';
import ptBRValidation from '../locales/pt-BR/validation.json';

import es419Common from '../locales/es-419/common.json';
import es419Help from '../locales/es-419/help.json';
import es419Validation from '../locales/es-419/validation.json';

const resources = {
  'pt-BR': {
    common: ptBRCommon,
    help: ptBRHelp,
    validation: ptBRValidation,
  },
  'es-419': {
    common: es419Common,
    help: es419Help,
    validation: es419Validation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'cvgratis-language',
    },
  });

export default i18n;
```

#### 2. `src/locales/pt-BR/common.json` (início)
```json
{
  "app": {
    "title": "CV Grátis Builder",
    "tagline": "Crie seu currículo profissional gratuitamente"
  },
  "navigation": {
    "home": "Início",
    "create": "Criar Currículo",
    "templates": "Templates",
    "admin": "Admin"
  },
  "buttons": {
    "previous": "Anterior",
    "next": "Próximo",
    "finish": "Finalizar Currículo",
    "save": "Salvar",
    "cancel": "Cancelar",
    "download": "Baixar",
    "print": "Imprimir"
  },
  "steps": {
    "personalInfo": "Dados Pessoais",
    "objective": "Objetivo",
    "experience": "Experiência",
    "education": "Formação",
    "skills": "Habilidades",
    "languages": "Idiomas",
    "courses": "Cursos",
    "projects": "Projetos"
  }
}
```

#### 3. `src/locales/es-419/common.json` (início)
```json
{
  "app": {
    "title": "CV Gratis Builder",
    "tagline": "Crea tu currículum profesional gratuitamente"
  },
  "navigation": {
    "home": "Inicio",
    "create": "Crear Currículum",
    "templates": "Plantillas",
    "admin": "Admin"
  },
  "buttons": {
    "previous": "Anterior",
    "next": "Siguiente",
    "finish": "Finalizar Currículum",
    "save": "Guardar",
    "cancel": "Cancelar",
    "download": "Descargar",
    "print": "Imprimir"
  },
  "steps": {
    "personalInfo": "Datos Personales",
    "objective": "Objetivo",
    "experience": "Experiencia",
    "education": "Formación",
    "skills": "Habilidades",
    "languages": "Idiomas",
    "courses": "Cursos",
    "projects": "Proyectos"
  }
}
```

**Checklist:**
- [ ] `src/i18n/config.ts` criado
- [ ] Arquivos JSON criados para pt-BR
- [ ] Arquivos JSON criados para es-419
- [ ] TypeScript compila sem erros

---

### STEP 1.4: Inicializar i18n na App (30 min)

#### Modificar `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n/config'; // ← ADICIONAR

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Checklist:**
- [ ] Import adicionado
- [ ] App ainda funciona
- [ ] Console sem erros i18n

---

### STEP 1.5: Criar Language Switcher Component (2 horas)

#### `src/components/LanguageSwitcher.tsx`

```typescript
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'es-419', name: 'Español (LATAM)', flag: '🌎' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find(
    (lang) => lang.code === i18n.language
  ) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('cvgratis-language', langCode);

    // Update HTML lang attribute
    document.documentElement.lang = langCode;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={i18n.language === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### Adicionar no Header (`src/pages/Index.tsx` ou componente de navegação)

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// No JSX do header:
<nav className="flex items-center gap-4">
  {/* outros itens de navegação */}
  <LanguageSwitcher />
</nav>
```

**Checklist:**
- [ ] Componente criado
- [ ] Dropdown funciona
- [ ] Idioma persiste no localStorage
- [ ] Ícone de globo visível

---

### STEP 1.6: Migrar Componente Piloto (3-4 horas)

**Escolher:** `src/components/resume-builder/StepNavigation.tsx`

**ANTES:**
```typescript
<Button onClick={handlePrevious}>
  Anterior
</Button>
<span>Passo {currentStep + 1} de {totalSteps}</span>
<Button onClick={handleNext}>
  Próximo
</Button>
```

**DEPOIS:**
```typescript
import { useTranslation } from 'react-i18next';

function StepNavigation() {
  const { t } = useTranslation('common');

  return (
    <>
      <Button onClick={handlePrevious}>
        {t('buttons.previous')}
      </Button>
      <span>
        {t('navigation.stepProgress', {
          current: currentStep + 1,
          total: totalSteps
        })}
      </span>
      <Button onClick={handleNext}>
        {t('buttons.next')}
      </Button>
    </>
  );
}
```

**Adicionar em `common.json`:**
```json
{
  "navigation": {
    "stepProgress": "Passo {{current}} de {{total}}"  // pt-BR
    // "Paso {{current}} de {{total}}"                // es-419
  }
}
```

**Checklist:**
- [ ] Hardcoded text removido
- [ ] t() function usada
- [ ] Interpolação funciona
- [ ] Troca de idioma atualiza em tempo real

---

### STEP 1.7: Testar Foundation (1 hora)

**Testes manuais:**
1. [ ] Trocar idioma no dropdown
2. [ ] Verificar localStorage: `cvgratis-language`
3. [ ] Recarregar página - idioma persiste
4. [ ] Testar com navegador em espanhol
5. [ ] Verificar console - sem errors

**Testes técnicos:**
```bash
# Build deve funcionar
npm run build

# Dev deve funcionar
npm run dev
```

---

### ✅ MILESTONE 1: Foundation Complete

**Entregáveis:**
- ✅ react-i18next instalado e configurado
- ✅ Estrutura de arquivos de tradução
- ✅ Language switcher funcional
- ✅ 1 componente piloto migrado
- ✅ Sistema funcionando em PT e ES

**Commit & Tag:**
```bash
git add .
git commit -m "feat(i18n): Foundation - Language switcher + pilot component"
git tag phase-1-foundation
git push origin feature/i18n-spanish-latam --tags
```

---

## 📝 FASE 2: CORE BUILDER (Semana 3-4)

### Objetivo
Traduzir completamente o fluxo de criação de currículo

### Estimativa
- ⏰ 40-50 horas
- 📅 10-15 dias

---

### STEP 2.1: Migrar 8 Steps do Builder (16-20 horas)

**Ordem de migração:**

#### 1. PersonalInfo.tsx (3h)
- Labels de formulário
- Placeholders
- Validações
- Help text

#### 2. ProfessionalObjective.tsx (2h)
- Labels
- IA instructions (preliminar)

#### 3. Experience.tsx (4h)
- Formulário complexo
- IA descriptions
- Date formatting

#### 4. Education.tsx (3h)
- Education levels dropdown
- Date pickers

#### 5. Skills.tsx (2h)
- Skill categories

#### 6. Languages.tsx (2h)
- Language levels

#### 7. Courses.tsx (2h)
- Course form

#### 8. ProjectsAchievements.tsx (2h)
- Projects form

**Template para cada step:**

```typescript
// ANTES
const label = "Nome Completo";
const placeholder = "Digite seu nome completo";
const error = "Campo obrigatório";

// DEPOIS
const { t } = useTranslation(['common', 'validation']);

const label = t('personalInfo.fullName');
const placeholder = t('personalInfo.fullNamePlaceholder');
const error = t('validation.required');
```

**Arquivos de tradução necessários:**

#### `src/locales/pt-BR/forms.json`
```json
{
  "personalInfo": {
    "fullName": "Nome Completo",
    "fullNamePlaceholder": "Digite seu nome completo",
    "email": "Email",
    "phone": "Telefone",
    "whatsapp": "WhatsApp",
    "address": "Endereço",
    "position": "Cargo/Posição Desejada",
    "driverLicense": "Carteira de Motorista (CNH)"
  },
  "experience": {
    "company": "Empresa",
    "position": "Cargo",
    "startDate": "Data de Início",
    "endDate": "Data de Término",
    "currentJob": "Trabalho Atual",
    "description": "Descrição das Atividades",
    "useAi": "Melhorar com IA"
  }
  // ... continuar para todos os campos
}
```

#### `src/locales/es-419/forms.json`
```json
{
  "personalInfo": {
    "fullName": "Nombre Completo",
    "fullNamePlaceholder": "Ingrese su nombre completo",
    "email": "Correo Electrónico",
    "phone": "Teléfono",
    "whatsapp": "WhatsApp",
    "address": "Dirección",
    "position": "Cargo/Posición Deseada",
    "driverLicense": "Licencia de Conducir"
  }
  // ... continuar
}
```

**Checklist por step:**
- [ ] Todos os labels traduzidos
- [ ] Placeholders traduzidos
- [ ] Help text traduzido
- [ ] Validações traduzidas
- [ ] Testes manuais em PT e ES

---

### STEP 2.2: Traduzir Help Tips System (8-10 horas)

**Arquivo fonte:** `src/data/help-tips.ts` (192 linhas)

**Estratégia:** Criar versões i18n-aware

#### `src/locales/pt-BR/help.json`
```json
{
  "personalInfo": {
    "title": "Informações Pessoais",
    "mainTip": "Diga aos futuros empregadores qual a melhor maneira de entrar em contato...",
    "tips": [
      "Use um email profissional (ex: nome.sobrenome@gmail.com)",
      "Adicione WhatsApp se estiver confortável em receber mensagens...",
      "CNH: Inclua apenas se for relevante para a vaga desejada"
    ]
  },
  "objective": {
    "title": "Objetivo Profissional",
    "mainTip": "Descreva em 2-3 frases o que você busca profissionalmente...",
    "tips": [
      "Seja específico sobre o cargo desejado",
      "Mencione suas principais qualificações",
      "Use a IA para gerar um objetivo impactante"
    ]
  }
  // ... continuar para todas as 8 seções
}
```

#### `src/locales/es-419/help.json`
```json
{
  "personalInfo": {
    "title": "Información Personal",
    "mainTip": "Indique a los futuros empleadores la mejor manera de contactarlo...",
    "tips": [
      "Use un correo profesional (ej: nombre.apellido@gmail.com)",
      "Agregue WhatsApp si se siente cómodo recibiendo mensajes...",
      "Licencia: Incluya solo si es relevante para el puesto deseado"
    ]
  }
  // ... continuar
}
```

#### Atualizar `src/data/help-tips.ts`
```typescript
import { useTranslation } from 'react-i18next';

export function useHelpTips() {
  const { t } = useTranslation('help');

  return {
    'personal-info': {
      title: t('personalInfo.title'),
      mainTip: t('personalInfo.mainTip'),
      tips: t('personalInfo.tips', { returnObjects: true }) as string[],
    },
    // ... etc
  };
}
```

**Checklist:**
- [ ] Todas as 8 seções de help traduzidas
- [ ] Hook `useHelpTips()` criado
- [ ] Integrado nos componentes
- [ ] Testes em ambos idiomas

---

### STEP 2.3: Traduzir Validações Zod (4-6 horas)

**Estratégia:** Criar schemas dinâmicos com i18n

#### `src/locales/pt-BR/validation.json`
```json
{
  "required": "Campo obrigatório",
  "invalidEmail": "Email inválido",
  "minLength": "Mínimo de {{count}} caracteres",
  "maxLength": "Máximo de {{count}} caracteres",
  "invalidPhone": "Telefone inválido",
  "invalidUrl": "URL inválida",
  "selectOption": "Selecione uma opção",
  "dateInFuture": "Data não pode ser no futuro",
  "startAfterEnd": "Data de início deve ser antes da data de término"
}
```

#### `src/schemas/curriculumSchema.ts` (atualizar)
```typescript
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

export function useCurriculumSchema() {
  const { t } = useTranslation('validation');

  return z.object({
    fullName: z
      .string()
      .min(1, t('required'))
      .min(3, t('minLength', { count: 3 })),
    email: z
      .string()
      .min(1, t('required'))
      .email(t('invalidEmail')),
    // ... continuar
  });
}
```

**Checklist:**
- [ ] Todas as mensagens de erro traduzidas
- [ ] Schemas usando função hook
- [ ] Testes de validação em PT e ES

---

### STEP 2.4: Traduzir ProgressIndicator & Navigation (2 horas)

**Arquivos:**
- `src/components/resume-builder/ProgressIndicator.tsx`
- `src/components/resume-builder/StepNavigation.tsx`

**Elementos:**
- Step titles
- Progress messages
- Button labels
- Completion percentage

**Checklist:**
- [ ] Progress bar traduzida
- [ ] Step titles traduzidos
- [ ] Navegação traduzida

---

### STEP 2.5: Testar Fluxo Completo (4 horas)

**Cenário de teste:**
1. [ ] Criar currículo do zero em português
2. [ ] Trocar para espanhol no meio do processo
3. [ ] Continuar em espanhol
4. [ ] Finalizar currículo
5. [ ] Verificar dados salvos corretamente
6. [ ] Repetir fluxo completo só em espanhol

**Bugs esperados:**
- Date formatting issues
- Validation messages não atualizando
- Help text not loading

**Resolver todos os bugs antes de continuar**

---

### ✅ MILESTONE 2: Core Builder Complete

**Entregáveis:**
- ✅ 8 steps do builder 100% traduzidos
- ✅ Sistema de help traduzido
- ✅ Validações traduzidas
- ✅ Navegação e progresso traduzidos
- ✅ Fluxo end-to-end funcional em ambos idiomas

**Commit & Tag:**
```bash
git add .
git commit -m "feat(i18n): Core Builder - All steps + help system + validation"
git tag phase-2-core-builder
git push origin feature/i18n-spanish-latam --tags
```

---

## 🤖 FASE 3: AI & TEMPLATES (Semana 5-6)

### Objetivo
Traduzir e otimizar prompts de IA + templates de currículo

### Estimativa
- ⏰ 40-50 horas
- 📅 10-15 dias

### ⚠️ ATENÇÃO: Esta fase requer profissional especializado

---

### STEP 3.1: Contratar Copywriter Espanhol LATAM (Semana 5)

**Perfil necessário:**
- Falante nativo de espanhol LATAM
- Experiência com RH/Recursos Humanos
- Copywriting profissional
- Compreensão de IA/prompts

**Entregáveis:**
1. Tradução de 3 prompts principais:
   - grokExperienceService.ts
   - grokObjectiveService.ts
   - grokCoverLetterService.ts

2. Iterações baseadas em testes de qualidade

**Budget:** $500-1000
**Prazo:** 1-2 semanas

**Checklist:**
- [ ] Copywriter contratado
- [ ] Brief enviado com contexto
- [ ] Acesso aos prompts atuais em PT
- [ ] Exemplos de saídas esperadas
- [ ] Timeline acordado

---

### STEP 3.2: Preparar Prompts para Tradução (4 horas)

**Extrair prompts para arquivos JSON**

#### `src/locales/pt-BR/ai.json`
```json
{
  "experience": {
    "systemPrompt": "Você é um especialista em transformar atividades profissionais...",
    "rules": [
      "NÃO invente responsabilidades que não foram mencionadas",
      "Use verbos de ação fortes no início: Desenvolvi, Gerenciei...",
      "Seja específico com números e resultados quando fornecidos"
    ],
    "examples": [
      {
        "input": "Trabalho com vendas e atendo clientes",
        "output": "• Atendimento personalizado a clientes..."
      }
    ],
    "fallbackDescriptions": [
      "Atuação em atividades relacionadas ao cargo de {{position}}",
      "Desenvolvimento de tarefas na área de {{position}}"
    ]
  }
}
```

#### Atualizar `src/services/grokExperienceService.ts`
```typescript
import { useTranslation } from 'react-i18next';

export function useGrokExperienceService() {
  const { t } = useTranslation('ai');

  const systemPrompt = t('experience.systemPrompt');
  const rules = t('experience.rules', { returnObjects: true });
  // ... etc
}
```

**Checklist:**
- [ ] Prompts extraídos para JSON
- [ ] Serviços usando i18n
- [ ] Testes - saída mantém qualidade

---

### STEP 3.3: Implementar Tradução dos Prompts (Semana 6)

**Receber do copywriter:** `es-419/ai.json`

#### Processo de validação:
1. **Implementar tradução**
2. **Testar com casos reais**
   ```
   Input PT: "Trabalho com vendas"
   Output PT: "• Atendimento personalizado..."

   Input ES: "Trabajo con ventas"
   Output ES: "• Atención personalizada..." ← DEVE SER DE QUALIDADE
   ```

3. **Iterar se necessário**
   - Se qualidade baixa → Feedback ao copywriter
   - Ajustar prompts
   - Re-testar

4. **Aprovar quando qualidade = português**

**Casos de teste (mínimo 20):**
- Descrições simples
- Descrições complexas
- Com números/métricas
- Sem detalhes (teste fallback)
- Diferentes indústrias

**Checklist:**
- [ ] Tradução de prompts implementada
- [ ] 20+ testes realizados
- [ ] Qualidade aprovada
- [ ] Fallbacks traduzidos
- [ ] Error handling traduzido

---

### STEP 3.4: Traduzir Templates de Currículo (8-10 horas)

**15 templates a traduzir:**
- FreeModern, FreeClassic
- PremiumExecutive, PremiumTech, PremiumCreative
- PremiumAcademic, PremiumPortfolio, PremiumInfographic
- Classic, Modern, Formal, Professional
- Minimal, Pastel, Creative, Executive, Tech

**Elementos a traduzir:**
- Section headers
- Labels de data
- "Presente" (current job)
- Tooltips

#### Estratégia: Props com tradução

**ANTES:**
```typescript
<h2 className="text-2xl font-bold">
  Experiência Profissional
</h2>
```

**DEPOIS:**
```typescript
function ModernTemplate({ data }: Props) {
  const { t } = useTranslation('templates');

  return (
    <h2 className="text-2xl font-bold">
      {t('sections.experience')}
    </h2>
  );
}
```

#### `src/locales/pt-BR/templates.json`
```json
{
  "sections": {
    "experience": "Experiência Profissional",
    "education": "Formação Acadêmica",
    "skills": "Habilidades",
    "languages": "Idiomas",
    "courses": "Cursos e Certificações",
    "projects": "Projetos e Conquistas",
    "objective": "Objetivo Profissional"
  },
  "labels": {
    "present": "Presente",
    "to": "até"
  }
}
```

**Checklist por template:**
- [ ] Todos os headers traduzidos
- [ ] Labels de data traduzidos
- [ ] Preview em PT e ES funcionam
- [ ] PDF export mantém tradução

---

### STEP 3.5: Traduzir Email Templates (4 horas)

**10+ serviços de email a atualizar**

#### `src/locales/pt-BR/email.json`
```json
{
  "subject": {
    "curriculum": "Currículo - {{name}}",
    "bonusWelcome": "Bem-vindo ao CV Grátis Builder"
  },
  "defaultMessage": "Olá!\n\nSegue em anexo meu currículo atualizado para sua análise.\n\nFico à disposição para mais informações.\n\nAtenciosamente,\n{{name}}",
  "errors": {
    "sendFailed": "Falha ao enviar email",
    "invalidRecipient": "Email destinatário inválido"
  },
  "success": {
    "sent": "Email enviado com sucesso!"
  }
}
```

#### Atualizar `src/services/emailService.ts`
```typescript
import { useTranslation } from 'react-i18next';

export function useEmailService() {
  const { t } = useTranslation('email');

  const sendEmail = async (to, name) => {
    const subject = t('subject.curriculum', { name });
    const message = t('defaultMessage', { name });
    // ... enviar
  };
}
```

**Checklist:**
- [ ] Subject lines traduzidos
- [ ] Message bodies traduzidos
- [ ] Error messages traduzidos
- [ ] Success messages traduzidos
- [ ] Teste de envio em ES

---

### STEP 3.6: Traduzir Curriculum Checker (4 horas)

**Arquivo:** `src/services/curriculumChecker.ts`

**40+ mensagens de validação:**

#### `src/locales/pt-BR/checker.json`
```json
{
  "errors": {
    "personalInfoIncomplete": {
      "message": "Informações pessoais incompletas",
      "suggestion": "Preencha pelo menos nome, email e telefone"
    },
    "noExperience": {
      "message": "Nenhuma experiência profissional adicionada",
      "suggestion": "Adicione pelo menos uma experiência profissional"
    },
    "shortDescription": {
      "message": "Descrição muito curta",
      "suggestion": "Expanda a descrição com mais detalhes"
    }
  },
  "warnings": {
    "noPhoto": {
      "message": "Foto não adicionada",
      "suggestion": "Adicionar foto profissional pode aumentar suas chances"
    }
  },
  "suggestions": {
    "useAi": "Use a IA para melhorar suas descrições",
    "addNumbers": "Inclua números e resultados quando possível"
  }
}
```

**Checklist:**
- [ ] Todos os errors traduzidos
- [ ] Todos os warnings traduzidos
- [ ] Suggestions traduzidos
- [ ] Testes de validação em ES

---

### ✅ MILESTONE 3: AI & Templates Complete

**Entregáveis:**
- ✅ 3 prompts de IA traduzidos e otimizados
- ✅ Qualidade de saída IA = português
- ✅ 15 templates traduzidos
- ✅ Email templates traduzidos
- ✅ Curriculum checker traduzido

**Commit & Tag:**
```bash
git add .
git commit -m "feat(i18n): AI prompts + Templates + Email + Checker"
git tag phase-3-ai-templates
git push origin feature/i18n-spanish-latam --tags
```

---

## 📄 FASE 4: CONTENT & LEGAL (Semana 7-8)

### Objetivo
Traduzir conteúdo de marketing e documentos legais

### Estimativa
- ⏰ 30-40 horas
- 📅 10-15 dias

---

### STEP 4.1: Contratar Tradutor Jurídico (Semana 7)

**Perfil necessário:**
- Tradutor jurídico certificado
- Experiência com documentos legais tech
- Conhecimento de GDPR e leis LATAM

**Entregáveis:**
1. Privacy Policy traduzida
2. Terms of Service traduzidos
3. Cookie Policy traduzida

**Budget:** $900 ($300 por documento)
**Prazo:** 1 semana

**Checklist:**
- [ ] Tradutor contratado
- [ ] Documentos enviados
- [ ] Timeline acordado
- [ ] Formato de entrega definido

---

### STEP 4.2: Traduzir Landing Page (10-12 horas)

**Arquivo:** `src/pages/Index.tsx` (630 linhas)

**Elementos:**
- Hero section
- Features section
- Templates showcase
- Testimonials
- Pricing
- FAQ
- CTAs

#### `src/locales/pt-BR/marketing.json`
```json
{
  "hero": {
    "title": "Crie Seu Currículo Profissional Gratuitamente",
    "subtitle": "Templates premium, IA integrada, e exportação em PDF",
    "cta": "Criar Meu Currículo Grátis"
  },
  "features": {
    "title": "Por Que Escolher CV Grátis Builder?",
    "ai": {
      "title": "IA Integrada",
      "description": "Melhore suas descrições profissionais com inteligência artificial"
    },
    "templates": {
      "title": "Templates Premium",
      "description": "7 templates profissionais + 1 gratuito"
    },
    "export": {
      "title": "Exportação Fácil",
      "description": "PDF de alta qualidade, pronto para enviar"
    }
  },
  "testimonials": {
    "title": "O Que Nossos Usuários Dizem",
    "items": [
      {
        "text": "Consegui emprego em 2 semanas usando este builder!",
        "author": "Maria Silva"
      }
    ]
  },
  "cta": {
    "final": "Comece Agora - É 100% Grátis",
    "noCreditCard": "Sem cartão de crédito necessário"
  }
}
```

**⚠️ Importante:** Contratar copywriter para esta seção também (pode ser o mesmo da IA).

**Motivo:** Marketing copy precisa ser persuasivo, não literal.

**Checklist:**
- [ ] Hero traduzido
- [ ] Features traduzidas
- [ ] Testimonials traduzidos
- [ ] FAQ traduzido
- [ ] CTAs traduzidos
- [ ] Review de copywriter nativo

---

### STEP 4.3: Implementar Documentos Legais (4 horas)

**Receber do tradutor jurídico:**
- Privacy Policy ES
- Terms of Service ES
- Cookie Policy ES

#### Estratégia: Componentes separados por idioma

#### `src/pages/PrivacyPolicy.tsx`
```typescript
import { useTranslation } from 'react-i18next';
import PrivacyPolicyPT from './legal/PrivacyPolicy.pt-BR';
import PrivacyPolicyES from './legal/PrivacyPolicy.es-419';

export function PrivacyPolicy() {
  const { i18n } = useTranslation();

  const Component = i18n.language === 'es-419'
    ? PrivacyPolicyES
    : PrivacyPolicyPT;

  return <Component />;
}
```

**Criar:**
- `src/pages/legal/PrivacyPolicy.pt-BR.tsx`
- `src/pages/legal/PrivacyPolicy.es-419.tsx`
- `src/pages/legal/TermsOfService.pt-BR.tsx`
- `src/pages/legal/TermsOfService.es-419.tsx`
- `src/pages/legal/CookiePolicy.pt-BR.tsx`
- `src/pages/legal/CookiePolicy.es-419.tsx`

**Checklist:**
- [ ] Estrutura de arquivos criada
- [ ] Documentos PT movidos
- [ ] Documentos ES implementados
- [ ] Switching funciona
- [ ] Links internos funcionam

---

### STEP 4.4: Traduzir SEO & Meta Tags (2 horas)

#### `src/locales/pt-BR/seo.json`
```json
{
  "home": {
    "title": "CV Grátis Builder - Criar Currículo Online Profissional | Templates Premium",
    "description": "Crie seu currículo profissional gratuitamente com templates premium e IA. Exportação em PDF, fácil e rápido. Comece agora!",
    "keywords": "currículo grátis, criar currículo online, curriculum vitae, cv profissional, templates currículo"
  },
  "createResume": {
    "title": "Criar Currículo | CV Grátis Builder",
    "description": "Monte seu currículo profissional em minutos com nosso builder intuitivo"
  }
}
```

#### Atualizar `src/components/SEOHead.tsx`
```typescript
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

export function SEOHead({ page = 'home' }: Props) {
  const { t, i18n } = useTranslation('seo');

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{t(`${page}.title`)}</title>
      <meta name="description" content={t(`${page}.description`)} />
      <meta name="keywords" content={t(`${page}.keywords`)} />
      <meta property="og:locale" content={i18n.language} />
    </Helmet>
  );
}
```

**Checklist:**
- [ ] Títulos traduzidos
- [ ] Descriptions traduzidas
- [ ] Keywords pesquisadas (ES)
- [ ] og:locale atualizado
- [ ] Testes de preview (Google/Facebook)

---

### STEP 4.5: Traduzir Admin Panel (6 horas)

**Arquivos:**
- `src/pages/AdminLogin.tsx`
- `src/pages/AdminPanel.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/components/admin/EbookManager.tsx`

**Elementos:**
- Login form
- Dashboard tabs
- Statistics labels
- User management
- Ebook manager

#### `src/locales/pt-BR/admin.json`
```json
{
  "login": {
    "title": "Acesso Administrativo",
    "username": "Usuário",
    "password": "Senha",
    "submit": "Entrar",
    "errors": {
      "invalidCredentials": "Usuário ou senha inválidos"
    }
  },
  "dashboard": {
    "tabs": {
      "overview": "Visão Geral",
      "users": "Usuários",
      "bonus": "Bônus (Leads)",
      "ebook": "Ebook",
      "analytics": "Analytics",
      "templates": "Templates Premium"
    },
    "stats": {
      "totalUsers": "Total de Usuários",
      "downloads": "Downloads",
      "emails": "Emails Enviados"
    }
  }
}
```

**Checklist:**
- [ ] Login traduzido
- [ ] Dashboard traduzido
- [ ] Tabs traduzidas
- [ ] Stats traduzidas
- [ ] Teste de acesso em ES

---

### STEP 4.6: Traduzir Componentes Restantes (6-8 horas)

**Componentes menores:**
- Error boundaries
- Loading states
- Toast notifications
- Modals/Dialogs
- Cookie consent banner

**Fazer busca global:**
```bash
# Encontrar hardcoded strings restantes
grep -r "\"[A-Z].*\"" src/ --include="*.tsx" --include="*.ts" | grep -v "locales/" | grep -v "node_modules/"
```

**Checklist:**
- [ ] Todos os hardcoded texts identificados
- [ ] Tudo migrado para i18n
- [ ] Busca global retorna zero results
- [ ] Build completo sem warnings

---

### ✅ MILESTONE 4: Content & Legal Complete

**Entregáveis:**
- ✅ Landing page 100% traduzida
- ✅ Documentos legais profissionalmente traduzidos
- ✅ SEO otimizado para espanhol
- ✅ Admin panel traduzido
- ✅ Zero hardcoded text restante

**Commit & Tag:**
```bash
git add .
git commit -m "feat(i18n): Content + Legal docs + Admin + SEO"
git tag phase-4-content-legal
git push origin feature/i18n-spanish-latam --tags
```

---

## 🧪 FASE 5: TESTING & LAUNCH (Semana 9-10)

### Objetivo
Testes completos, correções e preparação para launch

### Estimativa
- ⏰ 40-50 horas
- 📅 10-15 dias

---

### STEP 5.1: QA Manual Completo (12 horas)

#### Checklist de Testes - Português

**Fluxo Completo:**
- [ ] Homepage carrega corretamente
- [ ] Trocar para português no switcher
- [ ] Criar currículo do zero
  - [ ] Passo 1: Dados Pessoais
  - [ ] Passo 2: Objetivo (com IA)
  - [ ] Passo 3: Experiência (com IA)
  - [ ] Passo 4: Educação
  - [ ] Passo 5: Habilidades
  - [ ] Passo 6: Idiomas
  - [ ] Passo 7: Cursos
  - [ ] Passo 8: Projetos
- [ ] Selecionar template
- [ ] Preview correto
- [ ] Exportar PDF - qualidade OK
- [ ] Enviar por email - sucesso
- [ ] Curriculum checker - feedback correto
- [ ] Help tips aparecem corretamente
- [ ] Validações funcionam

**Edge Cases:**
- [ ] Trocar idioma no meio do processo
- [ ] Recarregar página - dados persistem
- [ ] Limpar localStorage - inicia corretamente
- [ ] Navegador em PT - detecta corretamente
- [ ] Datas formatadas corretamente

#### Checklist de Testes - Espanhol

**Fluxo Completo:**
- [ ] Homepage carrega corretamente
- [ ] Trocar para espanhol no switcher
- [ ] Criar currículo do zero
  - [ ] Todos os 8 passos em espanhol
  - [ ] IA gera conteúdo de QUALIDADE em ES
  - [ ] Help tips em espanhol
  - [ ] Validações em espanhol
- [ ] Templates mostram headers em ES
- [ ] Preview correto em ES
- [ ] PDF export - texto em ES
- [ ] Email em espanhol
- [ ] Curriculum checker - feedback em ES
- [ ] Admin panel funciona em ES
- [ ] Documentos legais em ES

**Edge Cases ES:**
- [ ] Navegador em ES - detecta corretamente
- [ ] Datas em formato LATAM
- [ ] Números formatados corretamente
- [ ] Currency (se aplicável)

---

### STEP 5.2: Testes com Beta Testers Nativos (1 semana)

**Recrutar 3-5 beta testers:**
- Falantes nativos de espanhol LATAM
- Diferentes países (México, Argentina, Colômbia, etc.)
- Perfil: pessoas procurando emprego

**Tarefas para testers:**
1. Criar currículo completo em espanhol
2. Testar IA - avaliar qualidade de saída
3. Reportar:
   - Textos que soam estranhos
   - Termos não usados em seu país
   - Bugs encontrados
   - Sugestões de melhoria

**Feedback Form:**
```markdown
# CV Builder - Beta Testing Feedback

## Información del Tester
- Nombre:
- País:
- Experiencia con CVs:

## Calidad de la Traducción (1-5)
- Textos generales: [ ]
- Prompts de IA: [ ]
- Documentos legales: [ ]

## Calidad de Salida de IA (1-5)
- Descripciones de experiencia: [ ]
- Objetivos profesionales: [ ]
- Cartas de presentación: [ ]

## Bugs Encontrados
1.
2.

## Sugerencias de Mejora
1.
2.

## Comentarios Generales
```

**Checklist:**
- [ ] 5 testers recrutados
- [ ] Testes completados
- [ ] Feedback coletado
- [ ] Priorizar issues encontrados
- [ ] Implementar correções críticas

---

### STEP 5.3: Correções Baseadas em Feedback (8-12 horas)

**Priorizar:**
1. **P0 - Bloqueadores:** Bugs que impedem uso
2. **P1 - Críticos:** Textos incorretos, IA de baixa qualidade
3. **P2 - Importantes:** Melhorias de UX
4. **P3 - Nice-to-have:** Sugestões menores

**Processo:**
1. Listar todos os feedbacks
2. Classificar por prioridade
3. Resolver P0 e P1 completamente
4. Resolver P2 se tempo permitir
5. Documentar P3 para futuras versões

**Checklist:**
- [ ] Todos os P0 resolvidos
- [ ] Todos os P1 resolvidos
- [ ] Maioria dos P2 resolvidos
- [ ] Re-teste após correções
- [ ] Aprovação dos testers

---

### STEP 5.4: Performance Testing (4 horas)

**Métricas a testar:**

#### Bundle Size
```bash
npm run build
# Verificar tamanho dos chunks

# ANTES i18n (baseline)
# DEPOIS i18n (não deve aumentar >10%)
```

**Checklist:**
- [ ] Build size aceitável (<500KB gzipped)
- [ ] Code splitting funcionando
- [ ] Lazy loading de traduções (se necessário)

#### Load Performance
```bash
# Lighthouse audit
npm run build
npm run preview
# Run Lighthouse
```

**Targets:**
- [ ] Performance: >90
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >90

#### Runtime Performance
- [ ] Trocar idioma: <200ms
- [ ] Render de página: <1s
- [ ] IA response: <3s
- [ ] PDF generation: <5s

**Checklist:**
- [ ] Performance tests passing
- [ ] Sem degradação vs versão PT pura
- [ ] Optimizações aplicadas se necessário

---

### STEP 5.5: Accessibility Testing (4 horas)

**Ferramentas:**
- Chrome Lighthouse
- axe DevTools
- Screen reader testing

**Checklist:**
- [ ] Lang attribute atualiza corretamente
- [ ] Aria labels traduzidos
- [ ] Screen reader funciona em ambos idiomas
- [ ] Keyboard navigation OK
- [ ] Color contrast OK
- [ ] Focus indicators visíveis

---

### STEP 5.6: Cross-browser Testing (4 horas)

**Browsers a testar:**
- [ ] Chrome (últimas 2 versões)
- [ ] Firefox (últimas 2 versões)
- [ ] Safari (macOS + iOS)
- [ ] Edge (última versão)

**Dispositivos:**
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Checklist por browser/device:**
- [ ] Layout não quebra
- [ ] Language switcher funciona
- [ ] Textos não overflow
- [ ] Datas formatam corretamente
- [ ] PDFs geram corretamente

---

### STEP 5.7: Preparar Documentação (6 horas)

#### Criar `INTERNATIONALIZATION.md`
```markdown
# Guia de Internacionalização

## Como Adicionar um Novo Idioma

1. Criar estrutura de arquivos
2. Traduzir todos os arquivos JSON
3. Adicionar ao language switcher
4. Testar completamente

## Estrutura de Arquivos

## Convenções de Tradução

## Testing

## Troubleshooting
```

#### Atualizar `README.md`
```markdown
## Idiomas Suportados

- 🇧🇷 Português (Brasil)
- 🌎 Español (LATAM)

## Como trocar idioma

[screenshot do language switcher]
```

#### Atualizar `CLAUDE.md`
```markdown
## Internationalization (i18n)

O projeto suporta múltiplos idiomas usando react-i18next.

### Arquivos de tradução:
- `src/locales/pt-BR/*.json`
- `src/locales/es-419/*.json`

### Como usar:
```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation('common');
  return <div>{t('key')}</div>;
}
```
```

**Checklist:**
- [ ] INTERNATIONALIZATION.md criado
- [ ] README.md atualizado
- [ ] CLAUDE.md atualizado
- [ ] Screenshots adicionados
- [ ] Guias de troubleshooting

---

### STEP 5.8: Final Review (4 horas)

**Checklist Master:**

#### Técnico
- [ ] Zero console errors
- [ ] Zero console warnings
- [ ] Todos os testes passam
- [ ] Build completa com sucesso
- [ ] Performance OK
- [ ] Accessibility OK

#### Funcional
- [ ] Fluxo completo PT funciona 100%
- [ ] Fluxo completo ES funciona 100%
- [ ] Switching entre idiomas sem bugs
- [ ] LocalStorage preservado
- [ ] IA gera conteúdo de qualidade em ambos
- [ ] PDFs corretos em ambos idiomas
- [ ] Emails corretos em ambos idiomas

#### Conteúdo
- [ ] Zero hardcoded text
- [ ] Todas as traduções revisadas
- [ ] Documentos legais aprovados
- [ ] SEO otimizado
- [ ] Marketing copy aprovado

#### Documentação
- [ ] README atualizado
- [ ] Changelog criado
- [ ] Guias de uso criados
- [ ] Screenshots atualizados

---

### STEP 5.9: Soft Launch (3 dias)

**Estratégia:**
1. Deploy em ambiente de staging
2. Testar em produção-like environment
3. Monitorar errors (Sentry/LogRocket)
4. Coletar feedback de primeiros usuários
5. Hot fixes se necessário

**Checklist:**
- [ ] Deploy staging OK
- [ ] Smoke tests em staging
- [ ] Analytics configurado
- [ ] Error monitoring ativo
- [ ] Primeiros 10 usuários testam
- [ ] Feedback positivo

---

### STEP 5.10: Production Launch (1 dia)

**Go-Live Checklist:**

#### Pre-launch (2 horas antes)
- [ ] Backup completo do banco de dados
- [ ] Backup completo do código atual
- [ ] Criar tag Git de release
- [ ] Testar rollback plan
- [ ] Equipe de suporte alertada

#### Launch
```bash
# Merge para main
git checkout main
git merge feature/i18n-spanish-latam

# Tag release
git tag v2.0.0-i18n
git push origin main --tags

# Deploy
npm run build
# Deploy para produção
```

#### Post-launch (monitorar 24h)
- [ ] Monitorar error rates
- [ ] Monitorar performance metrics
- [ ] Monitorar analytics
- [ ] Coletar feedback de usuários
- [ ] Resolver hot fixes se necessário

---

### ✅ MILESTONE 5: Testing & Launch Complete

**Entregáveis:**
- ✅ QA completo realizado
- ✅ Beta testing completo
- ✅ Performance validada
- ✅ Accessibility validada
- ✅ Documentação completa
- ✅ Deploy em produção com sucesso

**Final Commit & Tag:**
```bash
git add .
git commit -m "feat(i18n): v2.0.0 - Full Spanish LATAM support"
git tag v2.0.0-i18n
git push origin main --tags
```

---

## ✅ CHECKLIST FINAL

### Técnico
- [ ] react-i18next instalado e configurado
- [ ] Estrutura de arquivos de tradução criada
- [ ] Language switcher implementado
- [ ] Detecção automática de idioma funciona
- [ ] LocalStorage persistence funciona
- [ ] Zero hardcoded text no código
- [ ] Build completa sem erros
- [ ] Performance OK (Lighthouse >90)
- [ ] Accessibility OK (axe >90)
- [ ] Cross-browser tested

### Conteúdo
- [ ] 1300-1600 strings traduzidas
- [ ] UI components 100% traduzidos
- [ ] Forms 100% traduzidos
- [ ] Validation messages 100% traduzidos
- [ ] Help system 100% traduzido
- [ ] AI prompts traduzidos e otimizados
- [ ] Templates traduzidos
- [ ] Email templates traduzidos
- [ ] Legal docs profissionalmente traduzidos
- [ ] Landing page traduzida
- [ ] Admin panel traduzido
- [ ] SEO otimizado

### Qualidade
- [ ] AI output quality = português
- [ ] Traduções soam naturais
- [ ] Terminologia consistente
- [ ] Beta testers aprovaram
- [ ] Zero bugs críticos
- [ ] Performance sem degradação

### Negócio
- [ ] Usuários criam CV completo em ES
- [ ] Conversão tracking configurado
- [ ] Analytics separado por idioma
- [ ] Support ready para ES
- [ ] Documentação completa

### Documentação
- [ ] INTERNATIONALIZATION.md criado
- [ ] README.md atualizado
- [ ] CLAUDE.md atualizado
- [ ] Changelog criado
- [ ] Screenshots atualizados

---

## 🔄 PLANO DE ROLLBACK

### Se algo der errado em produção:

#### Rollback Imediato (< 5 minutos)
```bash
# Voltar para versão anterior
git checkout v1.0-pt-BR

# Re-deploy
npm run build
# Deploy para produção
```

#### Rollback Parcial (manter estrutura i18n)
```bash
# Desabilitar espanhol temporariamente
# Editar src/components/LanguageSwitcher.tsx

const languages = [
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  // Comentar espanhol temporariamente
  // { code: 'es-419', name: 'Español (LATAM)', flag: '🌎' },
];
```

#### Hot Fix (< 30 minutos)
```bash
# Criar branch de hot fix
git checkout -b hotfix/i18n-critical-bug

# Fix
# Commit
# Deploy direto para produção

git push origin hotfix/i18n-critical-bug
```

---

## 📊 MÉTRICAS DE SUCESSO

### Semana 1-2 após launch:
- [ ] 0 bugs críticos
- [ ] <5 bugs menores
- [ ] >50 usuários criaram CV em ES
- [ ] Feedback positivo (>4/5 stars)
- [ ] Performance mantida

### Mês 1 após launch:
- [ ] >500 usuários em ES
- [ ] Conversão ES ~= conversão PT
- [ ] <10 bugs reportados
- [ ] >80% feedback positivo

---

## 🎯 PRÓXIMOS PASSOS APÓS LAUNCH

### Curto Prazo (1-2 meses)
- [ ] Monitorar métricas de uso ES
- [ ] Coletar feedback contínuo
- [ ] Resolver bugs menores
- [ ] Ajustar traduções baseado em feedback
- [ ] A/B test marketing copy ES

### Médio Prazo (3-6 meses)
- [ ] Considerar mais idiomas (Inglês?)
- [ ] Otimizar SEO para keywords ES
- [ ] Expandir marketing para LATAM
- [ ] Adicionar templates específicos LATAM

### Longo Prazo (6-12 meses)
- [ ] Localization completa (moeda, formatos)
- [ ] Suporte multi-região
- [ ] Conteúdo localizado por país
- [ ] Parcerias LATAM

---

## 📞 CONTATOS E RECURSOS

### Time
- Desenvolvedor Principal: [nome]
- Copywriter ES: [contratar]
- Tradutor Jurídico: [contratar]
- Beta Testers: [recrutar]

### Recursos
- Documentação i18next: https://react.i18next.com/
- Guias de localização: https://phrase.com/blog/
- Testing: https://web.dev/i18n-and-l10n/

### Suporte
- Issues: GitHub Issues
- Dúvidas: [canal de comunicação]

---

**VERSÃO DO PLANO:** 1.0
**STATUS:** 🟡 AGUARDANDO APROVAÇÃO
**PRÓXIMO PASSO:** Aprovação do usuário para iniciar Fase 1

---

🚀 **ESTAMOS PRONTOS PARA COMEÇAR!**

Aguardando sua aprovação para iniciar a implementação.

Perguntas? Ajustes no plano? Me avise!
