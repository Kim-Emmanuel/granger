
import { GoogleGenAI, Chat } from "@google/genai";
import { ActivityStat } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFitnessAdvice = async (stats: ActivityStat[]): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure your API key to get AI insights.";

  try {
    const statsStr = stats.map(s => `${s.label}: ${s.value}${s.unit}`).join(', ');
    const prompt = `You are a high-energy elite sports coach. My current activity stats are: ${statsStr}. 
    Give me a one-sentence, punchy, aggressive but encouraging motivation to push harder right now.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keep pushing! You're doing great.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Stay focused and keep moving forward!";
  }
};

export const getDailyChallenge = async (): Promise<string> => {
  if (!apiKey) return "API Key missing. Configure to unlock AI challenges.";

  try {
    const prompt = `You are an intense elite sports coach. Give me a single, short, punchy, specific daily fitness challenge for an intermediate athlete. 
    Examples: "Run 5k under 25 mins", "100 Burpees for time", "Plank for 4 minutes total". 
    Output ONLY the challenge text. Max 15 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sprint 100m x 10 reps.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Complete 50 pushups now.";
  }
};

export const createCoachChat = (stats: ActivityStat[]): Chat => {
  if (!apiKey) throw new Error("API Key missing");
  
  const statsContext = stats.map(s => `${s.label}: ${s.value} ${s.unit}`).join(', ');
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are Coach G, a world-class elite sports performance trainer. 
      
      USER CONTEXT (Live Stats):
      ${statsContext}
      
      YOUR ROLE:
      - Analyze the provided stats to give specific, data-driven advice.
      - Tone: High-energy, professional, slightly aggressive but highly motivating (tough love).
      - Keep responses concise (under 40 words) for a chat interface, unless the user asks for a detailed plan.
      - Use emojis sparingly (🔥, 💪, ⚡️) to emphasize power.
      - If the user is slacking (low stats), push them. If they are doing well, challenge them to go further.
      `,
    }
  });
};
