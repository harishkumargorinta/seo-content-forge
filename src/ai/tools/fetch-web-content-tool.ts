
'use server';
/**
 * @fileOverview A Genkit tool for fetching web content from a URL.
 *
 * - fetchWebContentTool - A tool that fetches the primary text content from a given web URL.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FetchWebContentInputSchema = z.object({
  url: z.string().url().describe('The URL to fetch content from.'),
});

const FetchWebContentOutputSchema = z.object({
  content: z.string().describe('The fetched text content from the URL.'),
  error: z.string().optional().describe('Error message if fetching failed.'),
});

export const fetchWebContentTool = ai.defineTool(
  {
    name: 'fetchWebContentTool',
    description: 'Fetches the primary text content from a given web URL. It attempts to strip HTML tags and extract readable text.',
    inputSchema: FetchWebContentInputSchema,
    outputSchema: FetchWebContentOutputSchema,
  },
  async (input) => {
    try {
      const response = await fetch(input.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 GenkitContentFetcher/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        return { content: '', error: `Failed to fetch URL: ${response.status} ${response.statusText}` };
      }

      const contentType = response.headers.get('content-type');
      let textContent = await response.text();

      if (contentType && contentType.includes('text/html')) {
        // Remove script and style elements
        textContent = textContent.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        textContent = textContent.replace(/<style[^>]*>([\S\s]*?)<\/style>/gmi, '');
        // Remove all HTML tags
        textContent = textContent.replace(/<[^>]+>/gm, ' ');
        // Replace multiple spaces and newlines with a single space
        textContent = textContent.replace(/\s+/gm, ' ').trim();
      }
      
      if (!textContent) {
        return { content: '', error: 'Fetched content was empty after processing.' };
      }

      return { content: textContent };
    } catch (e: any) {
      console.error(`Error in fetchWebContentTool for URL ${input.url}:`, e);
      return { content: '', error: `Error fetching or processing URL: ${e.message}` };
    }
  }
);
