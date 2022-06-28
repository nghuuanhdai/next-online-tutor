import CourseChapter from "../../../models/course-chapter"

export default async function handler(req, res){
  if(req.method==='DELETE')
  {
    await CourseChapter.findByIdAndRemove(req.query.id)
    res.status(201).end()
  }
  res.status(404).end()
}