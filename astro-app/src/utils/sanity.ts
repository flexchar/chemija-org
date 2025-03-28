import { sanityClient } from 'sanity:client';
import type { PortableTextBlock } from '@portabletext/types';
import type { ImageAsset, Slug } from '@sanity/types';
import groq from 'groq';

// Article functions
export async function getArticles(limit = 10, offset = 0): Promise {
    return await sanityClient.fetch<Article[]>(
        groq`*[_type == "article" && defined(slug.current)] | order(publishedAt desc) [${offset}...${offset + limit}]`,
    );
}

export async function getLatestArticles(limit = 4): Promise {
    return await sanityClient.fetch<Article[]>(
        groq`*[_type == "article" && defined(slug.current)] | order(publishedAt desc) [0...${limit}]`,
    );
}

export async function getArticle(slug: string): Promise {
    return await sanityClient.fetch<Article>(
        groq`*[_type == "article" && slug.current == $slug][0]`,
        {
            slug,
        },
    );
}

export async function updateArticleViewCount(id: string): Promise {
    await sanityClient
        .patch(id)
        .setIfMissing({ viewCount: 0 })
        .inc({ viewCount: 1 })
        .commit();
}

// Exam functions
export async function getExams(limit = 20, offset = 0): Promise {
    return await sanityClient.fetch<Exam[]>(
        groq`*[_type == "exam" && defined(slug.current)] | order(examDate desc) [${offset}...${offset + limit}]`,
    );
}

export async function getLatestExams(limit = 4): Promise {
    return await sanityClient.fetch<Exam[]>(
        groq`*[_type == "exam" && defined(slug.current)] | order(examDate desc) [0...${limit}]`,
    );
}

export async function getExam(slug: string): Promise {
    return await sanityClient.fetch<Exam>(
        groq`*[_type == "exam" && slug.current == $slug][0]`,
        {
            slug,
        },
    );
}

export async function updateExamDownloadCount(id: string): Promise {
    await sanityClient
        .patch(id)
        .setIfMissing({ downloadCount: 0 })
        .inc({ downloadCount: 1 })
        .commit();
}

// Legacy functions (for compatibility)
export async function getPosts(): Promise {
    return await getArticles();
}

export async function getPost(slug: string): Promise {
    return await getArticle(slug);
}

// Interfaces
export interface Article {
    _id: string;
    _type: 'article';
    _createdAt: string;
    title?: string;
    slug: Slug;
    excerpt?: string;
    category?: string;
    viewCount?: number;
    mainImage?: ImageAsset & { alt?: string };
    body: PortableTextBlock[];
    publishedAt?: string;
}

export interface Exam {
    _id: string;
    _type: 'exam';
    _createdAt: string;
    title?: string;
    slug: Slug;
    examDate: string;
    examType: string;
    questionsFile: {
        asset: {
            _ref: string;
            url: string;
        };
    };
    answersFile?: {
        asset: {
            _ref: string;
            url: string;
        };
    };
    description?: string;
    difficulty?: string;
    downloadCount?: number;
}
