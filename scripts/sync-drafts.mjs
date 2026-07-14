#!/usr/bin/env bun

// Usage: bun scripts/sync-drafts.mjs [--apply]
// Reads manifest.json and PDFs from output/pdf/chemija-exam-corrections/.

import {createHash} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import {basename, dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const API_VERSION = '2026-07-14'
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const CORRECTIONS_DIR = resolve(SCRIPT_DIR, '../output/pdf/chemija-exam-corrections')
const MANIFEST_PATH = resolve(CORRECTIONS_DIR, 'manifest.json')
const APPLY = process.argv.includes('--apply')

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_KEY

if (!projectId || !dataset || !token) {
  throw new Error('SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_KEY are required')
}

const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))

if (manifest.sanity.project_id !== projectId || manifest.sanity.dataset !== dataset) {
  throw new Error('Environment does not match the project and dataset recorded in manifest.json')
}

if (manifest.sanity.mode !== 'draft-only') {
  throw new Error(`Refusing manifest mode ${manifest.sanity.mode}; expected draft-only`)
}

const headers = {Authorization: `Bearer ${token}`}
const apiBase = `https://${projectId}.api.sanity.io/v${API_VERSION}`

async function sha(algorithm, bytes) {
  return createHash(algorithm).update(bytes).digest('hex')
}

async function query(groq, params = {}) {
  const search = new URLSearchParams({query: groq, perspective: 'raw'})
  for (const [key, value] of Object.entries(params)) {
    search.set(`$${key}`, JSON.stringify(value))
  }

  const response = await fetch(`${apiBase}/data/query/${dataset}?${search}`, {headers})
  const body = await response.json()
  if (!response.ok) throw new Error(`Sanity query failed (${response.status}): ${JSON.stringify(body)}`)
  return body.result
}

async function uploadPdf(file) {
  const response = await fetch(
    `${apiBase}/assets/files/${dataset}?${new URLSearchParams({filename: file.name})}`,
    {
      method: 'POST',
      headers: {...headers, 'Content-Type': 'application/pdf'},
      body: file.bytes,
    },
  )
  const body = await response.json()
  if (!response.ok) throw new Error(`Asset upload failed (${response.status}): ${JSON.stringify(body)}`)
  return body.document
}

async function mutate(mutations) {
  const response = await fetch(`${apiBase}/data/mutate/${dataset}?returnIds=true`, {
    method: 'POST',
    headers: {...headers, 'Content-Type': 'application/json'},
    body: JSON.stringify({mutations}),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(`Sanity mutation failed (${response.status}): ${JSON.stringify(body)}`)
  return body
}

function fileReference(assetId) {
  return {_type: 'file', asset: {_type: 'reference', _ref: assetId}}
}

function provenance(correction) {
  const part = correction.year >= 2025 ? 'VBE II' : 'VBE'
  const prior = correction.current?.notes?.trim()
  const audit = [
    `Patikrinta ${manifest.verified_at} pagal oficialią NŠA medžiagą (${part}).`,
    `Klausimai: ${correction.questions.source_url}`,
    `Priedas: ${correction.questions.appendix_url}`,
    `Vertinimo instrukcija: ${correction.answers.source_url}`,
    `NŠA puslapiai: ${manifest.official_pages.questions} ir ${manifest.official_pages.answers}`,
    `SHA-256: klausimai ${correction.questions.sha256.slice(0, 12)}…, atsakymai ${correction.answers.sha256.slice(0, 12)}….`,
  ].join(' ')
  return prior ? `${prior}\n\n${audit}` : audit
}

const corrections = []
for (const entry of manifest.corrections) {
  const files = {}
  for (const kind of ['questions', 'answers']) {
    const spec = entry[kind]
    const path = resolve(CORRECTIONS_DIR, spec.file)
    const bytes = await readFile(path)
    const sha256 = await sha('sha256', bytes)
    if (sha256 !== spec.sha256) {
      throw new Error(`${spec.file}: SHA-256 differs from manifest.json`)
    }
    if (!bytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
      throw new Error(`${spec.file}: not a PDF file`)
    }
    files[kind] = {
      name: basename(path),
      path,
      bytes,
      size: bytes.length,
      sha1: await sha('sha1', bytes),
      sha256,
    }
  }
  corrections.push({...entry, files})
}

const publishedIds = corrections.map((entry) => entry.sanity_document_id)
const allIds = [...publishedIds, ...publishedIds.map((id) => `drafts.${id}`)]
const recordQuery = `*[_id in $ids] {
  _id, _rev, _updatedAt, _type, year, level, session, notes,
  questions { asset->{_id, originalFilename, size, mimeType, url, sha1hash} },
  answers { asset->{_id, originalFilename, size, mimeType, url, sha1hash} }
}`

const records = await query(recordQuery, {ids: allIds})
const byId = new Map(records.map((record) => [record._id, record]))

for (const correction of corrections) {
  const id = correction.sanity_document_id
  const current = byId.get(id)
  if (!current) throw new Error(`Published document ${id} does not exist`)
  if (byId.has(`drafts.${id}`)) throw new Error(`Draft drafts.${id} already exists; refusing to overwrite it`)
  if (current._type !== 'exam') throw new Error(`${id}: expected exam, found ${current._type}`)
  if (current.year !== `${correction.year}-01-01`) throw new Error(`${id}: year does not match manifest`)
  if (current.level !== 'Valstybinis') throw new Error(`${id}: expected Valstybinis`)
  if (current.session !== correction.session) throw new Error(`${id}: session does not match manifest`)
  correction.current = current
}

console.log(`${APPLY ? 'APPLY' : 'DRY RUN'}: ${corrections.length} exam drafts in ${projectId}/${dataset}`)
for (const correction of corrections) {
  console.log(
    `${correction.year} ${correction.session}: ${correction.sanity_document_id}\n` +
      `  questions: ${correction.current.questions.asset.originalFilename} -> ${correction.files.questions.name}\n` +
      `  answers:   ${correction.current.answers.asset.originalFilename} -> ${correction.files.answers.name}`,
  )
}

if (!APPLY) {
  console.log('No assets uploaded and no documents changed. Re-run with --apply to create drafts.')
  process.exit(0)
}

const uploaded = new Map()
for (const correction of corrections) {
  for (const kind of ['questions', 'answers']) {
    const file = correction.files[kind]
    const asset = await uploadPdf(file)
    if (asset._id !== `file-${file.sha1}-pdf`) {
      throw new Error(`${file.name}: uploaded asset ID does not match the local SHA-1`)
    }
    if (asset.size !== file.size || asset.mimeType !== 'application/pdf') {
      throw new Error(`${file.name}: uploaded asset metadata does not match the local file`)
    }
    uploaded.set(`${correction.sanity_document_id}:${kind}`, asset)
    console.log(`Uploaded ${file.name} as ${asset._id}`)
  }
}

const beforeMutation = await query(recordQuery, {ids: allIds})
const beforeById = new Map(beforeMutation.map((record) => [record._id, record]))
for (const correction of corrections) {
  const id = correction.sanity_document_id
  if (beforeById.has(`drafts.${id}`)) throw new Error(`Draft drafts.${id} appeared during upload; stopping`)
  if (beforeById.get(id)?._rev !== correction.current._rev) {
    throw new Error(`Published document ${id} changed during upload; stopping`)
  }
}

const draftDocuments = corrections.map((correction) => ({
  _id: `drafts.${correction.sanity_document_id}`,
  _type: 'exam',
  year: correction.current.year,
  level: correction.current.level,
  session: correction.current.session,
  questions: fileReference(uploaded.get(`${correction.sanity_document_id}:questions`)._id),
  answers: fileReference(uploaded.get(`${correction.sanity_document_id}:answers`)._id),
  notes: provenance(correction),
}))

await mutate(draftDocuments.map((document) => ({create: document})))

const verifiedRecords = await query(recordQuery, {ids: allIds})
const verifiedById = new Map(verifiedRecords.map((record) => [record._id, record]))
for (const correction of corrections) {
  const published = verifiedById.get(correction.sanity_document_id)
  const draft = verifiedById.get(`drafts.${correction.sanity_document_id}`)
  if (!draft) throw new Error(`Draft drafts.${correction.sanity_document_id} was not created`)
  if (published?._rev !== correction.current._rev) {
    throw new Error(`Published document ${correction.sanity_document_id} changed unexpectedly`)
  }

  for (const kind of ['questions', 'answers']) {
    const asset = draft[kind]?.asset
    const file = correction.files[kind]
    const expected = uploaded.get(`${correction.sanity_document_id}:${kind}`)
    if (asset?._id !== expected._id) throw new Error(`${draft._id}: wrong ${kind} asset reference`)
    if (asset?.size !== file.size || asset?.mimeType !== 'application/pdf') {
      throw new Error(`${draft._id}: wrong ${kind} asset metadata`)
    }
    if (asset?.sha1hash !== file.sha1) throw new Error(`${draft._id}: wrong ${kind} SHA-1`)
  }

  if (draft.notes !== provenance(correction)) throw new Error(`${draft._id}: provenance notes differ`)
  console.log(
    `Verified ${draft._id}\n` +
      `  questions: ${draft.questions.asset.originalFilename} (${draft.questions.asset.url})\n` +
      `  answers:   ${draft.answers.asset.originalFilename} (${draft.answers.asset.url})`,
  )
}

console.log('All six drafts verified. Published documents are unchanged.')
