import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';

// https://vitejs.dev/config/
export default defineConfig({
	base:"/rewards",
	plugins: [react()],
	server: {
		port: 8080,
		proxy: proxyOptions,
		watch: {
			usePolling: true, // Enable polling to avoid inotify limit issues
			interval: 1000,   // Set polling interval
			ignored: ['**/node_modules/**', '**/.git/**'] // Ignore unnecessary paths
		}
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	build: {
		outDir: '../reward_management/public/frontend',
		emptyOutDir: true,
		target: 'es2015',
	},
});
