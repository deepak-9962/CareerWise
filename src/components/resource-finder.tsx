"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, Book, Youtube, GraduationCap } from "lucide-react";

import { getResourcesAction } from "@/app/actions";
import { resourceFormSchema, type ResourceFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { GetResourceRecommendationsOutput } from "@/ai/flows/get-resource-recommendations";
import { Separator } from "./ui/separator";

function ResourceCard({ title, url, author }: { title: string; url?: string; author?: string }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                {author && <CardDescription>by {author}</CardDescription>}
            </CardHeader>
            {url && (
                <CardContent>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View Resource
                    </a>
                </CardContent>
            )}
        </Card>
    );
}


export default function ResourceFinder() {
    const [isPending, startTransition] = useTransition();
    const [resources, setResources] = useState<GetResourceRecommendationsOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceFormSchema),
        defaultValues: {
            skill: "",
        },
    });

    const onSubmit = (values: ResourceFormValues) => {
        setResources(null);
        startTransition(async () => {
            const result = await getResourcesAction(values);
            if (result.success && result.data) {
                setResources(result.data);
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: result.error || "There was a problem with your request.",
                });
            }
        });
    };

    return (
        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold flex items-center gap-2"><Search className="w-8 h-8 text-primary" /> Find Learning Resources</CardTitle>
                    <CardDescription>
                        Enter a skill you want to learn, and our AI will find the best resources for you.
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="skill"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Skill</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Next.js, Python, Machine Learning" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardContent>
                            <Button type="submit" disabled={isPending} className="w-full" size="lg">
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Find Resources
                            </Button>
                        </CardContent>
                    </form>
                </Form>
            </Card>

            {isPending && (
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">Finding the best resources...</p>
                </div>
            )}

            {resources && (
                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Youtube className="text-primary"/> YouTube Videos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resources.youtube?.map(video => <ResourceCard key={video.url} {...video} />)}
                        </div>
                    </section>
                    <Separator />
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><GraduationCap className="text-primary"/> Online Courses</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resources.courses?.map(course => <ResourceCard key={course.url} {...course} />)}
                        </div>
                    </section>
                    <Separator />
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Book className="text-primary"/> Books</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resources.books?.map(book => <ResourceCard key={book.title} {...book} />)}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
