import { useEffect, useState } from "react";
import { useUserProfile } from "../utils/firebaseClient";
import CourseCard from "./course-card";
import NewCourseCardButton from "./new-course-card";

export default function CoursesList({ courses, title, adminOption = false }) {  
  const [coursesVal, setCoursesVal] = useState([])
  useEffect(()=>setCoursesVal(courses), [courses])
  const isAdmin = useUserProfile()?.admin
  
  async function createNewCourse(evt) {
    console.log('create new course')
    const res = await fetch('/api/course-info', {
      method: 'POST'
    })
    const newCourse = await res.json()
    setCoursesVal([...coursesVal, newCourse])
  }

  function deleteCourse(delCourse) {
    return async ()=>{
      setCoursesVal(coursesVal.filter(course => course._id != delCourse._id))
      const res = await fetch(`/api/course-info/${delCourse._id}`, {method: 'DELETE'})
      if(res.status != 201) {
        setCoursesVal(coursesVal)
      }
    }
  }
  
  return (
    <>
      <div className="mt-10"></div>
      <h2 className="font-sans text-2xl font-bold text-blue-500">{title}</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3">
        {
          coursesVal.map(course => (<CourseCard key={course._id} course={course} adminOption={adminOption} onCourseDelete={deleteCourse(course)}></CourseCard>))
        }
        {
          isAdmin && adminOption
          ?<NewCourseCardButton onClick={createNewCourse}></NewCourseCardButton>
          :<></>
        }
      </div>
    </>
  )
}