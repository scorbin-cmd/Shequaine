import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CampaignInputs, CampaignOutput } from "../types";

// Initialize the client with the API Key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    brandName: { type: Type.STRING },
    webHero: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        subhead: { type: Type.STRING },
        cta: { type: Type.STRING },
      },
      required: ["headline", "subhead", "cta"],
    },
    productPage: {
      type: Type.OBJECT,
      properties: {
        valueProp: { type: Type.STRING },
        benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
        description: { type: Type.STRING },
      },
      required: ["valueProp", "benefits", "description"],
    },
    socialMedia: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
        },
      },
    },
    blogIntro: { type: Type.STRING },
    emailSequence: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING },
        },
      },
    },
    ads: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          framework: { type: Type.STRING },
          headline: { type: Type.STRING },
          body: { type: Type.STRING },
        },
      },
    },
    tiktokScript: { type: Type.STRING },
    proximityPack: {
      type: Type.OBJECT,
      properties: {
        qrLanding: { type: Type.STRING },
        whatsappMsg: { type: Type.STRING },
        incentive: { type: Type.STRING },
      },
      required: ["qrLanding", "whatsappMsg", "incentive"],
    },
    strategy: {
      type: Type.OBJECT,
      properties: {
        toneGuide: { type: Type.STRING },
        personaDefinition: { type: Type.STRING },
      },
      required: ["toneGuide", "personaDefinition"],
    },
    aioGeo: { type: Type.STRING },
  },
  required: [
    "brandName",
    "webHero",
    "productPage",
    "socialMedia",
    "blogIntro",
    "emailSequence",
    "ads",
    "tiktokScript",
    "proximityPack",
    "strategy",
    "aioGeo",
  ],
};

export const generateCampaign = async (
  inputs: CampaignInputs
): Promise<CampaignOutput> => {
  const modelId = "gemini-2.5-flash"; // Using Flash for speed/efficiency in structured data tasks

  const systemInstruction = `
    You are the Campaign Engine Core. 
    Your goal is to accept raw business parameters and output a complete, Swiss-style marketing asset pack.
    
    DESIGN PHILOSOPHY:
    - Minimalist: No conversational filler.
    - Functional: Every line of text must be usable marketing copy.
    
    CRITICAL RULES:
    1. Output strictly in JSON format matching the schema provided.
    2. If inputs are missing, infer them based on the Industry to ensure output is never empty.
    3. Output in the language of the prompt inputs.
  `;

  const prompt = `
    Generate a full marketing campaign with the following parameters:
    1. Brand Name: ${inputs.brandName}
    2. Industry: ${inputs.industry}
    3. Tone: ${inputs.tone}
    4. Audience: ${inputs.audience}
    5. Product: ${inputs.productDescription}
    6. Goal/Ethos: ${inputs.goal}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7, // Balanced creativity and structure
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as CampaignOutput;
  } catch (error) {
    console.error("Campaign generation failed:", error);
    throw error;
  }
};
