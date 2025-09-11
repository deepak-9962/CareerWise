"use server";

import { z } from "zod";
import { generatePersonalizedCareerReport } from "@/ai/flows/generate-personalized-career-report";
import type { GeneratePersonalizedCareerReportOutput } from "@/ai/flows/generate-personalized-career-report";

export const profileFormSchema = z.object({
  degree: z.string().min(2, { message: "Degree must be at least 2 characters." }),
  year: z.string({ required_error: "Please select your year of study." }),
  skills: z.string().min(2, { message: "Please list at least one skill." }),
  q1: z.string({ required_error: "Please answer this question." }),
  q2: z.string({ required_error: "Please answer this question." }),
  q3: z.string({ required_error: "Please answer this question." }),
  q4: z.string({ required_error: "Please answer this question." }),
  q5: z.string({ required_error: "Please answer this question." }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ActionResult = {
  success: boolean;
  data?: GeneratePersonalizedCareerReportOutput | null;
  error?: string;
};

export async function generateReportAction(values: ProfileFormValues): Promise<ActionResult> {
  const validatedFields = profileFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data.",
    };
  }

  const { degree, year, skills, q1, q2, q3, q4, q5 } = validatedFields.data;

  const input = {
    profile: {
      degree,
      year,
      skills,
    },
    quizAnswers: [q1, q2, q3, q4, q5],
  };

  try {
    const report = await generatePersonalizedCareerReport(input);
    return { success: true, data: report };
  } catch (error) {
    console.error("Error generating report:", error);
    return { success: false, error: "Failed to generate your career report. Please try again." };
  }
}
