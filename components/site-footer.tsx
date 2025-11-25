import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-12 bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Quordle Daily</h3>
            <p className="text-sm text-muted-foreground">
              Free daily word puzzle games. Challenge your brain with Quordle
              and Squares.
            </p>
          </div>

          {/* Games */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Games</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Quordle
                </Link>
              </li>
              <li>
                <Link
                  href="/squares"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Squares
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Quordle Daily. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Made with ❤️ for word puzzle lovers</span>
          </div>
        </div>

        {/* AdSense Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This website uses Google AdSense to display advertisements.{" "}
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline"
            >
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
