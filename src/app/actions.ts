'use server';

import {
  extractSkillsFromResume,
  type ExtractSkillsFromResumeInput,
} from '@/ai/flows/extract-skills-from-resume';
import {
  recommendRelevantInternships,
  type RecommendRelevantInternshipsInput,
} from '@/ai/flows/recommend-relevant-internships';

export async function extractSkillsAction(input: ExtractSkillsFromResumeInput) {
  try {
    const result = await extractSkillsFromResume(input);
    return { skills: result.skills };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to extract skills from resume: ${errorMessage}` };
  }
}

export async function recommendInternshipsAction(input: RecommendRelevantInternshipsInput) {
  try {
    const recommendations = await recommendRelevantInternships(input);
    return { recommendations };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate recommendations: ${errorMessage}` };
  }
}
