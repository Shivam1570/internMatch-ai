'use server';
/**
 * @fileOverview Automatically extracts skills from an applicant's resume using Genkit.
 *
 * - extractSkillsFromResume - A function that handles the skill extraction process.
 * - ExtractSkillsFromResumeInput - The input type for the extractSkillsFromResume function.
 * - ExtractSkillsFromResumeOutput - The return type for the extractSkillsFromResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsFromResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractSkillsFromResumeInput = z.infer<typeof ExtractSkillsFromResumeInputSchema>;

const ExtractSkillsFromResumeOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('The skills extracted from the resume.'),
});
export type ExtractSkillsFromResumeOutput = z.infer<typeof ExtractSkillsFromResumeOutputSchema>;

export async function extractSkillsFromResume(input: ExtractSkillsFromResumeInput): Promise<ExtractSkillsFromResumeOutput> {
  return extractSkillsFromResumeFlow(input);
}

const extractSkillsFromResumePrompt = ai.definePrompt({
  name: 'extractSkillsFromResumePrompt',
  input: {schema: ExtractSkillsFromResumeInputSchema},
  output: {schema: ExtractSkillsFromResumeOutputSchema},
  prompt: `You are an expert at extracting skills from resumes.

  Extract the skills from the resume provided.  The skills should be a list of strings.

  Resume: {{media url=resumeDataUri}}`,
});

const extractSkillsFromResumeFlow = ai.defineFlow(
  {
    name: 'extractSkillsFromResumeFlow',
    inputSchema: ExtractSkillsFromResumeInputSchema,
    outputSchema: ExtractSkillsFromResumeOutputSchema,
  },
  async input => {
    const {output} = await extractSkillsFromResumePrompt(input);
    return output!;
  }
);
