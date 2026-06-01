/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/controle-de-midias',
  allowedDevOrigins: ['192.168.1.181'],
  serverExternalPackages: ['knex', 'mssql'],
  outputFileTracingIncludes: {
    '/': ['./src/**/*'],
    '/api/auth/[...nextauth]': ['./src/auth.ts', './src/auth-utils.ts'],
  },
};

export default nextConfig;
