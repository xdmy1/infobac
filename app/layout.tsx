import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/shared/cookie-banner";
import { AnalyticsIdentity } from "@/components/shared/analytics-identity";
import { siteConfig } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const HOMEPAGE_TITLE = `InfoBac.md — 10 din oficiu la BAC informatică Moldova | Certiport`;
const HOMEPAGE_DESCRIPTION =
  "Pregătire online pentru BAC informatică Moldova prin 3 certificări Certiport (Python, SQL, Devices) — certificări internațional recunoscute, utile pentru pregătirea probei de informatică. De la 250 MDL/lună. Făcut în Chișinău de elevi care au luat 10.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: HOMEPAGE_TITLE,
    template: `%s · ${siteConfig.name}`,
  },
  description: HOMEPAGE_DESCRIPTION,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  category: "education",
  alternates: {
    canonical: "/",
    languages: {
      "ro-MD": siteConfig.url,
      "x-default": siteConfig.url,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    alternateLocale: ["ro_RO"],
    url: siteConfig.url,
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    siteName: siteConfig.fullName,
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    site: process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? undefined,
    creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default",
  },
  other: {
    "msapplication-TileColor": "#0f172a",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro-MD"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors closeButton />
          <AnalyticsIdentity />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            {/*
              Google Consent Mode v2. Analytics storage is granted up front
              and advertising storage stays denied — we run no ads and want no
              ad profiles built from this traffic. The banner informs rather
              than gates (see components/shared/cookie-banner.tsx); anyone who
              opts out through the privacy policy is excluded before this runs.
            */}
            <Script id="ga-consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                var analytics = 'granted';
                try {
                  if (typeof localStorage !== 'undefined' &&
                      localStorage.getItem('analytics-opt-out') === '1') {
                    analytics = 'denied';
                  }
                } catch (e) { /* localStorage may be blocked; stay granted */ }
                gtag('consent', 'default', {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': analytics
                });
              `}
            </Script>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          </>
        )}
        <CookieBanner />
      </body>
    </html>
  );
}
