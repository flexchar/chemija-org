import blockContent from './objects/blockContent'
import youtube from './objects/youtube'
import table from './objects/table'

import article from './documents/article'
import category from './documents/category'
import exam from './documents/exam'
import questionnaire from './documents/questionnaire'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Document types
  article,
  category,
  exam,
  questionnaire,

  // Object types
  blockContent,
  youtube,
  table,
]

export type ArticleType = typeof article
export type CategoryType = typeof category
export type ExamType = typeof exam
export type QuestionnaireType = typeof questionnaire
export type BlockContentType = typeof blockContent
export type YoutubeType = typeof youtube
export type TableType = typeof table
