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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Built with Modern Technology</CardTitle>
          <CardDescription>Fast, reliable, and user-friendly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline">Next.js 16</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">Cloudflare Workers</Badge>
            <Badge variant="outline">shadcn/ui</Badge>
            <Badge variant="outline">DFS Algorithms</Badge>
            <Badge variant="outline">Deterministic Generation</Badge>
            <Badge variant="outline">24-Hour Caching</Badge>
          </div>

          {/* GitHub Section */}
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Open Source Project</h3>
            <p className="text-muted-foreground mb-4">
              Quordle Daily is open source! View the source code, report issues,
              or contribute to the project.
            </p>
            <a
              href="https://github.com/SymphonyIceAttack/quordle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
