export interface Course {
  id: number;
  title: string;
  description: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  image: string;
  price: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
