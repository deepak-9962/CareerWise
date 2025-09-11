'use server';

/**
 * @fileOverview A resource recommendation AI agent.
 *
 * - getResourceRecommendations - A function that handles the resource recommendation process.
 * - GetResourceRecommendationsInput - The input type for the getResourceRecommendations function.
 * - GetResourceRecommendationsOutput - The return type for the getResourceRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Minimal local search stub: crafts YouTube search URLs based on a query.
// Shape matches the previous expected return type.
async function search({ query }: { query: string; options?: { site?: string } }): Promise<{ results: Array<{ title: string; url: string }> }> {
  const q = encodeURIComponent(query);
  return {
    results: [
      { title: `Top results for ${query}`, url: `https://www.youtube.com/results?search_query=${q}` },
      { title: `${query} tutorial`, url: `https://www.youtube.com/results?search_query=${q}+tutorial` },
      { title: `${query} for beginners`, url: `https://www.youtube.com/results?search_query=${q}+for+beginners` },
    ],
  };
}

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
    try {
      const searchResult = await search({
        query: `"${input.query}" tutorial`,
        options: {
          site: 'youtube.com',
        },
      });
  
      return searchResult.results.slice(0, 3).map(r => ({
        title: r.title,
        url: r.url,
      }));
    } catch (error) {
      console.error('YouTube search failed:', error);
      return []; // Return empty array on error to prevent flow failure
    }
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
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  if (!hasGeminiKey) {
    // Safe fallback without calling the LLM
    const q = encodeURIComponent(input.skill);
    return {
      youtube: [
        { title: `${input.skill} Crash Course`, url: `https://www.youtube.com/results?search_query=${q}+tutorial` },
        { title: `Learn ${input.skill} in 1 Hour`, url: `https://www.youtube.com/results?search_query=learn+${q}+in+1+hour` },
        { title: `${input.skill} for Beginners`, url: `https://www.youtube.com/results?search_query=${q}+for+beginners` },
      ],
      courses: [
        { title: `${input.skill} Specialization`, url: `https://www.coursera.org/search?query=${q}` },
        { title: `${input.skill} Nanodegree`, url: `https://www.udacity.com/courses/all?search=${q}` },
        { title: `${input.skill} Path`, url: `https://www.udemy.com/courses/search/?q=${q}` },
      ],
      books: [
        { title: `${input.skill} Cookbook`, author: 'Various' },
        { title: `Practical ${input.skill}`, author: 'Various' },
        { title: `${input.skill} in Action`, author: 'Various' },
      ],
    };
  }
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
