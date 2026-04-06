// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import starlightSidebarTopics from 'starlight-sidebar-topics';

// https://astro.build/config
export default defineConfig({
	site: 'https://weproxa.com',
	integrations: [
		sitemap(),
		starlight({
			title: 'Weproxa',
			disable404Route: true,
			components: {
				Footer: './src/components/Footer.astro',
			},
			logo: {
				src: '/public/favicon.svg',
			},
			favicon: '/favicon.svg',
			head: [
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'Weproxa' } },
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://weproxa.com/og-image.jpeg' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://weproxa.com/og-image.jpeg' } },
				{ tag: 'script', attrs: { defer: true, src: 'https://cloud.umami.is/script.js', 'data-website-id': '0aff05b2-b5a0-4142-ad4f-6d1d4239afd4' } },
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/ennbou/weproxa.com' },
			],
			customCss: ['./src/styles/custom.css'],
			plugins: [
				starlightBlog({
					title: 'Blog',
					prefix: 'blog',
					rss: false,
					authors: {
						weproxa: {
							name: 'Weproxa Team',
						},
					},
				}),
				starlightSidebarTopics([
					{
						label: 'Guide',
						link: '/guide/getting-started/installation/',
						icon: 'open-book',
						items: [
							{
								label: 'Getting Started',
								items: [
									{ label: 'Installation', slug: 'guide/getting-started/installation' },
									{ label: 'Quick Start', slug: 'guide/getting-started/quick-start' },
								],
							},
							{
								label: 'Features',
								items: [
									{ label: 'Inspect Requests', slug: 'guide/features/inspect-requests' },
									{ label: 'Breakpoints', slug: 'guide/features/breakpoints' },
									{ label: 'Map Local', slug: 'guide/features/map-local' },
									{ label: 'Repeat Requests', slug: 'guide/features/repeat-requests' },
									{ label: 'Block List', slug: 'guide/features/block-list' },
									{ label: 'Network Conditioning', slug: 'guide/features/network-conditioning' },
									{ label: 'Advanced Filtering', slug: 'guide/features/advanced-filtering' },
								],
							},
							{
								label: 'Guides',
								items: [
									{ label: 'Certificate Trust', slug: 'guide/guides/certificate-trust' },
									{ label: 'SSL Interception', slug: 'guide/guides/ssl-interception' },
									{ label: 'HTTPS Debugging', slug: 'guide/guides/https-debugging' },
									{ label: 'iOS Simulator', slug: 'guide/guides/ios-simulator' },
									{ label: 'MCP Integration', slug: 'guide/guides/mcp-integration' },
								],
							},
							{
								label: 'FAQ',
								items: [
									{ label: 'Frequently Asked Questions', slug: 'guide/faq' },
								],
							},
						],
					},
					{
						label: 'Pricing',
						link: '/pricing/',
						icon: 'star',
						items: [
							{ label: 'Plans', slug: 'pricing' },
						],
					},
					{
						label: 'Blog',
						link: '/blog/',
						icon: 'pen',
						id: 'blog',
						items: [],
					},
					{
						label: 'Legal',
						link: '/legal/privacy-policy/',
						icon: 'information',
						items: [
							{ label: 'Privacy Policy', slug: 'legal/privacy-policy' },
							{ label: 'Terms of Service', slug: 'legal/terms-of-service' },
						],
					},
				], {
					topics: {
						blog: ['/blog/**'],
					},
				}),
			],
		}),
	],
});
