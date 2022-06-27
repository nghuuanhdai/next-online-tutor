import dbConnect from "../../../utils/dbConnect";
import Course from "../../../models/course";
import { defaultCourseBanner } from "../../../utils/constant";

export default async function handler(req, res){
  await dbConnect()
  if(req.method === 'GET')
  {
    const course = await Course.findById(req.query.id)
    if(!course)
      return res.status(404).end()
    res.json({_id: course._id.toString(), title: course.title, bannerUrl: course.thumbnailUrl??defaultCourseBanner})
  }
  if(req.method === 'POST')
  {
    const course = await Course.findById(req.query.id)
    if(!course)
      return res.status(404).end()
    course.title = req.body.title
    await course.save()
    res.json({_id: course._id.toString(), title: course.title, bannerUrl: course.thumbnailUrl??defaultCourseBanner})
  }
  res.status(404).end()
}