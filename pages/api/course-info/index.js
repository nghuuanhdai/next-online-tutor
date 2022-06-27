import Course from "../../../models/course"
import { defaultCourseBanner } from "../../../utils/constant"

export default async function handler(req, res)
{
  if(req.method === 'POST')
  {
    const newCourse = new Course()
    await newCourse.save()
    res.json({_id: newCourse._id.toString(), title: newCourse.title??'course title', bannerUrl: newCourse.thumbnailUrl??defaultCourseBanner})
  }
  res.status(404).end()
}