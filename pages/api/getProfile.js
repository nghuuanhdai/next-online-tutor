import dbConnect from "../../utils/dbConnect";
import Profile from "../../models/profile"
import {loginCheck} from "../../utils/firebaseAdmin"

export default async function handler(req, res){
  try {
    await loginCheck(req, res)
  } catch (error) {
    return res.status(401).send('FORBIDDEN')
  }
  await dbConnect()
  if(req.method === 'GET')
  {
    const email = req.decodedClaims.email
    const profile = await Profile.findOne({email: email})
    return res.json(profile)
  }
  res.status(404).end()

}