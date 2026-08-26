export type PixelsChapter = {
  number: number;
  label: string;
  title: string;
  note: string;
  path: string;
};

export const pixelsChapters: PixelsChapter[] = [
  { number: 1, label: '01', title: 'The Bag of Sentences', note: 'A pile becomes a claim about what is the same.', path: 'chapter-01/' },
  { number: 2, label: '02', title: 'Piles Are Arguments', note: 'Topic gives way to structural comparison.', path: 'chapter-02/' },
  { number: 3, label: '03', title: 'The First Question', note: 'The class discovers recurrent kinds of change.', path: 'chapter-03/' },
  { number: 4, label: '04', title: 'Six Ways Something Can Change', note: 'The first six structural families receive their names.', path: 'chapter-04/' },
  { number: 5, label: '05', title: 'Same Change, Different Finish', note: 'The same transformation can become sufficient in different ways.', path: 'chapter-05/' },
  { number: 6, label: '06', title: 'Three Ways a Change Becomes Complete', note: 'Focal, Distributed, and Release are named.', path: 'chapter-06/' },
  { number: 7, label: '07', title: 'What Is Left When It Is Done?', note: 'A third independent structural question appears.', path: 'chapter-07/' },
  { number: 8, label: '08', title: 'Why Does This Keep Showing Up?', note: 'The children begin wondering why the same structures recur.', path: 'chapter-08/' },
  { number: 9, label: '09', title: 'Three Ways the Result Remains', note: 'Standing, Bearing, and Efficacy are named after being discovered.', path: 'chapter-09/' },
  { number: 10, label: '10', title: 'Three Questions, One Thing', note: 'The three dimensions locate one completed intelligibility.', path: 'chapter-10/' },
  { number: 11, label: '11', title: 'The Fifty-Four Boxes', note: 'The map appears only after its distinctions have been earned.', path: 'chapter-11/' },
  { number: 12, label: '12', title: 'Move One Dial', note: 'The map becomes a field of neighbours.', path: 'chapter-12/' },
  { number: 13, label: '13', title: 'Every Box Can Speak', note: 'Ordinary utterances test every structural coordinate.', path: 'chapter-13/' },
  { number: 14, label: '14', title: 'The Hard Boxes', note: 'Uncertainty becomes something the class can diagnose rather than hide.', path: 'chapter-14/' },
  { number: 15, label: '15', title: 'Sometimes There Is No Box Yet', note: 'No completion, no coordinate.', path: 'chapter-15/' },
  { number: 16, label: '16', title: 'Clear Does Not Mean True', note: 'Structural intelligibility is separated from truth, evidence, and justice.', path: 'chapter-16/' },
  { number: 17, label: '17', title: 'Take It Outside', note: 'Prepared examples disappear; the children find and generate contrasts themselves.', path: 'chapter-17/' },
  { number: 18, label: '18', title: 'The Bag Comes Back', note: 'The original problem returns, now with better questions.', path: 'chapter-18/' },
];

export function pixelsChapterFromPath(pathname: string): PixelsChapter | undefined {
  const match = pathname.match(/\/pixels-of-clarity\/chapter-(\d{2})(?:\/|\/index\.html)?$/);
  if (!match) return undefined;
  return pixelsChapters.find((chapter) => chapter.label === match[1]);
}
