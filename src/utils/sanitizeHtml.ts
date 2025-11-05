/**
 * 🛡️ UTILITÁRIO DE SANITIZAÇÃO HTML SEGURO
 *
 * Este utilitário fornece sanitização segura de HTML usando DOMPurify
 * para prevenir ataques XSS (Cross-Site Scripting).
 *
 * SEGURANÇA: Sempre use este utilitário em vez de dangerouslySetInnerHTML direto
 */

import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  removeScripts?: boolean;
  removeStyles?: boolean;
}

/**
 * Sanitiza HTML removendo elementos maliciosos
 */
export function sanitizeHtml(
  html: string,
  options: SanitizeOptions = {}
): string {
  const {
    allowedTags = [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a'
    ],
    allowedAttributes = ['href', 'target', 'rel', 'class', 'id', 'style'],
    removeScripts = true,
    removeStyles = false
  } = options;

  // Configurar DOMPurify
  const config: {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    ALLOW_DATA_ATTR?: boolean;
    ALLOW_UNKNOWN_PROTOCOLS?: boolean;
    FORBID_TAGS?: string[];
    FORBID_ATTR?: string[];
  } = {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOW_DATA_ATTR: false, // Não permitir data-* por segurança
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SANITIZE_DOM: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false
  };

  if (removeScripts) {
    config.FORBID_TAGS = ['script', 'object', 'embed', 'iframe'];
  }

  if (removeStyles) {
    config.FORBID_ATTR = ['style'];
  }

  try {
    const sanitized = DOMPurify.sanitize(html, config);
    return sanitized;
  } catch (error) {
    console.error('🚨 Erro na sanitização HTML:', error);
    // Em caso de erro, retornar string vazia por segurança
    return '';
  }
}

/**
 * Sanitiza CSS removendo propriedades perigosas
 */
export function sanitizeCss(css: string): string {
  try {
    // Lista de propriedades CSS perigosas
    const dangerousPatterns = [
      /javascript:/gi,
      /expression\(/gi,
      /behavior:/gi,
      /binding:/gi,
      /@import/gi,
      /url\s*\(\s*['"]?javascript:/gi,
      /url\s*\(\s*['"]?data:/gi
    ];

    let sanitizedCss = css;

    // Remover padrões perigosos
    dangerousPatterns.forEach(pattern => {
      sanitizedCss = sanitizedCss.replace(pattern, '');
    });

    return sanitizedCss;
  } catch (error) {
    console.error('🚨 Erro na sanitização CSS:', error);
    return '';
  }
}

/**
 * Hook React para sanitização segura
 */
export function useSafeHtml(html: string, options?: SanitizeOptions) {
  const sanitizedHtml = sanitizeHtml(html, options);

  return {
    __html: sanitizedHtml
  };
}

/**
 * Componente React para renderização segura de HTML
 */
interface SafeHtmlProps {
  html: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  options?: SanitizeOptions;
}

export function SafeHtml({
  html,
  className,
  tag = 'div',
  options
}: SafeHtmlProps) {
  const sanitizedHtml = useSafeHtml(html, options);
  const TagComponent = tag as keyof JSX.IntrinsicElements;

  return React.createElement(TagComponent, {
    className,
    dangerouslySetInnerHTML: sanitizedHtml
  });
}

/**
 * Validar se um HTML é seguro (apenas verificação)
 */
export function isHtmlSafe(html: string): boolean {
  try {
    const sanitized = sanitizeHtml(html);
    // Se o HTML sanitizado é igual ao original, é seguro
    return sanitized === html;
  } catch {
    return false;
  }
}

/**
 * Configurações pré-definidas para diferentes contextos
 */
export const SANITIZE_PRESETS = {
  // Para conteúdo de usuário geral
  USER_CONTENT: {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'b', 'i'],
    allowedAttributes: [],
    removeScripts: true,
    removeStyles: true
  },

  // Para CSS de templates (mais restritivo)
  TEMPLATE_CSS: {
    allowedTags: [],
    allowedAttributes: [],
    removeScripts: true,
    removeStyles: false
  },

  // Para conteúdo administrativo (mais permissivo)
  ADMIN_CONTENT: {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img'
    ],
    allowedAttributes: ['href', 'target', 'rel', 'class', 'src', 'alt'],
    removeScripts: true,
    removeStyles: false
  }
} as const;