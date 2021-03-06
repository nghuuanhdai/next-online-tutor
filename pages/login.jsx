import Link from 'next/link'
import { useRouter } from 'next/router'
import MyHead from '../components/head'
import { login } from '../utils/firebaseClient'

export default function Login (){
  const router = useRouter()
  const { err, info } = router.query

  async function loginSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    await login(formData.get('email'), formData.get('password'))
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
        <form onSubmit={loginSubmit} className='drop-shadow-xl rounded-xl p-5 bg-white flex flex-col max-w-xs mx-auto'>
          <h1 className='text-4xl font-bold flex-auto text-amber-400'><Link href='/'>Online Tutor</Link></h1>
          <h2 className='text-2xl font-semibold text-slate-400 mb-5'>Login</h2>
          <label htmlFor='email' className='flex-auto text-black/40 text-sm'>email</label>
          <input name='email' id='email' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='text'></input>
          <label htmlFor='password' className='flex-auto text-black/40 text-sm'>password</label>
          <input name='password' id='password' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='password'></input>
          <span  className="text-right text-sm text-blue-400 underline"><Link href="/reset-password">Forgot password</Link></span>
          <button type='submit' className='mt-6 flex-auto rounded bg-blue-400 p-2 text-white font-semibold'>Login</button>
        </form>
      </main>
    </div>
  )
}