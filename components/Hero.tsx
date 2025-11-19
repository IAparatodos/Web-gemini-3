import React from 'react';
import { Button } from './Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-adria-dark">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-adria-secondary/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-adria-dark to-transparent"></div>
         <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-adria-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-white space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-adria-primary text-sm font-medium">
            <Sparkles size={16} />
            <span>La IA no es el futuro, es el presente</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Descubre la <br/>
            <span className="text-adria-primary">Inteligencia Artificial</span> <br/>
            sin complicaciones.
          </h1>
          
          <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
            En Código AdrIA, enseñamos a pequeñas empresas y apasionados a dominar la tecnología que está cambiando el mundo. Fresco, limpio y directo al grano.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="primary" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth'})}>
              Ver Cursos <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth'})}>
              Probar Demo IA
            </Button>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://picsum.photos/800/1000?grayscale" 
              alt="Estudiante aprendiendo IA" 
              className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-adria-secondary/30 mix-blend-multiply"></div>
          </div>
          
          {/* Decorative floating card */}
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-adria-primary rounded-full flex items-center justify-center text-adria-dark font-bold">AI</div>
              <div>
                <p className="text-adria-dark font-bold text-sm">Curso Destacado</p>
                <p className="text-xs text-gray-500">Automatización PyME</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-adria-primary h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};