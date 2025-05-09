
'use server';
/**
 * @fileOverview An AI agent for generating kids' comic book scripts.
 *
 * - generateComicBook - A function that handles the comic book script generation.
 * - GenerateComicBookInput - The input type for the generateComicBook function.
 * - GenerateComicBookOutput - The return type for the generateComicBook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComicPanelSchema = z.object({
  panelNumber: z.number().describe('Sequential number of the comic panel.'),
  sceneDescription: z.string().describe('Visual description of the scene, setting, and character expressions/positions for this panel. Keep it concise and visual.'),
  dialogueOrCaption: z.string().describe("Character dialogue (e.g., 'Character A: Hello!') or narrative caption for this panel. Use 'CAPTION:' prefix for captions."),
  // soundEffects: z.string().optional().describe("Suggested sound effects for the panel (e.g., POW!, ZAP!)."), // Optional for now
});

const GenerateComicBookInputSchema = z.object({
  storyTheme: z.string().min(5, "Story theme/idea is required.").describe('The main theme or a brief idea for the comic story (e.g., a lost kitten finds its way home, two friends build a spaceship).'),
  mainCharacters: z.string().min(5, "Character descriptions are required.").describe('Brief description of the main characters (1-3 characters usually). Include names and a key trait, e.g., "Lilly: a curious rabbit, Tom: a brave squirrel".'),
  targetAgeGroup: z.enum(['3-5 years', '6-8 years', '9-11 years']).default('6-8 years').describe('The target age group for the comic book.'),
  approximatePanels: z.number().min(3).max(20).default(6).describe('Approximate number of comic panels to generate (e.g., for a short story or a few pages). Min 3, Max 20.'),
  storyTone: z.enum(['Funny', 'Adventurous', 'Educational', 'Heartwarming', 'Silly']).default('Funny').describe('The desired tone for the comic story.'),
});
export type GenerateComicBookInput = z.infer<typeof GenerateComicBookInputSchema>;

const GenerateComicBookOutputSchema = z.object({
  comicTitle: z.string().describe('A catchy and age-appropriate title for the comic book story.'),
  characterSummary: z.string().describe('A brief summary of the main characters involved in the story, based on input.'),
  panels: z.array(ComicPanelSchema).describe('An array of comic panels, each detailing the scene, dialogue, and actions.'),
  storySummary: z.string().describe('A very brief overall summary of the generated comic story arc.'),
});
export type GenerateComicBookOutput = z.infer<typeof GenerateComicBookOutputSchema>;

export async function generateComicBook(input: GenerateComicBookInput): Promise<GenerateComicBookOutput> {
  return comicBookWriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'comicBookWriterPrompt',
  input: {schema: GenerateComicBookInputSchema},
  output: {schema: GenerateComicBookOutputSchema},
  // Simple safety setting example, can be expanded
  config: {
    safetySettings: [ 
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
  prompt: `You are a creative and fun-loving writer specializing in comic books for children aged {{targetAgeGroup}}.
Your task is to generate a short comic book script with approximately {{approximatePanels}} panels.

Story Theme/Idea: "{{storyTheme}}"
Main Characters: {{mainCharacters}}
Desired Tone: {{storyTone}}

Instructions:

1.  **Comic Title**: Create a catchy, simple, and age-appropriate title for this comic story.
2.  **Character Summary**: Briefly restate or summarize the main characters that will be in this story.
3.  **Panels (Array of Objects)**: Generate an array of approximately {{approximatePanels}} comic panel objects. Each panel object must include:
    *   `panelNumber` (number): A sequential number for the panel.
    *   `sceneDescription` (string): A concise visual description of what is happening in the panel. Describe the setting, character actions, and expressions. This should guide an illustrator. Make it vivid but simple.
    *   `dialogueOrCaption` (string): All character dialogue or narrative captions for the panel.
        *   For dialogue, use the format: "CharacterName: Their dialogue line."
        *   For narrative captions, use the format: "CAPTION: The narrative text."
        *   Ensure dialogue is simple, age-appropriate for {{targetAgeGroup}}, and moves the story forward.
4.  **Story Summary**: Provide a very brief (1-2 sentences) summary of the overall plot or arc of the comic story you've created.

General Guidelines for Kids' Comics:
*   Keep the story simple and easy to follow.
*   Focus on positive themes, friendship, problem-solving, or humor suitable for {{targetAgeGroup}}.
*   Use clear, simple language. Avoid complex vocabulary or sentence structures.
*   Ensure actions and descriptions are visual and can be easily drawn.
*   The story should have a clear beginning, middle, and a satisfying (usually happy) end.
*   Make sure the number of panels generated is close to {{approximatePanels}}.

Output the result as a single JSON object. The JSON object MUST have the following keys: "comicTitle" (string), "characterSummary" (string), "panels" (array of panel objects as described above), and "storySummary" (string).
`,
});

const comicBookWriterFlow = ai.defineFlow(
  {
    name: 'comicBookWriterFlow',
    inputSchema: GenerateComicBookInputSchema,
    outputSchema: GenerateComicBookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate the comic book script.");
    }
    return output;
  }
);
