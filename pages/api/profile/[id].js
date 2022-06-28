import { loginCheck } from "../../../utils/firebaseAdmin"
import Profile from "../../../models/profile"
import dbConnect from "../../../utils/dbConnect"

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

  if(req.method==='PUT')
  {
    const adminUpdate = {}
    console.log(req.body.admin)
    if(req.body.admin !== undefined)
      adminUpdate.admin = req.body.admin
    
    const pushCourse = {}
    if(req.body.pushCourseId)
      pushCourse.courses = req.body.pushCourseId

    const popCourse = {}
    if(req.body.popCourseId)
      popCourse.courses = req.body.popCourseId
    
    const userProfile = await Profile.findByIdAndUpdate(req.query.id, {$set: adminUpdate, $push: pushCourse, $pull: popCourse}, {new: true})
    console.log(adminUpdate)
    return res.json({
      _id: userProfile._id.toString(),
      admin: userProfile.admin??false,
      email: userProfile.email,
      courses: userProfile.courses.map(c => ({
        _id: c._id.toString(),
        title: c.title
      }))
    })
  }
  res.status(404).end()
}