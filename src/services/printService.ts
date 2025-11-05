export class PrintService {
  static async printTemplate(): Promise<void> {
    const printContainer = document.getElementById('template-preview-container');
    
    if (!printContainer) {
      throw new Error('Template container not found');
    }

    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Popup bloqueado. Permita popups para imprimir.');
    }

    // Copiar estilos da página atual
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('\n');

    // HTML da página de impressão
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Currículo - Impressão</title>
          ${styles}
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none !important; }
              .print-only { display: block !important; }
              @page { margin: 0.5in; size: A4; }
            }
            body { 
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: #000;
            }
          </style>
        </head>
        <body>
          ${printContainer.outerHTML}
        </body>
      </html>
    `;

    // Escrever HTML na nova janela
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Aguardar carregamento e imprimir
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }

  static async printCurrentPage(): Promise<void> {
    // Ocultar elementos que não devem ser impressos
    const noprint = document.querySelectorAll('.no-print');
    noprint.forEach(el => (el as HTMLElement).style.display = 'none');

    // Imprimir página atual
    window.print();

    // Restaurar elementos
    noprint.forEach(el => (el as HTMLElement).style.display = '');
  }
} 