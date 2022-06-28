import CourseChapter from "../../../models/course-chapter"
import Course from "../../../models/course"
import Lecture from "../../../models/lecture"

export default async function handler(req, res){
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
    await newLecture.save()
    await CourseChapter.findByIdAndUpdate(parentChapterId, { $push: { lectures: newLecture._id } })
    return res.json(newLecture)
  }
  res.status(404).end()
}