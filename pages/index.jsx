import { useEffect, useState } from "react"
import MyHead from "../components/head"
import CoursesList from "../components/courses-list"
import Divider from "../components/divider"
import Footer from "../components/footer"
import Header from "../components/header"

export default function Home({myCourses, courses}) {
  return (
    <>
      <MyHead></MyHead>
      <Header></Header>
      <div className="container mx-auto p-2">
        <CoursesList courses={myCourses} title='MY COURSES'></CoursesList>
        <Divider></Divider>
        <CoursesList courses={courses} title='RECOMMENDED COURSES' adminOption={true}></CoursesList>
      </div>
      <Footer></Footer>
    </>
  )
}

export async function getServerSideProps(contex) {
  const dummyCourses = []
    for (let i = 0; i < 10; i++) {
      dummyCourses.push({
        _id: i.toString(),
        title: `Course ${i} Title`,
        bannerUrl: 'https://ugc.futurelearn.com/uploads/images/17/a5/header_17a5cd13-9059-46d3-a48e-23b21df7e947.jpg'
      })
    }
  return {
    props: {myCourses: dummyCourses, courses: dummyCourses}
  }
}
