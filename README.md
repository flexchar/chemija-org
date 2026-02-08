# Chemija.org Archive

This repository contains the source code for the Chemija.org website, a chemistry resource site in Lithuanian. It is a monorepo built with Astro for the frontend and Sanity as a headless CMS.

## Project Structure

The monorepo is organized into three main directories:

1.  **`astro-app/`**: The frontend application built with [Astro](https://astro.build/).
    - **`src/`**: Contains the core source code.
        - `assets/`: Static assets like CSS.
        - `components/`: Reusable Astro components, including UI elements, interactive calculators (e.g., molar mass, chemical equation balancer), and components for rendering rich text content from Sanity.
        - `layouts/`: Defines the overall page structure.
        - `pages/`: Defines the routes and individual pages of the site (e.g., homepage, articles, exams, calculators).
        - `types/`: TypeScript type definitions, including those generated from the Sanity schema.
        - `utils/`: Utility functions, notably `sanity.ts` which handles fetching data from Sanity using GROQ queries.
    - `public/`: Static files publicly accessible (e.g., images, `robots.txt`).
    - `astro.config.mjs`: Astro configuration file.

2.  **`studio/`**: The [Sanity Studio](https://www.sanity.io/studio) configuration for content management.
    - **`src/schemaTypes/`**: Defines the content model (schemas) for Sanity.
        - `documents/`: Defines the main content types:
            - `article.ts`: For chemistry articles, including rich text body, categories, and legacy URL tracking.
            - `category.ts`: For categorizing articles.
            - `exam.ts`: For past chemistry exams, including question and answer files.
            - `questionnaire.ts`: For sets of questions and answers ("Klausimynas").
        - `objects/`: Defines reusable structured content types that can be embedded within documents:
            - `blockContent.tsx`: A rich text editor schema allowing various formatting options, lists, and embedding of images, YouTube videos, and tables. This is where the "ugly content" mentioned in the problem description might originate if not structured well by content editors.
            - `table.ts`: For creating simple tables.
            - `youtube.ts`: For embedding YouTube videos.
    - `sanity.config.ts`: Main configuration file for the Sanity Studio.
    - `sanity.cli.ts`: Configuration for the Sanity CLI.

## Content Management

Content for the website is managed in Sanity Studio. The "ugly content" issue likely refers to content within the `blockContent` fields of articles that may lack consistent structure or formatting. Improving this would involve either migrating/cleaning up existing Sanity data or providing stricter guidelines and tools for content editors.

## Development

(Information about local development setup, if available, would go here. Typically involves running the Astro dev server and the Sanity Studio locally.)
