import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface QueryInterpretation {
  keywords: string[];
  neighborhood: string | null;
  type: string | null;
  attributes: string[];
  summary: string;
}

const SYSTEM_PROMPT = `Você é um assistente que interpreta buscas de lugares em Curitiba, Brasil.
Analise a consulta do usuário e extraia informações estruturadas.

Responda APENAS com JSON válido no formato:
{
  "keywords": ["palavra1", "palavra2"],
  "neighborhood": "nome do bairro ou null",
  "type": "restaurante|bar|café|balada|lanchonete ou null",
  "attributes": ["atributo1", "atributo2"],
  "summary": "resumo da busca em uma frase"
}

Exemplos de bairros: Centro, Batel, Água Verde, Bacacheri, Santa Felicidade, Centro Histórico.
Exemplos de atributos: música ao vivo, wifi, ao ar livre, familiar, romântico, happy hour, vegan, delivery.`;

export async function interpretQuery(query: string): Promise<QueryInterpretation> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: query }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Resposta inesperada da Claude API");
  }

  const jsonText = textBlock.text.trim().replace(/^```json\n?|\n?```$/g, "");
  return JSON.parse(jsonText) as QueryInterpretation;
}
