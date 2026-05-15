import { GoogleGenAI } from "@google/genai";
import { SearchResult, AnalysisData, GroundingChunk, AttachedFile } from "../types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function performGlobalSearch(
  query: string, 
  files: AttachedFile[] = [],
  filters: string[] = []
): Promise<SearchResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  const fileParts = files.map(file => ({
    inlineData: {
      data: file.data.split(',')[1] || file.data,
      mimeType: file.type
    }
  }));

  const filterContext = filters.length > 0 ? `Apply these filters: ${filters.join(", ")}.` : "";
  
  const prompt = `
    Perform a global interactive search and analysis for: "${query}".
    Language: Italian. Respond in Italian unless the query is in another language.
    ${filterContext}
    Analyze any attached files provided.
    
    You MUST return ONLY a JSON object with the following structure:
    {
      "summary": "Full Markdown summary of search results and analysis",
      "keyPoints": ["3-5 key analytical insights as strings"],
      "chartData": [{"name": "category", "value": 100}],
      "tags": ["relevant", "tags"],
      "analysis": "Brief technical analysis of the data found"
    }
    
    If data for a chart is not found, provide an empty array for chartData.
    The response must be valid JSON.
  `;

  // Using gemini-3-flash-preview because it's mentioned as the one supporting googleSearch in skill
  // and it's fast for real-time interaction.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        ...fileParts,
        { text: prompt }
      ]
    },
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
    },
  });

  const rawJson = response.text;
  let analysis: AnalysisData;
  try {
    analysis = JSON.parse(rawJson);
  } catch (e) {
    // Fallback if JSON fails
    analysis = {
      summary: rawJson,
      keyPoints: [],
      tags: [],
    };
  }

  const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    .map(chunk => ({
      uri: chunk.web!.uri,
      title: chunk.web!.title || chunk.web!.uri
    })) || [];

  return {
    id: crypto.randomUUID(),
    query,
    timestamp: Date.now(),
    summary: analysis.summary,
    groundingChunks,
    analysis,
    files
  };
}
