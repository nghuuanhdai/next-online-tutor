import Footer from "../../components/footer"
import MyHead from "../../components/head"
import Header from "../../components/header"
import dbConnect from "../../utils/dbConnect"
import { loginCheck } from "../../utils/firebaseAdmin"
import Lecture from "../../models/lecture"
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faPen} from "@fortawesome/free-solid-svg-icons"
import { useRef, useState } from "react"
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
      videoId: lecture.videoId??null,
      courseId: lecture.courseId?._id.toString()??null,
      courseTitle: lecture.courseId?.title??'untitled'
    }}
  }
}

export default function LecturePage({ lecture }){
  const [videoId, setVideoId] = useState(lecture.videoId)
  const [editTitle, setEditTitle] = useState(false)
  const [title, setTitle] = useState(lecture.title)
  const isAdmin = useUserProfile()?.admin
  const [file, setFile] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

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

  function uploadVideo(evt) {
    evt.preventDefault()
    var formData = new FormData(evt.target)
    console.log(formData.values)
    // post form data
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    // log response
    xhr.onload = () => {
      console.log(xhr.response);
      setUploadProgress(0)
      if(xhr.response?.videoId)
        setVideoId(xhr.response.videoId)
    };

    xhr.upload.onprogress = function(event) {
      let percent = Math.round(100 * event.loaded / event.total);
      console.log(`File is ${percent} uploaded.`);
      setUploadProgress(percent)
    };

    // create and send the reqeust
    xhr.open('POST', `/api/video-upload/${lecture._id}`, true);

    xhr.send(formData);
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
    {videoId
      ?<div className="w-full">
        <div className="pt-[56.25%] h-0 relative"><iframe className="w-full h-full absolute top-0 left-0" src={`https://player.vimeo.com/video/${videoId}`} res={1} frameBorder="0" responsive={1} webkitallowfullscreen={1} mozallowfullscreen={1} allowFullScreen={1}></iframe></div>
      </div>
      :<></>}

    {
    isAdmin
    ?<>
    <form onSubmit={uploadVideo} className="flex my-2 w-full">
      <button type="submit" className="p-2 rounded-l bg-blue-400 text-white font-bold">Upload</button>
      <label htmlFor="video" className="flex-auto border-blue-400 border border-2 rounded-r p-2 text-blue-400 font-bold text-lg hover:cursor-pointer">select video <span className="mx-2 rounded bg-blue-400 text-white font-normal px-2">{file.replace(/.*[\/\\]/, '')}</span></label>
      <input name="video" type="file" accept=".mp4" className="hidden" id="video" onChange={evt=>{setFile(evt.target.value);}} value={file}/>
    </form>
    {
    uploadProgress>0
    ?<div className="rounded border border-green-400 my-2 clip">
      <div className="h-[10px] bg-green-400" style={{width: `${uploadProgress}%`}}></div>
    </div>
    :<></> }
    </>
    :<></>}
    <Description description={lecture.description} onDescriptionChanged={onDescriptionChanged}/>
    </main>
    <Footer />
    </>
  )
}