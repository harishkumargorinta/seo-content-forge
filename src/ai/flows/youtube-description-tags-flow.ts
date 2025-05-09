
'use server';
/**
 * @fileOverview An AI agent for generating YouTube video descriptions and tags.
 *
 * - generateYouTubeDescriptionAndTags - A function that handles YouTube video description and tag generation.
 * - GenerateYouTubeDescriptionAndTagsInput - The input type for the function.
 * - GenerateYouTubeDescriptionAndTagsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYouTubeDescriptionAndTagsInputSchema = z.object({
  videoContent: z.string().min(10, "Video content (script, title, or summary) must be at least 10 characters.").max(10000, "Video content is too long, please provide a shorter script or summary.").describe('The video script, title, or a detailed summary of the video content.'),
  focusKeywords: z.string().optional().describe('Comma-separated keywords to focus on for the description and tags.'),
  // contentTypeHint: z.enum(['script', 'title', 'summary']).optional().describe('A hint about the type of content provided (script, title, or summary).')
});
export type GenerateYouTubeDescriptionAndTagsInput = z.infer<typeof GenerateYouTubeDescriptionAndTagsInputSchema>;

const GenerateYouTubeDescriptionAndTagsOutputSchema = z.object({
  videoDescription: z.string().describe('A compelling and SEO-optimized YouTube video description.'),
  videoTags: z.string().describe('A comma-separated list of relevant YouTube tags.'),
});
export type GenerateYouTubeDescriptionAndTagsOutput = z.infer<typeof GenerateYouTubeDescriptionAndTagsOutputSchema>;

export async function generateYouTubeDescriptionAndTags(input: GenerateYouTubeDescriptionAndTagsInput): Promise<GenerateYouTubeDescriptionAndTagsOutput> {
  return youtubeDescriptionTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'youtubeDescriptionTagsPrompt',
  input: {schema: GenerateYouTubeDescriptionAndTagsInputSchema},
  output: {schema: GenerateYouTubeDescriptionAndTagsOutputSchema},
  prompt: `You are a YouTube SEO and content strategy expert.
The user has provided the following content related to their YouTube video. This could be a full script, a detailed summary, or just the video title.

Video Content:
\`\`\`
{{{videoContent}}}
\`\`\`

{{#if focusKeywords}}
Please try to incorporate these focus keywords if they are relevant and fit naturally: {{focusKeywords}}
{{/if}}

Based on the provided video content, generate the following:

1.  **Video Description**:
    *   Craft a compelling and engaging YouTube video description.
    *   Optimize it for search engines by naturally incorporating relevant keywords (including focus keywords if provided).
    *   Aim for approximately 2-4 paragraphs.
    *   Include a clear call to action if appropriate for the content (e.g., subscribe, watch another video, visit a link).
    *   Ensure the description is well-formatted for YouTube (use line breaks for readability).
    *   The description should accurately reflect the video content and entice viewers to watch.

2.  **Video Tags**:
    *   Generate a list of 10-15 highly relevant YouTube tags.
    *   Provide these tags as a single comma-separated string.
    *   Include a mix of broad and specific tags.
    *   Incorporate the focus keywords (if provided and relevant) and other important terms from the video content.

Output the result as a single JSON object. The JSON object MUST have the following keys:
- "videoDescription" (string): The generated YouTube video description.
- "videoTags" (string): The comma-separated list of generated YouTube tags.
`,
});

const youtubeDescriptionTagsFlow = ai.defineFlow(
  {
    name: 'youtubeDescriptionTagsFlow',
    inputSchema: GenerateYouTubeDescriptionAndTagsInputSchema,
    outputSchema: GenerateYouTubeDescriptionAndTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate YouTube description and tags.");
    }
    return output;
  }
);
