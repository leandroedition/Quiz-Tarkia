import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizConfig } from "../types";

export const generateQuizQuestions = async (config: QuizConfig): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Atue como um consultor sênior de negócios internacionais e estruturação patrimonial (foco Brasil-Dubai).
    Crie um quiz de ${config.questionCount} perguntas de nível ${config.difficulty} em PORTUGUÊS (Brasil) com base no texto abaixo.
    
    ESTILO:
    - O tom deve ser sofisticado, direto e profissional (Business Luxury).
    - Evite linguagem infantil ou "escolar". Use termos como "Investidor", "Estrutura", "Holding", "Compliance".
    - O objetivo é testar o conhecimento do usuário sobre os riscos fiscais no Brasil e as vantagens de estruturar em Dubai.

    TEXTO BASE (Do eBook "Tarkia"):
    "${config.sourceText.substring(0, 25000)}" 
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "A pergunta do quiz. Deve ser desafiadora."
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4 opções de resposta. Apenas uma correta."
              },
              correctIndex: {
                type: Type.INTEGER,
                description: "O índice da resposta correta (0-3)."
              },
              explanation: {
                type: Type.STRING,
                description: "Explicação técnica e concisa do porquê, reforçando a autoridade da Tarkia."
              }
            },
            required: ["text", "options", "correctIndex", "explanation"],
            propertyOrdering: ["text", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Sem resposta do modelo.");
    }
    
    const rawQuestions = JSON.parse(jsonText);

    return rawQuestions.map((q: any, index: number) => ({
      id: `q-${index}-${Date.now()}`,
      ...q
    }));

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Falha ao gerar o quiz. Por favor, tente novamente.");
  }
};