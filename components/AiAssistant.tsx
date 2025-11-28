import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { downloadProveedorPDF } from '../services/pdfService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles, FileDown } from 'lucide-react';
import { Button } from './Button';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: '¡Hola! Soy AdrIA 🤖. Estoy aquí para ayudarte a descubrir cómo la Inteligencia Artificial puede potenciar tu negocio o carrera. ¿Qué te gustaría saber?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(input);
      
      const botMessage: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-assistant" className="py-20 bg-adria-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-adria-secondary font-semibold tracking-wide uppercase text-sm">Experiencia Interactiva</span>
          <h2 className="text-4xl font-bold text-adria-dark mt-2 mb-4">Habla con AdrIA</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ¿No sabes por dónde empezar? Pregúntale a nuestro asistente virtual entrenado para guiarte en el mundo de la IA.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row h-[600px]">
          
          {/* Left Panel (Info) */}
          <div className="hidden md:flex md:w-1/3 bg-adria-dark p-8 flex-col justify-between text-white">
            <div>
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="text-adria-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tu guía personal</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                AdrIA utiliza la tecnología Gemini de Google para responder tus dudas sobre nuestros cursos y sobre conceptos básicos de IA.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs uppercase text-gray-400 tracking-wider font-semibold">Sugerencias</p>
              <button
                onClick={() => setInput("¿Qué curso es mejor para una tienda online?")}
                className="block w-full text-left text-sm p-3 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                "¿Qué curso para ecommerce?"
              </button>
              <button
                 onClick={() => setInput("Explícame qué es la IA generativa")}
                className="block w-full text-left text-sm p-3 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                "¿Qué es IA generativa?"
              </button>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs uppercase text-gray-400 tracking-wider font-semibold mb-3">Recursos</p>
                <button
                  onClick={downloadProveedorPDF}
                  className="flex items-center gap-2 w-full text-left text-sm p-3 rounded bg-adria-primary/20 hover:bg-adria-primary/30 transition-colors border border-adria-primary/30"
                >
                  <FileDown size={16} className="text-adria-primary" />
                  <span>Descargar Instrucciones PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="w-full md:w-2/3 flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-adria-primary flex items-center justify-center flex-shrink-0">
                      <Bot size={18} className="text-adria-dark" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-adria-secondary text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                   <div className="w-8 h-8 rounded-full bg-adria-primary flex items-center justify-center flex-shrink-0">
                      <Bot size={18} className="text-adria-dark" />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-adria-secondary" />
                      <span className="text-xs text-gray-400">Pensando...</span>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex gap-3 items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 bg-gray-100 text-gray-800 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-adria-primary/50 transition-all"
              />
              <Button type="submit" variant="primary" className="!px-4 !py-3 rounded-full">
                <Send size={20} />
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};