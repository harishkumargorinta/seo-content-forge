
'use server';
/**
 * @fileOverview An AI agent for generating non-fiction book chapters.
 *
 * - generateBookChapter - A function that handles the book chapter generation process.
 * - GenerateBookChapterInput - The input type for the generateBookChapter function.
 * - GenerateBookChapterOutput - The return type for the generateBookChapter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookChapterInputSchema = z.object({
  chapterTopic: z.string().min(5, "Chapter topic is required and must be at least 5 characters.").describe('The specific topic or title of this chapter.'),
  overallBookTopic: z.string().min(5, "Overall book topic is required.").describe('The main theme or subject of the entire book.'),
  keyPointsToCover: z.string().min(10, "Key points are required.").describe('A comma-separated list or a detailed description of the key points, arguments, or information to be included in this chapter.'),
  targetAudience: z.string().optional().describe('The intended audience for the book (e.g., beginners, experts, general public).'),
  desiredTone: z.string().optional().describe('The desired tone for the chapter (e.g., academic, conversational, instructional, inspiring).'),
  approximateWordCount: z.number().optional().describe('The approximate desired word count for the chapter.'),
});
export type GenerateBookChapterInput = z.infer<typeof GenerateBookChapterInputSchema>;

const GenerateBookChapterOutputSchema = z.object({
  generatedChapterTitle: z.string().describe('A suitable title for the generated chapter, based on the chapterTopic.'),
  chapterContent: z.string().describe('The full content of the book chapter in Markdown format. This should include an introduction, main body discussing key points, and a conclusion.'),
  suggestedSubheadings: z.string().optional().describe('A comma-separated list of suggested subheadings that could be used within the chapter for better structure.'),
});
export type GenerateBookChapterOutput = z.infer<typeof GenerateBookChapterOutputSchema>;

export async function generateBookChapter(input: GenerateBookChapterInput): Promise<GenerateBookChapterOutput> {
  return bookChapterWriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bookChapterWriterPrompt',
  input: {schema: GenerateBookChapterInputSchema},
  output: {schema: GenerateBookChapterOutputSchema},
  prompt: `You are an expert non-fiction author and editor. Your task is to write a compelling and informative book chapter based on the user's specifications.

Overall Book Topic: "{{overallBookTopic}}"
Chapter Topic/Title Idea: "{{chapterTopic}}"

Key Points to Cover in this Chapter:
{{keyPointsToCover}}

{{#if targetAudience}}
The chapter should be tailored for the following target audience: {{targetAudience}}.
{{/if}}
{{#if desiredTone}}
The desired tone for this chapter is: {{desiredTone}}.
{{/if}}
{{#if approximateWordCount}}
The desired length for the chapter is approximately {{approximateWordCount}} words. Aim for this length, but prioritize clarity, depth, and engagement.
{{/if}}

Instructions:

1.  **Generated Chapter Title**: Refine the provided "Chapter Topic/Title Idea" into a clear and engaging title for this chapter.
2.  **Chapter Content (Markdown Format)**:
    *   Write the full chapter content. It must be well-structured with an introduction, a main body, and a conclusion.
    *   The introduction should grab the reader's attention and clearly state the chapter's purpose or main argument.
    *   The main body should thoroughly develop and explain the "Key Points to Cover". Use clear language, provide examples or explanations where necessary, and ensure a logical flow between ideas. Organize the content with paragraphs. You can use Markdown for formatting like bold, italics, and lists if appropriate, but the primary structure should be paragraphs under implied or explicit subheadings.
    *   The conclusion should summarize the main takeaways of the chapter and possibly link to the next chapter or the book's overall theme.
    *   Ensure the content is original, insightful, and provides significant value to the reader.
    *   Use Markdown for all text formatting. For example, use '#' for main headings if needed (though the chapter will be one unit, so internal H2/H3s as '## Subheading' or '### Sub-subheading' are more likely), '*' or '-' for bullet points.
3.  **Suggested Subheadings (Optional)**: Provide a comma-separated list of 3-5 potential subheadings that could be used within the chapter content to further break it down and improve readability. These should be derived from the key points and the generated content.

Output the result as a single JSON object. The JSON object MUST have the following keys: "generatedChapterTitle" (string), "chapterContent" (string), and "suggestedSubheadings" (string, optional).
The "chapterContent" value must be a single string containing the complete Markdown formatted chapter.
`,
});

const bookChapterWriterFlow = ai.defineFlow(
  {
    name: 'bookChapterWriterFlow',
    inputSchema: GenerateBookChapterInputSchema,
    outputSchema: GenerateBookChapterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate the book chapter.");
    }
    return output;
  }
);
