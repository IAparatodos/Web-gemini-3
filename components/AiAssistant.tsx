import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
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
    <section id="ai-assistant" className="py-20 bg-gradient-to-b from-adria-light to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-adria-dark mb-3">Asistente IA</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Prueba nuestra IA conversacional. Pregunta lo que quieras sobre cursos o conceptos de IA.
          </p>
        </div>

        {/* Quick suggestions */}
        <div className="max-w-3xl mx-auto mb-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setInput("¿Qué curso es mejor para una tienda online?")}
            className="px-4 py-2 text-sm bg-white hover:bg-adria-primary/10 border border-gray-200 rounded-full transition-colors"
          >
            ¿Qué curso para ecommerce?
          </button>
          <button
            onClick={() => setInput("Explícame qué es la IA generativa")}
            className="px-4 py-2 text-sm bg-white hover:bg-adria-primary/10 border border-gray-200 rounded-full transition-colors"
          >
            ¿Qué es IA generativa?
          </button>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col h-[600px]">
          {/* Chat Interface */}
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

                <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
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

          <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white flex gap-3 items-center">
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
    </section>
  );
};