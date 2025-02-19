let userConfig;
(async () => {
  try {
    userConfig = (await import('./next.config.mjs')).default;
  } catch (e) {
    userConfig = {}; // Ensures it's always an object
  }
  mergeConfig(nextConfig, userConfig);
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  headers: async () => [
    {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
      ],
    },
    {
      source: "/manifest.json",
      headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
    },
  ],
};

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig || typeof userConfig !== 'object') return;

  for (const key in userConfig) {
    if (userConfig[key] !== undefined) {
      if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
        nextConfig[key] = { ...nextConfig[key], ...userConfig[key] };
      } else {
        nextConfig[key] = userConfig[key];
      }
    }
  }
}

export default nextConfig;
