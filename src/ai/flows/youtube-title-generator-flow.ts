
'use server';
/**
 * @fileOverview An AI agent for generating YouTube video titles.
 *
 * - generateYouTubeTitles - A function that handles YouTube video title generation.
 * - GenerateYouTubeTitlesInput - The input type for the function.
 * - GenerateYouTubeTitlesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYouTubeTitlesInputSchema = z.object({
  videoTopic: z.string().min(5, "Video topic must be at least 5 characters.").describe('The main topic or subject of the YouTube video.'),
  keywords: z.string().optional().describe('Comma-separated keywords relevant to the video content for SEO.'),
  targetAudience: z.string().optional().describe('The intended audience for the video (e.g., beginners, experts, specific demographic).'),
  desiredStyle: z.enum([
      "Catchy & Engaging", 
      "SEO Optimized", 
      "Question-Based", 
      "How-To / Tutorial", 
      "Listicle (e.g., Top 5...)",
      "Intriguing / Curiosity-Driven"
    ]).optional().describe('The desired style or tone for the titles.'),
  titleCount: z.number().min(1).max(10).default(5).describe('The number of unique title suggestions to generate (1-10).'),
});
export type GenerateYouTubeTitlesInput = z.infer<typeof GenerateYouTubeTitlesInputSchema>;

const SuggestedTitleSchema = z.object({
  title: z.string().describe('The suggested YouTube video title.'),
  reasoning: z.string().describe('A brief explanation of why this title is effective or how it aligns with the input criteria.'),
});

const GenerateYouTubeTitlesOutputSchema = z.object({
  suggestedTitles: z.array(SuggestedTitleSchema).describe('A list of generated YouTube video titles with reasoning.'),
  generalTips: z.string().describe('General tips for creating effective YouTube titles, considering SEO and engagement.'),
});
export type GenerateYouTubeTitlesOutput = z.infer<typeof GenerateYouTubeTitlesOutputSchema>;

export async function generateYouTubeTitles(input: GenerateYouTubeTitlesInput): Promise<GenerateYouTubeTitlesOutput> {
  return youtubeTitleGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'youtubeTitleGeneratorPrompt',
  input: {schema: GenerateYouTubeTitlesInputSchema},
  output: {schema: GenerateYouTubeTitlesOutputSchema},
  prompt: `You are an expert YouTube content strategist and SEO specialist. Your task is to generate {{titleCount}} compelling and effective YouTube video titles based on the provided information.

Video Topic: "{{videoTopic}}"

{{#if keywords}}
Keywords to consider: {{keywords}}
{{/if}}
{{#if targetAudience}}
Target Audience: {{targetAudience}}
{{/if}}
{{#if desiredStyle}}
Desired Title Style: {{desiredStyle}}
{{/if}}

For each title, provide:
1.  The title itself (string). Aim for titles that are clear, concise (ideally under 60-70 characters), and attention-grabbing. Incorporate keywords naturally where appropriate.
2.  A brief reasoning (string) explaining why the title is good, how it aligns with the requested style (if any), or its potential effectiveness.

Additionally, provide a short section with general tips for creating great YouTube titles, focusing on SEO and click-through rate (CTR).

Output the result as a single JSON object. The JSON object MUST have the following keys:
- "suggestedTitles": An array of objects, where each object has "title" (string) and "reasoning" (string).
- "generalTips": A string containing actionable advice for YouTube titles.

Example of a suggestedTitle object:
{
  "title": "Unlock Secrets to Viral YouTube Growth in 2024!",
  "reasoning": "Uses strong keywords ('Viral YouTube Growth', '2024'), creates urgency/curiosity ('Unlock Secrets'), and is benefit-driven."
}

Generate exactly {{titleCount}} unique title suggestions.
Ensure the titles are diverse and reflect different angles or hooks related to the topic and desired style.
If keywords are provided, try to naturally integrate them into some of the titles for SEO benefits.
The "generalTips" should be broadly applicable advice.
`,
});

const youtubeTitleGeneratorFlow = ai.defineFlow(
  {
    name: 'youtubeTitleGeneratorFlow',
    inputSchema: GenerateYouTubeTitlesInputSchema,
    outputSchema: GenerateYouTubeTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate YouTube titles.");
    }
    return output;
  }
);
