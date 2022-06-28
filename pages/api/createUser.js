import Profile from "../../models/profile";
import { loginCheck } from "../../utils/firebaseAdmin";
import { getAdminApp } from "../../utils/firebaseAdmin";
import { getAuth } from 'firebase-admin/auth'
import passwordGenerator from 'generate-password'

export default async function handler(req, res)
{
  if(req.method === 'POST')
  {
    try {
      await loginCheck(req, res)
    } catch (error) {
      console.error(error)
      return res.status(401).end()
    }  
    const email = req.decodedClaims.email
    const profile = await Profile.findOne({email: email})

    if(!profile?.admin)
      return res.status(401).end()

    const userEmail = req.body.email
    const auth = getAuth(getAdminApp())
    const password = passwordGenerator.generate({
      length: 20,
      numbers: true,
      symbols: true
    })
    const userRecord = await auth.createUser({
      email: userEmail,
      password: password,
      emailVerified: false
    })
    let userProfile = await Profile.findOne({email: userEmail})
    if(userProfile)
      return res.status(500).end()

    userProfile = new Profile()
    userProfile.email = userEmail
    
    await userProfile.save()
    return res.json({
      email: userEmail,
      password: password
    })
  }
  res.status(404).end()
}