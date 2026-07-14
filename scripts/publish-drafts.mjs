#!/usr/bin/env bun

// Usage: bun scripts/publish-drafts.mjs [--apply]
// Reads manifest.json and PDFs from output/pdf/chemija-exam-corrections/.

import {createHash} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const API_VERSION = '2026-07-14'
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const CORRECTIONS_DIR = resolve(SCRIPT_DIR, '../output/pdf/chemija-exam-corrections')
const APPLY = process.argv.includes('--apply')

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_KEY

if (!projectId || !dataset || !token) {
  throw new Error('SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_KEY are required')
}

const manifest = JSON.parse(await readFile(resolve(CORRECTIONS_DIR, 'manifest.json'), 'utf8'))
if (manifest.sanity.project_id !== projectId || manifest.sanity.dataset !== dataset) {
  throw new Error('Environment does not match manifest.json')
}

const apiBase = `https://${projectId}.api.sanity.io/v${API_VERSION}`
const authHeaders = {Authorization: `Bearer ${token}`}

async function query(groq, params = {}) {
  const search = new URLSearchParams({query: groq, perspective: 'raw'})
  for (const [key, value] of Object.entries(params)) search.set(`$${key}`, JSON.stringify(value))
  const response = await fetch(`${apiBase}/data/query/${dataset}?${search}`, {
    headers: authHeaders,
  })
  const body = await response.json()
  if (!response.ok) throw new Error(`Sanity query failed (${response.status}): ${JSON.stringify(body)}`)
  return body.result
}

async function mutate(mutations, dryRun) {
  const search = new URLSearchParams({
    returnIds: 'true',
    visibility: 'sync',
    dryRun: String(dryRun),
    tag: 'chemija.exam-corrections.publish',
  })
  const response = await fetch(`${apiBase}/data/mutate/${dataset}?${search}`, {
    method: 'POST',
    headers: {...authHeaders, 'Content-Type': 'application/json'},
    body: JSON.stringify({mutations}),
  })
  const body = await response.json()
  if (!response.ok) {
    throw new Error(
      `Sanity ${dryRun ? 'dry-run ' : ''}mutation failed (${response.status}): ${JSON.stringify(body)}`,
    )
  }
  return body
}

const corrections = []
for (const entry of manifest.corrections) {
  const files = {}
  for (const kind of ['questions', 'answers']) {
    const spec = entry[kind]
    const bytes = await readFile(resolve(CORRECTIONS_DIR, spec.file))
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    if (sha256 !== spec.sha256) throw new Error(`${spec.file}: SHA-256 differs from manifest.json`)
    files[kind] = {
      sha1: createHash('sha1').update(bytes).digest('hex'),
      sha256,
      size: bytes.length,
      name: spec.file,
    }
  }
  corrections.push({...entry, files})
}

const publishedIds = corrections.map((entry) => entry.sanity_document_id)
const draftIds = publishedIds.map((id) => `drafts.${id}`)
const allIds = [...publishedIds, ...draftIds]
const recordQuery = `*[_id in $ids] {
  _id, _rev, _type, year, level, session, notes,
  questions { asset->{_id, originalFilename, size, mimeType, url, sha1hash} },
  answers { asset->{_id, originalFilename, size, mimeType, url, sha1hash} }
}`

const before = await query(recordQuery, {ids: allIds})
const beforeById = new Map(before.map((document) => [document._id, document]))
const oldAssetIds = new Set()

for (const correction of corrections) {
  const id = correction.sanity_document_id
  const published = beforeById.get(id)
  const draft = beforeById.get(`drafts.${id}`)
  if (!published) throw new Error(`${id}: published document is missing`)
  if (!draft) throw new Error(`drafts.${id}: verified draft is missing`)
  if (published._type !== 'exam' || draft._type !== 'exam') throw new Error(`${id}: expected exam documents`)
  if (draft.year !== `${correction.year}-01-01`) throw new Error(`${id}: draft year is wrong`)
  if (draft.level !== 'Valstybinis' || draft.session !== correction.session) {
    throw new Error(`${id}: draft level or session is wrong`)
  }
  if (!draft.notes?.includes(`Patikrinta ${manifest.verified_at}`)) {
    throw new Error(`${id}: draft provenance is missing`)
  }

  for (const kind of ['questions', 'answers']) {
    const expected = correction.files[kind]
    const asset = draft[kind]?.asset
    if (asset?._id !== `file-${expected.sha1}-pdf`) throw new Error(`${id}: wrong draft ${kind} asset`)
    if (asset.sha1hash !== expected.sha1 || asset.size !== expected.size) {
      throw new Error(`${id}: draft ${kind} checksum or size is wrong`)
    }
    if (asset.mimeType !== 'application/pdf' || asset.originalFilename !== expected.name) {
      throw new Error(`${id}: draft ${kind} filename or MIME type is wrong`)
    }
    oldAssetIds.add(published[kind].asset._id)
  }

  correction.published = published
  correction.draft = draft
}

console.log(`${APPLY ? 'PUBLISH' : 'PREFLIGHT'}: ${corrections.length} verified exam drafts`)
for (const correction of corrections) {
  console.log(
    `${correction.year} ${correction.session}: ${correction.sanity_document_id}\n` +
      `  questions: ${correction.published.questions.asset.originalFilename} -> ${correction.draft.questions.asset.originalFilename}\n` +
      `  answers:   ${correction.published.answers.asset.originalFilename} -> ${correction.draft.answers.asset.originalFilename}`,
  )
}

if (!APPLY) {
  console.log('No documents changed. Re-run with --apply to publish.')
  process.exit(0)
}

const mutations = []
for (const correction of corrections) {
  const id = correction.sanity_document_id
  const published = correction.published
  const draft = correction.draft

  // Revision guards make the transaction fail if either document changes after preflight.
  mutations.push({patch: {id, ifRevisionID: published._rev, set: {year: published.year}}})
  mutations.push({delete: {id}})
  mutations.push({
    create: {
      _id: id,
      _type: 'exam',
      year: draft.year,
      level: draft.level,
      session: draft.session,
      questions: {_type: 'file', asset: {_type: 'reference', _ref: draft.questions.asset._id}},
      answers: {_type: 'file', asset: {_type: 'reference', _ref: draft.answers.asset._id}},
      notes: draft.notes,
    },
  })
  mutations.push({patch: {id: `drafts.${id}`, ifRevisionID: draft._rev, set: {year: draft.year}}})
  mutations.push({delete: {id: `drafts.${id}`}})
}

await mutate(mutations, true)
console.log('Sanity accepted the complete delete/recreate transaction as a dry run.')
const committed = await mutate(mutations, false)
console.log(`Committed transaction ${committed.transactionId}`)

const after = await query(recordQuery, {ids: allIds})
const afterById = new Map(after.map((document) => [document._id, document]))

for (const correction of corrections) {
  const id = correction.sanity_document_id
  const published = afterById.get(id)
  if (!published) throw new Error(`${id}: corrected published document is missing after commit`)
  if (afterById.has(`drafts.${id}`)) throw new Error(`drafts.${id}: draft still exists after publish`)
  if (
    published.year !== correction.draft.year ||
    published.level !== correction.draft.level ||
    published.session !== correction.draft.session ||
    published.notes !== correction.draft.notes
  ) {
    throw new Error(`${id}: published metadata differs from the verified draft`)
  }
  for (const kind of ['questions', 'answers']) {
    const actual = published[kind]?.asset
    const expected = correction.files[kind]
    if (
      actual?._id !== `file-${expected.sha1}-pdf` ||
      actual.sha1hash !== expected.sha1 ||
      actual.size !== expected.size ||
      actual.mimeType !== 'application/pdf' ||
      actual.originalFilename !== expected.name
    ) {
      throw new Error(`${id}: published ${kind} asset failed verification`)
    }
  }
  console.log(
    `Verified published ${id}\n` +
      `  questions: ${published.questions.asset.url}\n` +
      `  answers:   ${published.answers.asset.url}`,
  )
}

const remainingOldReferences = await query(
  `*[!(_id in $oldAssetIds) && references($oldAssetIds)] {_id, _type}`,
  {oldAssetIds: [...oldAssetIds]},
)
console.log(`Old asset documents retained; active non-asset references found: ${remainingOldReferences.length}`)
console.log('All six corrected exams are published and all six drafts are removed.')
