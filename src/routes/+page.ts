import type { PageLoad } from './$types';

// Enable prerendering for this page
export const prerender = true;

// Optional: Control Server-Side Rendering
export const ssr = true;

// Optional: Control client-side hydration
export const csr = true;

// Load function that runs at build time during prerendering
export const load: PageLoad = async ({ url }) => {
	// This runs at build time when prerendering
	// Perfect for loading static data, configuration, or initial state
	
	const appConfig = {
		title: 'User Management System',
		description: 'A simple user management application built with SvelteKit',
		version: '1.0.0',
		buildTime: new Date().toISOString(),
		features: [
			'Create new users',
			'View existing users', 
			'Form validation',
			'Responsive design',
			'TypeScript support'
		]
	};

	// Simulate loading some initial data
	const initialStats = {
		totalUsers: 0,
		lastUpdated: new Date().toISOString(),
		isPrerendered: true
	};

	// Return data that will be available to the page component
	return {
		appConfig,
		initialStats,
		meta: {
			title: appConfig.title,
			description: appConfig.description,
			canonical: url.pathname
		}
	};
};
