import {defineField, defineType} from 'sanity'

interface ExamPreviewProps {
  metai?: string
  level?: string
  sesija?: string
}

export default defineType({
  name: 'exam',
  title: 'Egzaminai',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Metai',
      type: 'date',
      options: {
        dateFormat: 'YYYY',
      },
    }),
    defineField({
      name: 'level',
      title: 'Lygis',
      type: 'string',
      options: {
        layout: 'radio',
        list: ['Valstybinis', 'Mokyklinis'],
      },
    }),
    defineField({
      name: 'session',
      title: 'Sesija',
      type: 'string',
      options: {
        layout: 'radio',
        list: ['Pagrindinė sesija', 'Pakartotinė sesija', 'Pavyzdinė užduotis'],
      },
    }),
    defineField({
      name: 'answers',
      title: 'Atsakymai',
      type: 'file',
    }),
    defineField({
      name: 'questions',
      title: 'Klausimai',
      type: 'file',
    }),
    defineField({
      name: 'notes',
      title: 'Užrašai',
      type: 'string',
    }),
  ],
  orderings: [
    {
      title: 'Metai, Naujausi',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      metai: 'year',
      level: 'level',
      sesija: 'session',
    },
    prepare(selection: ExamPreviewProps = {metai: '', level: '', sesija: ''}) {
      const {sesija, metai, level} = selection
      return {
        title: `${metai?.split('-')[0] || ''} ${level === 'Valstybinis' ? 'VBE' : 'MBE'} ${sesija?.split(' ')[0] || ''}`,
      }
    },
  },
})
