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
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-adria-dark mb-4">
            ¿Por qué elegir nuestra plataforma?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aprendizaje práctico y accesible para todos
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-14 h-14 bg-adria-dark rounded-lg flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-adria-dark mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};