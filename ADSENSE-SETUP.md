# AdSense Setup Guide for Quordle Daily

This document provides a comprehensive guide for setting up Google AdSense on the Quordle Daily website.

## ✅ Completed SEO Optimizations

The following SEO optimizations have been implemented to meet AdSense requirements:

### 1. Required Pages (Created ✅)
- **About Us** (`/about`) - Detailed information about the game and team
- **Contact** (`/contact`) - Multiple contact methods and support information
- **Privacy Policy** (`/privacy-policy`) - Comprehensive privacy policy covering:
  - Data collection and usage
  - Third-party services (Cloudflare, Google AdSense)
  - Cookie policy
  - GDPR/CCPA compliance
  - User rights
- **Terms of Service** (`/terms-of-service`) - Complete terms covering:
  - Acceptable use policy
  - Intellectual property
  - Disclaimers
  - Limitation of liability

### 2. SEO Configuration (Optimized ✅)
- **Sitemap** (`/sitemap.xml`) - Includes all public pages with proper priority
- **Robots.txt** (`/robots.txt`) - Properly configured to allow search engines
- **Metadata** - Enhanced with:
  - Comprehensive title and description tags
  - Open Graph tags for social media
  - Twitter Card metadata
  - Canonical URLs
  - Author and publisher information

### 3. Structured Data (Implemented ✅)
The following JSON-LD structured data has been added:
- **WebSite Schema** - Website information and search action
- **Organization Schema** - Company/organization details
- **Game Schema** - Game-specific metadata
- **Breadcrumb Schema** - Navigation breadcrumbs
- **FAQ Schema** - Frequently asked questions (where applicable)

### 4. Navigation & Footer (Added ✅)
- **Site Footer** - Contains links to:
  - All game pages
  - About and Contact pages
  - Privacy Policy and Terms of Service
  - Copyright notice
  - AdSense disclosure notice

## 🚀 Next Steps for AdSense Implementation

### Step 1: Create AdSense Account
1. Visit [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Add your website (`https://yourdomain.com`)
4. Verify ownership via HTML tag or DNS verification

### Step 2: Add AdSense Code
Add the following to your `layout.tsx` file in the `<head>` section:

```tsx
// In app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Your content */}
      </body>
    </html>
  );
}
```

**Important**: Replace `XXXXXXXXXXXXXXXX` with your actual AdSense publisher ID.

### Step 3: Create Ad Units

Create ad components for different placements:

#### Header Banner Ad (728x90 or responsive)
Create a file: `components/ads/HeaderAd.tsx`

```tsx
"use client";

export function HeaderAd() {
  return (
    <div className="flex justify-center my-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
}
```

#### Sidebar Ad (300x250 or responsive)
Create a file: `components/ads/SidebarAd.tsx`

```tsx
"use client";

export function SidebarAd() {
  return (
    <div className="my-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
}
```

### Step 4: Add Ads to Pages

#### In Root Layout (for all pages)
Add header ad to the layout:

```tsx
// In layout.tsx
import { HeaderAd } from "@/components/ads/HeaderAd";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <HeaderAd />
        {children}
      </body>
    </html>
  );
}
```

#### In Specific Pages
Add ads to specific pages:

```tsx
// In app/page.tsx (Quordle game page)
import { SidebarAd } from "@/components/ads/SidebarAd";

export default function Page() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3">
          <QuordleGame />
        </div>
        <div className="md:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Recommended Ad Placements

Based on best practices for puzzle/gaming websites:

1. **Header Banner** (728x90 or responsive)
   - Above the navigation
   - Visible on all pages

2. **Sidebar Ad** (300x250 or responsive)
   - Right sidebar on desktop
   - Below the game area

3. **In-Content Ad**
   - Between game content
   - After 2-3 paragraphs on static pages (About, Contact, etc.)

4. **Footer Ad** (728x90 or responsive)
   - Below the footer content

### Step 6: AdSense Policy Compliance

Ensure compliance with AdSense policies:

#### ✅ Content Quality
- All pages have substantial, original content
- Privacy Policy and Terms are comprehensive
- No placeholder or "coming soon" pages

#### ✅ Navigation
- Clear navigation to all important pages
- Footer links to required legal pages
- No broken links

#### ✅ Ad Placement
- Don't place ads too close to game elements
- Avoid interfering with gameplay
- Don't encourage accidental clicks

#### ✅ User Experience
- Fast loading times (Cloudflare Workers)
- Mobile-responsive design
- No intrusive pop-ups or overlays

## 📊 Analytics & Monitoring

### Add Google Analytics (Optional but Recommended)
Create `components/analytics.tsx`:

```tsx
"use client";

import { useEffect } from "react";

export function Analytics() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Google Analytics 4 implementation
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
      document.head.appendChild(script);

      const inlineScript = document.createElement("script");
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
      `;
      document.head.appendChild(inlineScript);
    }
  }, []);

  return null;
}
```

## 🎯 AdSense Approval Checklist

Before submitting to AdSense, verify:

- [ ] All 4 required pages exist and are linked in the footer
- [ ] Privacy Policy includes Google AdSense disclosure
- [ ] Sitemap.xml includes all public pages
- [ ] Robots.txt allows search engine crawling
- [ ] Structured data is valid (test with Google's Rich Results Test)
- [ ] Website is accessible and loads without errors
- [ ] Content is original and substantial
- [ ] No copyright-infringing content
- [ ] Fast loading times (< 3 seconds)
- [ ] Mobile-responsive design
- [ ] Contact information is available
- [ ] About page describes the website purpose

## 🔧 Testing Your Setup

### 1. Test Structured Data
- Use [Google's Rich Results Test](https://search.google.com/test/rich-results)
- Enter your URL and verify no errors

### 2. Test Sitemap
- Visit `https://yourdomain.com/sitemap.xml`
- Ensure all pages are listed

### 3. Test AdSense Code
- Add test ads using your AdSense account
- Check that ads display correctly
- Verify no console errors

### 4. Test on Mobile
- Ensure ads display properly on mobile devices
- Check that they don't interfere with gameplay

## 📞 Support Resources

- [Google AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Program Policies](https://support.google.com/adsense/answer/48182)
- [Best Practices for Ad Placement](https://support.google.com/adsense/answer/3221668)

## ⚠️ Important Notes

1. **AdSense Review Process**: Typically takes 1-7 days. Ensure your site is fully ready before applying.

2. **Traffic Requirements**: While there's no strict minimum, having consistent organic traffic improves approval chances.

3. **Content Updates**: Keep adding fresh, original content to improve user engagement and ad performance.

4. **Policy Violations**: Stay updated with AdSense policy changes to avoid account suspension.

---

For questions or support, contact: adsense@quordle-daily.com
