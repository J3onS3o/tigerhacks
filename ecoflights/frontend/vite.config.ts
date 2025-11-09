// import path from 'path';
// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig(({ mode }) => {
//     const env = loadEnv(mode, '.', '');
//     return {
//       server: {
//         port: 3000,
//         host: '0.0.0.0',
//         proxy: {
//           '/api': {
//             target: 'http://localhost:3001',
//             changeOrigin: true,
//             secure: false,
//             configure: (proxy, options) => {
//               proxy.on('error', (err, req, res) => {
//                 console.log('proxy error', err);
//               });
//               proxy.on('proxyReq', (proxyReq, req, res) => {
//                 console.log('Sending Request to the Target:', req.method, req.url);
//               });
//               proxy.on('proxyRes', (proxyRes, req, res) => {
//                 console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
//               });
//             }
//           }
//         }
//       },
//       plugins: [react()],
//       define: {
//         'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
//         'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
//       },
//       resolve: {
//         alias: {
//           '@': path.resolve(__dirname, '.'),
//         }
//       }
//     };
// });


// ecoflights/vite.config.ts - CORRECTED FOR VERCEL DEPLOYMENT

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path/win32';

export default defineConfig({
    // Vercel only needs the plugins and the base URL settings
    plugins: [react()],
    
    // **CRITICAL FIX: Set the base path.**
    // When Vercel serves the app, it serves it from the root '/'. 
    // This setting ensures all asset paths (like /index.html) are correct.
    base: '/',

    // We keep the alias to resolve the '@' symbol correctly, 
    // but simplify the path resolution to match standard Vite behavior.
    resolve: {
        alias: {
            // This allows you to use imports like '@/'
            '@': path.resolve(__dirname, './src'), 
        }
    },
    
    // Vercel does not need any of the local 'server' or 'proxy' configurations.
    // We remove them because they cause build errors when Vercel tries to interpret them.
});