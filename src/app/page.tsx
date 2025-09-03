'use client';

import { useState } from 'react';
import type { RecommendedInternship } from '@/lib/types';
import { internships as allInternships } from '@/lib/internships';
import { useToast } from '@/hooks/use-toast';
import { extractSkillsAction, recommendInternshipsAction } from './actions';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { UserProfileForm } from '@/components/user-profile-form';
import { InternshipCard } from '@/components/internship-card';
import { Logo } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [recommendations, setRecommendations] = useState<RecommendedInternship[]>(
    allInternships.map((internship) => ({ ...internship, matchScore: 0 }))
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const { toast } = useToast();

  const handleExtractSkills = async (resumeDataUri: string) => {
    setIsExtracting(true);
    setSkills([]);
    const result = await extractSkillsAction({ resumeDataUri });
    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.skills) {
      setSkills(result.skills);
      toast({
        title: 'Success!',
        description: `Extracted ${result.skills.length} skills from your resume.`,
      });
    }
    setIsExtracting(false);
  };

  const handleFindMatches = async (values: any) => {
    setIsMatching(true);
    const { locationPreference, sectorInterests, locationWeight } = values;
    const result = await recommendInternshipsAction({
      applicantSkills: skills,
      applicantLocationPreference: locationPreference,
      applicantSectorInterests: sectorInterests.split(',').map(s => s.trim()),
      internshipListings: allInternships,
      locationWeight: locationWeight,
    });
    
    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.recommendations) {
        const recommendedIds = new Set(result.recommendations.map(r => {
            const original = allInternships.find(i => i.title === r.title);
            return original?.id;
        }));
        
        const recommendedWithDetails = result.recommendations.map(rec => {
            const original = allInternships.find(i => i.title === rec.title);
            return { ...original!, matchScore: rec.matchScore };
        });

        const otherInternships = allInternships
            .filter(internship => !recommendedIds.has(internship.id))
            .map(internship => ({...internship, matchScore: 0}));

        setRecommendations([...recommendedWithDetails, ...otherInternships]);
    }
    setIsMatching(false);
  };
  
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-[350px] w-full" />
      <Skeleton className="h-[350px] w-full" />
      <Skeleton className="h-[350px] w-full" />
    </div>
  )

  return (
    <SidebarProvider>
      <Sidebar className="bg-card border-r" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-primary" />
            <h1 className="font-headline text-xl font-semibold">InternMatch AI</h1>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="p-4">
          <UserProfileForm
            onExtractSkills={handleExtractSkills}
            onFindMatches={handleFindMatches}
            isExtracting={isExtracting}
            isMatching={isMatching}
            skills={skills}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-bold tracking-tight">Internship Opportunities</h2>
            <p className="text-muted-foreground">
              {isMatching ? 'Finding the best matches for you...' : (recommendations.filter(r => r.matchScore > 0).length > 0 ? 'Here are your top internship recommendations!' : 'Browse available internships or upload your resume to get personalized matches.')}
            </p>
          </div>
          {isMatching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[400px] w-full" />)}
            </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
