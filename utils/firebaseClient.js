import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, getIdToken, inMemoryPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from 'react'

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export function getApp(){
    if(typeof window !== "undefined")
        return global.firebaseApp
    else
        return null
}

export async function login(email, password) {
    const auth = getAuth(getApp())
    try {
      await setPersistence(auth, inMemoryPersistence)
      const user = await signInWithEmailAndPassword(auth, email, password)
      await sessionLogin(auth)
    } catch (error) {
      window.location.assign('/login?err='+ error)
      await auth.signOut()
      throw error
    }    
}

export async function logout() {
  const auth = getAuth(getApp())
  try {
    const res = await fetch('/api/sessionLogout', {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
    })
    if (res.status !== 200){
      throw({code: res.status, message: res.text })
    }
    await auth.signOut()
    window.location.assign('/')
  } catch (error) {
    await auth.signOut()
    throw error
  }
}

async function sessionLogin(auth) {
  const user = auth.currentUser
  const idToken = await user.getIdToken(false)
  const csrftoken = getCookie('csrftoken')
  const res = await fetch('/api/sessionLogin', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({idToken: idToken, csrftoken: csrftoken})
  })
  if (res.status !== 200){
    window.location.assign('/login?err='+ encodeURIComponent(res.statusText))
    throw({code: res.status, message: res.text })
  }
  await auth.signOut()
  window.location.assign('/')
}

export async function signup(email, password) {
  const auth = getAuth(getApp())
  try {
    await setPersistence(auth, inMemoryPersistence)
    const user = await createUserWithEmailAndPassword(auth, email, password)
    await sessionLogin(auth)
  } catch (error) {
    console.log(error)
    await auth.signOut()
    throw error
  }    
}

//build context api to get current user profile
const UserContext = createContext()
export function UserContextWrapper({ children })
{
  const [ userProfile, setUserProfile ] = useState(null)

  useEffect(()=>{
    fetch('/api/getProfile', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(data => setUserProfile(data))
    .catch(err => {console.log(err); setUserProfile(null)})
  }, [])

  return (
    <UserContext.Provider value={userProfile}>{children}</UserContext.Provider>
  )
}

export function useUserProfile()
{
  return useContext(UserContext);
}

const FirebaseContext = createContext()
export function FirebaseProvider({children})
{
  const [firebaseApp, setFirebaseApp] = useState(null)

  useEffect(()=>{
    if(typeof window !== "undefined")
    {
      if (!global.firebaseApp)
      {
        console.log('firebase init')
        global.firebaseApp = initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_DB_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_APP_ID,
          measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
        })
        setFirebaseApp(global.firebaseApp)
      }
    }
  },[])

  return (
    <FirebaseContext.Provider value={firebaseApp}>{children}</FirebaseContext.Provider>
  )
}

export function useFirebase() {
  return useContext(FirebaseContext)
}