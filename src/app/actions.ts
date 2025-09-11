"use server";

import { generatePersonalizedCareerReport } from "@/ai/flows/generate-personalized-career-report";
import type { GeneratePersonalizedCareerReportOutput } from "@/ai/flows/generate-personalized-career-report";
import { profileFormSchema, type ProfileFormValues } from "@/lib/schemas";


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
