import Groq from "groq-sdk";
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


const formattedDate = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  dateStyle: 'medium',
  timeStyle: 'medium',
}).format(new Date());


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

Return the result according to the provided JSON schema. Current Time is ${formattedDate}.
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
              description: "Estimated completion date in YYYY-DD-MM format",
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

export type ConversationTurn = { role: "user" | "assistant"; content: string };

export const getAiResponse = async (text: string, history: ConversationTurn[] = []): Promise<string> => {
  if (!text.trim()) {
    throw new Error("No text provided for AI response");
  }

  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: "You are Tasky, a friendly and practical AI assistant built into TaskFlow. Your name is Tasky. Help users increase their productivity by planning work, prioritizing tasks, breaking goals into manageable steps, and staying focused. Be concise, encouraging, and actionable. Format responses with readable Markdown: use short headings, bullets, numbered steps, and bold emphasis when helpful. Avoid Markdown tables unless the user asks for one or a table is clearly the clearest format. Do not output raw HTML. Do not claim to have accessed or changed the user's tasks or boards unless that information is provided to you.",
      },
      ...history,
      {
        role: "user",
        content: text,
      },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
};
