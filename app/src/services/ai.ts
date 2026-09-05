import { generateOpenRouterAnswer } from './openrouter';
import { generateMockAnswer } from './mockAi';

export interface AIResult {
  text: string;
}

/**
 * Smart AI Switcher (OpenRouter Priority)
 * 1. Tries OpenRouter (Free Tier - Auto Selection)
 * 2. Falls back to Mock Assistant
 */
export async function generateAIAnswer(
  prompt: string,
  systemPrompt?: string
): Promise<AIResult> {
  // Try OpenRouter (Free Models)
  try {
    console.log("AI Switcher: Attempting OpenRouter...");
    return await generateOpenRouterAnswer(prompt, systemPrompt);
  } catch (error: any) {
    console.warn("AI Switcher: OpenRouter failed.", error.message);

    // Final Safety Net
    console.log("AI Switcher: Using Mock Assistant safety net.");
    return await generateMockAnswer(prompt);
  }
}
