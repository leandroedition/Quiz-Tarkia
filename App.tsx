import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { generateQuizQuestions } from './services/geminiService';
import { AppStatus, Question, QuizConfig } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.SETUP);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const handleStartQuiz = async (config: QuizConfig) => {
    setStatus(AppStatus.LOADING);
    try {
      const generatedQuestions = await generateQuizQuestions(config);
      setQuestions(generatedQuestions);
      setUserAnswers(new Array(generatedQuestions.length).fill(-1));
      setStatus(AppStatus.QUIZ);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar o quiz. Por favor verifique sua chave de API e tente novamente.");
      setStatus(AppStatus.SETUP);
    }
  };

  const handleQuizFinish = (answers: number[], finalScore: number) => {
    setUserAnswers(answers);
    setScore(finalScore);
    setStatus(AppStatus.RESULTS);
  };

  const handleRestart = () => {
    setStatus(AppStatus.SETUP);
    setQuestions([]);
    setUserAnswers([]);
    setScore(0);
  };

  return (
    <div className="h-full w-full bg-tarkia-navy font-sans">
      {status === AppStatus.SETUP && (
        <SetupScreen onStart={handleStartQuiz} isLoading={false} />
      )}

      {status === AppStatus.LOADING && (
        <div className="h-full flex flex-col items-center justify-center text-tarkia-gold animate-fade-in">
          <Loader2 className="w-16 h-16 animate-spin mb-4" />
          <h2 className="text-2xl font-serif">Consultando a inteligência Tarkia...</h2>
          <p className="text-gray-400 mt-2">Preparando suas perguntas personalizadas.</p>
        </div>
      )}

      {status === AppStatus.QUIZ && (
        <QuizScreen 
          questions={questions} 
          onFinish={handleQuizFinish} 
        />
      )}

      {status === AppStatus.RESULTS && (
        <ResultsScreen 
          score={score} 
          total={questions.length} 
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default App;