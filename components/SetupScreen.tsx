import React, { useState, useEffect } from 'react';
import { QuizConfig } from '../types';
import { Sparkles, Globe2, Building2, ArrowRight } from 'lucide-react';

interface SetupScreenProps {
  onStart: (config: QuizConfig) => void;
  isLoading: boolean;
}

const TARKIA_EBOOK_TEXT = `
O novo mapa da liberdade FINANCEIRA. Como Estruturar Negócios e Patrimônio em Dubai com Segurança Fiscal e Jurídica.
O Brasil Encarece, o Mundo Acelera. O custo de manter capital no Brasil não é mais apenas financeiro; é estrutural.
Erro 1 - Escolha da zona franca pela "estrela" e não pelo escopo estratégico.
Erro 2 - Ignorar os custos "invisíveis" que reduzem o rendimento real do negócio.
Erro 3 - Confiar em "Promessas de visto" ou em agentes sem due-diligence.
Erro 4 - Não separar o investimento imobiliário do planejamento societário/fiscal.
Erro 5 - Acreditar que "0%" de imposto significa "sem obrigações".
A lógica para o investidor estratégico: Transferir parte do portfólio imobiliário para uma holding ou empresa de investimento nos Emirados; Reter rendimentos em ambiente de baixa tributação e reinvesti-los em novos ativos; Blindar patrimônio de riscos políticos e sucessórios brasileiros; Aproveitar o câmbio, recebendo renda em AED/USD.
Imposto corporativo federal foi introduzido em junho de 2023 com taxa de 9% sobre lucros acima de AED 375.000.
Holding de participação: ideal muitas vezes para deter participações em empresas brasileiras ou internacionais.
Critérios para ser considerado residente fiscal nos EAU: Estar fisicamente presente nos EAU por 183 dias ou mais; ou 90 dias com residência permanente/visto.
A Tarkia ajuda você a estruturar além dos tijolos: diagnóstico patrimonial, saída fiscal do Brasil, constituição da holding nos EAU.
`;

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Médio' | 'Difícil'>('Médio');
  
  // Auto-start setup with defaults
  const handleStart = () => {
    onStart({
      sourceText: TARKIA_EBOOK_TEXT,
      difficulty,
      questionCount: 10, // Changed to 10 as requested
      themeColor: 'tarkia',
      primaryFont: 'serif'
    });
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-tarkia-navy text-white overflow-hidden relative">
      
      {/* Background Decorative Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <path d="M0,100 Q400,300 800,100 T1600,100" fill="none" stroke="#C5A572" strokeWidth="1" />
          <path d="M0,200 Q400,400 800,200 T1600,200" fill="none" stroke="#C5A572" strokeWidth="1" />
          <path d="M0,300 Q400,500 800,300 T1600,300" fill="none" stroke="#C5A572" strokeWidth="1" />
        </svg>
      </div>

      {/* Left Panel - Hero */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-center relative z-10 animate-slide-up">
        <div className="mb-8">
          <div className="border border-tarkia-gold/50 inline-block px-4 py-1 mb-6 text-tarkia-gold tracking-[0.2em] uppercase text-sm font-serif">
            Tarkia
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-4">
            O novo mapa da <br />
            <span className="text-tarkia-gold font-bold">LIBERDADE FINANCEIRA</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-lg leading-relaxed">
            Teste seus conhecimentos sobre como estruturar negócios e patrimônio em Dubai com segurança fiscal e jurídica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-w-lg">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-tarkia-gold/10 rounded-lg text-tarkia-gold">
              <Globe2 size={24} />
            </div>
            <div>
              <h3 className="font-serif text-lg">Internacionalização</h3>
              <p className="text-sm text-gray-400">Expanda fronteiras com segurança</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-tarkia-gold/10 rounded-lg text-tarkia-gold">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-serif text-lg">Holding Patrimonial</h3>
              <p className="text-sm text-gray-400">Proteção e eficiência fiscal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Action */}
      <div className="flex-1 bg-white/5 backdrop-blur-sm border-l border-white/10 p-8 md:p-16 flex flex-col justify-center z-10">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-tarkia-navy/80 border border-tarkia-gold/30 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
            <h2 className="text-2xl font-serif mb-6 text-center">Prepare-se para o Quiz</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-tarkia-gold text-sm uppercase tracking-wide mb-3">Nível de Dificuldade</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Fácil', 'Médio', 'Difícil'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level as any)}
                      className={`py-2 px-4 rounded border transition-all duration-300 ${
                        difficulty === level 
                          ? 'bg-tarkia-gold text-tarkia-navy border-tarkia-gold font-bold' 
                          : 'border-white/20 text-gray-400 hover:border-tarkia-gold/50 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleStart}
                  disabled={isLoading}
                  className="w-full group bg-gradient-to-r from-tarkia-gold to-tarkia-gold-light text-tarkia-navy font-bold text-lg py-4 px-6 rounded-lg shadow-lg hover:shadow-tarkia-gold/20 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="animate-spin" /> Gerando Quiz...
                    </>
                  ) : (
                    <>
                      Iniciar Desafio (10 Questões) <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                Baseado no eBook oficial da Tarkia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;