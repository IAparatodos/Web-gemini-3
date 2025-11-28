import React from 'react';
import { Button } from './Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 bg-adria-dark">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-adria-primary text-sm font-medium">
            <Sparkles size={16} />
            <span>Plataforma de IA Educativa</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Aprende <span className="text-adria-primary">Inteligencia Artificial</span> de forma práctica
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Cursos prácticos y asistente IA para ayudarte a dominar la tecnología del futuro
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <Button variant="primary" onClick={() => document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth'})}>
              Probar Asistente IA <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth'})}>
              Ver Cursos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};