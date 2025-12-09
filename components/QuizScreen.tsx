import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (answers: number[], score: number) => void;
}

// Simple synth for sound effects
const playSound = (type: 'success' | 'error') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'success') {
      // Pleasant "Ding" (Sine wave, high pitch fading out)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6
      
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } else {
      // Dull "Thud" (Triangle wave, low pitch)
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(150, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(s => s + 1);
      playSound('success');
    } else {
      playSound('error');
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake after animation
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onFinish(answers, score);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-tarkia-gold to-transparent"></div>
       <div className="absolute bottom-0 right-0 w-64 h-64 bg-tarkia-blue rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-4xl z-10">
        {/* Header / Progress */}
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="text-tarkia-gold text-sm font-bold tracking-widest uppercase">Questão {currentIndex + 1}</span>
            <span className="text-gray-500 text-sm ml-2">/ {questions.length}</span>
          </div>
          <div className="text-white/50 font-serif text-sm italic">
            Tarkia Intelligence
          </div>
        </div>

        {/* Question Card */}
        <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up ${shake ? 'animate-shake' : ''}`}>
          <div className="p-8 md:p-10 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-serif text-tarkia-navy leading-snug">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="p-8 bg-gray-50">
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, index) => {
                let cardStyle = "border-gray-200 hover:border-tarkia-gold hover:bg-white text-gray-700";
                
                if (selectedOption === index && !isAnswered) {
                  cardStyle = "border-tarkia-gold bg-tarkia-gold/10 text-tarkia-navy ring-1 ring-tarkia-gold";
                }

                if (isAnswered) {
                   if (index === currentQuestion.correctIndex) {
                     cardStyle = "border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500";
                   } else if (index === selectedOption && index !== currentQuestion.correctIndex) {
                     cardStyle = "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500";
                   } else {
                     cardStyle = "border-gray-100 opacity-50";
                   }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={isAnswered}
                    className={`p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group ${cardStyle}`}
                  >
                    <span className="text-lg font-medium">{option}</span>
                    {isAnswered && index === currentQuestion.correctIndex && <CheckCircle2 className="text-green-600" />}
                    {isAnswered && index === selectedOption && index !== currentQuestion.correctIndex && <XCircle className="text-red-600" />}
                    {!isAnswered && selectedOption === index && <div className="w-4 h-4 bg-tarkia-gold rounded-full"></div>}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Action Area */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 h-24">
              {isAnswered ? (
                <div className="flex-1 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="text-tarkia-gold shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-tarkia-navy text-sm uppercase mb-1">Feedback do Especialista</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1"></div>
              )}

              <div className="shrink-0 w-full md:w-auto">
                {!isAnswered ? (
                   <button
                   onClick={handleConfirm}
                   disabled={selectedOption === null}
                   className="w-full md:w-auto px-8 py-3 bg-tarkia-navy text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-tarkia-blue transition-colors"
                 >
                   Confirmar Resposta
                 </button>
                ) : (
                  <button
                  onClick={handleNext}
                  className="w-full md:w-auto px-8 py-3 bg-tarkia-gold text-tarkia-navy rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                >
                  {currentIndex === questions.length - 1 ? "Ver Resultado" : "Próxima"} <ArrowRight size={18} />
                </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;