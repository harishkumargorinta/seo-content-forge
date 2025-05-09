
'use server';
/**
 * @fileOverview An AI agent for generating Facebook post descriptions and hashtags.
 *
 * - generateFacebookDescriptionAndTags - A function that handles Facebook post description and hashtag generation.
 * - GenerateFacebookDescriptionTagsInput - The input type for the function.
 * - GenerateFacebookDescriptionTagsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFacebookDescriptionTagsInputSchema = z.object({
  postContent: z.string().min(10, "Post content/idea must be at least 10 characters.").max(5000, "Post content is too long, please provide a shorter summary or idea.").describe('The main idea, script snippet, or a description of what the Facebook post is about.'),
  keywords: z.string().optional().describe('Comma-separated keywords relevant to the post content for targeting and hashtag generation.'),
  targetAudience: z.string().optional().describe('The intended audience for the post (e.g., local community, specific interest group).'),
  desiredStyle: z.enum([
      "Engaging & Playful",
      "Informative & Direct",
      "Storytelling / Anecdotal",
      "Benefit-Oriented & Persuasive",
      "Urgency/FOMO Driven",
      "Community-Focused"
    ]).optional().describe('The desired style or tone for the Facebook post description.'),
  includeEmojis: z.boolean().optional().default(false).describe('Whether to include relevant emojis in the description.'),
  callToAction: z.string().optional().describe('A specific call to action to include, e.g., "Learn more!", "Shop now!", "Comment below!"'),
  hashtagCount: z.number().min(0).max(10).default(5).describe('The approximate number of hashtags to generate (0-10).'),
});
export type GenerateFacebookDescriptionTagsInput = z.infer<typeof GenerateFacebookDescriptionTagsInputSchema>;

const GenerateFacebookDescriptionTagsOutputSchema = z.object({
  postDescription: z.string().describe('The generated Facebook post description, optimized for engagement and readability.'),
  suggestedHashtags: z.string().describe('A comma-separated list of suggested relevant hashtags (e.g., #keyword1, #keyword2).'),
  effectivenessTips: z.string().describe('Tips for writing effective Facebook descriptions and using hashtags on the platform.'),
});
export type GenerateFacebookDescriptionTagsOutput = z.infer<typeof GenerateFacebookDescriptionTagsOutputSchema>;

export async function generateFacebookDescriptionAndTags(input: GenerateFacebookDescriptionTagsInput): Promise<GenerateFacebookDescriptionTagsOutput> {
  return facebookDescriptionTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'facebookDescriptionTagsPrompt',
  input: {schema: GenerateFacebookDescriptionTagsInputSchema},
  output: {schema: GenerateFacebookDescriptionTagsOutputSchema},
  prompt: `You are an expert Facebook marketing strategist and copywriter.
Your task is to generate an engaging Facebook post description and a list of relevant hashtags based on the provided information.

Post Content/Idea to expand upon:
\`\`\`
{{{postContent}}}
\`\`\`

{{#if keywords}}
Keywords to consider for targeting and hashtags: {{keywords}}
{{/if}}
{{#if targetAudience}}
Target Audience for this Facebook post: {{targetAudience}}
{{/if}}
{{#if desiredStyle}}
Desired Description Style: {{desiredStyle}}
{{/if}}
{{#if callToAction}}
Specific Call to Action to include: "{{callToAction}}"
{{/if}}

Instructions:

1.  **Post Description**:
    *   Craft a compelling and engaging Facebook post description based on the "Post Content/Idea".
    *   The description should be well-structured, easy to read, and appropriate for the Facebook platform.
    *   If a "Desired Description Style" is provided, adhere to it.
    *   If a "Target Audience" is provided, tailor the language and tone accordingly.
    *   Naturally incorporate relevant "Keywords" if provided.
    *   {{#if includeEmojis}}Include relevant emojis to enhance engagement and visual appeal, but use them sparingly and appropriately.{{else}}Avoid using emojis unless they are exceptionally fitting for the content and tone.{{/if}}
    *   {{#if callToAction}}Ensure the call to action "{{callToAction}}" is clearly integrated.{{else}}If no specific CTA is given, consider adding a general engagement prompt (e.g., "What do you think?", "Tag a friend who needs to see this!").{{/if}}
    *   Aim for a description length suitable for Facebook (typically 1-3 short paragraphs).

2.  **Suggested Hashtags**:
    *   Generate a list of approximately {{hashtagCount}} relevant hashtags.
    *   Provide these hashtags as a single comma-separated string (e.g., #socialmediamarketing, #facebooktips, #contentstrategy).
    *   Include a mix of broad and niche hashtags.
    *   Base hashtags on the "Post Content/Idea" and any "Keywords" provided.
    *   If {{hashtagCount}} is 0, return an empty string for hashtags.

3.  **Effectiveness Tips**:
    *   Provide 2-3 concise tips for writing effective Facebook descriptions and using hashtags to maximize reach and engagement on the platform.

Output the result as a single JSON object. The JSON object MUST have the following keys:
- "postDescription" (string): The generated Facebook post description.
- "suggestedHashtags" (string): The comma-separated list of hashtags.
- "effectivenessTips" (string): Actionable tips.

Example of output structure:
{
  "postDescription": "Discover the amazing benefits of our new product! 🎉 It's designed to help {{targetAudience}} achieve their goals. {{callToAction}}",
  "suggestedHashtags": "#newproduct, #musthave, #innovation, #{{keywords}}",
  "effectivenessTips": "1. Keep descriptions concise and value-driven. 2. Use a mix of popular and niche hashtags. 3. Include a clear call to action."
}

Ensure the description is distinct and expands on the input "Post Content/Idea", not just repeating it.
Generate exactly {{hashtagCount}} hashtags if the count is greater than 0.
`,
});

const facebookDescriptionTagsFlow = ai.defineFlow(
  {
    name: 'facebookDescriptionTagsFlow',
    inputSchema: GenerateFacebookDescriptionTagsInputSchema,
    outputSchema: GenerateFacebookDescriptionTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate Facebook description and tags.");
    }
    return output;
  }
);

