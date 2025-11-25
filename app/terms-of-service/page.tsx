import {
  AlertTriangle,
  FileText,
  Globe,
  Scale,
  Shield,
  UserCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for Quordle Daily. Understand your rights and responsibilities when using our daily word puzzle games.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "quordle terms",
    "user agreement",
    "disclaimer",
  ],
  openGraph: {
    title: "Quordle Daily Terms of Service",
    description: "Review our terms and conditions for using Quordle Daily.",
  },
};

export default function TermsOfServicePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs
        items={[
          { name: "Terms of Service", url: `${baseUrl}/terms-of-service` },
        ]}
      />

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">
          Last updated: November 25, 2025
        </p>
      </div>

      {/* Quick Summary */}
      <Card className="mb-8 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="secondary">Free to Use</Badge>
            <p className="text-sm">
              Quordle Daily is a free word puzzle game. By using our service,
              you agree to these terms.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary">Respectful Use</Badge>
            <p className="text-sm">
              Please use our service respectfully and in accordance with these
              terms.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary">No Warranty</Badge>
            <p className="text-sm">
              Our service is provided "as is" without warranties. Use at your
              own risk.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              1. Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              By accessing and using Quordle Daily ("the Service"), you accept
              and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>
            <p className="text-sm text-muted-foreground">
              These Terms of Service ("Terms") govern your use of our website
              located at quordle-daily.com (the "Service") operated by Quordle
              Daily ("us", "we", or "our").
            </p>
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Quordle Daily is an online word puzzle game that offers two game
              modes:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>
                <strong>Quordle:</strong> A game where players solve four
                five-letter words simultaneously in nine attempts
              </li>
              <li>
                <strong>Squares:</strong> A 5x5 word search puzzle game where
                players find hidden words by selecting tiles
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              We provide fresh daily puzzles, game statistics tracking, and
              various features to enhance your gaming experience.
            </p>
          </CardContent>
        </Card>

        {/* Section 3 */}
        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts and Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Currently, Quordle Daily does not require user registration. You
              can play the game without creating an account. Game statistics are
              stored locally in your browser. We reserve the right to implement
              user accounts in the future, at which point these terms will be
              updated accordingly.
            </p>
          </CardContent>
        </Card>

        {/* Section 4 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              4. Acceptable Use Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You agree to use the Service only for lawful purposes and in
              accordance with these Terms. You agree NOT to:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>
                Use the Service in any way that violates applicable federal,
                state, local, or international law
              </li>
              <li>
                Transmit or procure the sending of any advertising or
                promotional material without our prior written consent
              </li>
              <li>
                Impersonate or attempt to impersonate the company, a company
                employee, another user, or any other person or entity
              </li>
              <li>
                Use any automated system (including robots, spiders, or data
                mining tools) to access the Service
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the
                Service
              </li>
              <li>Use the Service to develop competing products or services</li>
              <li>
                Share or distribute content that infringes on intellectual
                property rights
              </li>
              <li>
                Engage in harassment, abuse, insult, harm, defamation,
                discrimination, vulgarity, or Obscenity
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 5 */}
        <Card>
          <CardHeader>
            <CardTitle>5. Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Our Content</h4>
              <p className="text-sm text-muted-foreground">
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                Quordle Daily and its licensors. The Service is protected by
                copyright, trademark, and other laws.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Word Lists</h4>
              <p className="text-sm text-muted-foreground">
                Word lists used in our puzzles are sourced from open-source
                dictionaries and public domain lists. We do not claim ownership
                of these word lists.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">User-Generated Content</h4>
              <p className="text-sm text-muted-foreground">
                Any feedback, suggestions, or comments you provide to us may be
                used by us without restriction or compensation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 6 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              6. Disclaimer of Warranties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              THE INFORMATION ON THIS WEBSITE IS PROVIDED ON AN "AS IS" BASIS.
              TO THE FULLEST EXTENT PERMITTED BY LAW, WE EXCLUDE ALL
              REPRESENTATIONS, WARRANTIES, CONDITIONS, AND TERMS (WHETHER
              EXPRESS OR IMPLIED BY STATUTE, COMMON LAW OR OTHERWISE) WHICH, BUT
              FOR THESE TERMS, WOULD HAVE EFFECT IN RELATION TO THIS WEBSITE.
            </p>
            <p className="text-sm text-muted-foreground">
              We do not warrant that the Service will be constantly available,
              or available at all; nor do we warrant that the Service will be
              free from errors, bugs, or interruptions.
            </p>
          </CardContent>
        </Card>

        {/* Section 7 */}
        <Card>
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              IN NO EVENT SHALL WE, NOR OUR DIRECTORS, EMPLOYEES, PARTNERS,
              AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
              WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
              INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR
              INABILITY TO ACCESS OR USE THE SERVICE.
            </p>
          </CardContent>
        </Card>

        {/* Section 8 */}
        <Card>
          <CardHeader>
            <CardTitle>8. Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the Service, to understand our
              practices.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <a
                href="/privacy-policy"
                className="text-primary hover:underline"
              >
                View our Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Section 9 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              9. Third-Party Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our Service may contain links to third-party websites or services
              that are not owned or controlled by Quordle Daily. We have no
              control over and assume no responsibility for the content, privacy
              policies, or practices of any third-party websites or services.
              You acknowledge and agree that we shall not be responsible or
              liable for any damage or loss caused by your use of any such
              content, goods, or services.
            </p>
          </CardContent>
        </Card>

        {/* Section 10 */}
        <Card>
          <CardHeader>
            <CardTitle>10. Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We may terminate or suspend your access immediately, without prior
              notice or liability, for any reason whatsoever, including without
              limitation if you breach the Terms. Upon termination, your right
              to use the Service will cease immediately.
            </p>
          </CardContent>
        </Card>

        {/* Section 11 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              11. Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which our company is registered,
              without regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        {/* Section 12 */}
        <Card>
          <CardHeader>
            <CardTitle>12. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days' notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion. Your continued use of the Service after any
              such changes constitutes your acceptance of the new Terms.
            </p>
          </CardContent>
        </Card>

        {/* Section 13 */}
        <Card>
          <CardHeader>
            <CardTitle>13. Severability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If any provision of these Terms is held to be unenforceable or
              invalid, such provision will be changed and interpreted to
              accomplish the objectives of such provision to the greatest extent
              possible under applicable law and the remaining provisions will
              continue in full force and effect.
            </p>
          </CardContent>
        </Card>

        {/* Section 14 */}
        <Card>
          <CardHeader>
            <CardTitle>14. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Email:</strong> legal@quordle-daily.com
              </div>
              <div>
                <strong>Contact Page:</strong>{" "}
                <a href="/contact" className="text-primary hover:underline">
                  /contact
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Age Restriction */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Age Restriction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            By using this Service, you represent that you are at least the age
            of majority in your jurisdiction of residence. If you are under the
            age of majority, you may only use the Service with the consent of
            your parent or legal guardian.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
