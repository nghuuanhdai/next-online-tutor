import Footer from "../../components/footer"
import MyHead from "../../components/head"
import Header from "../../components/header"
import dbConnect from "../../utils/dbConnect"
import { loginCheck } from "../../utils/firebaseAdmin"
import Lecture from "../../models/lecture"
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faPen} from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { useUserProfile } from "../../utils/firebaseClient"
import Description from "../../components/description"
import Profile from "../../models/profile"

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
  const _id = context.query.id
  const lecture = await Lecture.findById(_id)

  if(!profile || (profile.courses.filter(c => c._id.toString() == lecture.courseId?._id.toString()??null).length == 0 && !profile.admin))
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      },
      props: {}
    }

  return {
    props: {lecture: {
      _id: lecture._id.toString(),
      title: lecture.title??'untitled',
      description: lecture.description??'',
      videoId: lecture.videoUrl??null,
      courseId: lecture.courseId?._id.toString()??null,
      courseTitle: lecture.courseId?.title??'untitled'
    }}
  }
}

export default function LecturePage({ lecture }){
  const [editTitle, setEditTitle] = useState(false)
  const [title, setTitle] = useState(lecture.title)
  const isAdmin = useUserProfile()?.admin

  function onDescriptionChanged(newDescription) {
    fetch(`/api/lecture/${lecture._id}`, {
      method: 'PUT',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({
        description: newDescription
      })
    })
  }

  function updateTitle()
  {
    setEditTitle(!editTitle)
    fetch(`/api/lecture/${lecture._id}`, {
      method: 'PUT',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({
        title: title
      })
    })
    .then(res => {
      if(res.status != 200)
      {
        throw Error('server err')
      }
      return res
    })
    .then(res => res.json())
    .then(updated => setTitle(updated.title))
    .catch(err => setTitle(lecture.title))
  }

  return (
    <>
    <MyHead />
    <Header />
    <main className="container mx-auto px-2 mb-5">
    <h1 className="font-bold text-3xl text-blue-400 mb-5">
      <Link href={`/course/${lecture.courseId}`}>
        <a> {lecture.courseTitle} <FontAwesomeIcon 
          icon={faArrowRight}
        /></a>
      </Link>
      {
        editTitle
        ?<input type='text' className="font-normal text-slate-400 rounded px-2 bg-slate-200 outline-0" value={title} onChange={(evt)=>setTitle(evt.target.value)}></input>
        :<span className="font-normal text-slate-400"> {title} </span>
      }
      {isAdmin
      ?<button className="font-normal text-slate-400" onClick={updateTitle}>
        <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
      </button>
      :<></>}
    </h1>
    <div className="video-section">

    </div>
    <Description description={lecture.description} onDescriptionChanged={onDescriptionChanged}/>
    </main>
    <Footer />
    </>
  )
}