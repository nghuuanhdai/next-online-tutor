import Lecture from "../../../models/lecture"

export default async function handler(req, res){
  if(req.method==='DELETE')
  {
    await Lecture.findByIdAndRemove(req.query.id)
    res.status(201).end()
  }
  res.status(404).end()
}