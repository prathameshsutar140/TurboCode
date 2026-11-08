import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client server-side only
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Gemini AI client initialization warning:', err);
  }
}

import { AIAssistAction } from '../src/types.js';
export type { AIAssistAction };

export async function askAIAssistant(
  action: AIAssistAction,
  sourceCode: string,
  language: string,
  contextMessage?: string
): Promise<{ success: boolean; result?: string; error?: string }> {
  if (!process.env.GEMINI_API_KEY || !aiClient) {
    return {
      success: false,
      error: 'Gemini API key is not configured in the environment. You can set GEMINI_API_KEY in the Secrets panel. All compilation and execution work completely offline without AI.',
    };
  }

  let prompt = '';
  switch (action) {
    case 'explain_error':
      prompt = `You are a patient senior C/C++ compiler engineer and educator.
The student received the following compiler diagnostic or runtime issue:
---
${contextMessage || 'No specific error message provided.'}
---

Here is their current source code (${language.toUpperCase()}):
\`\`\`${language}
${sourceCode}
\`\`\`

Explain in clear, step-by-step educational language:
1. What the exact error or warning means.
2. The specific line and syntax rule being violated.
3. How to fix it, with a concise snippet demonstrating the correction.
Be encouraging and concise.`;
      break;

    case 'explain_code':
      prompt = `You are an expert C/C++ tutor.
Explain the following ${language.toUpperCase()} source code for a diploma student learning systems programming:
\`\`\`${language}
${sourceCode}
\`\`\`

Provide:
1. Overall summary of what the program accomplishes.
2. Step-by-step breakdown of key sections (headers, main logic, variables, loops/functions).
3. Memory and pointer mechanics (stack vs heap, allocations, or pointers if used).
Keep it focused, accurate, and easy to understand.`;
      break;

    case 'optimize':
      prompt = `Review this ${language.toUpperCase()} code for standard compliance, performance, and best practices:
\`\`\`${language}
${sourceCode}
\`\`\`

Suggest:
1. Potential pitfalls (uninitialized variables, buffer overflows, memory leaks, undefined behavior).
2. Modern standard idioms (e.g. C17 / C++20 improvements).
3. Optimized version of the code.`;
      break;

    case 'generate_practice':
      prompt = `Generate a practical hands-on programming exercise in ${language.toUpperCase()} related to:
${contextMessage || 'Basic algorithms and data structures'}

Include:
1. Problem Statement with real-world context.
2. Input format and Output format with sample test cases.
3. Hints for memory safety and edge cases.
4. (Optional) Starter boilerplate code.`;
      break;

    default:
      prompt = `Analyze this ${language} code:\n\`\`\`\n${sourceCode}\n\`\`\``;
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are TurboCode Assistant, a focused, professional C/C++ development tutor. Give concise, technically accurate explanations and clean C/C++ code snippets.',
      },
    });

    const text = response.text || 'No response generated.';
    return { success: true, result: text };
  } catch (err: any) {
    return {
      success: false,
      error: `AI Assistant Error: ${err.message || 'Failed to communicate with model'}`,
    };
  }
}
