import path from 'path';
import { createClient, type SanityClient } from '@sanity/client';

// Configuration - Ensure these environment variables are set
const sanityConfig = {
    projectId: Bun.env.SANITY_PROJECT_ID!, // Assume projectId is set
    dataset: Bun.env.SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: '2024-05-01',
    token: Bun.env.SANITY_API_KEY,
};

const sanityClient = createClient(sanityConfig);

// --- Configuration ---
const outputDir = path.resolve(process.cwd(), '../astro-app');
const vercelConfigPath = path.join(outputDir, 'vercel.json');

// --- Types ---
interface Article {
    slug: string;
    legacy_urls?: string[];
}

interface Redirect {
    source: string;
    destination: string;
    permanent: boolean;
}

interface Rewrite {
    source: string;
    destination: string;
    has?: { type: string; value: string }[];
}

interface VercelConfig {
    redirects: Redirect[]; // Make non-optional as we always generate them
    rewrites: Rewrite[]; // Make non-optional
}

// --- Core Functions ---

/**
 * Fetches articles with legacy URLs from Sanity. Errors will halt execution.
 */
async function fetchArticles(client: SanityClient): Promise<Article[]> {
    const query = `
      *[_type == "article" && defined(legacy_urls) && length(legacy_urls) > 0] {
        "slug": slug.current,
        legacy_urls
      }
    `;
    const articles = await client.fetch<Article[]>(query);
    console.log(`Fetched ${articles.length} articles with legacy URLs.`);
    return articles;
}

/**
 * Generates redirects based on fetched articles.
 */
function generateArticleRedirects(articles: Article[]): Redirect[] {
    return articles.flatMap((article) =>
        (article.legacy_urls || []).map((url) => ({
            source: url.startsWith('/') ? url : `/${url}`,
            destination: `/${article.slug}`,
            permanent: true,
        })),
    );
}

/**
 * Defines global static redirects.
 */
function getGlobalRedirects(): Redirect[] {
    return [
        {
            source: '/cheminis-skaiciuotuvas.html',
            destination: '/cheminis-skaiciuotuvas',
            permanent: true,
        },
        {
            source: '/egzaminai.html',
            destination: '/egzaminai',
            permanent: true,
        },
    ];
}

/**
 * Defines the desired rewrite rules.
 */
function getDesiredRewrites(): Rewrite[] {
    return [
        {
            source: '/:path(.*)', // Match any path
            destination: 'https://chemija-legacy.netlify.app/:path', // Proxy to the legacy site
        },
    ];
}

/**
 * Ensures uniqueness within the generated redirects by source path.
 */
function processRedirects(generated: Redirect[]): Redirect[] {
    const uniqueRedirectsMap = new Map(
        generated.map((item) => [item.source, item]),
    );
    return Array.from(uniqueRedirectsMap.values());
}

// --- Main Execution ---
async function main() {
    console.log('Starting Vercel config generation...');

    // 1. Fetch data
    const articles = await fetchArticles(sanityClient);

    // 2. Generate redirects
    const articleRedirects = generateArticleRedirects(articles);
    const globalRedirects = getGlobalRedirects();
    const allGeneratedRedirects = [...articleRedirects, ...globalRedirects];

    // 3. Process redirects (remove duplicates)
    const finalRedirects = processRedirects(allGeneratedRedirects);

    // 4. Define rewrites (processing is trivial, just use directly)
    const finalRewrites = getDesiredRewrites();

    // 5. Construct final configuration
    const finalVercelConfig: VercelConfig = {
        redirects: finalRedirects,
        rewrites: finalRewrites,
    };

    // 6. Write the final config file (errors will halt execution)
    const dataToWrite = JSON.stringify(finalVercelConfig, null, 2) + '\n';
    await Bun.write(vercelConfigPath, dataToWrite);

    console.log(
        `Vercel config generation completed. Wrote ${finalRedirects.length} redirects and ${finalRewrites.length} rewrites to\n${vercelConfigPath}`,
    );
}

// Run the main function
main();
