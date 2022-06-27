import Footer from "../../components/footer"
import MyHead from "../../components/head"
import Header from "../../components/header"
import Image from 'next/image'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faPen , faImage} from "@fortawesome/free-solid-svg-icons"
import { useRef, useState } from "react"
import CourseChapter from "../../components/course-chapter"
import { useUserProfile } from "../../utils/firebaseClient"


export async function getServerSideProps(context){
  const _id = context.query.id
  const dummyCourse = {
    _id: _id,
    title: `Course ${_id} Title`,
    bannerUrl: 'https://ugc.futurelearn.com/uploads/images/17/a5/header_17a5cd13-9059-46d3-a48e-23b21df7e947.jpg',
    lectures: [],
    chapters: [
      { _id: '1', title: 'chapter 1', lectures: [{_id: '1', title: 'Lecture 1'}, {_id: '2', title: 'Lecture 2'}], chapters: [] },
      { _id: '2', title: 'chapter 2', lectures: [{_id: '1', title: 'Lecture 1'}, {_id: '2', title: 'Lecture 2'}], chapters: [] },
      { _id: '3', title: 'chapter 3', lectures: [{_id: '1', title: 'Lecture 1'}, {_id: '2', title: 'Lecture 2'}], chapters: [] }
    ]
  }
  return {
    props : {course: dummyCourse}
  }
}

export default function Course({ course }) {
  const isAdmin = useUserProfile()?.admin;
  const [editTitle, setEditTitle] = useState(false)
  const titleInput = useRef(null)
  const [title, setTitle] = useState(course.title)

  async function editCourseTitle(evt) {
    setEditTitle(!editTitle)
  }

  async function editThumbnail(evt) {
    
  }

  return (
    <>
    <MyHead></MyHead>
    <Header></Header>
    <main className="container mx-auto px-2 mb-5">
      <div className="relative rounded-b-xl overflow-hidden">
        <Image src={course.bannerUrl} alt={title} width='320' layout='responsive' height='180' objectFit='cover'></Image>
        {
          isAdmin
          ?<div className="flex-none absolute bot-0 right-0 -translate-y-full">
            <button onClick={editThumbnail} className=" bg-white rounded py-1 px-2 m-2">
              <FontAwesomeIcon
                icon={faImage}
                style={{fontSize: 15}}
                className="text-slate-800 hover:text-blue-400"
              ></FontAwesomeIcon>
            </button>
          </div>
          :<></>
        }
      </div>
      <div className="flex flex-row items-center align-center mb-5">
        {
          editTitle
          ?<input onClick={(evt => evt.preventDefault())} onChange={(evt)=>setTitle(evt.target.value)} className="outline-0 bg-slate-200 px-2 flex-auto text-blue-500 font-bold text-4xl text-center" ref={titleInput} value={title}></input>
          :<h1 className="flex-auto text-blue-500 font-bold text-4xl text-center">{title}</h1>
        } 
        {
          isAdmin
          ?<button onClick={editCourseTitle} className="mx-4 flex-none">
            <FontAwesomeIcon
              icon={faPen}
              style={{fontSize: 15}}
              className="text-slate-800 hover:text-blue-400"
            ></FontAwesomeIcon>
          </button>
          :<></>
        }
      </div>
      <CourseChapter chapter={{rootChapter: true, chapters: course.chapters, lectures: course.lectures}} isAdmin={isAdmin}></CourseChapter>
    </main>
    <Footer></Footer>
    </>
  )
}