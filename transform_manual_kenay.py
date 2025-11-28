"""
Script de Producción - Transformación de Manuales de Instrucciones
Estilo: Kenay
Autor: Ingeniero de Software Principal
Entorno: Google Colab / Python 3.8+

INSTALACIÓN DE DEPENDENCIAS (Google Colab):
!pip install PyMuPDF reportlab Pillow

INPUTS:
- 'Instrucciones proveedor.pdf': Fuente de datos e imágenes
- 'Instrucciones Kenay (1).pdf': Referencia de estilo visual

OUTPUT:
- 'Manual_Final_Kenay.pdf': Documento final con estilo Kenay
"""

import fitz  # PyMuPDF
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage
import io
import os
from typing import List, Dict, Tuple, Optional
import tempfile


# ============================================================================
# CONFIGURACIÓN GLOBAL - ESTILO KENAY
# ============================================================================

class KenayStyle:
    """Configuración de estilo visual basada en el manual de referencia Kenay"""

    # Colores corporativos
    COLOR_PRIMARY = HexColor('#2C3E50')      # Azul oscuro corporativo
    COLOR_SECONDARY = HexColor('#95A5A6')    # Gris suave
    COLOR_ACCENT = HexColor('#3498DB')       # Azul acento
    COLOR_TEXT = HexColor('#2C3E50')         # Texto principal
    COLOR_HARDWARE_BG = HexColor('#ECF0F1')  # Fondo del hardware box
    COLOR_BORDER = HexColor('#BDC3C7')       # Bordes suaves

    # Tipografía (Sans-serif limpia)
    FONT_FAMILY = 'Helvetica'
    FONT_FAMILY_BOLD = 'Helvetica-Bold'
    FONT_SIZE_TITLE = 16
    FONT_SIZE_SUBTITLE = 12
    FONT_SIZE_BODY = 10
    FONT_SIZE_FOOTER = 9
    FONT_SIZE_HARDWARE = 11

    # Dimensiones de página
    PAGE_WIDTH, PAGE_HEIGHT = A4
    MARGIN_LEFT = 20 * mm
    MARGIN_RIGHT = 20 * mm
    MARGIN_TOP = 20 * mm
    MARGIN_BOTTOM = 20 * mm

    # Hardware Box
    HARDWARE_BOX_WIDTH = 80 * mm
    HARDWARE_BOX_HEIGHT = 60 * mm
    HARDWARE_BOX_X = MARGIN_LEFT
    HARDWARE_BOX_Y = PAGE_HEIGHT - MARGIN_TOP - HARDWARE_BOX_HEIGHT
    HARDWARE_BOX_PADDING = 8
    HARDWARE_BOX_CORNER_RADIUS = 5

    # Área de contenido
    CONTENT_X = MARGIN_LEFT
    CONTENT_Y_START = HARDWARE_BOX_Y - 10 * mm
    CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
    CONTENT_HEIGHT = CONTENT_Y_START - MARGIN_BOTTOM - 30 * mm


# ============================================================================
# MÓDULO 1: EXTRACCIÓN INTELIGENTE DE DATOS DEL PDF PROVEEDOR
# ============================================================================

class PDFExtractor:
    """Extrae datos e imágenes del PDF del proveedor usando PyMuPDF"""

    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.doc = fitz.open(pdf_path)

    def extract_images_from_page(self, page_num: int,
                                  crop_coords: Optional[Tuple[float, float, float, float]] = None) -> List[bytes]:
        """
        Extrae imágenes de una página específica del PDF.

        Args:
            page_num: Número de página (0-indexed)
            crop_coords: Tupla (x0, y0, x1, y1) para recortar área específica

        Returns:
            Lista de imágenes en formato bytes
        """
        page = self.doc[page_num]
        images = []

        # Si se proporcionan coordenadas, recortar la página primero
        if crop_coords:
            rect = fitz.Rect(*crop_coords)
            # Crear un nuevo PDF temporal con solo el área recortada
            pix = page.get_pixmap(clip=rect, matrix=fitz.Matrix(2, 2))  # 2x resolución
            img_data = pix.tobytes("png")
            images.append(img_data)
        else:
            # Extraer todas las imágenes incrustadas en la página
            image_list = page.get_images(full=True)

            for img_index, img in enumerate(image_list):
                xref = img[0]
                base_image = self.doc.extract_image(xref)
                img_data = base_image["image"]
                images.append(img_data)

        return images

    def extract_step_diagrams(self) -> Dict[int, bytes]:
        """
        Extrae diagramas de instrucciones paso a paso.
        Esta función debe personalizarse según la estructura del PDF del proveedor.

        Returns:
            Diccionario {paso_numero: imagen_bytes}
        """
        diagrams = {}

        # EJEMPLO: Asumiendo que cada página contiene un diagrama de paso
        # Ajustar coordenadas según el layout real del PDF del proveedor
        for page_num in range(len(self.doc)):
            # Coordenadas aproximadas para área de diagrama (ajustar según PDF real)
            # Formato: (x0, y0, x1, y1) en puntos
            diagram_area = (50, 150, 550, 700)  # Ejemplo - AJUSTAR SEGÚN PDF REAL

            images = self.extract_images_from_page(page_num, crop_coords=diagram_area)
            if images:
                diagrams[page_num + 1] = images[0]  # Primer imagen como diagrama principal

        return diagrams

    def extract_hardware_list(self) -> List[Dict[str, any]]:
        """
        Extrae la lista de hardware/tornillos del PDF del proveedor.
        Detecta texto en patrones tipo "A: Tornillo M6 x 40mm (x8)"

        Returns:
            Lista de diccionarios con información de hardware
        """
        hardware_items = []

        # Buscar en las primeras páginas (usualmente la lista está al inicio)
        for page_num in range(min(3, len(self.doc))):
            page = self.doc[page_num]
            text = page.get_text()

            # Patrón común: Letra + ": " + Descripción + " (xCantidad)"
            # Ejemplo: "A: Tornillo M6 x 40mm (x8)"
            lines = text.split('\n')

            for line in lines:
                # Detectar líneas que empiezan con una letra seguida de ":"
                if len(line) > 3 and line[0].isalpha() and line[1] == ':':
                    label = line[0]
                    description = line[2:].strip()

                    # Intentar extraer cantidad si está entre paréntesis
                    quantity = 1
                    if '(' in description and 'x' in description:
                        try:
                            qty_part = description.split('(')[1].split(')')[0]
                            quantity = int(qty_part.replace('x', '').strip())
                            description = description.split('(')[0].strip()
                        except:
                            pass

                    hardware_items.append({
                        'label': label,
                        'description': description,
                        'quantity': quantity
                    })

        return hardware_items

    def analyze_layout(self, reference_pdf_path: str) -> Dict:
        """
        Analiza el PDF de referencia Kenay para extraer parámetros de estilo.

        Args:
            reference_pdf_path: Ruta al PDF de referencia Kenay

        Returns:
            Diccionario con parámetros de estilo detectados
        """
        ref_doc = fitz.open(reference_pdf_path)
        style_params = {
            'page_count': len(ref_doc),
            'page_size': ref_doc[0].rect,
            'fonts_used': set(),
            'colors_detected': set()
        }

        # Analizar fuentes y colores (simplificado)
        for page in ref_doc:
            # Extraer información de fuentes
            blocks = page.get_text("dict")["blocks"]
            for block in blocks:
                if "lines" in block:
                    for line in block["lines"]:
                        for span in line["spans"]:
                            style_params['fonts_used'].add(span.get('font', 'Unknown'))

        ref_doc.close()
        return style_params

    def close(self):
        """Cierra el documento PDF"""
        self.doc.close()


# ============================================================================
# MÓDULO 2: MOTOR DE RENDERIZADO - GENERACIÓN DEL PDF KENAY
# ============================================================================

class KenayPDFGenerator:
    """Genera el PDF final con estilo Kenay usando ReportLab"""

    def __init__(self, output_path: str, total_steps: int = 8):
        self.output_path = output_path
        self.total_steps = total_steps
        self.current_step = 0

        # Crear canvas de ReportLab
        self.c = canvas.Canvas(output_path, pagesize=A4)

    def draw_header(self, step_number: int, step_title: str = ""):
        """
        Dibuja la cabecera del documento con tipografía Kenay.

        Args:
            step_number: Número del paso actual
            step_title: Título opcional del paso
        """
        c = self.c

        # Línea superior decorativa
        c.setStrokeColor(KenayStyle.COLOR_ACCENT)
        c.setLineWidth(2)
        c.line(KenayStyle.MARGIN_LEFT,
               KenayStyle.PAGE_HEIGHT - 10*mm,
               KenayStyle.PAGE_WIDTH - KenayStyle.MARGIN_RIGHT,
               KenayStyle.PAGE_HEIGHT - 10*mm)

        # Título principal
        c.setFont(KenayStyle.FONT_FAMILY_BOLD, KenayStyle.FONT_SIZE_TITLE)
        c.setFillColor(KenayStyle.COLOR_PRIMARY)

        if step_title:
            title_text = f"PASO {step_number}: {step_title.upper()}"
        else:
            title_text = f"INSTRUCCIONES DE MONTAJE - PASO {step_number}"

        c.drawString(KenayStyle.MARGIN_LEFT,
                     KenayStyle.PAGE_HEIGHT - 15*mm,
                     title_text)

    def draw_hardware_box(self, hardware_items: List[Dict[str, any]], step_number: int):
        """
        Dibuja el rectángulo flotante del hardware en la esquina superior izquierda.

        Args:
            hardware_items: Lista de elementos de hardware con {label, description, quantity}
            step_number: Número del paso (para filtrar hardware relevante si es necesario)
        """
        c = self.c
        x = KenayStyle.HARDWARE_BOX_X
        y = KenayStyle.HARDWARE_BOX_Y
        width = KenayStyle.HARDWARE_BOX_WIDTH
        height = KenayStyle.HARDWARE_BOX_HEIGHT

        # Fondo del cuadro con bordes redondeados
        c.setFillColor(KenayStyle.COLOR_HARDWARE_BG)
        c.setStrokeColor(KenayStyle.COLOR_BORDER)
        c.setLineWidth(1.5)
        c.roundRect(x, y, width, height,
                    KenayStyle.HARDWARE_BOX_CORNER_RADIUS,
                    stroke=1, fill=1)

        # Título del cuadro
        c.setFont(KenayStyle.FONT_FAMILY_BOLD, KenayStyle.FONT_SIZE_HARDWARE)
        c.setFillColor(KenayStyle.COLOR_PRIMARY)
        title_y = y + height - 15
        c.drawString(x + KenayStyle.HARDWARE_BOX_PADDING, title_y, "HARDWARE NECESARIO")

        # Línea separadora
        c.setStrokeColor(KenayStyle.COLOR_BORDER)
        c.setLineWidth(0.5)
        c.line(x + 5, title_y - 5, x + width - 5, title_y - 5)

        # Lista de items de hardware
        c.setFont(KenayStyle.FONT_FAMILY, KenayStyle.FONT_SIZE_BODY)
        c.setFillColor(KenayStyle.COLOR_TEXT)

        item_y = title_y - 15
        for item in hardware_items[:6]:  # Limitar a 6 items para que quepa
            # Etiqueta (A, B, C...)
            c.setFont(KenayStyle.FONT_FAMILY_BOLD, KenayStyle.FONT_SIZE_BODY)
            c.drawString(x + KenayStyle.HARDWARE_BOX_PADDING, item_y,
                        f"{item['label']}:")

            # Descripción y cantidad
            c.setFont(KenayStyle.FONT_FAMILY, KenayStyle.FONT_SIZE_BODY - 1)
            desc_text = f"{item['description']}"
            if len(desc_text) > 35:  # Truncar si es muy largo
                desc_text = desc_text[:32] + "..."

            c.drawString(x + KenayStyle.HARDWARE_BOX_PADDING + 15, item_y, desc_text)

            # Cantidad entre paréntesis
            c.setFont(KenayStyle.FONT_FAMILY_BOLD, KenayStyle.FONT_SIZE_BODY - 1)
            qty_text = f"(x{item['quantity']})"
            c.drawString(x + width - 25, item_y, qty_text)

            item_y -= 12

    def draw_step_diagram(self, image_data: bytes, step_number: int):
        """
        Dibuja el diagrama de instrucciones en el área de contenido.

        Args:
            image_data: Imagen en bytes
            step_number: Número del paso
        """
        c = self.c

        # Guardar imagen temporalmente para procesarla
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp_file:
            tmp_file.write(image_data)
            tmp_path = tmp_file.name

        try:
            # Abrir con PIL para obtener dimensiones
            pil_img = PILImage.open(tmp_path)
            img_width, img_height = pil_img.size

            # Calcular dimensiones manteniendo aspecto
            max_width = KenayStyle.CONTENT_WIDTH * 0.9
            max_height = KenayStyle.CONTENT_HEIGHT * 0.7

            scale = min(max_width / img_width, max_height / img_height)
            final_width = img_width * scale
            final_height = img_height * scale

            # Centrar la imagen en el área de contenido
            img_x = KenayStyle.CONTENT_X + (KenayStyle.CONTENT_WIDTH - final_width) / 2
            img_y = KenayStyle.CONTENT_Y_START - final_height - 20*mm

            # Dibujar imagen
            c.drawImage(tmp_path, img_x, img_y,
                       width=final_width, height=final_height,
                       preserveAspectRatio=True, mask='auto')

            # Marco decorativo opcional
            c.setStrokeColor(KenayStyle.COLOR_BORDER)
            c.setLineWidth(0.5)
            c.rect(img_x - 2, img_y - 2, final_width + 4, final_height + 4)

        finally:
            # Limpiar archivo temporal
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    def draw_footer(self, step_number: int, total_steps: int):
        """
        Dibuja el pie de página con "Paso X / Step X" y paginación.

        Args:
            step_number: Número del paso actual
            total_steps: Total de pasos
        """
        c = self.c
        footer_y = KenayStyle.MARGIN_BOTTOM - 5*mm

        # Línea decorativa superior
        c.setStrokeColor(KenayStyle.COLOR_SECONDARY)
        c.setLineWidth(0.5)
        c.line(KenayStyle.MARGIN_LEFT, footer_y + 10*mm,
               KenayStyle.PAGE_WIDTH - KenayStyle.MARGIN_RIGHT, footer_y + 10*mm)

        # Texto del paso (bilingüe)
        c.setFont(KenayStyle.FONT_FAMILY, KenayStyle.FONT_SIZE_FOOTER)
        c.setFillColor(KenayStyle.COLOR_TEXT)
        step_text = f"Paso {step_number} / Step {step_number}"
        c.drawString(KenayStyle.MARGIN_LEFT, footer_y, step_text)

        # Paginación (derecha)
        c.setFont(KenayStyle.FONT_FAMILY_BOLD, KenayStyle.FONT_SIZE_FOOTER)
        page_text = f"{step_number}/{total_steps}"
        page_width = c.stringWidth(page_text, KenayStyle.FONT_FAMILY_BOLD,
                                   KenayStyle.FONT_SIZE_FOOTER)
        c.drawString(KenayStyle.PAGE_WIDTH - KenayStyle.MARGIN_RIGHT - page_width,
                     footer_y, page_text)

        # Logo o marca de agua (opcional)
        c.setFont(KenayStyle.FONT_FAMILY, 7)
        c.setFillColor(KenayStyle.COLOR_SECONDARY)
        center_x = KenayStyle.PAGE_WIDTH / 2
        watermark = "KENAY HOME"
        watermark_width = c.stringWidth(watermark, KenayStyle.FONT_FAMILY, 7)
        c.drawString(center_x - watermark_width/2, footer_y, watermark)

    def add_step_page(self, step_number: int,
                      diagram_data: bytes,
                      hardware_items: List[Dict[str, any]],
                      step_title: str = ""):
        """
        Añade una página completa con un paso de instrucciones.

        Args:
            step_number: Número del paso
            diagram_data: Imagen del diagrama en bytes
            hardware_items: Lista de hardware necesario
            step_title: Título opcional del paso
        """
        # Dibujar todos los componentes de la página
        self.draw_header(step_number, step_title)
        self.draw_hardware_box(hardware_items, step_number)
        self.draw_step_diagram(diagram_data, step_number)
        self.draw_footer(step_number, self.total_steps)

        # Finalizar página
        self.c.showPage()
        self.current_step = step_number

    def add_instruction_text(self, text: str, x: float, y: float, max_width: float = None):
        """
        Añade texto de instrucciones con wrapping automático.

        Args:
            text: Texto a añadir
            x, y: Coordenadas de inicio
            max_width: Ancho máximo antes de wrap
        """
        c = self.c
        c.setFont(KenayStyle.FONT_FAMILY, KenayStyle.FONT_SIZE_BODY)
        c.setFillColor(KenayStyle.COLOR_TEXT)

        if max_width is None:
            max_width = KenayStyle.CONTENT_WIDTH

        # Wrapping simple de texto
        words = text.split()
        lines = []
        current_line = ""

        for word in words:
            test_line = current_line + " " + word if current_line else word
            if c.stringWidth(test_line, KenayStyle.FONT_FAMILY,
                           KenayStyle.FONT_SIZE_BODY) <= max_width:
                current_line = test_line
            else:
                if current_line:
                    lines.append(current_line)
                current_line = word

        if current_line:
            lines.append(current_line)

        # Dibujar líneas
        for i, line in enumerate(lines):
            c.drawString(x, y - (i * 14), line)

    def save(self):
        """Guarda el PDF final"""
        self.c.save()


# ============================================================================
# MÓDULO 3: LÓGICA DE NEGOCIO - MAPEO Y TRANSFORMACIÓN
# ============================================================================

class InstructionMapper:
    """Mapea y transforma datos del proveedor al formato Kenay"""

    @staticmethod
    def map_provider_to_kenay_steps(provider_steps: Dict[int, any],
                                     total_kenay_steps: int = 8) -> Dict[int, any]:
        """
        Mapea los pasos del proveedor al orden lógico de Kenay.
        Esta función implementa la lógica de negocio específica del mapeo.

        Args:
            provider_steps: Diccionario con pasos del proveedor
            total_kenay_steps: Número total de pasos en formato Kenay

        Returns:
            Diccionario con pasos mapeados al orden Kenay
        """
        kenay_steps = {}

        # EJEMPLO DE MAPEO (ajustar según lógica real)
        # Mapeo simple 1:1 si el número de pasos coincide
        if len(provider_steps) == total_kenay_steps:
            kenay_steps = provider_steps.copy()
        else:
            # Lógica personalizada de mapeo
            # Ejemplo: combinar o dividir pasos según sea necesario
            provider_step_numbers = sorted(provider_steps.keys())

            for i in range(1, total_kenay_steps + 1):
                if i <= len(provider_step_numbers):
                    kenay_steps[i] = provider_steps[provider_step_numbers[i-1]]
                else:
                    # Paso vacío o repetir último
                    kenay_steps[i] = provider_steps.get(provider_step_numbers[-1], {})

        return kenay_steps

    @staticmethod
    def filter_hardware_for_step(all_hardware: List[Dict],
                                  step_number: int,
                                  items_per_step: int = 3) -> List[Dict]:
        """
        Filtra el hardware relevante para un paso específico.

        Args:
            all_hardware: Lista completa de hardware
            step_number: Número del paso
            items_per_step: Cantidad de items a mostrar por paso

        Returns:
            Lista filtrada de hardware para el paso
        """
        # Estrategia simple: rotar hardware entre pasos
        # En producción, esto debería basarse en análisis del diagrama
        start_idx = ((step_number - 1) * items_per_step) % len(all_hardware)
        end_idx = start_idx + items_per_step

        if end_idx <= len(all_hardware):
            return all_hardware[start_idx:end_idx]
        else:
            # Wrap around
            return all_hardware[start_idx:] + all_hardware[:end_idx - len(all_hardware)]

    @staticmethod
    def generate_step_title(step_number: int) -> str:
        """
        Genera un título descriptivo para cada paso.

        Args:
            step_number: Número del paso

        Returns:
            Título del paso
        """
        # Títulos estándar (personalizar según necesidad)
        titles = {
            1: "PREPARACIÓN DE COMPONENTES",
            2: "MONTAJE DE BASE",
            3: "ENSAMBLAJE LATERAL",
            4: "INSTALACIÓN DE REFUERZOS",
            5: "MONTAJE SUPERIOR",
            6: "AJUSTE DE CONEXIONES",
            7: "ACABADO Y DETALLES",
            8: "VERIFICACIÓN FINAL"
        }

        return titles.get(step_number, f"PASO {step_number}")


# ============================================================================
# MÓDULO 4: ORQUESTADOR PRINCIPAL
# ============================================================================

def transform_manual(provider_pdf_path: str,
                     reference_pdf_path: str,
                     output_pdf_path: str = "Manual_Final_Kenay.pdf",
                     total_steps: int = 8,
                     custom_crop_coords: Optional[Dict[int, Tuple]] = None):
    """
    Función principal que orquesta toda la transformación del manual.

    Args:
        provider_pdf_path: Ruta al PDF del proveedor
        reference_pdf_path: Ruta al PDF de referencia Kenay
        output_pdf_path: Ruta del PDF de salida
        total_steps: Número total de pasos a generar
        custom_crop_coords: Coordenadas de recorte personalizadas por página
                           Dict[page_num, (x0, y0, x1, y1)]
    """

    print("🚀 Iniciando transformación de manual a estilo Kenay...")

    # PASO 1: Extracción de datos del proveedor
    print("📄 Extrayendo datos del PDF del proveedor...")
    extractor = PDFExtractor(provider_pdf_path)

    # Extraer hardware
    hardware_items = extractor.extract_hardware_list()
    if not hardware_items:
        # Hardware por defecto si no se detecta
        print("⚠️  No se detectó lista de hardware. Usando valores por defecto...")
        hardware_items = [
            {'label': 'A', 'description': 'Tornillo M6 x 40mm', 'quantity': 8},
            {'label': 'B', 'description': 'Tornillo M4 x 30mm', 'quantity': 12},
            {'label': 'C', 'description': 'Taco de pared', 'quantity': 4},
            {'label': 'D', 'description': 'Llave Allen 4mm', 'quantity': 1},
            {'label': 'E', 'description': 'Conector metálico', 'quantity': 6},
            {'label': 'F', 'description': 'Arandela plana', 'quantity': 8}
        ]

    print(f"✅ Detectados {len(hardware_items)} items de hardware")

    # Extraer diagramas
    print("🖼️  Extrayendo diagramas de pasos...")
    step_diagrams = extractor.extract_step_diagrams()

    if not step_diagrams:
        print("⚠️  No se detectaron diagramas automáticamente.")
        print("    Intentando extracción manual por coordenadas...")

        # Extracción manual si la automática falla
        for page_num in range(min(total_steps, len(extractor.doc))):
            coords = None
            if custom_crop_coords and page_num in custom_crop_coords:
                coords = custom_crop_coords[page_num]

            images = extractor.extract_images_from_page(page_num, crop_coords=coords)
            if images:
                step_diagrams[page_num + 1] = images[0]

    print(f"✅ Extraídos {len(step_diagrams)} diagramas")

    # Análisis del PDF de referencia
    if os.path.exists(reference_pdf_path):
        print("🎨 Analizando estilo del PDF de referencia Kenay...")
        style_params = extractor.analyze_layout(reference_pdf_path)
        print(f"✅ Detectadas {len(style_params['fonts_used'])} fuentes en referencia")

    # PASO 2: Mapeo de pasos
    print("🔄 Mapeando pasos del proveedor a formato Kenay...")
    mapped_steps = InstructionMapper.map_provider_to_kenay_steps(
        step_diagrams,
        total_steps
    )

    # PASO 3: Generación del PDF final
    print("📝 Generando PDF con estilo Kenay...")
    generator = KenayPDFGenerator(output_pdf_path, total_steps)

    for step_num in range(1, total_steps + 1):
        print(f"   Procesando paso {step_num}/{total_steps}...")

        # Obtener diagrama para este paso
        diagram_data = mapped_steps.get(step_num)

        if diagram_data is None:
            # Si falta diagrama, usar placeholder
            print(f"   ⚠️  Diagrama no disponible para paso {step_num}, usando placeholder")
            # Crear imagen placeholder simple
            placeholder_img = PILImage.new('RGB', (400, 300), color='lightgray')
            img_buffer = io.BytesIO()
            placeholder_img.save(img_buffer, format='PNG')
            diagram_data = img_buffer.getvalue()

        # Filtrar hardware relevante para este paso
        step_hardware = InstructionMapper.filter_hardware_for_step(
            hardware_items,
            step_num,
            items_per_step=min(6, len(hardware_items))
        )

        # Generar título del paso
        step_title = InstructionMapper.generate_step_title(step_num)

        # Añadir página al PDF
        generator.add_step_page(
            step_number=step_num,
            diagram_data=diagram_data,
            hardware_items=step_hardware,
            step_title=step_title
        )

    # PASO 4: Guardar PDF final
    generator.save()
    extractor.close()

    print(f"✅ ¡Transformación completada exitosamente!")
    print(f"📦 PDF generado: {output_pdf_path}")
    print(f"📊 Total de páginas: {total_steps}")

    return output_pdf_path


# ============================================================================
# PUNTO DE ENTRADA - EJECUCIÓN
# ============================================================================

if __name__ == "__main__":
    """
    Ejecutar script principal.

    INSTRUCCIONES PARA GOOGLE COLAB:

    1. Instalar dependencias:
       !pip install PyMuPDF reportlab Pillow

    2. Subir archivos PDF:
       - 'Instrucciones proveedor.pdf'
       - 'Instrucciones Kenay (1).pdf'

    3. Ejecutar este script
    """

    # CONFIGURACIÓN DE RUTAS
    PROVIDER_PDF = "Instrucciones proveedor.pdf"
    REFERENCE_PDF = "Instrucciones Kenay (1).pdf"
    OUTPUT_PDF = "Manual_Final_Kenay.pdf"

    # Verificar que los archivos existan
    if not os.path.exists(PROVIDER_PDF):
        print(f"❌ ERROR: No se encuentra '{PROVIDER_PDF}'")
        print("   Por favor, sube el archivo PDF del proveedor.")
        exit(1)

    if not os.path.exists(REFERENCE_PDF):
        print(f"⚠️  ADVERTENCIA: No se encuentra '{REFERENCE_PDF}'")
        print("   Se usará configuración de estilo por defecto.")

    # COORDENADAS PERSONALIZADAS DE RECORTE (OPCIONAL)
    # Ajustar estos valores según el layout real del PDF del proveedor
    # Formato: {página: (x0, y0, x1, y1)} en puntos
    custom_coords = {
        0: (50, 200, 550, 750),   # Página 1
        1: (50, 200, 550, 750),   # Página 2
        2: (50, 200, 550, 750),   # Página 3
        # ... agregar más según sea necesario
    }

    # EJECUTAR TRANSFORMACIÓN
    try:
        output_file = transform_manual(
            provider_pdf_path=PROVIDER_PDF,
            reference_pdf_path=REFERENCE_PDF,
            output_pdf_path=OUTPUT_PDF,
            total_steps=8,
            custom_crop_coords=custom_coords
        )

        print("\n" + "="*60)
        print("🎉 PROCESO COMPLETADO CON ÉXITO")
        print("="*60)
        print(f"\n📄 Archivo generado: {output_file}")
        print("\n💡 Próximos pasos:")
        print("   1. Abrir y revisar el PDF generado")
        print("   2. Ajustar coordenadas de recorte si es necesario")
        print("   3. Personalizar títulos de pasos en generate_step_title()")
        print("   4. Afinar mapeo de hardware en filter_hardware_for_step()")

    except Exception as e:
        print(f"\n❌ ERROR durante la transformación:")
        print(f"   {str(e)}")
        print("\n🔍 Sugerencias:")
        print("   - Verificar que los archivos PDF sean válidos")
        print("   - Ajustar coordenadas de recorte (custom_crop_coords)")
        print("   - Revisar logs de errores arriba")
        raise
