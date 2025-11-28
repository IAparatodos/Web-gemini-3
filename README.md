# Código AdrIA - Web App

Aplicación web interactiva con un chatbot (AdrIA) powered by Google Gemini para la academia "Código AdrIA".

## 🤖 Características

- Chatbot interactivo con IA (AdrIA) usando Google Gemini
- Interfaz moderna y responsive con React + TypeScript
- Información sobre cursos de IA
- Sistema de navegación intuitivo

## 🚀 Ejecución Local

**Prerequisitos:** Node.js

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar API Key de Gemini:
   - Crear archivo `.env.local` en la raíz del proyecto
   - Agregar: `GEMINI_API_KEY=tu_api_key_aqui`

3. Ejecutar la aplicación:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador: `http://localhost:5173`

## 🛠️ Tecnologías

- React 19
- TypeScript
- Vite
- Google Gemini AI
- Tailwind CSS
- Lucide React (iconos)

## ☁️ Deploy en Vercel

### Opción 1: Deploy con un click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/IAparatodos/Web-gemini-3&env=GEMINI_API_KEY&envDescription=API%20Key%20de%20Google%20Gemini&envLink=https://aistudio.google.com/apikey)

### Opción 2: Deploy manual

1. Crear cuenta en [Vercel](https://vercel.com)

2. Instalar Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Hacer login:
   ```bash
   vercel login
   ```

4. Deploy desde el directorio del proyecto:
   ```bash
   vercel
   ```

5. Configurar variable de entorno en Vercel:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Agrega: `GEMINI_API_KEY` con tu API key
   - Redeploy el proyecto

### Opción 3: Deploy desde GitHub

1. Ve a [Vercel](https://vercel.com) y haz login con GitHub
2. Click en "Add New Project"
3. Importa el repositorio `IAparatodos/Web-gemini-3`
4. Configura la variable de entorno:
   - `GEMINI_API_KEY`: Tu API key de Gemini
5. Click en "Deploy"

¡Listo! Tu aplicación estará disponible en una URL pública de Vercel.
