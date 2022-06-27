import Divider from "./divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faYoutube } from "@fortawesome/free-brands-svg-icons"


export default function Footer() {
  return (
    <div className="relative">
      <Divider></Divider>
      <p className="mx-auto text-center my-6 font-semibold text-slate-400">Online tutor - 2022</p>
      <div className="top-2 right-2 absolute flex flex-col items-end">
        <a href="#" className="text-blue-500">
          <p className="text-slate-400 inline mr-2 text-sm">Facebook page</p>
          <FontAwesomeIcon
            icon={faFacebook}
            style={{fontSize: 15}}
          ></FontAwesomeIcon>
        </a>
        <a href="#" className="text-red-500">
          <p className="text-slate-400 inline mr-2 text-sm">Youtube page</p>
          <FontAwesomeIcon
            icon={faYoutube}
            style={{fontSize: 15}}
          ></FontAwesomeIcon>
        </a>
      </div>
    </div>
  )
}