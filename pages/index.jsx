import { useEffect, useState } from "react"
import MyHead from "../components/head"
import CoursesList from "../components/courses-list"
import Divider from "../components/divider"
import Footer from "../components/footer"
import Header from "../components/header"
import dbConnect from "../utils/dbConnect"
import Course from "../models/course"
import { useUserProfile } from "../utils/firebaseClient"
import { defaultCourseBanner } from "../utils/constant"

export default function Home({myCourses, courses}) {
  const profile = useUserProfile()
  myCourses = profile?.courses.map(course => ({_id: course._id.toString(), title: course.title, bannerUrl: course.thumbnailUrl??defaultCourseBanner}))??[]

  return (
    <>
      <MyHead></MyHead>
      <Header></Header>
      <div className="container mx-auto p-2">
        {
          profile
          ?<>
            <CoursesList courses={myCourses} title='MY COURSES'></CoursesList>
            <Divider></Divider>
          </>
          :<></>
        }
        <CoursesList courses={courses} title='RECOMMENDED COURSES' adminOption={true}></CoursesList>
      </div>
      <Footer></Footer>
    </>
  )
}

export async function getServerSideProps(contex) {
  await dbConnect()
  let courses = await Course.find()
  courses = courses.map(course => ({_id: course._id.toString(), title: course.title, bannerUrl: course.thumbnailUrl??defaultCourseBanner}))
  return {
    props: {myCourses: [], courses: courses}
  }
}
