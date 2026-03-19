import { logInfo, logWarn, logError } from "./logger";

/**
 * AI PROVIDERS SUPPORTED: Groq, HuggingFace
 */


const TIMEOUT_MS = 120000;

/**
 * Multi-Provider AI Text Generation with Fallback & Retries
 */
export async function generateText(prompt: string, retries: number = 1): Promise<string> {
  const providers = [
    {
      id: "groq-llama-3.3-70b",
      provider: "groq",
      model: "llama-3.3-70b-versatile",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      apiKey: process.env.GROQ_API_KEY,
      type: "openai-chat",
      active: true,
    },
    {
      id: "hf-mistral",
      provider: "huggingface",
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      endpoint: "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      apiKey: process.env.HUGGINGFACE_API_KEY,
      type: "hf-inference",
      active: true,
    }
  ];

  if (!prompt) return "";

  const activeProviders = providers.filter((p) => p.active && p.apiKey);

  if (activeProviders.length === 0) {
    await logError("AIService", "No active AI providers configured");
    throw new Error("AI Service config missing keys");
  }

  for (const provider of activeProviders) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        if (attempt > 0) {
          await logWarn("AIService", `Retrying ${provider.id} (${attempt}/${retries})`);
        } else {
          await logInfo("AIService", `[AI] Started: ${provider.model}`);
        }

        const response = await callProvider(provider, prompt, controller.signal);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = parseResponse(provider, data);

        if (!text) throw new Error("Empty response");

        await logInfo("AIService", `[AI] Success: ${provider.model}`);
        return text.trim();

      } catch (err: any) {
        clearTimeout(timeoutId);
        if (attempt === retries) {
          await logWarn("AIService", `${provider.model} failed permanently: ${err.message}`);
        } else {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
  }

  throw new Error("All AI providers failed. Check API keys and quotas.");
}

async function callProvider(p: any, prompt: string, signal: AbortSignal) {
  const body = p.type === "openai-chat" 
    ? {
        model: p.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      } 
    : {
        inputs: prompt,
        parameters: { max_new_tokens: 1500, temperature: 0.7 }
      };

  return fetch(p.endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${p.apiKey}`,
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify(body),
  });
}

function parseResponse(p: any, data: any): string {
  if (p.type === "openai-chat") return data?.choices?.[0]?.message?.content || "";
  if (Array.isArray(data)) return data[0]?.generated_text || "";
  return data.generated_text || "";
}
