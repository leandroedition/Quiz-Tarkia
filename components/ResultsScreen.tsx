import React, { useRef, useState } from 'react';
import { RefreshCcw, ExternalLink, Trophy, Share2, Instagram } from 'lucide-react';

interface ResultsScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, total, onRestart }) => {
  const [isSharing, setIsSharing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const percentage = Math.round((score / total) * 100);
  
  let message = "";
  let subMessage = "";

  if (percentage >= 80) {
    message = "Visionário Internacional";
    subMessage = "Você compreende a importância da estrutura além dos tijolos. Está pronto para a Rota da Águia.";
  } else if (percentage >= 50) {
    message = "Em Construção";
    subMessage = "Você tem boas noções, mas ainda há riscos ocultos em sua estratégia de internacionalização.";
  } else {
    message = "Precisa de Planejamento";
    subMessage = "Cuidado. Ficar onde está pode ser o maior risco. É hora de buscar conhecimento estruturado.";
  }

  const generateAndShareImage = async () => {
    setIsSharing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions (Story Format: 1080x1920)
    canvas.width = 1080;
    canvas.height = 1920;

    // --- Background ---
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    gradient.addColorStop(0, '#0B2341'); // Tarkia Navy
    gradient.addColorStop(1, '#051121'); // Darker Navy
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- Border ---
    ctx.strokeStyle = '#C5A572'; // Gold
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, 1000, 1840);

    // --- Logo Text ---
    ctx.fillStyle = '#C5A572';
    ctx.font = 'bold 50px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('TARKIA', 540, 200);
    
    ctx.fillStyle = '#E5C592';
    ctx.font = '30px "Inter", sans-serif';
    ctx.letterSpacing = '10px';
    ctx.fillText('INTELLIGENCE', 540, 250);

    // --- Score Circle ---
    ctx.beginPath();
    ctx.arc(540, 600, 200, 0, 2 * Math.PI);
    ctx.strokeStyle = '#C5A572';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.fillStyle = 'rgba(197, 165, 114, 0.1)';
    ctx.fill();

    // --- Score Number ---
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 180px "Playfair Display", serif';
    ctx.fillText(`${score}/${total}`, 540, 620);
    
    ctx.fillStyle = '#C5A572';
    ctx.font = '40px "Inter", sans-serif';
    ctx.fillText('ACERTOS', 540, 720);

    // --- Dynamic Title Sizing ---
    const titleText = message.toUpperCase();
    let titleFontSize = 90; // Starting font size
    ctx.font = `bold ${titleFontSize}px "Playfair Display", serif`;
    
    // Reduce font size until it fits within 900px width
    while (ctx.measureText(titleText).width > 900 && titleFontSize > 30) {
      titleFontSize -= 5;
      ctx.font = `bold ${titleFontSize}px "Playfair Display", serif`;
    }

    ctx.fillStyle = '#C5A572';
    ctx.fillText(titleText, 540, 1000);

    // --- Subtext (Word Wrap) ---
    ctx.fillStyle = '#DDDDDD';
    ctx.font = 'italic 40px "Playfair Display", serif';
    const words = subMessage.split(' ');
    let line = '';
    let y = 1150;
    const maxWidth = 800;
    
    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, 540, y);
        line = words[n] + ' ';
        y += 60;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, y);

    // --- CTA Footer ---
    // Background box for CTA
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.roundRect(140, 1550, 800, 250, 20);
    ctx.fill();

    ctx.fillStyle = '#E5C592';
    ctx.font = 'bold 35px "Inter", sans-serif';
    ctx.fillText('QUER SABER O SEU NÍVEL?', 540, 1620);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '40px "Inter", sans-serif';
    ctx.fillText('Faça o teste no link da bio:', 540, 1680);

    ctx.fillStyle = '#C5A572';
    ctx.font = 'bold 50px "Inter", sans-serif';
    ctx.fillText('@tarkia.ae', 540, 1750);

    // --- Convert to Blob and Share ---
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
            setIsSharing(false);
            return;
        }
        
        const file = new File([blob], 'tarkia-result.png', { type: 'image/png' });
        
        // Use Web Share API if available
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Meu Resultado Tarkia',
            text: `Acertei ${score}/${total} no quiz da Tarkia! Você está preparado para investir em Dubai? Faça o teste também: @tarkia.ae #Tarkia #Dubai #Investimento`,
          });
        } else {
          // Fallback: Download
          const link = document.createElement('a');
          link.download = 'tarkia-result.png';
          link.href = canvas.toDataURL();
          link.click();
          alert("A imagem foi salva no seu dispositivo. Poste no Instagram e marque @tarkia.ae!");
        }
        setIsSharing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing:', error);
      alert("Não foi possível compartilhar automaticamente.");
      setIsSharing(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-6 relative overflow-y-auto">
      {/* Hidden Canvas for Image Generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Background Decorative */}
      <div className="absolute inset-0 bg-tarkia-navy -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-tarkia-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="max-w-3xl w-full z-10 text-center animate-slide-up my-auto">
        
        <div className="inline-block p-4 rounded-full bg-gradient-to-br from-tarkia-gold to-yellow-600 mb-8 shadow-2xl shadow-tarkia-gold/20">
          <Trophy className="w-12 h-12 text-tarkia-navy" />
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
          {message}
        </h1>
        <p className="text-tarkia-gold text-xl mb-12 font-light">
          Você acertou {score} de {total} questões
        </p>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 mb-10">
          <p className="text-gray-200 text-lg leading-relaxed mb-8">
            "{subMessage}"
          </p>
          
          <div className="bg-tarkia-navy/50 p-6 rounded-xl border border-tarkia-gold/20">
            <h3 className="text-tarkia-gold font-bold uppercase text-sm tracking-wider mb-2">Próximo Passo</h3>
            <p className="text-white font-serif text-xl italic">
              "Não voe sozinho. Voe com a bússola certa."
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={generateAndShareImage}
            disabled={isSharing}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
             {isSharing ? 'Gerando...' : (
               <>
                 <Instagram size={20} /> Compartilhar Resultado
               </>
             )}
          </button>
          
          <a 
            href="https://www.tarkia.ae" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-tarkia-gold text-tarkia-navy rounded-lg font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Agendar Consultoria <ExternalLink size={20} />
          </a>
        </div>
        
        <div className="mt-6 flex justify-center">
             <button
            onClick={onRestart}
            className="px-6 py-2 bg-transparent border border-white/20 text-white/70 rounded-lg text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            Refazer Quiz <RefreshCcw size={16} />
          </button>
        </div>

        <footer className="mt-12 text-white/30 text-sm">
          © Tarkia.ae - Dubai, UAE
        </footer>
      </div>
    </div>
  );
};

export default ResultsScreen;