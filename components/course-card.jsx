import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPen, faImage } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { useUserProfile } from "../utils/firebaseClient";

export default function CourseCard({ course, adminOption = false, onCourseDelete = ()=>{}}){
  const isAdmin = useUserProfile()?.admin;

  async function deleteCourse(evt) {
    evt.preventDefault()
    console.log(`delete course ${course._id}`)
    setUpdating(prevCount => prevCount + 1)
    setTimeout(()=> {setUpdating(prevCount => prevCount - 1); onCourseDelete();}, 1000 )
  }

  async function editCourseTitle(evt) {
    evt.preventDefault()
    console.log(`edit course title`)
    setTitleEdit(!titleEdit)
    if (title != course.title)
    {
      setUpdating(prevCount => prevCount + 1)
      setTimeout(()=> setUpdating(prevCount => prevCount - 1), 1000 )
    }
  }

  async function editCourseThumbnail(evt) {
    evt.preventDefault()
    console.log(`edit course thumbnail`)
  }
  const [updating, setUpdating] = useState(0)
  const [bannerUrl, setBannerUrl] = useState(course.bannerUrl)
  const [title, setTitle] = useState(course.title)
  const [titleEdit, setTitleEdit] = useState(false)
  const titleInput = useRef(null)
  return (
    <div className="rounded-xl relative bg-white m-2 hover:drop-shadow-xl hover:scale-105 transition-all hover:z-10">
      <Link href={`/course/${course._id}`}>
        <a>
          <div className="rounded-xl overflow-clip">
            <Image src={bannerUrl} alt={title} width='320' layout='responsive' height='180' objectFit='cover'></Image>
            {
              updating>0
              ?<div className="h-0 relative">
                <div className="w-full h-1 bg-green-400 animate-pulse absolute"></div>
              </div>
              :<></>
            }
            <div className="flex">
              {
                titleEdit
                ?<input onClick={(evt => evt.preventDefault())} onChange={(evt)=>setTitle(evt.target.value)} className="bg-slate-200 flex-auto p-2 font-semibold text-slate-600 focus:outline-0 min-w-0" ref={titleInput} value={title}></input>
                :<h3 className="flex-auto p-2 font-semibold text-slate-600">{title}</h3>
              }
              {
                adminOption && isAdmin
                ?<>
                <button onClick={editCourseTitle} className="m-2 flex-none">
                  <FontAwesomeIcon
                    icon={faPen}
                    style={{fontSize: 15}}
                    className="text-slate-800 hover:text-blue-400"
                  ></FontAwesomeIcon>
                </button>
                <button onClick={editCourseThumbnail} className="m-2 flex-none">
                  <FontAwesomeIcon
                    icon={faImage}
                    style={{fontSize: 15}}
                    className="text-slate-800 hover:text-blue-400"
                  ></FontAwesomeIcon>
                </button>
                </>
                :<></>
              }
            </div>
          </div>
        </a>
      </Link>
      {
        isAdmin && adminOption
        ?<button onClick={deleteCourse} className="w-6 h-6 rounded-3xl bg-red-500 absolute -top-2 -right-2 text-white font-bold hover:scale-125 transition-all">
          <FontAwesomeIcon
            icon={faXmark}
            style={{ fontSize: 15, color: "white" }}
          />
        </button>
        :<></>
      }
    </div>
  )
}