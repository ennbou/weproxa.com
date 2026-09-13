// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import starlightSidebarTopics from 'starlight-sidebar-topics';

const POSTHOG_KEY = process.env.PUBLIC_POSTHOG_KEY ?? 'phc_mdnC7GAxSmrei9bRcAo4fYkJUHq2sytfuhK6CLnvghPH';
const POSTHOG_HOST = process.env.PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';

// PostHog web snippet, inlined so the key and options sit next to the other head tags.
// `cookieless_mode: 'always'` stores nothing on the visitor's device, so the site needs
// no consent banner under the EU ePrivacy rules. It requires "Cookieless server hash mode"
// to be enabled in the PostHog project settings.
const posthogSnippet = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="du vu fu pu yu init Bu Hu Nu qu Vu Kl ju Zu Ou Yu Xu th capture getExtension zu hu nh calculateEventProperties ih register register_once register_for_session unregister unregister_for_session ah Lu sh getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync uh identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset hh shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty rh Ku createPersonProfile setInternalOrTestUser oh bu opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Qu debug Yl Os getPageViewId captureTraceFeedback captureTraceMetric Pu".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('${POSTHOG_KEY}', {
	api_host: '${POSTHOG_HOST}',
	defaults: '2026-05-30',
	cookieless_mode: 'always',
	person_profiles: 'identified_only',
	disable_session_recording: true,
});`;

// https://astro.build/config
export default defineConfig({
	site: 'https://weproxa.com',
	integrations: [
		sitemap(),
		starlight({
			title: 'WePROXA',
			disable404Route: true,
			components: {
				Banner: './src/components/Banner.astro',
				Footer: './src/components/Footer.astro',
			},
			logo: {
				src: '/public/favicon.svg',
			},
			favicon: '/favicon.svg',
			head: [
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'WePROXA' } },
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://weproxa.com/og-image.jpeg' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://weproxa.com/og-image.jpeg' } },
				{ tag: 'script', content: posthogSnippet },
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/ennbou/weproxa.com' },
				{ icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/weproxa' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/WePROXA' },
			],
			customCss: ['./src/styles/custom.css'],
			plugins: [
				starlightBlog({
					title: 'Blog',
					prefix: 'blog',
					rss: false,
					authors: {
						weproxa: {
							name: 'WePROXA Team',
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
									{ label: 'Installation macOS', slug: 'guide/getting-started/installation' },
									{ label: 'Installation Windows', slug: 'guide/getting-started/installation-windows' },
									{ label: 'Quick Start', slug: 'guide/getting-started/quick-start' },
								],
							},
							{
								label: 'Features',
								items: [
									{ label: 'Inspect Requests', slug: 'guide/features/inspect-requests' },
									{ label: 'Workspaces', slug: 'guide/features/workspaces' },
									{ label: 'Scenarios', slug: 'guide/features/scenarios' },
									{ label: 'WebSocket Inspection', slug: 'guide/features/websocket-inspection' },
									{ label: 'Breakpoints', slug: 'guide/features/breakpoints' },
									{ label: 'Map Local', slug: 'guide/features/map-local' },
									{ label: 'Repeat Requests', slug: 'guide/features/repeat-requests' },
									{ label: 'Diff Requests', slug: 'guide/features/diff-requests' },
									{ label: 'Block List', slug: 'guide/features/block-list' },
									{ label: 'Pass-Through Containment', slug: 'guide/features/pass-through' },
									{ label: 'Network Conditioning', slug: 'guide/features/network-conditioning' },
									{ label: 'Scripting', slug: 'guide/features/scripting' },
									{ label: 'Network Performance Metrics', slug: 'guide/features/network-performance-metrics' },
									{ label: 'Advanced Filtering', slug: 'guide/features/advanced-filtering' },
								],
							},
							{
								label: 'Guides',
								items: [
									{ label: 'Certificate Trust', slug: 'guide/guides/certificate-trust' },
									{ label: 'Windows HTTPS Certificate Setup', slug: 'guide/guides/windows-https-certificate-setup' },
									{ label: 'SSL Interception', slug: 'guide/guides/ssl-interception' },
									{ label: 'HTTPS Debugging', slug: 'guide/guides/https-debugging' },
									{ label: 'iOS Simulator', slug: 'guide/guides/ios-simulator' },
									{ label: 'Remote Devices', slug: 'guide/guides/remote-devices' },
									{ label: 'MCP Integration', slug: 'guide/guides/mcp-integration' },
									{ label: 'Agent Skills', slug: 'guide/guides/agent-skills' },
									{ label: 'Toolbar & Tray', slug: 'guide/guides/tray-and-toolbar' },
									{ label: 'Keyboard Shortcuts', slug: 'guide/guides/keyboard-shortcuts' },
									{ label: 'Troubleshooting', slug: 'guide/guides/troubleshooting' },
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
