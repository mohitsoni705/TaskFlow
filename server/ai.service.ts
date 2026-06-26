import { ai } from "./config/gemini.ts";

export interface SuggestRequest {
  title: string;
  description: string;
}

export interface SuggestResponse {
  effort: string;
  dueDate: string;
  reasoning: string;
}

export const suggestTaskEstimate = async (
  data: SuggestRequest
): Promise<SuggestResponse> => {
  const prompt = `
You are an experienced software project manager.

Task Title:
${data.title}

Task Description:
${data.description}

Return ONLY valid JSON with no markdown formatting.

Format:

{
 "effort":"4 hours",
 "dueDate":"2026-06-30",
 "reasoning":"Short explanation"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = (response.text ?? "").replace(/```json\n?|```\n?/g, "").trim();

  return JSON.parse(text);
};