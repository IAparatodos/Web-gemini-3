import React from 'react';
import { Course } from '../types';
import { Clock, BarChart, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-adria-dark shadow-sm">
          {course.level}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-adria-dark mb-2 line-clamp-1" title={course.title}>
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>4 Semanas</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart size={16} />
            <span>Práctico</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-adria-secondary">{course.price}</span>
          <button className="text-adria-dark font-semibold flex items-center gap-1 hover:text-adria-primary transition-colors">
            Ver temario <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};