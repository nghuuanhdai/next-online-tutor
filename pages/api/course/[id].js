import Course from '../../../models/course'
import { defaultCourseBanner } from '../../../utils/constant'
import dbConnect from '../../../utils/dbConnect'
import { serializeChapter } from './utils'
import { loginCheck } from '../../../utils/firebaseAdmin'

export default async function hanlder(req, res){
  if(req.method==='GET')
  {
    const _id = req.query.id
    await dbConnect() 
    const course = await Course.findById(_id)
    if(!course)
      return res.send(404).end()

    return res.json({
      _id: course._id.toString(),
      title: course.title??'course title',
      description: course.description??'',
      bannerUrl: course.thumbnailUrl??defaultCourseBanner,
      chapter: serializeChapter(course.chapter)
    })
  }
  try {
    await loginCheck(req, res)
  } catch (error) {
    return res.status(401).send('FORBIDDEN')
  }
  if(req.method === 'PUT')
  {
    const _id = req.query.id
    await dbConnect() 
    const course = await Course.findById(_id)
    if(!course)
      return res.send(404).end()
    course.description = req.body.description
    await course.save()
    return res.json({
      _id: course._id.toString(),
      title: course.title??'course title',
      description: course.description??'',
      bannerUrl: course.thumbnailUrl??defaultCourseBanner,
      chapter: serializeChapter(course.chapter)
    })
  }
  return res.send(404).end()
}