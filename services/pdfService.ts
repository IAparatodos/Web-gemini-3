import { jsPDF } from 'jspdf';

interface PDFPage {
  imageUrl: string;
  title?: string;
  description?: string;
}

/**
 * Genera un PDF con imágenes grandes, fiel al estilo de Kenay
 * Las imágenes ocupan la mayor parte de cada página (no pequeñas)
 */
export const generatePDF = async (pages: PDFPage[], filename: string = 'documento.pdf') => {
  // Crear PDF en formato A4
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Márgenes pequeños para que las imágenes sean grandes
  const margin = 10;
  const contentWidth = pageWidth - (margin * 2);
  const contentHeight = pageHeight - (margin * 2);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    if (i > 0) {
      pdf.addPage();
    }

    // Agregar título si existe (pequeño, en la parte superior)
    if (page.title) {
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(page.title, pageWidth / 2, margin, { align: 'center' });
    }

    try {
      // Cargar imagen
      const img = await loadImage(page.imageUrl);

      // Calcular dimensiones para que la imagen sea GRANDE
      // La imagen debe ocupar la mayor parte de la página
      const imgRatio = img.width / img.height;
      let imgWidth = contentWidth;
      let imgHeight = contentWidth / imgRatio;

      // Si la altura es mayor que el contenido disponible, ajustar por altura
      if (imgHeight > contentHeight - (page.title ? 20 : 0)) {
        imgHeight = contentHeight - (page.title ? 20 : 0);
        imgWidth = imgHeight * imgRatio;
      }

      // Centrar la imagen en la página
      const xPos = (pageWidth - imgWidth) / 2;
      const yPos = page.title ? margin + 15 : (pageHeight - imgHeight) / 2;

      // Agregar imagen GRANDE al PDF
      pdf.addImage(
        img,
        'PNG',
        xPos,
        yPos,
        imgWidth,
        imgHeight
      );

      // Agregar descripción si existe (pequeña, en la parte inferior)
      if (page.description) {
        pdf.setFontSize(10);
        pdf.setTextColor(120, 120, 120);
        const descY = yPos + imgHeight + 5;
        pdf.text(page.description, pageWidth / 2, descY, {
          align: 'center',
          maxWidth: contentWidth
        });
      }
    } catch (error) {
      console.error(`Error loading image for page ${i + 1}:`, error);
      // Si falla la imagen, mostrar placeholder
      pdf.setFontSize(14);
      pdf.setTextColor(200, 0, 0);
      pdf.text(
        'Error al cargar la imagen',
        pageWidth / 2,
        pageHeight / 2,
        { align: 'center' }
      );
    }
  }

  // Guardar el PDF
  pdf.save(filename);
};

/**
 * Función auxiliar para cargar imágenes
 */
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Para evitar problemas de CORS
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Descarga el PDF del proveedor directamente (Instrucciones proveedor.pdf)
 * Mantiene las imágenes en su tamaño original (grandes)
 */
export const downloadProveedorPDF = () => {
  const link = document.createElement('a');
  link.href = '/Instrucciones proveedor.pdf';
  link.download = 'Instrucciones-Montaje-2375.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Genera un PDF a partir del PDF del proveedor (Instrucciones proveedor.pdf)
 * Mantiene las imágenes en su tamaño original (grandes)
 */
export const generateInstructionsPDF = async () => {
  // Aquí se definen las páginas con las imágenes del documento del proveedor
  // Estas imágenes deben estar en la carpeta public/instructions/
  const pages: PDFPage[] = [
    {
      title: 'Assembly Instructions - 2375',
      imageUrl: '/instructions/page-1.png'
    },
    {
      imageUrl: '/instructions/page-2.png'
    },
    {
      imageUrl: '/instructions/page-3.png'
    },
    {
      imageUrl: '/instructions/page-4.png'
    },
    {
      imageUrl: '/instructions/page-5.png'
    },
    {
      imageUrl: '/instructions/page-6.png'
    },
    {
      imageUrl: '/instructions/page-7.png'
    },
    {
      imageUrl: '/instructions/page-8.png'
    },
    {
      imageUrl: '/instructions/page-9.png'
    },
    {
      imageUrl: '/instructions/page-10.png'
    },
    {
      imageUrl: '/instructions/page-11.png'
    }
  ];

  await generatePDF(pages, 'Instrucciones-Montaje.pdf');
};
