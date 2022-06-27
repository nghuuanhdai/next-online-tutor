import { createContext, useContext, useEffect, useRef, useState } from "react";

const CloudinaryContext = createContext()
import Script from 'next/script'

export function Cloudinary({children}) {
  const [uploadWidget, setUploadWidget] = useState(null)
  const [cloudinary, setCloudinary] = useState(null)
  const callbackFn = useRef((error, result)=>{})
  function onCloudinaryLoaded() {
    setCloudinary(window.cloudinary)
  }

  useEffect(()=>{
    if(!cloudinary) return
    var widget = cloudinary.createUploadWidget({
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}, (error, result) => { 
        if (!error && result && result.event === "success") { 
          callbackFn.current(error, result)
        }
      }
    )
    setUploadWidget(widget)
    console.log('widget created')
    return ()=>{widget.destroy(); console.log('widget destroyed')}
  }, [cloudinary])

  return (
    <>
      <Script src='https://upload-widget.cloudinary.com/global/all.js' onLoad={onCloudinaryLoaded}></Script>
      <CloudinaryContext.Provider value={{uploadWidget, callbackFn}}>{children}</CloudinaryContext.Provider>
    </>
  )
}

export function useCloudinary()
{
  return useContext(CloudinaryContext)
}