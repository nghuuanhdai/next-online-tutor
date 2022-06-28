import Header from "../components/header"
import MyHead from "../components/head"
import Footer from "../components/footer"
import { loginCheck } from "../utils/firebaseAdmin"
import dbConnect from "../utils/dbConnect"
import Profile from "../models/profile"
import { useState } from "react"

export async function getServerSideProps(context){
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

  await dbConnect()
  const profile = await Profile.findOne({email: context.req.decodedClaims.email})
  if(!profile?.admin)
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      },
      props: {}
    }

  return {
    props: {}
  }
}


export default function UsersPage({})
{
  const [newUserErr, setNewUserErr] = useState(null)
  const [editUserErr, setEditUserErr] = useState(null)
  
  const [newUserInfo, setNewUserInfo] = useState(null)
  const [editUserInfo, setEditUserInfo] = useState(null)

  const [createdUsers, setCreatedUsers] = useState([])

  function createUserSubmit(evt) {
    evt.preventDefault()
    setNewUserErr(null)
    setNewUserInfo(null)
    const formData = new FormData(evt.target)
    fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.get('email')
      })
    })
    .then(res => {
      if (res.status != 200)
        throw Error(res.statusText)
      return res
    })
    .then(res => res.json())
    .then(newUser => {console.log(newUser); return newUser;})
    .then(newUser => setCreatedUsers([...createdUsers, newUser]))
    .catch(err => setNewUserErr(err.toString())) 
  }

  function editUserSubmit() {

  }

  console.log(newUserErr)
  return (
    <>
    <MyHead />
    <Header />
    <main className="container mx-auto px-2 mb-5">
    <form onSubmit={createUserSubmit} className='rounded-xl p-5 bg-white flex flex-col my-2'>
      <h2 className='text-2xl font-semibold text-slate-400 mb-5'>Create user account</h2>
      { newUserErr
        ?(<p className="drop-shadow-xl bg-red-400 text-white m-5 p-3 rounded-lg mt-5 max-w-xs mx-auto">{newUserErr}</p>)
        :(<></>)
      }
      { newUserInfo
        ?(<p className="drop-shadow-xl bg-green-400 text-white m-5 p-3 rounded-lg mt-5 max-w-xs mx-auto">{newUserInfo}</p>)
        :(<></>)
      }
      <div className="my-2">
        {
          createdUsers.map((user, index) => (
            <div key={index} className="rounded text-white bg-green-400 p-2 my-1"><strong>New user</strong><div>email: <span className="rounded px-2 font-bold bg-green-500 m-2">{user.email}</span></div><div>password: <span className="rounded px-2 font-bold bg-green-500 m-2">{user.password}</span></div></div>
          ))
        }
      </div>
      <label htmlFor='email' className='flex-auto text-black/40 text-sm'>user&apos;s email</label>
      <input name='email' id='email' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='email' placeholder="user@email.com"></input>
      <button type='submit' className='mt-6 flex-auto rounded bg-blue-400 p-2 text-white font-semibold'>Create</button>
    </form>

    <form onSubmit={editUserSubmit} className='rounded-xl p-5 bg-white flex flex-col my-2'>
      <h2 className='text-2xl font-semibold text-slate-400 mb-5'>Edit user account</h2>
      { editUserErr
        ?(<p className="drop-shadow-xl bg-red-400 text-white m-5 p-3 rounded-lg mt-5 max-w-xs mx-auto">{editUserErr}</p>)
        :(<></>)
      }
      { editUserInfo
        ?(<p className="drop-shadow-xl bg-green-400 text-white m-5 p-3 rounded-lg mt-5 max-w-xs mx-auto">{editUserInfo}</p>)
        :(<></>)
      }
      <label htmlFor='email' className='flex-auto text-black/40 text-sm'>user&apos;s email</label>
      <input name='email' id='email' className='text-blue-900 flex-auto bg-slate-200 rounded-lg p-2' type='email' placeholder="user@email.com"></input>
      <button type='submit' className='mt-6 flex-auto rounded bg-blue-400 p-2 text-white font-semibold'>Edit</button>
    </form>

    </main>
    <Footer/>
    </>
  )
}