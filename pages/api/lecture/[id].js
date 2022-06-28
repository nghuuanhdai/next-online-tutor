import Lecture from "../../../models/lecture"
import { loginCheck } from "../../../utils/firebaseAdmin"

export default async function handler(req, res){
  try {
    await loginCheck(req, res)
  } catch (error) {
    return res.status(401).send('FORBIDDEN')
  }
  if(req.method==='DELETE')
  {
    await Lecture.findByIdAndRemove(req.query.id)
    return res.status(201).end()
  }
  if(req.method==='PUT')
  {
    const updatedLecture = await Lecture.findByIdAndUpdate(req.query.id, {$set: { title: req.body.title }}, {new: true})
    return res.json(updatedLecture)
  }
  res.status(404).end()
}