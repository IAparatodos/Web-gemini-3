import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CourseCard } from './components/CourseCard';
import { AiAssistant } from './components/AiAssistant';
import { Course } from './types';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const courses: Course[] = [
  {
    id: 1,
    title: "IA para Pequeñas Empresas",
    description: "Aprende a automatizar correos, atención al cliente y redes sociales con herramientas gratuitas.",
    level: "Principiante",
    image: "https://picsum.photos/600/400?random=1",
    price: "199€"
  },
  {
    id: 2,
    title: "Dominando el Prompt Engineering",
    description: "Deja de hablarle a la IA como un robot. Aprende a pedirle exactamente lo que necesitas.",
    level: "Intermedio",
    image: "https://picsum.photos/600/400?random=2",
    price: "249€"
  },
  {
    id: 3,
    title: "Creación de Contenido con IA",
    description: "Genera imágenes, textos y vídeos para tu marca manteniendo tu identidad visual.",
    level: "Principiante",
    image: "https://picsum.photos/600/400?random=3",
    price: "150€"
  }
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans bg-white text-adria-dark selection:bg-adria-primary selection:text-adria-dark">
      <Navbar />
      
      <main>
        <Hero />
        
        <Features />
        
        <section id="courses" className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-adria-dark mb-4">Nuestros Cursos</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Formación diseñada para tener impacto inmediato. Sin relleno, solo herramientas que funcionan.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>

        <AiAssistant />
        
        <section id="contact" className="bg-adria-dark py-20 text-white">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">¿Listo para el futuro?</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Si tienes dudas sobre qué camino tomar o quieres una consultoría personalizada para tu empresa, estamos aquí para escucharte.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-300">
                  <Mail className="text-adria-primary" />
                  <span>hola@codigoadria.com</span>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <Phone className="text-adria-primary" />
                  <span>+34 600 123 456</span>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <MapPin className="text-adria-primary" />
                  <span>Valencia, España (Mediterráneo Style)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                  <input type="text" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-adria-primary transition-colors" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input type="email" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-adria-primary transition-colors" placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mensaje</label>
                  <textarea rows={4} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-adria-primary transition-colors" placeholder="¿En qué podemos ayudarte?"></textarea>
                </div>
                <button type="button" className="w-full bg-adria-primary text-adria-dark font-bold py-3 rounded-lg hover:bg-teal-300 transition-colors">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0b2228] py-12 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white font-bold text-xl">
            Código <span className="text-adria-primary">AdrIA</span>
          </div>
          
          <div className="text-gray-400 text-sm">
            © 2025 Código AdrIA. Todos los derechos reservados.
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-adria-primary transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-adria-primary transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-adria-primary transition-colors"><Facebook size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;