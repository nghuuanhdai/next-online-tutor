import Course from "../../../models/course"
import { defaultCourseBanner } from "../../../utils/constant"
import { loginCheck } from "../../../utils/firebaseAdmin";

export default async function handler(req, res)
{
  try {
    await loginCheck(req, res)
  } catch (error) {
    return res.status(401).send('FORBIDDEN')
  }
  if(req.method === 'POST')
  {
    const newCourse = new Course()
    await newCourse.save()
    return res.json({_id: newCourse._id.toString(), title: newCourse.title??'course title', bannerUrl: newCourse.thumbnailUrl??defaultCourseBanner})
  }
  res.status(404).end()
}