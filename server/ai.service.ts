import { ai } from "./config/groq.ts";
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
  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",
        content: `
You are an experienced software project manager.

Estimate the effort and completion date for the given software task.

Return the result according to the provided JSON schema.
        `.trim(),
      },
      {
        role: "user",
        content: `
Task Title:
${data.title}

Task Description:
${data.description}
        `.trim(),
      },
    ],

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "task_estimate",
        strict: true,
        schema: {
          type: "object",
          properties: {
            effort: {
              type: "string",
              description: "Estimated effort, for example 4 hours or 2 days",
            },
            dueDate: {
              type: "string",
              description: "Estimated completion date in YYYY-MM-DD format",
            },
            reasoning: {
              type: "string",
              description: "Short explanation for the estimate",
            },
          },
          required: ["effort", "dueDate", "reasoning"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response received from Groq");
  }

  return JSON.parse(content) as SuggestResponse;
};