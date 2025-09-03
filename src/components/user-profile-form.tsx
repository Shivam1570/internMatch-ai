'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  locationPreference: z.string().min(1, 'Location preference is required.'),
  sectorInterests: z.string().min(1, 'Sector interests are required.'),
  locationWeight: z.number().min(0).max(1),
  isRural: z.string().optional(),
  socialCategory: z.string().optional(),
});

type UserProfileFormValues = z.infer<typeof formSchema>;

type UserProfileFormProps = {
  onFindMatches: (values: UserProfileFormValues) => void;
  onExtractSkills: (dataUri: string) => void;
  isExtracting: boolean;
  isMatching: boolean;
  skills: string[];
};

export function UserProfileForm({
  onFindMatches,
  onExtractSkills,
  isExtracting,
  isMatching,
  skills,
}: UserProfileFormProps) {
  const [fileName, setFileName] = useState('');
  const [locationWeight, setLocationWeight] = useState(0.5);

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationPreference: '',
      sectorInterests: '',
      locationWeight: 0.5,
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = loadEvent.target?.result as string;
        if (base64) {
          onExtractSkills(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  function onSubmit(data: UserProfileFormValues) {
    onFindMatches({...data, locationWeight});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <Label htmlFor="resume-upload" className="font-headline text-lg">Upload Resume</Label>
          <FormDescription className="mb-2">
            Upload your resume (PDF, DOCX) to automatically extract your skills.
          </FormDescription>
          <div className="relative">
            <Input id="resume-upload" type="file" className="h-12 pl-12" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            <UploadCloud className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {fileName && <p className="text-sm text-muted-foreground mt-2">File: {fileName}</p>}
        </div>

        {isExtracting && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Extracting skills...
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <Label className="font-headline text-lg">Extracted Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="locationPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-headline text-lg">Location Preference</FormLabel>
              <FormControl>
                <Input placeholder="e.g., San Francisco, CA or Remote" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sectorInterests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-headline text-lg">Sector Interests</FormLabel>
               <FormControl>
                <Input placeholder="e.g., Technology, Marketing" {...field} />
              </FormControl>
              <FormDescription>
                Enter comma-separated sectors you're interested in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
            <FormLabel className="font-headline text-lg">Preference Weight</FormLabel>
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Sector</span>
                <span>Location</span>
            </div>
            <FormControl>
                <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setLocationWeight(value[0] / 100)}
                />
            </FormControl>
            <FormDescription>
                Prioritize sector interest vs. location preference.
            </FormDescription>
        </FormItem>

        <div>
            <h3 className="font-headline text-lg mb-2">Demographics</h3>
             <FormField
                control={form.control}
                name="isRural"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>From rural/aspirational district?</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                        >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="socialCategory"
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Social Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="obc">OBC</SelectItem>
                      <SelectItem value="sc">SC</SelectItem>
                      <SelectItem value="st">ST</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormDescription className="mt-4 text-xs">
                This information helps ensure fair and representative internship placements. Initial AI matching is based on skills and preferences.
            </FormDescription>
        </div>


        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isMatching || skills.length === 0}>
          {isMatching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Find My Matches
        </Button>
        {skills.length === 0 && <p className="text-xs text-center text-muted-foreground mt-2">Please upload a resume and extract skills to find matches.</p>}

      </form>
    </Form>
  );
}
