import { sanityClient } from 'sanity:client';
import groq, { defineQuery } from 'groq';
import type {
    ArticlesCountQueryResult,
    ArticlesQueryResult,
    LatestArticlesQueryResult,
    ArticleQueryResult,
    CategoriesQueryResult,
    ExamsQueryResult,
    LatestExamsQueryResult,
} from '@/types/sanity.types';

// Query Definitions

// Query to get multiple articles with pagination
const articlesQuery = defineQuery(
    groq`*[_type == "article" && defined(slug.current)] {
        ...,
        "categories": categories[]->{ _id, title }
    } | order(publishedAt desc) [$offset...$limit]`,
);

// Query to count articles
const articlesCountQuery = defineQuery(
    groq`count(*[_type == "article" && defined(slug.current)])`,
);

// Query to get the latest articles
const latestArticlesQuery = defineQuery(
    groq`*[_type == "article" && defined(slug.current)] {
        ...,
        "categories": categories[]->{ _id, title }
    } | order(publishedAt desc) [0...$limit]`,
);

// Query to get a single article by slug
const articleQuery = defineQuery(
    groq`*[_type == "article" && slug.current == $slug] {
        ...,
        "categories": categories[]->{ _id, title }
    }[0]`,
);

// Query to get all categories
const categoriesQuery = defineQuery(groq`*[_type == "category"]`);

// Article functions
export async function getArticles(limit = 10, offset = 0) {
    return await sanityClient.fetch<ArticlesQueryResult>(articlesQuery, {
        offset,
        limit,
    });
}

export async function getArticlesCount() {
    return await sanityClient.fetch<ArticlesCountQueryResult>(
        articlesCountQuery,
    );
}

export async function getLatestArticles(limit = 4) {
    return await sanityClient.fetch<LatestArticlesQueryResult>(
        latestArticlesQuery,
        { limit },
    );
}

export async function getArticle(slug: string) {
    return await sanityClient.fetch<ArticleQueryResult>(articleQuery, {
        slug,
    });
}

// get categories
export async function getCategories() {
    return await sanityClient.fetch<CategoriesQueryResult>(categoriesQuery);
}

export async function updateArticleViewCount(id: string) {
    await sanityClient
        .patch(id)
        .setIfMissing({ viewCount: 0 })
        .inc({ viewCount: 1 })
        .commit();
}

// Exam functions

// Query to get exams (potentially paginated later, added params for future use)
const examsQuery = defineQuery(groq`*[_type == "exam"] | order(year desc)`);

// Query to get the latest exams
const latestExamsQuery = defineQuery(
    groq`*[_type == "exam"] | order(year desc) [0...$limit]`,
);

export async function getExams() {
    return await sanityClient.fetch<ExamsQueryResult>(examsQuery);
}

export async function getLatestExams(limit = 4) {
    return await sanityClient.fetch<LatestExamsQueryResult>(latestExamsQuery, {
        limit,
    });
}
