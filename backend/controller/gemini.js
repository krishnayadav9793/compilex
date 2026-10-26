import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API;
let ai = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("[GeminiController] Warning: GEMINI_API key is not configured in .env");
}

/**
 * Clean and parse JSON from LLM response
 */
function extractJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (err) {
        // Continue
      }
    }
    throw new Error("Could not parse JSON from model response: " + text);
  }
}

/**
 * Ask Gemini to act as an automated CP Judge:
 * Given a problem statement and an input, determine the exact expected output and complexity.
 */
export async function judgeProblemWithGemini(problemStatement, input, userCode = "", language = "") {
  if (!ai) {
    throw new Error("Gemini API key is not configured on the server.");
  }

  const prompt = `You are an automated Competitive Programming (CP) Judge and code analyst.
Given the problem statement and the test case input below, your task is to:
1. Determine the EXACT standard output (stdout) that a correct solution must print for this input.
2. Analyze the problem and the user's code (if provided) to determine the time and space complexity.
3. Determine if the user's approach is optimal, and provide helpful analysis feedback.

### Problem Statement:
${problemStatement}

### Standard Input:
${input}

${userCode ? `### User's Submitted Code (${language}):\n\`\`\`${language}\n${userCode}\n\`\`\`` : ""}

CRITICAL INSTRUCTIONS:
- You MUST respond ONLY with a valid, raw JSON object (no markdown quotes, no backticks, no commentary outside the JSON).
- The "expectedOutput" field must contain ONLY the exact characters, numbers, and newlines that should be printed to stdout. No extra conversational text or labels.

JSON Schema:
{
  "expectedOutput": "string (the exact expected stdout)",
  "explanation": "string (clear explanation of why this is the expected answer and how to solve it)",
  "timeComplexity": "string (e.g. O(n) or O(n log n))",
  "spaceComplexity": "string (e.g. O(1) or O(n))",
  "isOptimal": boolean (true if user's solution is time/space optimal, false otherwise),
  "feedback": "string (concise encouragement or tip on optimization)"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
      }
    });

    const text = response.text ? response.text.trim() : "";
    const parsed = extractJSON(text);

    return {
      expectedOutput: String(parsed.expectedOutput ?? "").trim(),
      explanation: parsed.explanation || "No explanation provided.",
      timeComplexity: parsed.timeComplexity || "O(n)",
      spaceComplexity: parsed.spaceComplexity || "O(1)",
      isOptimal: parsed.isOptimal !== undefined ? parsed.isOptimal : true,
      feedback: parsed.feedback || "Good job! Keep practicing."
    };
  } catch (error) {
    console.error("[GeminiController] Error generating CP evaluation:", error);
    throw error;
  }
}

/**
 * Ask Gemini for code optimization / chat assistance
 */
export async function askGeminiAssist(userPrompt, code = "", language = "") {
  if (!ai) {
    throw new Error("Gemini API key is not configured on the server.");
  }

  const prompt = `You are compileX AI, an expert algorithm & software engineering assistant.
Help the user with their coding query.

User Query: ${userPrompt}
${language ? `Language: ${language}` : ""}
${code ? `Current Code:\n\`\`\`${language}\n${code}\n\`\`\`` : ""}

Provide a clear, friendly, and structured response. If proposing code, provide clean, optimal code snippets with brief explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.4,
      }
    });

    return response.text ? response.text.trim() : "No response generated.";
  } catch (error) {
    console.error("[GeminiController] Error in AI assist:", error);
    throw error;
  }
}
