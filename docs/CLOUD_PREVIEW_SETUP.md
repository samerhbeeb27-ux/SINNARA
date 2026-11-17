# Open the prototype without installing anything

## One-time account setup

1. Create a free account at https://dash.cloudflare.com/sign-up and verify your email.
2. In Workers & Pages, choose the Pages option to create a project and connect GitHub.
3. Authorise access to only samerhbeeb27-ux/SINNARA when GitHub offers repository selection.
4. Create a separate project named sinnara-prototype. Choose the branch phase-1-cloud-prototype for this preview project. Do not change an existing production site.

## Build settings

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export), or None with the values below |
| Build command | npm ci && npm run build |
| Output directory | out |
| Root directory | Repository root |
| NODE_VERSION environment variable | 22 |
| NEXT_TELEMETRY_DISABLED environment variable | 1 |

Do not add an API token, Gemini key, Supabase credentials or a payment method for this prototype. Use the generated pages.dev address. This static export does not require Workers functions or a custom domain.

After deployment, open /ar/ and /en/. Test a mobile viewport, a saved vacancy and a filtered vacancy link. The site carries noindex directives, but it is publicly accessible and noindex is not access control. Only fictional information belongs here.

GitHub Actions is the source of build and test results. A successful deployment alone is not proof that all checks passed.

## If the interface differs

Cloudflare may rename dashboard actions. The intended product is Pages with Git integration and a static export. Avoid choosing a paid plan or adding a dynamic Workers backend for this phase.

Reference: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
