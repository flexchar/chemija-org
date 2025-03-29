import { sanityClient } from 'sanity:client';
import groq from 'groq';
import type { Article, Category, Exam } from '~sanity-schema';
export type { Article, Exam };

// Article functions
export async function getArticles(limit = 10, offset = 0): Promise<Article[]> {
    return await sanityClient.fetch<Article[]>(
        groq`*[_type == "article" && defined(slug.current)] {
            ...,
            "categories": categories[]->{ _id, title }
        } | order(publishedAt desc) [${offset}...${offset + limit}]`,
    );
}

export async function getArticlesCount(): Promise<number> {
    return await sanityClient.fetch<number>(
        groq`count(*[_type == "article" && defined(slug.current)])`,
    );
}

export async function getLatestArticles(limit = 4): Promise<Article[]> {
    return await sanityClient.fetch<Article[]>(
        groq`*[_type == "article" && defined(slug.current)] {
            ...,
            "categories": categories[]->{ _id, title }
        } | order(publishedAt desc) [0...${limit}]`,
    );
}

export async function getArticle(slug: string): Promise<Article> {
    return await sanityClient.fetch<Article>(
        groq`*[_type == "article" && slug.current == $slug] {
            ...,
            "categories": categories[]->{ _id, title }
        }[0]`,
        {
            slug,
        },
    );
}

// get categories
export async function getCategories(): Promise<Category[]> {
    return await sanityClient.fetch<Category[]>(groq`*[_type == "category"]`);
}

export async function updateArticleViewCount(id: string): Promise<void> {
    await sanityClient
        .patch(id)
        .setIfMissing({ viewCount: 0 })
        .inc({ viewCount: 1 })
        .commit();
}

// Exam functions
export async function getExams(limit = 20, offset = 0): Promise<Exam[]> {
    try {
        console.log('Fetching exams with params:', { limit, offset });
        const results = await sanityClient.fetch<Exam[]>(
            groq`*[_type == "exam"] | order(year desc)`,
        );
        console.log('Fetched exams count:', results.length);
        return results;
    } catch (error) {
        console.error('Error fetching exams:', error);
        return [];
    }
}

export async function getLatestExams(limit = 4): Promise<Exam[]> {
    return await sanityClient.fetch<Exam[]>(
        groq`*[_type == "exam"] | order(year desc) [0...${limit}]`,
    );
}
