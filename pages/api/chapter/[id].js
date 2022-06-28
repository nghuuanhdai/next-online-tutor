import CourseChapter from "../../../models/course-chapter"
import { loginCheck } from "../../../utils/firebaseAdmin"
import { serializeChapter } from "../course/utils"

export default async function handler(req, res){
  try {
    await loginCheck(req, res)
  } catch (error) {
    return res.status(401).send('FORBIDDEN')
  }
  if(req.method==='DELETE')
  {
    await CourseChapter.findByIdAndRemove(req.query.id)
    return res.status(201).end()
  }
  if(req.method==='PUT')
  {
    const updateDoc = {}
    if(req.body.title)
      updateDoc.title = req.body.title
    if(req.body.description)
      updateDoc.description = req.body.description
    const updatedChapter = await CourseChapter.findByIdAndUpdate(req.query.id, {$set: updateDoc}, {new: true})
    return res.json(serializeChapter(updatedChapter))
  }
  res.status(404).end()
}