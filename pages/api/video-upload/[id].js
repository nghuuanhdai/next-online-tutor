import { loginCheck } from "../../../utils/firebaseAdmin"
import Profile from "../../../models/profile"
import dbConnect from "../../../utils/dbConnect"
import Lecture from "../../../models/lecture"
import formidable from 'formidable';
import {Vimeo} from 'vimeo'

export const config = {
  api: {
    bodyParser: false,
  },
};
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
  const lecture = await Lecture.findById(req.query.id)
  if(!lecture)
    res.status(404).end()

  const form = new formidable.IncomingForm();
  const {err, fields, files} = await new Promise((resolve, reject)=>{
      form.parse(req, (err, fields, files)=> {
          resolve({err, fields, files})
      })
  })
  if(err)
  {
      console.log(err)
      return res.status(500).end()
  }
  const file = files?.video.filepath;
  const video_uri = await vimeoUpload(file, lecture.title);
  const videoId = video_uri.split('/').at(-1)
  lecture.videoId = videoId
  await lecture.save()
  return res.json(lecture)

  res.status(404).end()
}

function vimeoUpload(file_name, title, onProgress=(progress)=>{}) {
  return new Promise((resolve, reject)=>{
    let client = new Vimeo(
      process.env.VIMEO_CLI_ID, 
      process.env.VIMEO_CLI_SECR, 
      process.env.VIMEO_ACC_TOKEN
    )
    client.upload(
      file_name,
      {
        'name': title
      },
      function (uri) {
        console.log('Your video URI is: ' + uri);
        resolve(uri);
      },
      function (bytes_uploaded, bytes_total) {
        var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
        console.log(bytes_uploaded, bytes_total, percentage + '%')
        onProgress(percentage)
      },
      function (error) {
        console.log('Failed because: ' + error);
        reject(error);
      }
    )
  })   
}