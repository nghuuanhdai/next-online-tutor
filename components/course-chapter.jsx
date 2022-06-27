import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen } from "@fortawesome/free-solid-svg-icons"
import { useRef, useState } from "react"
import Link from "next/link"
import AnimateHeight from 'react-animate-height';
import Divider from "./divider";
import { v4 as uuidv4 } from 'uuid';

function LectureEntry({lecture, isAdmin}) {
  const [titleEdit, setTitleEdit] = useState(false)
  const titleInput = useRef(null)
  const [title, setTitle] = useState(lecture.title)
  async function editChapterTitle(evt) {
    evt.preventDefault()
    setTitleEdit(!titleEdit)
  }

  return (
    <Link href={`/lecture/${lecture._id}`}>
      <a className="px-2 m-px w-full flex flex-row">
        {
          isAdmin
          ?<button onClick={editChapterTitle} className="flex-none mx-2">
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
          :<h2 className="flex-auto text-left underline">{title}</h2>
        }
      </a>
    </Link>
  )
}

export default function CourseChapter({ chapter, isAdmin })
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
  }

  async function addChapter(evt) {
    const dummyChapter = {
      _id: uuidv4(),
      title: 'New Chapter',
      chapters: [],
      lectures: []
    }
    setChapters([...chapters, dummyChapter])
  }

  async function addLecture(evt) {
    const dummyLecture = {
      _id: uuidv4(),
      title: 'New Lecture'
    }
    setLectures([...lectures, dummyLecture])
  }

  return (
    <>
    {
      !chapter.rootChapter
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
      <button className={isAdmin?"rounded-r bg-blue-100 p-2 m-l-px w-full flex flex-row":"rounded bg-blue-100 p-2 m-l-px w-full flex flex-row"} onClick={(evt)=>setExpand(!expand)}>
        {
          titleEdit
          ?<input onClick={(evt => evt.preventDefault())} onChange={(evt)=>setTitle(evt.target.value)} className="rounded outline-0 bg-blue-600 flex-auto text-white text-left font-bold" ref={titleInput} value={title}></input>
          :<h2 className="flex-auto text-slate-700 text-left font-bold">{title}</h2>
        }
        
      </button>
      
      </div>
      :<></>
    }
    <AnimateHeight
      id={chapter._id??'root-chapter'}
      duration={500}
      height={(expand || chapter.rootChapter)?'auto':0}
      className=""
    >
      <div className="pb-2">
        <div className= {chapter.rootChapter?"":"ml-5"}>
          <ul className="flex flex-col mb-2 border-l-2 border-slate-200">
          {
            lectures.map(lecture => <li key={lecture._id} className='flex-auto flex flex-row items-center'>
              <div className="w-2 h-0.5 bg-slate-200"></div><LectureEntry lecture={lecture} isAdmin={isAdmin}></LectureEntry>
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
                <CourseChapter chapter={chapter} isAdmin={isAdmin}></CourseChapter>
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