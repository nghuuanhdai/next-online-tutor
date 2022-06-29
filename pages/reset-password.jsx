import MyHead from '../components/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getApp, useFirebase } from '../utils/firebaseClient';
import { useState } from 'react';
export default function ResetPassword() {
  const firebaseApp = useFirebase()
  let auth = null
  if(firebaseApp)
    auth = getAuth(firebaseApp)

  const [ err, setErr] = useState(null)
  const [ info, setInfo ] = useState(null)

  function onResetPasswordFormSubmit(evt)
  {
    evt.preventDefault()
    if(!auth)
      return
    const formData = new FormData(evt.target)
    sendPasswordResetEmail(auth, formData.get('email'))
    .then(()=>{
      setErr(null)
      setInfo('Password reset email sent!')
    })
    .catch(err => {
      setErr(err.message)
      setErr(null)
    })
  }

  return (
    <div className="bg-gradient-to-t from-blue-400 to-indigo-300 h-screen flex items-center">
      <MyHead></MyHead>

      <main className="container mx-auto">
        { err
          ?(<p className="drop-shadow-xl bg-red-400 text-white m-5 p-3 rounded-lg mt-5 max-w-xs mx-auto">{err}</p>)
          :(<></>)
        }
        { info
          ?(<p className="drop-shadow-xl bg-green-400 text-white m-5 p-3 rounded-lg mt-5 max-w-xs mx-auto">{info}</p>)
          :(<></>)
        }
        <form onSubmit={onResetPasswordFormSubmit} className='drop-shadow-xl rounded-xl p-5 bg-white flex flex-col max-w-xs mx-auto'>
          <h1 className='text-4xl font-bold flex-auto text-amber-400'><Link href='/'>Online Tutor</Link></h1>
          <h2 className='text-2xl font-semibold text-slate-400 mb-5'>Reset password</h2>
          <label htmlFor='email' className='flex-auto text-black/40 text-sm'>email</label>
          <input name='email' id='email' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='email'></input>
          <button type='submit' className='mt-6 flex-auto rounded bg-blue-400 p-2 text-white font-semibold'>Send reset password email</button>
        </form>
      </main>
    </div>
  )
}