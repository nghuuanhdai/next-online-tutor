export function serializeChapter(chapter) {
  if(!chapter)
  {
    return { _id: null, title: 'root', chapters: [], lectures: []}
  }
  return {
    _id: chapter._id.toString(),
    title: chapter.title??'untitled',
    chapters: chapter.chapters.map(c => serializeChapter(c)),
    lectures: chapter.lectures.map(l => ({_id: l._id.toString(), title: l.title}))
  }
}