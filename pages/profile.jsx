import MyHead from "../components/head"
import Header from "../components/header"
import Footer from "../components/footer"
import { loginCheck } from "../utils/firebaseAdmin"
import { useUserProfile } from "../utils/firebaseClient"
import { getAuth, updatePassword } from "firebase/auth";
import { getApp } from '../utils/firebaseClient';
import { useState } from "react"

export async function getServerSideProps(context)
{
  try {
    await loginCheck(context.req, context.res)
  } catch (error) {
    console.log(error)
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      },
      props: {}
    }
  }

  return {
    props: {}
  }
}

export default function ProfilePage({})
{
  const profile = useUserProfile()
  const auth = getAuth(getApp())
  const user = auth.currentUser;
  const [ err, setErr] = useState(null)
  const [ info, setInfo ] = useState(null)
  
  function resetPasswordSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    if(formData.get('password') !== formData.get('password2'))
    {
      setErr('password does not match!')
      setInfo(null)
      return
    }
    updatePassword(user, formData.get('password'))
    .then(()=>{
      setErr(null)
      setInfo('password updated!')
    })
    .catch(err=>{
      setErr(err)
      setInfo(null)
    })

  }

  return (
    <>
    <MyHead />
    <Header />
    <main className="container mx-auto px-2 mb-5">
      <h1 className="font-bold text-3xl text-blue-400 mb-5">{profile?.email}</h1>
      <form onSubmit={resetPasswordSubmit} className='rounded-xl p-5 bg-white flex flex-col'>
        <h2 className='text-2xl font-semibold text-slate-400 mb-5'>Reset Password</h2>
        { err
          ?(<p className="drop-shadow-xl bg-red-400 text-white m-5 p-3 rounded-lg mt-5 max-w-xs mx-auto">{err}</p>)
          :(<></>)
        }
        { info
          ?(<p className="drop-shadow-xl bg-green-400 text-white m-5 p-3 rounded-lg mt-5 max-w-xs mx-auto">{info}</p>)
          :(<></>)
        }
        <label htmlFor='password' className='flex-auto text-black/40 text-sm'>new password</label>
        <input name='password' id='password' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='password'></input>
        <label htmlFor='password2' className='flex-auto text-black/40 text-sm'>confirm new password</label>
        <input name='password2' id='password2' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='password'></input>
        <button type='submit' className='mt-6 flex-auto rounded bg-blue-400 p-2 text-white font-semibold'>Update password</button>
      </form>
    </main>
    <Footer />
    </>
  )
}