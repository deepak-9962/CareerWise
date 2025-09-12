import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Route, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '@/components/back-button';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,35.24,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);


export default function Home() {
  return (
    <div className="flex h-full flex-col items-center bg-background p-4">
      <div className="w-full max-w-screen-2xl">
        <BackButton />
      </div>
      <div className="text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-block rounded-full bg-primary/10 p-4">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Welcome to CareerWise AI
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your personalized career co-pilot, powered by GenAI.
        </p>
        <p className="text-lg text-muted-foreground">
          Let's unlock your potential and find the perfect career path for you.
        </p>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-10 w-full max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Route className="text-primary"/> Build Your Roadmap</CardTitle>
              <CardDescription>Create a personalized skill roadmap and 7-day plan.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="lg">
                <Link href="/profile">Create My Roadmap</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Find Resources</CardTitle>
              <CardDescription>Top videos, courses, and books for any skill.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full" size="lg">
                <Link href="/features">Open Resource Finder</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
