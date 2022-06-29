import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useRef, useState } from "react"
import Link from "next/link"
import AnimateHeight from 'react-animate-height';
import Divider from "./divider";
import { v4 as uuidv4 } from 'uuid';
import { useUserProfile } from "../utils/firebaseClient";

function LectureEntry({lecture, isAdmin, courseId, onDelete = (lecture)=>{}}) {
  const [titleEdit, setTitleEdit] = useState(false)
  const titleInput = useRef(null)
  const [title, setTitle] = useState(lecture.title)
  const userProfile = useUserProfile()
  const userCourses = userProfile?.courses??[]

  const canView = userCourses.findIndex(c => c._id === courseId) != -1 || userProfile?.admin

  async function editLectureTitle(evt) {
    evt.preventDefault()
    setTitleEdit(!titleEdit)
    if (title != lecture.title)
    {
      fetch(`/api/lecture/${lecture._id}`, {
        method: 'PUT',
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify({
          title: title
        })
      }).then(res => {
        if(res.status != 200)
          throw Error('server error')
        return res
      }).then(res => res.json())
      .then(updated => setTitle(updated.title))
      .catch(err => setTitle(lecture.title))
    }
  }
  async function deleteLecture(evt){
    evt.preventDefault()
    fetch(`/api/lecture/${lecture._id}`, {
      method: 'DELETE',
    })
    .then(res => {
      if(res.status != 201)
        throw Error('server err')
      return res
    })
    .then(res => onDelete(lecture))
  }

  return (
    <StateLink href={`/lecture/${lecture._id}`} disabled={!canView}>
      <a className="px-2 m-px w-full flex flex-row">
        {
          isAdmin
          ?<button onClick={editLectureTitle} className="flex-none mx-2">
            <FontAwesomeIcon
              icon={faPen}
              style={{fontSize: 15}}
              className="text-slate-800 hover:text-blue-400"
            ></FontAwesomeIcon>
          </button>
          :<></>}
        {
          titleEdit
          ?<input onClick={(evt => evt.preventDefault())} onChange={(evt)=>setTitle(evt.target.value)} className="rounded outline-0 bg-slate-300 flex-auto text-left underline" ref={titleInput} value={title}></input>
          :<h2 className="flex-auto text-left"><span className={canView?"underline":"text-slate-400"}>{title}</span></h2>
        }
        {
          isAdmin
          ?<button onClick={deleteLecture} className="flex-none mx-2">
            <FontAwesomeIcon
              icon={faXmark}
              style={{fontSize: 15}}
              className="text-red-500 hover:text-red-700"
            ></FontAwesomeIcon>
          </button>
          :<></>}
      </a>
    </StateLink>
  )
}

function StateLink({children, disabled, href})
{
  return (
    disabled
    ?<>{children}</>
    :<Link href={href}>{children}</Link>
  )
}

export default function CourseChapter({ chapter, isAdmin, courseId, isRoot=false, onChapterDelete=(chapter)=>{} })
{
  const [titleEdit, setTitleEdit] = useState(false)
  const [expand, setExpand] = useState(false)
  const [title, setTitle] = useState(chapter.title)
  const [chapters,  setChapters] = useState(chapter.chapters)
  const [lectures, setLectures] = useState(chapter.lectures)
  const titleInput = useRef(null)

  async function editChapterTitle(evt) {
    evt.preventDefault()
    setTitleEdit(!titleEdit)
    if (title != chapter.title)
    {
      fetch(`/api/chapter/${chapter._id}`, {
        method: 'PUT',
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify({
          title: title
        })
      }).then(res => {
        if(res.status != 200)
          throw Error('server error')
        return res
      }).then(res => res.json())
      .then(updatedChapter => setTitle(updatedChapter.title))
      .catch(err => setTitle(chapter.title))
    }
  }

  function addChapter(evt) {
    fetch('/api/chapter', {
      method: 'POST',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({
        parentCourseId: courseId,
        parentChapterId: chapter._id
      })
    })
    .then(res => {
      if(res.status != 200)
        throw Error('server err')
      return res
    })
    .then(res => res.json())
    .then(newChapter => setChapters([...chapters, newChapter]))
    .catch(err => setChapters(chapters))
  }

  async function addLecture(evt) {
    fetch('/api/lecture', {
      method: 'POST',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({
        parentCourseId: courseId,
        parentChapterId: chapter._id
      })
    })
    .then(res => {
      if(res.status != 200)
        throw Error('server err')
      return res
    })
    .then(res => res.json())
    .then(newLecture => setLectures([...lectures, newLecture]))
    .catch(err => setLectures(lectures))
  }

  async function deleteChapter(evt) {
    evt.preventDefault()
    fetch(`/api/chapter/${chapter._id}`, {
      method: 'DELETE',
    })
    .then(res => {
      if(res.status != 201)
        throw Error('server err')
      return res
    })
    .then(res => onChapterDelete(chapter))
  }

  function onSubChapterDelete(delChapter) {
    setChapters(chapters.filter(chapter => chapter._id != delChapter._id))
  }

  function onSubLectureDelete(delLecture) {
    setLectures(lectures.filter(lecture => lecture._id != delLecture._id))
  }

  return (
    <>
    {
      !isRoot
      ?<div className="flex flex-row m-px">
      {
        isAdmin
          ?<button onClick={editChapterTitle} className="flex-none px-2 bg-blue-100 rounded-l">
            <FontAwesomeIcon
              icon={faPen}
              style={{fontSize: 15}}
              className="text-slate-700 hover:text-blue-500"
            ></FontAwesomeIcon>
          </button>
          :<></>  
      }
      <button className={isAdmin?"bg-blue-100 p-2 m-l-px w-full flex flex-row":"rounded bg-blue-100 p-2 m-l-px w-full flex flex-row"} onClick={(evt)=> {if(!titleEdit)setExpand(!expand)}}>
      {
        titleEdit
        ?<input onClick={(evt => evt.preventDefault())} onChange={(evt)=>setTitle(evt.target.value)} className="rounded outline-0 bg-blue-300 flex-auto text-slate-700 text-left font-bold" ref={titleInput} value={title}></input>
        :<h2 className="flex-auto text-slate-700 text-left font-bold">{title}</h2>
      }
      </button>
      {
        isAdmin
        ?<button onClick={deleteChapter} className="flex-none px-2 bg-blue-100 rounded-r">
          <FontAwesomeIcon
            icon={faXmark}
            style={{fontSize: 15}}
            className="text-red-500 hover:text-red-700"
          ></FontAwesomeIcon>
        </button>
        :<></>}
      
      </div>
      :<></>
    }
    <AnimateHeight
      id={chapter._id??'root-chapter'}
      duration={500}
      height={(expand || isRoot)?'auto':0}
      className=""
    >
      <div className="pb-2">
        <div className= {isRoot?"":"ml-5"}>
          <ul className="flex flex-col mb-2 border-l-2 border-slate-200">
          {
            lectures.map(lecture => <li key={lecture._id} className='flex-auto flex flex-row items-center'>
              <div className="w-2 h-0.5 bg-slate-200"></div><LectureEntry courseId={courseId} lecture={lecture} isAdmin={isAdmin} onDelete={onSubLectureDelete}></LectureEntry>
            </li>)
          }
          {
            isAdmin
            ?<li>
            <button className="px-2 m-px w-full flex flex-row" onClick={addLecture}>
                {
                  <h2 className="flex-auto text-left underline">Add Lecture</h2>
                }
              </button>
            </li>
            :<></>}
          </ul>
          <ul className="flex flex-col">
            {
              chapters.map(chapter => <li key={chapter._id} className='flex-auto'>
                <CourseChapter chapter={chapter} isAdmin={isAdmin} courseId={courseId} onChapterDelete={onSubChapterDelete}></CourseChapter>
              </li>)
            }
            {
              isAdmin
              ?<li>
                <button className="rounded bg-white p-2 m-l-px w-full flex flex-row" onClick={addChapter}>
                  {
                    <h2 className="flex-auto text-blue-500 text-white font-bold">Add Chapter</h2>
                  }
                </button>
              </li>
              :<></>  
            }
          </ul>
        </div>
      </div>
      
    </AnimateHeight>
    </>
  )
}