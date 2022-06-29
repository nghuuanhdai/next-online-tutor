import { serialize } from 'cookie';
import { getAuth } from "firebase-admin/auth";
import Profile from '../../models/profile';
import { getAdminApp } from '../../utils/firebaseAdmin';

export default async function handler(req, res) {
  const idToken = req.body.idToken.toString()
  const csrftoken = req.body.csrftoken.toString()

  // if(csrftoken !== req.cookies.csrftoken) {
  //     res.status(401).send('UNAUTHORIZED REQUEST!');
  //     console.log(req.cookies.csrftoken)
  //     console.log(csrftoken)
  //     return;
  // }

  const expiresIn = 1000*60*60*24*5;
  const auth = getAuth(getAdminApp())
  let email = null
  try {
    const decodedIdToken = await auth.verifyIdToken(idToken);
    email = decodedIdToken.email
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time > 5 * 60)
    {
        res.status(401).send('Recent sign in required!');
        return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('SERVER ERROR!');
    return;
  }

  try {
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })
      const options =  { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV == 'development'?false:true, path: '/'};
      
      let userProfile = await Profile.findOne({email: email})
      if(!userProfile)
      {
        userProfile = new Profile()
        userProfile.email = email
        await userProfile.save()
      }
      res.setHeader('Set-Cookie', serialize('session', sessionCookie, options));
      res.status(200)
      res.end(JSON.stringify({ status: 'success' }));
  } catch (error) {
      console.log(error);
      res.status(500).send('SERVER ERROR!');
      return;
  }
}