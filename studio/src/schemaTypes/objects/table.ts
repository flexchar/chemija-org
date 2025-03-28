import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'table',
  type: 'object',
  title: 'Table',
  fields: [
    defineField({
      name: 'rows',
      type: 'array',
      title: 'Rows',
      of: [
        {
          type: 'object',
          name: 'row',
          fields: [
            defineField({
              type: 'array',
              name: 'cells',
              of: [{type: 'text'}],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      rows: 'rows',
    },
    prepare(selection) {
      const {rows} = selection
      const rowCount = rows?.length || 0
      const cellCount = rows?.[0]?.cells?.length || 0

      return {
        title: `Table (${rowCount} × ${cellCount})`,
      }
    },
  },
})
