import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function NewCourseCardButton({ onClick = null }) {
  return (
    <button onClick={onClick} className="rounded-xl relative bg-white m-2 hover:drop-shadow-xl hover:scale-105 transition-all">
        <div className="rounded-xl overflow-clip flex flex-col items-center my-6">
          <FontAwesomeIcon 
            icon={faPlus}
            style={{ fontSize: 100, color: 'rgb(100 116 139)' }}>
          </FontAwesomeIcon>
        </div>
    </button>
  )
}