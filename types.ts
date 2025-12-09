export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizConfig {
  sourceText: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  questionCount: number;
  themeColor: string;
  primaryFont: 'sans' | 'serif';
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  answers: number[]; // Index of user answers provided so far (-1 if skipped/not answered yet)
  isFinished: boolean;
}

export enum AppStatus {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export const THEME_COLORS = [
  { name: 'Azul Corporativo', value: 'blue', hex: '#2563eb', bg: 'bg-blue-600', text: 'text-blue-600', ring: 'ring-blue-600', border: 'border-blue-600' },
  { name: 'Verde Natureza', value: 'emerald', hex: '#059669', bg: 'bg-emerald-600', text: 'text-emerald-600', ring: 'ring-emerald-600', border: 'border-emerald-600' },
  { name: 'Roxo Criativo', value: 'purple', hex: '#7c3aed', bg: 'bg-purple-600', text: 'text-purple-600', ring: 'ring-purple-600', border: 'border-purple-600' },
  { name: 'Laranja Vibrante', value: 'orange', hex: '#ea580c', bg: 'bg-orange-600', text: 'text-orange-600', ring: 'ring-orange-600', border: 'border-orange-600' },
  { name: 'Preto Minimalista', value: 'slate', hex: '#1e293b', bg: 'bg-slate-800', text: 'text-slate-800', ring: 'ring-slate-800', border: 'border-slate-800' },
  { name: 'Rosa Moderno', value: 'pink', hex: '#db2777', bg: 'bg-pink-600', text: 'text-pink-600', ring: 'ring-pink-600', border: 'border-pink-600' },
];