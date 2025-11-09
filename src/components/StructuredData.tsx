import { useEffect } from 'react';

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'breadcrumb' | 'all';
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function StructuredData({ type = 'all', breadcrumbs }: StructuredDataProps) {

  useEffect(() => {
    // Remove scripts anteriores do tipo structured-data
    const existingScripts = document.querySelectorAll('script[data-structured-data="true"]');
    existingScripts.forEach(script => script.remove());

    const schemas = [];

    // Schema de Organization
    if (type === 'organization' || type === 'all') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CVGratis Online - Produções ComPG',
        legalName: 'Produções ComPG',
        url: 'https://www.curriculogratisonline.com',
        logo: 'https://www.curriculogratisonline.com/android-chrome-512x512.png',
        description: 'Plataforma de criação de currículos profissionais com IA integrada, templates premium e ferramentas avançadas para conquistar seu emprego dos sonhos.',
        foundingDate: '2024',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Minas Gerais',
          addressRegion: 'MG',
          addressCountry: 'BR'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+55-31-97105-2200',
          contactType: 'Customer Service',
          email: 'contato@compg.com.br',
          areaServed: 'BR',
          availableLanguage: ['Portuguese']
        },
        sameAs: [
          'https://www.curriculogratisonline.com'
        ]
      });
    }

    // Schema de WebApplication
    if (type === 'website' || type === 'all') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'CVGratis - Criador de Currículos Profissionais',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
          description: 'Versão gratuita com IA integrada e templates profissionais'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '50000',
          bestRating: '5',
          worstRating: '1'
        },
        author: {
          '@type': 'Organization',
          name: 'Produções ComPG'
        },
        description: 'Crie currículos profissionais gratuitamente com templates modernos, IA integrada, exportação PDF e muito mais. Mais de 127.000 profissionais já conseguiram emprego.',
        screenshot: 'https://www.curriculogratisonline.com/screenshot-desktop.png',
        softwareVersion: '1.0',
        url: 'https://www.curriculogratisonline.com',
        image: 'https://www.curriculogratisonline.com/og-image.jpg',
        inLanguage: 'pt-BR',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        permissions: 'Browser-based application, no special permissions required'
      });
    }

    // Schema de BreadcrumbList (se fornecido)
    if ((type === 'breadcrumb' || type === 'all') && breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url
        }))
      });
    }

    // Schema de FAQPage (perguntas frequentes implícitas)
    if (type === 'all') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Como criar um currículo grátis?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No CVGratis você cria seu currículo profissional em 3 passos simples: 1) Preencha seus dados em 3 minutos com ajuda da IA, 2) Escolha um dos templates modernos aprovados por RH, 3) Faça download em PDF e comece a enviar para empresas.'
            }
          },
          {
            '@type': 'Question',
            name: 'É realmente grátis?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim! A versão gratuita inclui IA integrada, 2 templates profissionais, download PDF ilimitado, impressão otimizada e salvamento automático. Sem cartão de crédito, sem pegadinhas.'
            }
          },
          {
            '@type': 'Question',
            name: 'Qual a diferença entre GRÁTIS e PREMIUM?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A versão PREMIUM (R$ 4,90 por template) oferece 10 templates exclusivos, JobAI integrado para tirar dúvidas de RH, avaliação IA com nota 9.2/10, relatório completo de melhorias e carta de apresentação com IA.'
            }
          },
          {
            '@type': 'Question',
            name: 'Quanto tempo leva para criar um currículo?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Em média, nossos usuários criam currículos profissionais em apenas 3 minutos. A IA integrada acelera o processo sugerindo descrições profissionais para suas experiências.'
            }
          }
        ]
      });
    }

    // Schema de Service (serviço oferecido)
    if (type === 'all') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Criação de Currículos Profissionais',
        provider: {
          '@type': 'Organization',
          name: 'CVGratis Online - Produções ComPG'
        },
        areaServed: {
          '@type': 'Country',
          name: 'Brasil'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Serviços de Currículo',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Currículo GRÁTIS',
                description: 'Templates profissionais com IA integrada'
              },
              price: '0',
              priceCurrency: 'BRL'
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Currículo PREMIUM',
                description: 'Templates exclusivos + JobAI + Avaliação IA'
              },
              price: '4.90',
              priceCurrency: 'BRL'
            }
          ]
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '50000'
        }
      });
    }

    // Inserir schemas no head
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', 'true');
      script.setAttribute('data-schema-index', index.toString());
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup ao desmontar
    return () => {
      const scripts = document.querySelectorAll('script[data-structured-data="true"]');
      scripts.forEach(script => script.remove());
    };
  }, [type, breadcrumbs]);

  return null;
}
