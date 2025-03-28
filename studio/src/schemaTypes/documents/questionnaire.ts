import {defineField, defineType} from 'sanity'

interface QuestionnairePreviewProps {
  question?: string
  category?: string
}

export default defineType({
  name: 'questionnaire',
  title: 'Klausimynas',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Kategorija',
      type: 'string',
    }),
    defineField({
      name: 'question',
      title: 'Klausimas',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'answer',
      title: 'Atsakymas',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'points',
      title: 'Taškai',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      question: 'question',
      category: 'category',
    },
    prepare(selection: QuestionnairePreviewProps = {}) {
      const {question, category} = selection
      return {
        title: question || '',
        subtitle: category || '',
      }
    },
  },
})
