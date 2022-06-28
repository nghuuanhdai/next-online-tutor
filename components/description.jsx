import QuillJSRenderer from "./quill-js-renderer"
import QuillJsEditor from "./quill-js-editor"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { useUserProfile } from "../utils/firebaseClient"

export default function Description({description, onDescriptionChanged})
{
  const isAdmin = useUserProfile()?.admin
  const [descriptionEdit, setDescriptionEdit] = useState(false)
  const [quill, setQuill] = useState(null)
  let deltaInit = {}
  try {
    deltaInit = JSON.parse(description)
  } catch (error) {
    //console.error(error)
  }
  const [delta, setDelta] = useState(deltaInit)

  useEffect(()=>{
    function handleChange()
    {
      const deltaContent = quill.getContents()
      setDelta(deltaContent)
      onDescriptionChanged(JSON.stringify(deltaContent))
    }
    quill?.on('text-change', handleChange)

    return ()=>{quill?.off('text-change', handleChange)}
  }, [quill])

  return (
    <div className="relative mb-5">
      {
        descriptionEdit
        ?<QuillJsEditor delta={delta} onQuillSet={setQuill}></QuillJsEditor>
        :<QuillJSRenderer delta={delta}></QuillJSRenderer>
      }
      {
        isAdmin
        ?<div className="flex-none absolute bot-0 right-0 -translate-y-full">
          <button onClick={()=>setDescriptionEdit(!descriptionEdit)} className="px-2 m-2">
            <FontAwesomeIcon
              icon={faPen}
              style={{fontSize: 15}}
              className="text-slate-800 hover:text-blue-400"
            ></FontAwesomeIcon>
          </button>
        </div>
        :<></>
      }
    </div>
  )
}