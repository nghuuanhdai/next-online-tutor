import { useEffect, useState } from "react";
import CourseCard from "./course-card";
import NewCourseCardButton from "./new-course-card";
import { mutate } from "swr";

export default function CoursesList({ courses, title, adminOption = false }) {  
  const [coursesVal, setCoursesVal] = useState([])
  useEffect(()=>setCoursesVal(courses), [courses])
  
  async function createNewCourse(evt) {
    console.log('create new course')
    setCoursesVal([...coursesVal, {
      _id: (parseInt(coursesVal[coursesVal.length -1]._id) + 1).toString(),
      title: 'Course Title',
      bannerUrl: 'https://ugc.futurelearn.com/uploads/images/17/a5/header_17a5cd13-9059-46d3-a48e-23b21df7e947.jpg'
    }])
  }

  function deleteCourse(delCourse) {
    return ()=>{
      setCoursesVal(coursesVal.filter(course => course._id != delCourse._id))
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
          adminOption
          ?<NewCourseCardButton onClick={createNewCourse}></NewCourseCardButton>
          :<></>
        }
      </div>
    </>
  )
}