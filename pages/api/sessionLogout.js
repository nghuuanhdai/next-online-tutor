import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "../../utils/firebaseAdmin";
import { serialize } from 'cookie'

export default async function handler(req, res) {
  const sessionCookie = req.cookies.session || '';
  res.setHeader('Set-Cookie', serialize('session', '', {
      expires: new Date(0),
      path: '/'
  }));

  const auth = getAuth(getAdminApp())
  try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie)
      await auth.revokeRefreshTokens(decodedClaims.sub)
      res.redirect('/login');
  } catch (error) {
      console.log(error)
      res.redirect('/login');
  }
}