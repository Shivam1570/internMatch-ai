'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import type { RecommendedInternship } from '@/lib/types';
import { Briefcase, Mail, MapPin, Star, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApplyForm } from './apply-form';
import type { ApplyFormValues } from './apply-form';
import { extractSkillsAction } from '@/app/actions';

export function InternshipCard({
  internship,
}: {
  internship: RecommendedInternship;
}) {
  const { toast } = useToast();
  const [isApplied, setIsApplied] = useState(false);
  const [applicantEmail, setApplicantEmail] = useState('');
  const [open, setOpen] = useState(false);

  const handleApply = async (values: ApplyFormValues) => {
    // In a real app, you'd save the application to a database.
    // For now, we'll just simulate the skill extraction and matching.
    const result = await extractSkillsAction({ resumeDataUri: values.resume });
    
    if (result.error) {
      toast({
        title: 'Error',
        description: `Could not process resume: ${result.error}`,
        variant: 'destructive',
      });
      return;
    }

    // Simple matching logic: if more than 2 skills match, consider it a good fit.
    const matchedSkills = internship.skills.filter(skill => result.skills?.includes(skill));
    if (matchedSkills.length > 2) {
        setIsApplied(true);
        setApplicantEmail(values.email);
        toast({
          title: 'Application Submitted!',
          description: "You're a good match for this role and have been shortlisted.",
          className: 'bg-primary text-primary-foreground',
        });
    } else {
       toast({
        title: 'Application Submitted',
        description: "Thank you for applying! We will review your application.",
      });
    }

    setOpen(false);
  };

  const handleEmail = () => {
    const subject = `You're Shortlisted for the ${internship.title} role at ${internship.company}!`;
    const body = `Dear Applicant,%0D%0A%0D%0AThank you for applying for the ${internship.title} position at ${internship.company}. We were impressed with your profile and would like to invite you for an interview.%0D%0A%0D%0APlease let us know your availability for the coming week so we can schedule the next steps.%0D%0A%0D%0ABest regards,%0D%0AThe Hiring Team`;
    window.location.href = `mailto:${applicantEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="flex flex-col h-full bg-card hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl font-headline">{internship.title}</CardTitle>
            <CardDescription className="font-semibold text-primary">{internship.company}</CardDescription>
          </div>
          {internship.matchScore > 0 && (
            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span className="font-bold text-foreground">{Math.round(internship.matchScore * 100)}%</span>
                    <span>Match</span>
                </div>
                <Progress value={internship.matchScore * 100} className="w-24 h-2" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{internship.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{internship.sector}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">
          {internship.description}
        </p>
        <div className="flex flex-wrap gap-2">
            <div className='flex items-center text-sm font-semibold mr-2'>
                <Tag className='w-4 h-4 mr-1.5'/>
                Skills:
            </div>
          {internship.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {isApplied ? (
            <Button onClick={handleEmail} className="w-full" variant="default">
                <Mail className="mr-2 h-4 w-4" />
                Email Applicant
            </Button>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="primary">
                Apply Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for {internship.title}</DialogTitle>
                <DialogDescription>
                  Please fill out the form below to submit your application.
                </DialogDescription>
              </DialogHeader>
              <ApplyForm onSubmit={handleApply} />
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
