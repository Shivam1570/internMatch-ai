'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const applyFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  contact: z.string().min(10, { message: 'Please enter a valid contact number.' }),
  resume: z.string().min(1, { message: 'Resume is required.' }),
});

export type ApplyFormValues = z.infer<typeof applyFormSchema>;

type ApplyFormProps = {
  onSubmit: (values: ApplyFormValues) => Promise<void>;
};

export function ApplyForm({ onSubmit }: ApplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: {
      name: '',
      email: '',
      contact: '',
      resume: '',
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = loadEvent.target?.result as string;
        if (base64) {
          field.onChange(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (values: ApplyFormValues) => {
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="+91 12345 67890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Upload Resume</FormLabel>
                    <div className="relative">
                        <Input 
                            id="resume-upload-dialog" 
                            type="file" 
                            className="h-12 pl-12 pr-24" 
                            onChange={(e) => handleFileChange(e, field)} 
                            accept=".pdf,.doc,.docx" 
                        />
                        <UploadCloud className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        {fileName && <p className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground truncate max-w-[100px]">{fileName}</p>}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
}
