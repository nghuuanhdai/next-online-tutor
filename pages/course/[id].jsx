import Footer from "../../components/footer"
import MyHead from "../../components/head"
import Header from "../../components/header"
import Image from 'next/image'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faPen , faImage} from "@fortawesome/free-solid-svg-icons"
import { useRef, useState, useEffect } from "react"
import CourseChapter from "../../components/course-chapter"
import { useUserProfile } from "../../utils/firebaseClient"
import dbConnect from '../../utils/dbConnect'
import Course from "../../models/course"
import { defaultCourseBanner } from "../../utils/constant"
import useSWR , { mutate } from "swr";
import { useCloudinary } from "../../utils/cloudinary-ctx"
import Description from "../../components/description"
import {serializeChapter} from '../api/course/utils'

export async function getServerSideProps(context){
  const _id = context.query.id
  await dbConnect()
  const course = await Course.findById(_id)
  return {
    props : {course: {
      _id: course?._id.toString()??_id,
      title: course?.title??'Unknown',
      bannerUrl: course?.thumbnailUrl??defaultCourseBanner,
      description: course?.description??'',
      chapter: serializeChapter(course?.chapter)
    }}
  }
}

export default function CoursePage({ course }) {
  const courseKey = `/api/course/${course._id}`
  async function courseFetcher() {
    const res = await fetch(courseKey, {method: 'GET'})
    return await res.json()
  }

  const {data: courseDetail, courseDetailErr} = useSWR(courseKey, courseFetcher, {fallbackData: course, revalidateOnMount: false})
  if(courseDetail && !courseDetailErr)
  {
    course = courseDetail  
  }
  
  const courseInfoKey = `/api/course-info/${course._id}`
  async function infoFetcher(){
    const res = await fetch(courseInfoKey, {method: 'GET'})
    return await res.json()
  }

  const {data: courseInfo, courseInfoErr} = useSWR(courseInfoKey, infoFetcher, {fallbackData: course, revalidateOnMount: false})
  if(courseInfo && !courseInfoErr)
  {
    courseInfo.chapter = course.chapter
    courseInfo.description = course.description
    course = courseInfo
  }

  function onDescriptionChanged(newDescription) {
    fetch(courseKey, {
      method: 'PUT',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({
        description: newDescription
      })
    }).then(res => res.json())
    .then(resCourse => {
      mutate(courseKey, resCourse)
    }) 
  }

  const isAdmin = useUserProfile()?.admin;
  const [editTitle, setEditTitle] = useState(false)
  const titleInput = useRef(null)
  const [title, setTitle] = useState(course.title)
  const [bannerUrl, setBannerUrl] = useState(course.bannerUrl) 
  useEffect(()=>{setTitle(course.title)}, [course])
  useEffect(()=>{setBannerUrl(course.bannerUrl)}, [course])

  async function editCourseTitle(evt) {
    setEditTitle(!editTitle)
    if (title != course.title)
    {
      const res = await fetch(courseInfoKey, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({title: title, bannerUrl: bannerUrl})
      })
      const newCourseInfo = await res.json()
      setTitle(newCourseInfo.title)
      mutate(courseInfoKey, newCourseInfo, false)
    }
  }
  const {uploadWidget: cloudinaryUploadWidget, callbackFn: cloudinaryCallback} = useCloudinary()
  async function editThumbnail(evt) {
    evt.preventDefault()
    cloudinaryCallback.current = async (error, result) =>{
      if(error) return console.error(error)
      const res = await fetch(courseInfoKey, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({title: title, bannerUrl: result.info.url})
      })
      const newCourseInfo = await res.json()
      setBannerUrl(newCourseInfo.bannerUrl)
      mutate(courseInfoKey, newCourseInfo, false)
    }
    cloudinaryUploadWidget.open()
  }

  return (
    <>
    <MyHead></MyHead>
    <Header></Header>
    <main className="container mx-auto px-2 mb-5">
      <div className="relative rounded-b-xl overflow-hidden">
        <Image src={bannerUrl} alt={title} width='320' layout='responsive' height='180' objectFit='cover'></Image>
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
      <Description description={course.description} onDescriptionChanged={onDescriptionChanged}></Description>
      <h2 className="flex-auto text-blue-500 font-bold text-2xl">Lectures</h2>
      <CourseChapter chapter={course.chapter} courseId={course._id} isAdmin={isAdmin} isRoot={true}></CourseChapter>
    </main>
    <Footer></Footer>
    </>
  )
}