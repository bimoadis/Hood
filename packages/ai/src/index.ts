export interface AIProvider {
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  generateEmbeddings(text: string): Promise<number[]>;
}

export class OpenAIProvider implements AIProvider {
  constructor(private readonly apiKey: string) {}

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    // Mock implementation for OpenAI text generation
    return `[OpenAI Response to: ${prompt}]`;
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    // Return a mock vector of 1536 dimensions
    return Array.from({ length: 1536 }, () => Math.random());
  }
}

export class GeminiProvider implements AIProvider {
  constructor(private readonly apiKey: string) {}

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    // Mock implementation for Gemini text generation
    return `[Gemini Response to: ${prompt}]`;
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    // Return a mock vector of 768 dimensions
    return Array.from({ length: 768 }, () => Math.random());
  }
}

export class GrokProvider implements AIProvider {
  constructor(private readonly apiKey: string) {}

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    // Mock implementation for Grok text generation
    return `[Grok Response to: ${prompt}]`;
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    // Return a mock vector
    return Array.from({ length: 1536 }, () => Math.random());
  }
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveMemories(
  query: string,
  memories: Array<{ id: string; memoryKey: string; memoryValue: string; embedding?: number[] }>,
  provider: AIProvider,
  threshold: number = 0.78
): Promise<Array<{ memoryKey: string; memoryValue: string; similarity: number }>> {
  const queryEmbedding = await provider.generateEmbeddings(query);
  const results = [];
  
  for (const memory of memories) {
    const memEmbedding = memory.embedding || Array.from({ length: queryEmbedding.length }, () => Math.random());
    const similarity = cosineSimilarity(queryEmbedding, memEmbedding);
    if (similarity > threshold) {
      results.push({
        memoryKey: memory.memoryKey,
        memoryValue: memory.memoryValue,
        similarity,
      });
    }
  }

  return results.sort((a, b) => b.similarity - a.similarity);
}
