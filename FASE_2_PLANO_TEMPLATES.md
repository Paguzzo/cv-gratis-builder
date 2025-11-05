# 📋 FASE 2: TEMPLATES VISUAIS - PLANO DE EXECUÇÃO

**Data de Início**: 05 de Outubro de 2025
**Prioridade**: 🔴 **CRÍTICA** (Produto não vendável sem templates)
**Tempo Estimado**: 40 horas (1 semana com 2 devs ou 2 semanas solo)

---

## 🎯 OBJETIVO

Criar **9 templates profissionais** (2 gratuitos + 7 premium) que justifiquem o preço de R$ 4,90-6,90 e sejam competitivos com Canva, Resume.io e Novoresume.

---

## 📊 SITUAÇÃO ATUAL

### ❌ PROBLEMA CRÍTICO IDENTIFICADO:
```
src/components/templates/templates/ → DIRETÓRIO VAZIO
TemplateRenderer.tsx → NÃO EXISTE
```

**Impacto**:
- Templates cadastrados em `templates.ts` mas não implementados
- Usuário não consegue visualizar ou baixar nenhum template
- Produto não pode ser vendido (fraude ao cliente)

---

## 🏗️ ARQUITETURA A SER CRIADA

```
src/components/templates/
├── TemplateRenderer.tsx          # Router de templates
├── BaseTemplate.tsx              # Componente base reutilizável
├── TemplateUtils.ts              # Funções auxiliares
├── templates/
│   ├── FreeModern.tsx           # Template 1: Moderno Gratuito
│   ├── FreeClassic.tsx          # Template 2: Clássico Gratuito
│   ├── PremiumExecutive.tsx     # Template 3: Executivo Premium
│   ├── PremiumTech.tsx          # Template 4: Tech Premium
│   ├── PremiumCreative.tsx      # Template 5: Criativo Premium
│   ├── PremiumMinimal.tsx       # Template 6: Minimalista Premium
│   ├── PremiumElegant.tsx       # Template 7: Elegante Premium
│   ├── PremiumFormal.tsx        # Template 8: Formal Premium
│   └── PremiumProfessional.tsx  # Template 9: Profissional Premium
└── styles/
    ├── common.css               # Estilos comuns
    ├── print.css                # Estilos para impressão
    └── pdf.css                  # Estilos para PDF
```

---

## 🎨 DESIGN SPECIFICATIONS

### Template 1: **Moderno Gratuito** (free-modern)
**Tempo**: 4h | **Complexidade**: Média

**Layout**:
- Single column (uma coluna)
- Header centralizado com nome grande
- Seções bem espaçadas
- Ícones minimalistas para contato

**Cores**:
- Primary: #1f2937 (cinza escuro)
- Accent: #3b82f6 (azul)
- Text: #111827 (preto suave)

**Tipografia**:
- Heading: Inter Bold
- Body: Inter Regular
- Sizes: Name 32px, Headings 18px, Body 11px

**Elementos**:
- ✅ Watermark "CVGrátis" no rodapé
- ✅ Linha divisória azul entre seções
- ✅ Bullets circulares
- ✅ Data format: MM/YYYY

---

### Template 2: **Clássico Gratuito** (free-classic)
**Tempo**: 4h | **Complexidade**: Baixa

**Layout**:
- Single column tradicional
- Header esquerda-alinhado
- Formatação conservadora
- Sem ícones (apenas texto)

**Cores**:
- Primary: #374151 (cinza médio)
- Accent: #4b5563 (cinza)
- Text: #111827

**Tipografia**:
- Heading: Georgia Serif
- Body: Arial
- Tamanhos clássicos

**Elementos**:
- ✅ Watermark "CVGrátis"
- ✅ Linhas horizontais simples
- ✅ Formato tradicional conservador

---

### Template 3: **Executivo Premium** (premium-executive)
**Tempo**: 5h | **Complexidade**: Alta

**Layout**:
- **Two columns**: Sidebar 30% + Content 70%
- Sidebar escura (azul corporativo)
- Foto circular no topo da sidebar

**Cores**:
- Sidebar: #1e293b (azul escuro corporativo)
- Accent: #0ea5e9 (azul claro)
- Text: #334155

**Tipografia**:
- Heading: Playfair Display (elegante)
- Body: Inter
- Name: 36px, Headings: 20px

**Elementos Exclusivos**:
- ✅ Foto circular 120px
- ✅ Ícones brancos na sidebar
- ✅ Barras de progresso para skills
- ✅ Timeline vertical para experiências
- ✅ Sem watermark

---

### Template 4: **Tech Premium** (premium-tech)
**Tempo**: 5h | **Complexidade**: Alta

**Layout**:
- **Two columns**: Sidebar 35% + Content 65%
- Sidebar verde tech vibrante
- Design moderno angular

**Cores**:
- Sidebar: #0f766e (verde tech)
- Accent: #14b8a6 (verde água)
- Code bg: #1e293b

**Tipografia**:
- Heading: JetBrains Mono (monospace)
- Body: Inter
- Suporte a code snippets

**Elementos Exclusivos**:
- ✅ Ícones de tecnologia (GitHub, Stack)
- ✅ Gráficos de progresso animados
- ✅ Seção de projetos GitHub
- ✅ Badges de certificações
- ✅ Timeline visual de carreira

---

### Template 5: **Criativo Premium** (premium-creative)
**Tempo**: 5h | **Complexidade**: Muito Alta

**Layout**:
- **Assimétrico**: Header diagonal + 2 columns
- Design diferenciado e ousado
- Elementos gráficos criativos

**Cores**:
- Primary: #7c2d12 (marrom terra)
- Accent: #ea580c (laranja vibrante)
- Text: #1c1917

**Tipografia**:
- Heading: Montserrat Bold
- Body: Open Sans
- Uso de fontes variadas

**Elementos Exclusivos**:
- ✅ Header com forma diagonal
- ✅ Foto hexagonal
- ✅ Ícones coloridos
- ✅ Seção de portfolio destacada
- ✅ Elementos gráficos decorativos

---

### Template 6: **Minimalista Premium** (premium-minimal)
**Tempo**: 4h | **Complexidade**: Média

**Layout**:
- **Two columns**: Sidebar 32% + Content 68%
- Barra lateral rosa/pink moderna
- Espaçamento generoso

**Cores**:
- Sidebar: #ec4899 (rosa vibrante)
- Accent: #f472b6 (rosa claro)
- Text: #374151

**Tipografia**:
- Heading: Poppins
- Body: Inter
- Muito espaço em branco

**Elementos Exclusivos**:
- ✅ Foto quadrada com borda
- ✅ Minimalismo extremo
- ✅ Linhas finas de separação
- ✅ Ícones outline

---

### Template 7: **Elegante Premium** (premium-pastel)
**Tempo**: 4h | **Complexidade**: Média

**Layout**:
- **Two columns**: Sidebar 30% + Content 70%
- Sidebar bege/pastel suave
- Design feminino e delicado

**Cores**:
- Sidebar: #fef3c7 (bege pastel)
- Accent: #f59e0b (dourado suave)
- Text: #92400e (marrom)

**Tipografia**:
- Heading: Playfair Display Italic
- Body: Lora
- Tom elegante e refinado

**Elementos Exclusivos**:
- ✅ Foto oval
- ✅ Elementos florais sutis
- ✅ Paleta pastel suave
- ✅ Tipografia cursiva para nome

---

### Template 8: **Formal Premium** (premium-formal)
**Tempo**: 4h | **Complexidade**: Baixa

**Layout**:
- **Single column** ultra-simples
- Foto quadrada 80x80 com cantos arredondados
- Títulos com linhas embaixo

**Cores**:
- Primary: #000000 (preto)
- Accent: #374151 (cinza)
- Text: #000000

**Tipografia**:
- Heading: Times New Roman
- Body: Arial
- Formato acadêmico/formal

**Elementos Exclusivos**:
- ✅ Máxima simplicidade
- ✅ Foto pequena e discreta
- ✅ Linhas horizontais sob títulos
- ✅ Formato CV tradicional

---

### Template 9: **Profissional Premium** (premium-professional)
**Tempo**: 5h | **Complexidade**: Média-Alta

**Layout**:
- **Two columns**: Sidebar 35% + Content 65%
- Faixa azul elegante no topo
- Design corporativo moderno

**Cores**:
- Header: #2563eb (azul corporativo)
- Accent: #3b82f6 (azul médio)
- Text: #374151

**Tipografia**:
- Heading: Roboto Bold
- Body: Roboto
- Visual clean e profissional

**Elementos Exclusivos**:
- ✅ Faixa azul no topo (full-width)
- ✅ Foto circular 100px
- ✅ Ícones modernos
- ✅ Divisores visuais elegantes
- ✅ Layout balanceado

---

## 🛠️ COMPONENTES AUXILIARES

### 1. **BaseTemplate.tsx**
Componente reutilizável com:
- Props padronizadas (CurriculumData + config)
- Renderização de seções comuns
- Formatação de datas
- Ícones compartilhados
- Helpers de estilo

### 2. **TemplateRenderer.tsx**
Router que:
- Recebe template.id
- Carrega componente correto
- Passa dados do currículo
- Aplica configurações premium (fontes, cores)
- Gerencia exportação PDF

### 3. **TemplateUtils.ts**
Funções auxiliares:
- `formatDate(date)` - MM/YYYY ou MM/AA
- `formatPhone(phone)` - (XX) XXXXX-XXXX
- `getInitials(name)` - Para avatares
- `truncateText(text, max)` - Limitar caracteres
- `generatePDF(template)` - Exportação

---

## 📅 CRONOGRAMA DETALHADO

### **DIA 1** (8h) - Infraestrutura
- ☐ Criar BaseTemplate.tsx (2h)
- ☐ Criar TemplateRenderer.tsx (2h)
- ☐ Criar TemplateUtils.ts (1h)
- ☐ Setup de estilos comuns (1h)
- ☐ Dados de teste mockados (1h)
- ☐ Setup PDF export básico (1h)

### **DIA 2** (8h) - Templates Gratuitos
- ☐ FreeModern.tsx (4h)
  - Layout + Estilos
  - Integração com dados
  - Watermark
  - Teste de impressão
- ☐ FreeClassic.tsx (4h)
  - Layout conservador
  - Tipografia clássica
  - Watermark
  - Teste

### **DIA 3** (8h) - Templates Premium 1
- ☐ PremiumExecutive.tsx (5h)
  - Sidebar escura
  - Foto circular
  - Barras de progresso
  - Timeline
- ☐ PremiumTech.tsx inicio (3h)
  - Sidebar verde
  - Layout base

### **DIA 4** (8h) - Templates Premium 2
- ☐ PremiumTech.tsx conclusão (2h)
  - Ícones tech
  - Badges
  - Projetos GitHub
- ☐ PremiumCreative.tsx (5h)
  - Header diagonal
  - Foto hexagonal
  - Portfolio
- ☐ Buffer (1h)

### **DIA 5** (8h) - Templates Premium 3
- ☐ PremiumMinimal.tsx (4h)
  - Sidebar rosa
  - Minimalismo
- ☐ PremiumElegant.tsx (4h)
  - Sidebar bege
  - Elementos florais
  - Paleta pastel

### **DIA 6** (8h) - Templates Premium 4 + Finalizações
- ☐ PremiumFormal.tsx (4h)
  - Single column
  - Ultra-simples
- ☐ PremiumProfessional.tsx (4h)
  - Faixa azul
  - Layout corporativo

### **DIA 7** (8h) - Testes e Otimização
- ☐ Testar todos templates com dados reais (2h)
- ☐ Otimizar PDF export (2h)
- ☐ Ajustes de responsividade (2h)
- ☐ Documentação (1h)
- ☐ Code review (1h)

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

Para cada template:
- ✅ Renderiza corretamente com dados reais
- ✅ Exporta para PDF com qualidade
- ✅ Print-friendly (margens corretas)
- ✅ Responsive (mobile view)
- ✅ Sem overflow de texto
- ✅ Performance < 2s para render
- ✅ Acessibilidade (contrast ratios)

---

## 🎯 MÉTRICAS DE SUCESSO

- **9 templates** funcionais
- **100% de cobertura** dos dados do currículo
- **Qualidade visual** competitiva
- **PDF perfeito** em todos
- **Código reutilizável** (< 30% duplicação)

---

## 🚀 ESTRATÉGIA DE EXECUÇÃO

### Abordagem:
1. **Infraestrutura primeiro** (BaseTemplate + Renderer)
2. **Gratuitos primeiro** (validar sistema)
3. **Premium por complexidade** (simples → complexo)
4. **Testes contínuos** (não deixar para o final)
5. **Uso de agentes em paralelo** quando possível

---

**Início da execução**: AGORA
**Primeira entrega**: Templates gratuitos (Dia 2)
**Entrega completa**: Dia 7

Vamos começar! 🚀
