import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { enableGoogleCloudTelemetry } from '@genkit-ai/google-cloud';

export const ai = genkit(
  {
    plugins: [googleAI()],
    model: 'googleai/gemini-2.5-flash',
  },
  async () => {
    await enableGoogleCloudTelemetry({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    });
  }
);
