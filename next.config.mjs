// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



import transpileModules from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default transpileModules([
  '@fullcalendar/core',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/interaction',
])(nextConfig);
