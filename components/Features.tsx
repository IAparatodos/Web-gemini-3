import React from 'react';
import { Brain, Target, Users, Lightbulb } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-adria-primary" />,
      title: "Aprendizaje Práctico",
      description: "Olvídate de la teoría aburrida. Aquí aprendes haciendo, implementando IA en casos reales desde el día uno."
    },
    {
      icon: <Target className="w-8 h-8 text-adria-primary" />,
      title: "Enfoque PyME",
      description: "Diseñamos estrategias específicas para pequeñas empresas que buscan automatizar procesos y ahorrar tiempo."
    },
    {
      icon: <Users className="w-8 h-8 text-adria-primary" />,
      title: "Comunidad AdrIA",
      description: "Únete a un ecosistema de apasionados donde compartimos prompts, herramientas y éxitos."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-adria-primary" />,
      title: "Claridad Total",
      description: "Explicamos lo complejo de forma sencilla. Ese es el sello de la casa."
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <span className="text-adria-primary font-bold tracking-widest uppercase text-sm">¿Por qué nosotros?</span>
            <h2 className="text-4xl font-bold text-adria-dark mt-2 mb-6">
              Democratizamos la <br />
              <span className="text-adria-secondary">Inteligencia Artificial</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              En <strong>Código AdrIA</strong>, creemos que la tecnología no debe ser una barrera, sino un puente. 
              Utilizamos una metodología fresca y limpia para que descubras el potencial de la IA sin sentirte abrumado.
            </p>
            <div className="p-6 bg-adria-light rounded-xl border-l-4 border-adria-primary">
              <p className="italic text-adria-dark font-medium">
                "La IA no viene a reemplazarte, viene a potenciar lo que ya haces bien."
              </p>
            </div>
          </div>

          <div className="md:w-1/2 grid sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-adria-primary/30 group">
                <div className="w-14 h-14 bg-adria-dark rounded-lg flex items-center justify-center mb-4 group-hover:bg-adria-secondary transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-adria-dark mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};