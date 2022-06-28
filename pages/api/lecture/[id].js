import Lecture from "../../../models/lecture"
import { loginCheck } from "../../../utils/firebaseAdmin"
import Profile from "../../../models/profile"

export default async function handler(req, res){
  try {
    await loginCheck(req, res)
  } catch (error) {
    return res.status(401).send('FORBIDDEN')
  }
  await dbConnect()
  const profile = await Profile.findOne({email: req.decodedClaims.email})
  if(!profile?.admin)
    return res.status(401).send('FORBIDDEN')

  if(req.method==='DELETE')
  {
    await Lecture.findByIdAndRemove(req.query.id)
    return res.status(201).end()
  }
  if(req.method==='PUT')
  {
    const updateDoc = {}
    if(req.body.title)
      updateDoc.title = req.body.title
    if(req.body.description)
      updateDoc.description = req.body.description

    const updatedLecture = await Lecture.findByIdAndUpdate(req.query.id, {$set: updateDoc}, {new: true})
    return res.json(updatedLecture)
  }
  res.status(404).end()
}