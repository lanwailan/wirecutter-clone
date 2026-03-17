import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// 环境变量
const siteUrl = import.meta.env.SITE_URL || 'https://wirecutter-clone.vercel.app';
const siteName = import.meta.env.SITE_NAME || 'Wirecutter Clone';
const siteDescription = import.meta.env.SITE_DESCRIPTION || 'Product reviews and buying advice you can trust';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  site: siteUrl,
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  vite: {
    plugins: []
  }
});