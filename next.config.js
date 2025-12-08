/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 13+
  // Use 'src' directory convention

  // React strict mode for development
  reactStrictMode: true,

  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Support for WebGL and Three.js with Turbopack
  turbopack: {},

  webpack: (config, { isServer }) => {
    config.externals.push('canvas');

    // Handle WebGL resources
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: 'raw-loader',
    });

    return config;
  },

  // Headers for security and performance
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },

  // Environment variables
  env: {
    // Add any public environment variables here if needed
  },

  // Redirects
  redirects: async () => {
    return [];
  },

  // Rewrites to support markdown file serving
  rewrites: async () => {
    return {
      beforeFiles: [
        // Allow serving markdown files from public/projects directory
        {
          source: '/projects/:slug/README.md',
          destination: '/projects/:slug/README.md',
        },
      ],
    };
  },

  // Performance optimizations
  productionBrowserSourceMaps: false,

  // Trailing slashes (optional, set to true if you prefer /page/)
  trailingSlash: false,

  // Compress responses
  compress: true,

  // PoweredBy header removal
  poweredByHeader: false,

  // Configure typescript
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Experimental features (optional for newer capabilities)
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei'],
  },
};

module.exports = nextConfig;
