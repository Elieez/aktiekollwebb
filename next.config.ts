import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disable legacy XSS auditor (modern browsers ignore it; old ones can misuse it)
  { key: "X-XSS-Protection", value: "0" },
  // Limit referrer info to same-origin when crossing to http
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser features not used by this app
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Enforce HTTPS for 1 year (enable once TLS is confirmed on prod)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Content Security Policy
  // Note: 'unsafe-inline' for scripts is required by Next.js inline bootstrapping.
  // Use nonce-based CSP via middleware for stricter enforcement if needed.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' for its bootstrapping scripts
      "script-src 'self' 'unsafe-inline'",
      // Inline styles are used by Next.js and Tailwind
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // data: for SVG icons, blob: for chart canvas
      "img-src 'self' data: blob:",
      // Allow XHR/fetch to self and backend API
      `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL ?? ""}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]
      .filter(Boolean)
      .join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
