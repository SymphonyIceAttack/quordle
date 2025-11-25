import { Cookie, Database, Eye, Lock, Shield, Users } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Quordle Daily Privacy Policy - Learn how we collect, use, and protect your personal information when you play our word puzzle games.",
  keywords: [
    "privacy policy",
    "quordle privacy",
    "data protection",
    "GDPR compliance",
    "CCPA",
  ],
  openGraph: {
    title: "Quordle Daily Privacy Policy",
    description: "Learn how we protect your privacy and handle your data.",
  },
};

export default function PrivacyPolicyPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs
        items={[{ name: "Privacy Policy", url: `${baseUrl}/privacy-policy` }]}
      />

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">
          Last updated: November 25, 2025
        </p>
      </div>

      {/* Quick Summary */}
      <Card className="mb-8 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="secondary">We DO NOT</Badge>
            <p className="text-sm">
              Collect personal information, track you across websites, or share
              your data with third parties (except for essential service
              providers).
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary">We DO</Badge>
            <p className="text-sm">
              Store your game statistics locally in your browser and use
              anonymized, aggregated analytics to improve our services.
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
              <Eye className="h-5 w-5 text-primary" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Information You Provide</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                <li>
                  Contact information when you reach out to us (name, email)
                </li>
                <li>Feedback or suggestions you voluntarily submit</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                Information Collected Automatically
              </h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                <li>Game statistics (wins, guesses, completion time)</li>
                <li>Game preferences (theme, sound settings)</li>
                <li>Device and browser information</li>
                <li>IP address (for security and analytics purposes)</li>
                <li>Usage data (pages visited, time spent)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              2. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Provide and maintain our word puzzle games</li>
              <li>Track your game progress and achievements</li>
              <li>Improve game difficulty and user experience</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze usage patterns to optimize our services</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              3. Data Storage and Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Local Storage</h4>
              <p className="text-sm text-muted-foreground">
                Your game statistics and preferences are stored locally in your
                browser using localStorage. This data stays on your device and
                is not transmitted to our servers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Cloud Storage</h4>
              <p className="text-sm text-muted-foreground">
                We use Cloudflare Workers, R2 storage, and D1 databases to serve
                our content and improve performance. All data is encrypted in
                transit and at rest.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Security Measures</h4>
              <p className="text-sm text-muted-foreground">
                We implement industry-standard security measures including
                encryption (HTTPS/TLS), secure data centers, and regular
                security audits to protect your information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 4 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              4. Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">Cloudflare</h4>
              <p className="text-sm text-muted-foreground">
                We use Cloudflare for content delivery, security, and analytics.
                Cloudflare may collect anonymous usage data as described in
                their privacy policy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Google AdSense</h4>
              <p className="text-sm text-muted-foreground">
                We may display Google AdSense ads on our website. Google may use
                cookies to serve ads based on your visit to this and other
                websites. You can opt out of personalized advertising by
                visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Ad Settings
                </a>
                .
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Analytics</h4>
              <p className="text-sm text-muted-foreground">
                We use anonymized analytics to understand how our games are
                used. This data is aggregated and does not identify individual
                users.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 5 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              5. Cookies and Local Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We use the following types of storage:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>
                <strong>Local Storage:</strong> Stores your game statistics and
                preferences locally on your device
              </li>
              <li>
                <strong>Session Storage:</strong> Temporary data needed during
                your session
              </li>
              <li>
                <strong>Cookies:</strong> Essential cookies for website
                functionality (cannot be disabled)
              </li>
              <li>
                <strong>Third-party Cookies:</strong> From Google AdSense for ad
                delivery and analytics
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 6 */}
        <Card>
          <CardHeader>
            <CardTitle>6. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              To exercise these rights, please contact us at
              privacy@quordle-daily.com.
            </p>
          </CardContent>
        </Card>

        {/* Section 7 */}
        <Card>
          <CardHeader>
            <CardTitle>7. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our games are suitable for all ages. We do not knowingly collect
              personal information from children under 13 without parental
              consent. If you are a parent and believe your child has provided
              us with personal information, please contact us to have the
              information removed.
            </p>
          </CardContent>
        </Card>

        {/* Section 8 */}
        <Card>
          <CardHeader>
            <CardTitle>8. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We may update this privacy policy from time to time. We will
              notify users of any material changes by posting the new policy on
              this page and updating the "Last updated" date. Your continued use
              of our services after any changes indicates your acceptance of the
              new policy.
            </p>
          </CardContent>
        </Card>

        {/* Section 9 */}
        <Card>
          <CardHeader>
            <CardTitle>9. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Email:</strong> privacy@quordle-daily.com
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

      {/* Legal Compliance */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Legal Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This privacy policy complies with applicable privacy laws including
            GDPR (EU), CCPA (California), and other regional data protection
            regulations. If you are a resident of the European Economic Area
            (EEA), you have additional rights under GDPR.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
