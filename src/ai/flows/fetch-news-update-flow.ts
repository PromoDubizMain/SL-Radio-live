
'use server';
/**
 * @fileOverview A flow to fetch and extract news updates from a given URL.
 *
 * - fetchNewsUpdate - A function that fetches content from a URL and extracts a news update.
 * - FetchNewsUpdateInput - The input type for the fetchNewsUpdate function.
 * - FetchNewsUpdateOutput - The return type for the fetchNewsUpdate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FetchNewsUpdateInputSchema = z.object({
  url: z.string().url().describe('The URL to fetch news content from.'),
});
export type FetchNewsUpdateInput = z.infer<typeof FetchNewsUpdateInputSchema>;

const FetchNewsUpdateOutputSchema = z.object({
  newsUpdate: z.string().describe('A concise news update extracted from the URL content. If no specific news item is found, provide a general status or a key highlight from the page. Aim for a single, informative sentence.'),
});
export type FetchNewsUpdateOutput = z.infer<typeof FetchNewsUpdateOutputSchema>;

export async function fetchNewsUpdate(input: FetchNewsUpdateInput): Promise<FetchNewsUpdateOutput> {
  return newsExtractionFlow(input);
}

const newsExtractionPrompt = ai.definePrompt({
  name: 'newsExtractionPrompt',
  input: { schema: z.object({ pageContent: z.string().describe("The full text content of the webpage.") }) },
  output: { schema: FetchNewsUpdateOutputSchema },
  prompt: `Given the following webpage content, extract a single, concise news update or the most important highlight.
If there are multiple news items, pick the most recent or most prominent one.
The update should be suitable for a small news ticker.
If no clear news update is found, summarize the page's main purpose or provide a general status in one sentence.

Webpage Content:
{{{pageContent}}}

Extract the news update:`,
});

const newsExtractionFlow = ai.defineFlow(
  {
    name: 'newsExtractionFlow',
    inputSchema: FetchNewsUpdateInputSchema,
    outputSchema: FetchNewsUpdateOutputSchema,
  },
  async (input) => {
    try {
      const response = await fetch(input.url, { cache: 'no-store' });
      if (!response.ok) {
        console.error(`Failed to fetch URL: ${input.url}, status: ${response.status}`);
        return { newsUpdate: `Error fetching news: Status ${response.status}` };
      }
      const pageContent = await response.text();

      const maxContentLength = 10000; 
      const truncatedContent = pageContent.length > maxContentLength
        ? pageContent.substring(0, maxContentLength) + "..."
        : pageContent;

      if (!truncatedContent.trim()) {
        return { newsUpdate: "No content found at the provided URL." };
      }

      const llmResponse = await newsExtractionPrompt({ pageContent: truncatedContent });
      if (!llmResponse.output) {
        return { newsUpdate: "Could not extract news from the content." };
      }
      return llmResponse.output;

    } catch (error) {
      console.error(`Error in newsExtractionFlow for URL ${input.url}:`, error);
      let errorMessage = "An unexpected error occurred while fetching news.";
      if (error instanceof Error) {
        errorMessage = `Error fetching news: ${error.message.substring(0, 100)}`;
      }
      return { newsUpdate: errorMessage };
    }
  }
);

