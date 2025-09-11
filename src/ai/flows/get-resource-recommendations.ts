'use server';

/**
 * @fileOverview A resource recommendation AI agent.
 *
 * - getResourceRecommendations - A function that handles the resource recommendation process.
 * - GetResourceRecommendationsInput - The input type for the getResourceRecommendations function.
 * - GetResourceRecommendationsOutput - The return type for the getResourceRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {search} from '@genkit-ai/google-cloud';
import {z} from 'genkit';

const youtubeSearch = ai.defineTool(
  {
    name: 'youtubeSearch',
    description: 'Search for YouTube videos.',
    inputSchema: z.object({query: z.string()}),
    outputSchema: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })),
  },
  async (input) => {
    const searchResult = await search({
      query: input.query,
      options: {
        site: 'youtube.com',
      },
    });

    return searchResult.results.slice(0, 3).map(r => ({
      title: r.title,
      url: r.url,
    }));
  },
);

const GetResourceRecommendationsInputSchema = z.object({
  skill: z.string().describe('The skill for which to recommend resources.'),
});
export type GetResourceRecommendationsInput = z.infer<typeof GetResourceRecommendationsInputSchema>;

const GetResourceRecommendationsOutputSchema = z.object({
  youtube: z.array(z.object({
    title: z.string().describe('The title of the YouTube video.'),
    url: z.string().url().describe('The URL of the YouTube video.'),
  })).optional().describe('A list of recommended YouTube videos.'),
  courses: z.array(z.object({
    title: z.string().describe('The title of the course.'),
    url: z.string().url().describe('The URL of the course.'),
  })).optional().describe('A list of recommended online courses.'),
  books: z.array(z.object({
    title: z.string().describe('The title of the book.'),
    author: z.string().describe('The author of the book.'),
  })).optional().describe('A list of recommended books.'),
});
export type GetResourceRecommendationsOutput = z.infer<typeof GetResourceRecommendationsOutputSchema>;

export async function getResourceRecommendations(input: GetResourceRecommendationsInput): Promise<GetResourceRecommendationsOutput> {
  return getResourceRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getResourceRecommendationsPrompt',
  input: {schema: GetResourceRecommendationsInputSchema},
  output: {schema: GetResourceRecommendationsOutputSchema},
  tools: [youtubeSearch],
  prompt: `You are an expert at finding the best learning resources. For the given skill, provide the top 3 recommendations for each of the following categories: YouTube videos, online courses, and books. Only recommend resources that are highly rated and from reputable sources.

Use the youtubeSearch tool to find relevant videos and use the results to formulate your response.

Skill: {{{skill}}}

Respond with a JSON object with the following structure:
{
  "youtube": [
    {"title": "Video Title", "url": "https://www.youtube.com/watch?v=..."},
    ...
  ],
  "courses": [
    {"title": "Course Title", "url": "https://..."},
    ...
  ],
  "books": [
    {"title": "Book Title", "author": "Author Name"},
    ...
  ]
}
`,
});

const getResourceRecommendationsFlow = ai.defineFlow(
  {
    name: 'getResourceRecommendationsFlow',
    inputSchema: GetResourceRecommendationsInputSchema,
    outputSchema: GetResourceRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
