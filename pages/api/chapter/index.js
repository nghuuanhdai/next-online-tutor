import CourseChapter from "../../../models/course-chapter"
import Course from "../../../models/course"
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
  if(req.method==='POST')
  {
    let parentChapterId = req.body.parentChapterId
    if(req.body.parentCourseId && !parentChapterId)
    {
      const newRootChapter = new CourseChapter()
      newRootChapter.title = 'untitled'
      await newRootChapter.save()
      await Course.findByIdAndUpdate(req.body.parentCourseId, {$set: {chapter: newRootChapter._id}})
      parentChapterId = newRootChapter._id
    }

    const newChapter = new CourseChapter()
    newChapter.title = 'untitled'
    await newChapter.save()
    await CourseChapter.findByIdAndUpdate(parentChapterId, { $push: { chapters: newChapter._id } })
    return res.json(newChapter)
  }
  res.status(404).end()
}