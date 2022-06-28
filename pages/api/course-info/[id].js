import dbConnect from "../../../utils/dbConnect";
import Course from "../../../models/course";
import { defaultCourseBanner } from "../../../utils/constant";
import { loginCheck } from "../../../utils/firebaseAdmin";

export default async function handler(req, res){
  await dbConnect()
  if(req.method === 'GET')
  {
    const course = await Course.findById(req.query.id)
    if(!course)
      return res.status(404).end()
    return res.json({_id: course._id.toString(), title: course.title??'course title', bannerUrl: course.thumbnailUrl??defaultCourseBanner})
  }
  try {
    await loginCheck(req, res)
  } catch (error) {
    return res.status(401).send('FORBIDDEN')
  }
  if(req.method === 'POST')
  {
    const course = await Course.findById(req.query.id)
    if(!course)
      return res.status(404).end()
    course.title = req.body.title
    course.thumbnailUrl = req.body.bannerUrl
    await course.save()
    return res.json({_id: course._id.toString(), title: course.title??'course title', bannerUrl: course.thumbnailUrl??defaultCourseBanner})
  }
  if(req.method === 'DELETE')
  {
    await Course.findByIdAndRemove(req.query.id)
    return res.status(201).end()
  }
  res.status(404).end()
}