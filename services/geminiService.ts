
import { GoogleGenAI, Type } from "@google/genai";
import { DreamAnalysis } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A creative, evocative title for the dream, 4-6 words long."
    },
    summary: {
      type: Type.STRING,
      description: "A one-paragraph summary of the dream's narrative and emotional tone."
    },
    symbols: {
      type: Type.ARRAY,
      description: "A list of 2-4 key symbols or objects from the dream.",
      items: {
        type: Type.OBJECT,
        properties: {
          symbol: {
            type: Type.STRING,
            description: "The name of the symbol (e.g., 'a running clock', 'a key')."
          },
          meaning: {
            type: Type.STRING,
            description: "A brief, insightful interpretation of what this symbol might represent in psychology or culture."
          }
        },
        required: ["symbol", "meaning"]
      }
    },
    themes: {
      type: Type.ARRAY,
      description: "A list of 3-5 main emotional or psychological themes present in the dream (e.g., 'Anxiety', 'Freedom', 'Transformation').",
      items: {
        type: Type.STRING
      }
    },
    image_prompt_enhancement: {
      type: Type.STRING,
      description: "A short, highly descriptive phrase that captures the essence and key visual elements of the dream, suitable for an AI image generator. Focus on objects, setting, color, and mood. Example: 'A surreal landscape with melting clocks and a single, glowing key hanging in a purple, starry sky'."
    }
  },
  required: ["title", "summary", "symbols", "themes", "image_prompt_enhancement"]
};

export const analyzeDream = async (dreamDescription: string): Promise<DreamAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following dream description: "${dreamDescription}"`,
      config: {
        systemInstruction: "You are a serene and insightful dream interpreter. Your goal is to analyze a user's dream description and provide a structured, symbolic interpretation. Respond ONLY with the JSON format defined in the schema.",
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    const jsonText = response.text.trim();
    // In case the model wraps the JSON in markdown backticks
    const cleanedJson = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(cleanedJson) as DreamAnalysis;
  } catch (error) {
    console.error("Error analyzing dream:", error);
    throw new Error("Failed to analyze the dream. The model may have returned an unexpected response.");
  }
};

export const visualizeDream = async (prompt: string): Promise<string> => {
  try {
    const finalPrompt = `An ethereal, dreamlike digital painting of ${prompt}. Style: surreal, fantasy, high detail, cinematic lighting, epic composition.`;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error visualizing dream:", error);
    throw new Error("Failed to create a visualization for the dream.");
  }
};
