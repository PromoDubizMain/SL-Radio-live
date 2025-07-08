
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    // This prevents the Next.js dev server from restarting when
    // files are changed in the .firebase/ and .vscode/ directories.
    const ignored = Array.isArray(config.watchOptions.ignored)
      ? config.watchOptions.ignored
      : config.watchOptions.ignored
      ? [config.watchOptions.ignored]
      : [];
    config.watchOptions.ignored = [
      ...ignored,
      '**/.firebase/**',
      '**/.vscode/**',
    ];
    return config;
  },
};

export default nextConfig;
