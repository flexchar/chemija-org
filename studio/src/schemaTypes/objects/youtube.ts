import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'youtube',
  type: 'object',
  title: 'YouTube',
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'YouTube video URL',
    }),
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare(value) {
      return {
        title: 'YouTube Video',
        subtitle: value.url,
      }
    },
  },
})
