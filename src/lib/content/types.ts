export type SourceSpan = {
  path: string;
  startLine: number;
  endLine: number;
};

export type ContentBlock = {
  raw: string;
  source: SourceSpan;
};

export type Chapter = {
  kind: 'chapter';
  number: number | null;
  title: string;
  slug: string;
  part: string | null;
  partTitle: string | null;
  raw: string;
  source: SourceSpan;
  previousSlug: string | null;
  nextSlug: string | null;
};

export type AtlasCell = {
  number: number;
  slug: string;
  companionUtterance: string;
  coordinateGeneratedForm: string;
  canonicalCrystallization: string;
  transformationPattern: string;
  completionTopology: string;
  persistenceMode: string;
  generativeMovement: string;
  examples: [string, string, string];
  coordinateForcedSentence: string;
  constraintStrength: string;
  source: SourceSpan;
};

export type Exposition = {
  number: number;
  slug: string;
  transformationPattern: string;
  completionTopology: string;
  persistenceMode: string;
  coordinateGeneratedForm: string;
  canonicalCrystallization: string;
  companionUtterance: string;
  constraintStrength: string;
  body: ContentBlock[];
  rawBody: string;
  source: SourceSpan;
};

export type GlossaryTerm = {
  term: string;
  slug: string;
  preferredStatus: string;
  definition: string;
  functionInTheory: string;
  distinguishFrom: string;
  relations: string[];
  relationsRaw: string;
  category: string;
  source: SourceSpan;
};

export type EssaySection = {
  level: number;
  title: string;
  slug: string;
  startLine: number;
};

export type Essay = {
  title: string;
  subtitle: string | null;
  slug: string;
  raw: string;
  sections: EssaySection[];
  source: SourceSpan;
};
