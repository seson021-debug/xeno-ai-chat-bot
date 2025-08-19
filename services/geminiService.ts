
import { GoogleGenAI } from "@google/genai";
import type { Message, Author } from '../types';
import { Author as AuthorEnum } from '../types';

if (!process.env.API_KEY) {
  console.warn(
    "API_KEY environment variable not set. Using a mock service. AI features will be disabled."
  );
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const createMockStream = async function* (prompt: string) {
    const mockResponses = [
        "I'm sorry, ", "I can't connect to the AI service right now. ",
        "Please check if the API_KEY is configured correctly. ",
        `Your prompt was: "${prompt}"`
    ];
    for (const response of mockResponses) {
        await new Promise(res => setTimeout(res, 150));
        yield { text: response };
    }
};

export const streamChatResponse = async (chatHistory: Message[], newPrompt: string) => {
  if (!ai) {
    return createMockStream(newPrompt);
  }

  const contents = [
    ...chatHistory.map(msg => ({
      role: msg.author === AuthorEnum.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    { role: 'user', parts: [{ text: newPrompt }] }
  ];

  try {
    const responseStream = await ai.models.generateContentStream({
       model: "gemini-2.5-flash",
       contents: contents,
       config: {
         systemInstruction: "You are Xeno, a helpful and creative AI assistant. Be concise and friendly.",
       },
    });

    const stream = (async function* () {
      for await (const chunk of responseStream) {
        yield { text: chunk.text };
      }
    })();
    
    return stream;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get response from AI. Please check your connection and API key.");
  }
};
