import { getAuth } from "firebase-admin/auth";

var admin = require("firebase-admin");

if(!global.firebaseAdmin){
  const serviceAccount = {
    "type":                         process.env.FB_ADMIN_TYPE,
    "project_id":                   process.env.FB_ADMIN_PROJECT_ID,
    "private_key_id":               process.env.FB_ADMIN_PRIVATE_KEY_ID,
    "private_key":                  (process.env.FB_ADMIN_PRIVATE_KEY).replace(/\\n/g, '\n'),
    "client_email":                 process.env.FB_ADMIN_CLIENT_EMAIL,
    "client_id":                    process.env.FB_ADMIN_CLIENT_ID,
    "auth_uri":                     process.env.FB_ADMIN_AUTH_URI,
    "token_uri":                    process.env.FB_ADMIN_TOKEN_URI,
    "auth_provider_x509_cert_url":  process.env.FB_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url":         process.env.FB_ADMIN_CLIENT_X509_CERT_URL
  }
  global.firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })

}

export function getAdminApp() {
  return global.firebaseAdmin;
}

export async function loginCheck(req, res){
  const sessionCookie = req.cookies.session || '';
  const auth = getAuth(getAdminApp())
  const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
  req.decodedClaims = decodedClaims
}