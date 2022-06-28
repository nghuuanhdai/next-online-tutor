import CourseChapter from "../../../models/course-chapter"
import Course from "../../../models/course"

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

    const newChapter = new CourseChapter()
    newChapter.title = 'untitled'
    await newChapter.save()
    await CourseChapter.findByIdAndUpdate(parentChapterId, { $push: { chapters: newChapter._id } })
    return res.json(newChapter)
  }
  res.status(404).end()
}