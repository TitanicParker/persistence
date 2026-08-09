# Publication architecture

This document records the editorial and technical decisions for the digital publication. It does not alter the theory or replace the source texts.

## Editorial hierarchy

### Canonical / mature

1. `constraint_grammar_of_completed_intelligibility_final_monograph.txt` — principal theoretical work.
2. `coordinate_forced_atlas.md` — canonical structural atlas of the 54 coordinate positions.
3. `constraint_grammar_54_plain_language_expositions_final.txt` — canonical explanatory companion for the 54 forms.
4. `constraint_grammar_exhaustive_glossary.md` — authoritative terminology and theoretical-level reference.

### Supporting

5. `constraint_grammar_from_sentence_resolution_to_constraint_grammar_intellectual_transformation.md` — historical reconstruction of the theory's development.
6. `constraint_grammar_academic_disciplinary_positioning.md` — disciplinary positioning, novelty calibration, limitations, and research programme.

### Subordinate / archival research material

7. `theory_of_completed_intelligibility_academic_draft.txt` — academic draft; useful for research history but not promoted above the mature monograph.
8. Earlier or superseded 54-exposition files — retain as source history where present, but route readers to the final edition.

## Publication routes

- `/` — orientation and reading paths.
- `/theory` — monograph index.
- `/theory/[chapter]` — durable monograph chapter routes.
- `/atlas` — interactive 6 × 3 × 3 overview.
- `/atlas/[cell]` — coordinate record with generated form and canonical crystallization.
- `/forms` — browse the 54 plain-language expositions.
- `/forms/[cell]` — full exposition with previous/next and dimension-neighbor navigation.
- `/glossary` — alphabetical/searchable reference.
- `/glossary/[term]` — stable term URL.
- `/history` — intellectual-development essay.
- `/academic` — disciplinary-positioning essay.
- `/research-status` — concise boundary between established internal architecture and open empirical/universality claims.
- `/search` — publication-wide search.

## Content model

### Chapter

Fields: source path, title, part, order, stable slug, headings, previous, next.

### AtlasCell

Fields: number, companion utterance, Transformation Pattern, Completion Topology, Persistence Mode, coordinate-generated form, canonical crystallization, generative movement, manifestations, coordinate-forced sentence, constraint strength.

### Exposition

Fields: cell number, coordinate tuple, generated form, crystallization, utterance, strength, prose blocks, manifestations, generated sentence.

### GlossaryTerm

Fields: term, preferred status, definition, function, distinguish-from, relations, stable slug.

### Essay

Fields: source path, title, subtitle, abstract/lede, sections, heading anchors, publication role.

## Ingestion principles

- Source files remain canonical.
- TXT files are parsed only through explicit deterministic rules; no silent rewriting or cleanup.
- Markdown is parsed as Markdown.
- Stable slugs derive from headings/terms with collision checks.
- The parser records source offsets so rendered material can be traced back to source.
- Atlas and exposition records join on cell number and coordinate tuple.
- Glossary links are restrained and explicit rather than automatically linking every occurrence.
- Generated metadata is kept separate from source text.

## Design principles

- Reading measure around 65–72 characters.
- Serif-first prose typography with system sans-serif for navigation and metadata.
- Minimal chrome inside long-form reading pages.
- Persistent local navigation on large screens; in-flow navigation on small screens.
- Stable heading anchors, breadcrumbs, reading progress, and previous/next controls.
- Tables become horizontally safe or transform to keyed records on narrow screens.
- Atlas controls must be keyboard and touch accessible.
- Motion is optional and only used to improve orientation.

## Technical architecture

Astro is used as the static publication framework. It keeps prose pages nearly JavaScript-free while allowing isolated interactive islands for the atlas, glossary search, and publication-wide search. MDX support is present for controlled derived presentation components, but source documents remain external canonical inputs.

The next milestone is the deterministic content-ingestion layer: parse the monograph headings into chapters, parse the atlas table into 54 typed records, split the final exposition file by `CELL n`, and parse glossary entries into structured reference records.
