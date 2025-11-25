import { Brain, Gamepad2, Target, Users } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Quordle Daily - the brain-training word puzzle game where you solve 4 Wordles simultaneously. Discover our mission to provide engaging daily challenges.",
  keywords: [
    "about quordle",
    "quordle team",
    "word puzzle game",
    "brain training",
    "daily challenge",
  ],
  openGraph: {
    title: "About Quordle Daily",
    description:
      "Learn about our mission to provide engaging daily word puzzles that challenge and entertain.",
  },
};

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs items={[{ name: "About Us", url: `${baseUrl}/about` }]} />

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Quordle Daily</h1>
        <p className="text-xl text-muted-foreground">
          Your daily destination for challenging word puzzles
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Quordle Daily was created to provide word puzzle enthusiasts with a
            unique and challenging daily gaming experience. Our mission is to
            deliver engaging, brain-training puzzles that help sharpen your
            vocabulary and problem-solving skills.
          </p>
          <p>
            We believe that word games are more than just entertainment—they're
            a fun way to exercise your mind, expand your vocabulary, and start
            your day with a satisfying mental challenge.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              Two Unique Games
            </CardTitle>
            <CardDescription>Two distinct puzzle experiences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-1">
                Quordle - 4 Wordles at Once
              </h4>
              <p className="text-sm text-muted-foreground">
                Challenge yourself by solving four five-letter words
                simultaneously. A true test of vocabulary and deduction skills.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Squares - 5x5 Word Search</h4>
              <p className="text-sm text-muted-foreground">
                Find hidden words in a 5x5 grid with drag-to-select interaction
                and visual connections.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Brain Training
            </CardTitle>
            <CardDescription>Exercise your mind daily</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our puzzles are designed to improve vocabulary, enhance pattern
              recognition, and develop strategic thinking. Each daily puzzle
              offers a fresh challenge to keep your mind sharp.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Community Driven
            </CardTitle>
            <CardDescription>Join puzzle lovers worldwide</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Share your achievements, compete with friends, and be part of a
              growing community of word puzzle enthusiasts from around the
              world.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Fresh Content</CardTitle>
            <CardDescription>New puzzles every day</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Every day brings a new set of puzzles. Our content is carefully
              curated and validated to ensure fair, solvable challenges with a
              balanced mix of difficulty levels.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How We Create Daily Puzzles</CardTitle>
          <CardDescription>Our word generation process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Badge variant="secondary">Step 1</Badge>
            <div>
              <h4 className="font-semibold mb-1">Word Selection</h4>
              <p className="text-sm text-muted-foreground">
                We use curated wordlists with thousands of carefully selected
                words, organized by difficulty and category.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Badge variant="secondary">Step 2</Badge>
            <div>
              <h4 className="font-semibold mb-1">Validation</h4>
              <p className="text-sm text-muted-foreground">
                For Squares puzzles, we use advanced algorithms (DFS) to ensure
                all target words can actually be found in the generated grid.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Badge variant="secondary">Step 3</Badge>
            <div>
              <h4 className="font-semibold mb-1">Daily Generation</h4>
              <p className="text-sm text-muted-foreground">
                Using date-based seeding, we ensure consistent daily puzzles
                across all users worldwide.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Built with Modern Technology</CardTitle>
          <CardDescription>Fast, reliable, and user-friendly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Next.js 16</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">Cloudflare Workers</Badge>
            <Badge variant="outline">shadcn/ui</Badge>
            <Badge variant="outline">DFS Algorithms</Badge>
            <Badge variant="outline">Deterministic Generation</Badge>
            <Badge variant="outline">24-Hour Caching</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
