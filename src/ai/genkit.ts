import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      googleCloud: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
      },
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
