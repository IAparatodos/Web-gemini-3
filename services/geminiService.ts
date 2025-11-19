import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Please check your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: `Eres "AdrIA", el asistente virtual experto de la academia "Código AdrIA". 
        
        Tu personalidad:
        - Eres amable, profesional pero cercano, fresco y claro (estilo Adrihosan).
        - Tu objetivo es ayudar a pequeñas empresas y entusiastas a entender qué es la IA y cómo puede ayudarles.
        - Promueves los cursos de la academia (Automatización, IA Generativa, ChatGPT para negocios).
        - Tus respuestas son concisas (máximo 3 párrafos).
        
        Tono:
        - Motivador y educativo.
        - Usas emojis ocasionalmente para mantener la frescura.
        
        Si te preguntan precios específicos, diles que visiten la sección de contacto o cursos para la oferta más actualizada.`,
        temperature: 0.7,
      }
    });

    return response.text || "Lo siento, tuve un pequeño cortocircuito. ¿Podrías repetírmelo?";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Parece que mis circuitos están un poco saturados. Intenta de nuevo en unos momentos.";
  }
};
