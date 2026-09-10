import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Top-level (not `experimental`) — typed routes went stable in Next 15.5,
  // which is why package.json requires ^15.5.0. This is what makes
  // `NavItem.href: Route` catch a typo'd link at build time.
  typedRoutes: true,
  eslint: {
    dirs: ["src"],
  },
};

export default nextConfig;
