import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {table} from '@sanity/table'
import {schemaTypes} from './src/schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'lv5ajubm'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'chemija-org-studio',
  title: 'Chemija.org Sanity Studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool(), table({rowType: 'row'})],
  schema: {
    types: schemaTypes,
  },
})
