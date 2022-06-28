import Footer from "../components/footer";
import MyHead from "../components/head";
import Header from "../components/header";
import {useRouter } from 'next/router'
import { loginCheck } from "../utils/firebaseAdmin";
import Profile from "../models/profile";
import dbConnect from "../utils/dbConnect";
import useSWR, {mutate} from "swr";
import Course from "../models/course";

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
  if(!profile?.admin)
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      },
      props: {}
    }
  const userProfile = await Profile.findOne({email: context.query.email})
  
  if(!userProfile)
    return {
      props: {error: 'User not found!', profile: {}}
    }

  let courses = await Course.find({})
  courses = courses.map(course => ({_id: course._id.toString(), title: course.title??'course title'}))

  return {
    props: { 
      profile: {
        _id: userProfile._id.toString(),
        admin: userProfile.admin??false,
        email: userProfile.email,
        courses: userProfile.courses.map(c => ({
          _id: c._id.toString(),
          title: c.title
        }))
      },
      courses: courses
    }
  }
}

export default function UserPage({ profile, courses, error }){
  const router = useRouter()
  const email = router.query.email
  const profileKey = `/api/profile/${profile._id}`
  async function fetcher() {
    const res = await fetch(courseInfoKey, {method: 'GET'})
    return await res.json()
  }

  const {data: swrProfile, err} = useSWR(profileKey, fetcher, {revalidateOnMount: false})
  if(swrProfile && !err)
    profile = swrProfile
  
  function updateUserCourse(course, add) {
    return function (evt) {
      evt.preventDefault()
      const updateJson = {}
      if(add)
        updateJson.pushCourseId = course._id
      else
        updateJson.popCourseId = course._id

      fetch(profileKey, {
        method: 'PUT',
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify(updateJson)
      })
      .then(res => res.json())
      .then(data => mutate(profileKey, data))
    }
  }

  function toggleAdmin(evt) {
    evt.preventDefault()
    console.log(profile.admin)
    fetch(profileKey, {
      method: 'PUT',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify({
        admin: !profile.admin
      })
    })
    .then(res => res.json())
    .then(data => mutate(profileKey, data))
  }

  return (
    <>
      <MyHead></MyHead>
      <Header></Header>
      <main className="container mx-auto px-2 mb-5">
        {
          error
          ?<h1 className="font-bold text-3xl text-red-400 mb-5">{error}</h1>
          :<>
            <h1 className="font-bold text-3xl text-blue-400 mb-5">{email}</h1>
            <button onClick={toggleAdmin} className={profile.admin?"rounded p-2 bg-green-500 flex items-center":"rounded p-2 bg-slate-300 flex items-center"}>
              <div className="p-[2px] rounded-[7px] bg-white mr-2">{profile.admin?<div className="w-[10px] h-[10px] rounded-[5px] bg-green-500"/>:<div className="w-[10px] h-[10px]"></div>}</div>
              <span className="text-white font-bold">{profile.email} {profile.admin?'is':'is not'} an Admin</span>
            </button>
            <h1 className="font-bold text-2xl text-blue-400 mb-5">User&apos;s Courses</h1>
            <div className="flex flex-col">
              {
                profile.courses.map(course => (
                  <button key={course._id} className="rounded bg-red-500 text-white p-2 my-1" onClick={updateUserCourse(course, false)}>
                    <h2 className="text-left">remove <span className="rounded bg-red-700 px-2">{course.title}</span> from <span className="rounded bg-red-700 px-2">{profile.email}</span></h2>
                  </button>
                ))
              }
            </div>
            <h1 className="font-bold text-2xl text-blue-400 mb-5">Courses</h1>
            <div className="flex flex-col">
              {
                courses.filter(course => profile.courses.findIndex(pCourse => course._id === pCourse._id) == -1).map(course => (
                <button key={course._id} className="rounded bg-green-500 text-white p-2 my-1" onClick={updateUserCourse(course, true)}>
                  <h2 className="text-left">add <span className="rounded bg-green-700 px-2">{course.title}</span> to <span className="rounded bg-green-700 px-2">{profile.email}</span></h2>
                </button>))
              }
            </div>
          </>
        }


      </main>
      <Footer></Footer>
    </>
  )
}