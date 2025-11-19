import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Cursos', href: '#courses' },
    { name: 'Pregunta a AdrIA', href: '#ai-assistant' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 group">
          <div className="bg-adria-primary p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Cpu className="text-adria-dark w-6 h-6" />
          </div>
          <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-adria-dark' : 'text-white'}`}>
            Código <span className="text-adria-primary">AdrIA</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`font-medium hover:text-adria-primary transition-colors ${
                isScrolled ? 'text-adria-dark' : 'text-white/90'
              }`}
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact"
            className={`px-5 py-2 rounded-full font-semibold transition-colors ${
              isScrolled 
                ? 'bg-adria-dark text-white hover:bg-adria-secondary' 
                : 'bg-white text-adria-dark hover:bg-gray-100'
            }`}
          >
            Empieza Hoy
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-adria-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-6 px-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-adria-dark font-medium text-lg hover:text-adria-secondary"
            >
              {link.name}
            </a>
          ))}
          <button className="w-full bg-adria-primary text-adria-dark py-3 rounded-lg font-bold mt-4">
            Empieza Hoy
          </button>
        </div>
      )}
    </nav>
  );
};