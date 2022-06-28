import CourseChapter from "../../../models/course-chapter"
import Course from "../../../models/course"
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

  if(req.method==='POST')
  {
    let parentChapterId = req.body.parentChapterId
    if(req.body.parentCourseId && !parentChapterId)
    {
      const newRootChapter = new CourseChapter()
      newChapter.title = 'untitled'
      await newChapter.save()
      await Course.findByIdAndUpdate(req.body.parentCourseId, {$set: {chapter: newChapter._id}})
      parentChapterId = newRootChapter._id
    }

    const newLecture = new Lecture()
    newLecture.title = 'untitled'
    newLecture.courseId = req.body.parentCourseId
    await newLecture.save()
    await CourseChapter.findByIdAndUpdate(parentChapterId, { $push: { lectures: newLecture._id } })
    return res.json(newLecture)
  }
  res.status(404).end()
}