'use server';
/**
 * @fileOverview An AI agent for generating Facebook post titles/headlines.
 *
 * - generateFacebookTitles - A function that handles Facebook post title generation.
 * - GenerateFacebookTitlesInput - The input type for the function.
 * - GenerateFacebookTitlesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFacebookTitlesInputSchema = z.object({
  postContent: z.string().min(10, "Post content/idea must be at least 10 characters.").max(5000, "Post content is too long, please provide a shorter summary or idea.").describe('The main idea, script snippet, or a description of what the Facebook post is about.'),
  keywords: z.string().optional().describe('Comma-separated keywords relevant to the post content for targeting.'),
  targetAudience: z.string().optional().describe('The intended audience for the post (e.g., local community, specific interest group).'),
  desiredStyle: z.enum([
      "Engaging & Clickable",
      "Informative & Direct",
      "Question-Based",
      "Benefit-Oriented",
      "Urgency/FOMO Driven",
      "Storytelling Hook"
    ]).optional().describe('The desired style or tone for the Facebook titles/headlines.'),
  titleCount: z.number().min(1).max(10).default(5).describe('The number of unique title suggestions to generate (1-10).'),
});
export type GenerateFacebookTitlesInput = z.infer<typeof GenerateFacebookTitlesInputSchema>;

const SuggestedFacebookTitleSchema = z.object({
  title: z.string().describe('The suggested Facebook post title/headline.'),
  reasoning: z.string().describe('A brief explanation of why this title is effective for Facebook or how it aligns with the input criteria.'),
});

const GenerateFacebookTitlesOutputSchema = z.object({
  suggestedTitles: z.array(SuggestedFacebookTitleSchema).describe('A list of generated Facebook post titles with reasoning.'),
  generalTips: z.string().describe('General tips for creating effective Facebook post titles/headlines, focusing on engagement and click-through rate on the platform.'),
});
export type GenerateFacebookTitlesOutput = z.infer<typeof GenerateFacebookTitlesOutputSchema>;

export async function generateFacebookTitles(input: GenerateFacebookTitlesInput): Promise<GenerateFacebookTitlesOutput> {
  return facebookTitleGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'facebookTitleGeneratorPrompt',
  input: {schema: GenerateFacebookTitlesInputSchema},
  output: {schema: GenerateFacebookTitlesOutputSchema},
  prompt: `You are an expert Facebook marketing strategist and copywriter. Your task is to generate {{titleCount}} compelling and effective Facebook post titles/headlines based on the provided information. These titles should be optimized for engagement (likes, comments, shares) and click-throughs if applicable.

Post Content/Idea:
\`\`\`
{{{postContent}}}
\`\`\`

{{#if keywords}}
Keywords to consider for targeting/theme: {{keywords}}
{{/if}}
{{#if targetAudience}}
Target Audience for this Facebook post: {{targetAudience}}
{{/if}}
{{#if desiredStyle}}
Desired Title Style: {{desiredStyle}}
{{/if}}

For each title suggestion, provide:
1.  The title/headline itself (string). Aim for titles that are attention-grabbing, clear, and concise. Consider Facebook's platform nuances (e.g., mobile visibility, use of emojis if appropriate for the tone). Incorporate keywords naturally where appropriate.
2.  A brief reasoning (string) explaining why the title is good for Facebook, how it aligns with the requested style (if any), or its potential effectiveness for engagement or clicks.

Additionally, provide a short section with general tips for creating great Facebook post titles/headlines, focusing on platform best practices, engagement, and possibly ad copy if relevant.

Output the result as a single JSON object. The JSON object MUST have the following keys:
- "suggestedTitles": An array of objects, where each object has "title" (string) and "reasoning" (string).
- "generalTips": A string containing actionable advice for Facebook titles.

Example of a suggestedTitle object:
{
  "title": "🤯 You WON'T BELIEVE what happened next! (Full story inside)",
  "reasoning": "Uses emojis to grab attention, creates strong curiosity with a hook, and implies value within the post."
}

Generate exactly {{titleCount}} unique title suggestions.
Ensure the titles are diverse and reflect different angles or hooks related to the post content and desired style.
If keywords are provided, try to naturally integrate them into some of the titles.
The "generalTips" should be broadly applicable advice for Facebook.
`,
});

const facebookTitleGeneratorFlow = ai.defineFlow(
  {
    name: 'facebookTitleGeneratorFlow',
    inputSchema: GenerateFacebookTitlesInputSchema,
    outputSchema: GenerateFacebookTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate Facebook titles.");
    }
    return output;
  }
);
