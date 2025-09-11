'use server';

/**
 * @fileOverview A personalized career report generator AI agent.
 *
 * - generatePersonalizedCareerReport - A function that handles the career report generation process.
 * - GeneratePersonalizedCareerReportInput - The input type for the generatePersonalizedCareerReport function.
 * - GeneratePersonalizedCareerReportOutput - The return type for the generatePersonalizedCareerReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedCareerReportInputSchema = z.object({
  profile: z.object({
    degree: z.string().describe('The degree/major of the student.'),
    year: z.string().describe('The year of study of the student.'),
    skills: z.string().describe('The technical skills of the student, comma-separated.'),
  }).describe('The academic profile of the student.'),
  quizAnswers: z.array(z.string()).describe('The answers to the psychometric quiz.'),
});
export type GeneratePersonalizedCareerReportInput = z.infer<typeof GeneratePersonalizedCareerReportInputSchema>;

const GeneratePersonalizedCareerReportOutputSchema = z.object({
  careerRecommendations: z.array(z.object({
    title: z.string().describe('The title of the career recommendation.'),
    description: z.string().describe('The description of the career recommendation.'),
  })).describe('The top 3 career recommendations for the student.'),
  fitReasoning: z.array(z.object({
    title: z.string().describe('The title of the career recommendation.'),
    reason: z.string().describe('The reasoning behind why this career is a good fit for the student.'),
  })).describe('The reasoning behind why each career recommendation is a good fit for the student.'),
  learningPlans: z.array(z.object({
    skill: z.string().describe('The skill to be learned.'),
    plan: z.array(z.object({
      day: z.number().describe('The day of the learning plan.'),
      task: z.string().describe('The task to be completed on this day.'),
    })).describe('The 7-day learning plan for the skill.'),
  })).describe('A list of personalized 7-day learning plans for the student based on recommended careers.'),
});
export type GeneratePersonalizedCareerReportOutput = z.infer<typeof GeneratePersonalizedCareerReportOutputSchema>;

export async function generatePersonalizedCareerReport(input: GeneratePersonalizedCareerReportInput): Promise<GeneratePersonalizedCareerReportOutput> {
  return generatePersonalizedCareerReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedCareerReportPrompt',
  input: {schema: GeneratePersonalizedCareerReportInputSchema},
  output: {schema: GeneratePersonalizedCareerReportOutputSchema},
  prompt: `You are a personalized career advisor for university students in India. Based on their academic profile and psychometric quiz results, you will generate a personalized career report with the top 3 career recommendations, the reasoning behind why each career is a good fit, and a 7-day learning plan for a key skill for each recommendation.

Academic Profile:
Degree: {{{profile.degree}}}
Year of Study: {{{profile.year}}}
Technical Skills: {{{profile.skills}}}

Psychometric Quiz Results: {{{quizAnswers}}}

Generate the response in the following JSON structure:
{
  "careerRecommendations": [
    {"title": "AI Engineer", "description": "..."},
    {"title": "Data Analyst", "description": "..."},
    {"title": "Cloud Solutions Architect", "description": "..."}
  ],
  "fitReasoning": [
    {"title": "AI Engineer", "reason": "..."},
    {"title": "Data Analyst", "reason": "..."},
    {"title": "Cloud Solutions Architect", "reason": "..."}
  ],
  "learningPlans": [
    {
      "skill": "Natural Language Processing",
      "plan": [
        {"day": 1, "task": "..."},
        {"day": 2, "task": "..."}
      ]
    },
    {
      "skill": "Advanced SQL",
      "plan": [
        {"day": 1, "task": "..."},
        {"day": 2, "task": "..."}
      ]
    },
    {
      "skill": "Infrastructure as Code (Terraform)",
      "plan": [
        {"day": 1, "task": "..."},
        {"day": 2, "task": "..."}
      ]
    }
  ]
}
`,
});

const generatePersonalizedCareerReportFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedCareerReportFlow',
    inputSchema: GeneratePersonalizedCareerReportInputSchema,
    outputSchema: GeneratePersonalizedCareerReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
