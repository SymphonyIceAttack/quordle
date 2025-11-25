import { Github, Mail, MessageSquare, Twitter } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Quordle Daily team. Send us your feedback, suggestions, or questions about our word puzzle games.",
  keywords: [
    "contact quordle",
    "quordle support",
    "word game feedback",
    "bug report",
    "feature request",
  ],
  openGraph: {
    title: "Contact Quordle Daily",
    description:
      "Send us your feedback, questions, or suggestions about our daily word puzzles.",
  },
};

export default function ContactPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs
        items={[{ name: "Contact Us", url: `${baseUrl}/contact` }]}
      />

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground">
          We'd love to hear from you
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              General Inquiries
            </CardTitle>
            <CardDescription>
              For general questions and feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Have a question about the game? Want to share your feedback? We're
              here to help!
            </p>
            <div className="font-mono text-sm bg-muted p-3 rounded">
              contact@quordle-daily.com
            </div>
            <p className="text-xs text-muted-foreground">
              We typically respond within 24-48 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Bug Reports
            </CardTitle>
            <CardDescription>Report technical issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Found a bug? Encountered a technical issue? Please let us know so
              we can fix it as soon as possible.
            </p>
            <div className="font-mono text-sm bg-muted p-3 rounded">
              bugs@quordle-daily.com
            </div>
            <p className="text-xs text-muted-foreground">
              Please include steps to reproduce the issue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-6 w-6 text-primary" />
              Feature Requests
            </CardTitle>
            <CardDescription>Suggest new features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Have an idea for a new feature or improvement? We value your input
              and would love to hear your suggestions!
            </p>
            <div className="font-mono text-sm bg-muted p-3 rounded">
              features@quordle-daily.com
            </div>
            <p className="text-xs text-muted-foreground">
              Share your ideas to help improve Quordle Daily
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Twitter className="h-6 w-6 text-primary" />
              Social Media
            </CardTitle>
            <CardDescription>Follow us for updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Follow us on social media for the latest updates, tips, and
              community highlights.
            </p>
            <div className="space-y-2">
              <a
                href="https://twitter.com/quordledaily"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline block"
              >
                Twitter: @quordledaily
              </a>
              <a
                href="https://github.com/quordle-daily"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline block"
              >
                GitHub: Quordle Daily
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What to Include in Your Message</CardTitle>
          <CardDescription>Help us respond faster</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">For General Inquiries:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Your name and email address</li>
              <li>Subject or topic of your inquiry</li>
              <li>Any relevant details or context</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">For Bug Reports:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Description of the bug</li>
              <li>Steps to reproduce the issue</li>
              <li>Your browser/device type</li>
              <li>Screenshots (if applicable)</li>
              <li>Current date and time of occurrence</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">For Feature Requests:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Description of the proposed feature</li>
              <li>How it would improve your experience</li>
              <li>Any additional context or use cases</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Link */}
      <Card>
        <CardHeader>
          <CardTitle>Before You Contact Us</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">
            Check out these helpful resources before reaching out:
          </p>
          <div className="space-y-2">
            <a
              href="/about"
              className="text-primary hover:underline block text-sm"
            >
              → Learn more about Quordle Daily and how it works
            </a>
            <a
              href="/privacy-policy"
              className="text-primary hover:underline block text-sm"
            >
              → Read our Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-primary hover:underline block text-sm"
            >
              → Review our Terms of Service
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Response Time Notice */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          <strong>Response Time:</strong> We typically respond to inquiries
          within 24-48 hours. For urgent issues, please mention "URGENT" in your
          subject line.
        </p>
      </div>
    </div>
  );
}
