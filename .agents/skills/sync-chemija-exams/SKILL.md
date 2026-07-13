---
name: sync-chemija-exams
description: Audit, download, verify, and synchronize Lithuanian chemistry exam question and answer files from the official NŠA website into the Chemija.org Sanity exam collection. Use when asked to check or repair an exam pairing, import a new exam year or session, compare Chemija.org files with NŠA, prepare Sanity drafts, or publish a verified chemistry VBE/MBE pair for years such as 2024, 2026, 2027, or later.
---

# Sync Chemija Exams

Use the official NŠA publication as the source of truth. Treat Chemija.org and existing Sanity assets as comparison targets, never as proof that a pairing is correct.

## Inputs and modes

Derive these values from the request; state any safe defaults:

- `year`: required.
- `level`: default to `Valstybinis` unless the request says `Mokyklinis`.
- `session`: default to `Pagrindinė sesija`; also support `Pakartotinė sesija` and `Pavyzdinė užduotis`.
- `mode`: default to `audit`; support `draft` and `publish` only when explicitly requested.
- `part`: optional. Discover whether the exam has I/II parts or other separately published components.

Do not interpret “sync” as permission to publish. When the user asks to download and upload without saying “publish,” create or update a draft.

## Safety contract

Before any Sanity write, locate and read the repository’s `SANITY_MCP.md` completely. Use its verified project, dataset, workspace, schema values, and draft-first workflow. Inspect the current `exam` schema source as a secondary check.

Never:

- use a Chemija.org mirror as the authoritative source;
- pair files only because their filenames or nearby links look similar;
- mistake an answer sheet, statistics report, formula sheet, or assessment program for an answer key;
- mix years, sessions, levels, or VBE parts;
- overwrite a verified published record before preparing and checking a draft;
- publish without an explicit user instruction to publish.

Stop and report the ambiguity when the official source lacks a complete question/answer pair, when file contents contradict their labels, or when the Sanity schema cannot represent the official structure without loss.

## Workflow

### 1. Inspect the repository and current record

1. Find the repository root and read `AGENTS.md`, `SANITY_MCP.md`, and the `exam` schema.
2. Query Sanity for all candidate exam documents matching the requested year, level, and session, including drafts.
3. Record document IDs, draft/published state, notes, and existing question/answer asset metadata and URLs.
4. Check the repository’s `question-bank/manifest.json` when present for prior provenance and known mismatch notes. Treat it as audit context, not official proof.

### 2. Discover official NŠA materials

1. Search the current official NŠA domain for the requested chemistry exam year and session. Follow official NŠA redirects or archived official NŠA pages when necessary.
2. Capture the landing-page URL and every relevant direct file URL.
3. Enumerate all components before choosing a pair: question booklet, I/II part, appendices, formula sheets, answer sheets, scoring instructions, answer keys, and statistical reports.
4. Prefer the scoring/assessment instructions or an explicitly named answer-key file as `answers`. A blank response form is not an answer key.

If the current NŠA site has no files for a future year, report “not yet published” with the page checked and make no write.

### 3. Download and inspect files

Download candidates to a temporary working directory. Preserve the original extension and a readable filename.

For every candidate:

1. Record the source URL, retrieval date, byte size, MIME type, page count, and SHA-256 checksum.
2. Extract text and render the title/cover plus relevant question and answer pages when PDF layout matters.
3. Verify the internal subject, year, level, session, and part labels; do not rely on URL or filename alone.
4. Identify question-number coverage and the corresponding answer/rubric coverage.
5. Confirm appendices referenced by the questions are included or linked appropriately.

Use OCR only when embedded text is missing. Visually verify OCR-sensitive chemistry notation, tables, superscripts, subscripts, and answer markers.

### 4. Prove compatibility

Build a compact pairing table with one row per official part:

| Part | Question identity and range | Answer/rubric coverage | Compatible | Evidence |
| --- | --- | --- | --- | --- |

A compatible row must match all available identifiers: subject, year, level, session, part, question numbering, and distinctive question text or labels. Sample-check at least three distributed questions against the answer material when possible: an early, middle, and late item.

Classify each candidate as one of:

- `verified pair`;
- `incomplete — answers missing`;
- `answer sheet only`;
- `wrong year/session/level`;
- `wrong part`;
- `schema cannot represent pair safely`.

Do not proceed to a write unless every uploaded pair is `verified pair`.

### 5. Map the official structure to Sanity

The current Chemija.org `exam` document supports one `questions` file and one `answers` file. Therefore:

- Use one exam document when NŠA publishes one complete question file and one compatible answer file.
- If NŠA publishes separately paired parts, do not silently combine files and do not place one part’s answers beside another part’s questions.
- Prefer separate clearly identified exam documents only if the existing schema and site behavior can distinguish them without collisions. Otherwise stop and propose the smallest schema change before writing.
- Preserve existing correct metadata and assets. Change only fields required for the verified correction/import.

Write provenance into `notes` without erasing useful existing notes. Include the official NŠA landing page, question and answer source URLs, part identity, verification date, and abbreviated checksums.

### 6. Draft-first Sanity update

For `draft` or `publish` mode:

1. Show the intended document/asset changes before the first write.
2. Upload only locally verified files as Sanity file assets.
3. Create or patch `drafts.<published-id>` for an existing record, or create a new draft with a stable descriptive ID when supported.
4. Set `year` using the schema’s `YYYY` date representation and use exact schema enum values for `level` and `session`.
5. Re-query the draft and verify both asset references resolve to the intended uploaded files.
6. Re-check filenames, sizes, MIME types, checksums when available, and notes provenance.
7. Leave the published document unchanged in `draft` mode.

For `publish` mode, publish only after all draft verification passes and the user explicitly requested publication. If the user asks for confirmation before publishing, pause after the verified draft.

### 7. Report the result

Return:

- requested year, level, session, and part coverage;
- official NŠA landing page and direct file sources;
- pairing classification and evidence;
- Sanity document IDs and draft/published state;
- old versus new asset filenames/URLs when corrected;
- checksums and verification date;
- any unresolved gaps or required schema deviation.

Keep downloaded temporary files only when the user asks for a local archive. Never claim success from upload responses alone; success requires re-reading and verifying the Sanity draft or published document.

## Invocation examples

- `$sync-chemija-exams audit the 2024 chemistry VBE main-session files and explain any wrong pairing; do not write to Sanity.`
- `$sync-chemija-exams find the official 2026 chemistry VBE files, verify every part, and upload corrected pairings as Sanity drafts.`
- `$sync-chemija-exams check whether NŠA has published the 2027 chemistry exam and answer key; if complete, prepare a draft import.`
- `$sync-chemija-exams publish the already verified 2026 draft after re-checking its asset references and provenance.`
