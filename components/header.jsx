import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link"
import { useState } from "react";
import { logout } from '../utils/firebaseClient'
import { useUserProfile } from '../utils/firebaseClient'

function NavLink({url, text}) {
  return <Link href={url}>
    <a className="text-white m-0.5 text-md mx-3 font-semibold">{text}</a>
  </Link>
}
function NavLinkBtn({ text, onClick }) {
  return <button onClick={onClick}>
    <a className="text-white m-0.5 text-md mx-3 font-semibold">{text}</a>
  </button>
}

export default function Header() {
  const profile = useUserProfile()
  const isLogin = profile??false;
  const isAdmin = profile?.admin;
  const [showMobileNav, setShowMobileNav] = useState(false)
  return (
    <div className="sticky top-0 z-20">
    <nav className="h-16 w-full bg-blue-500 flex flex-row items-center p-2">
      <h1 className="flex-auto text-white font-bold text-2xl"><Link href='/'>ONLINE TUTOR</Link></h1>
      <ul className="flex-none hidden flex-row md:flex">
        <li><NavLink url={'/'} text='Home'></NavLink></li>
        {
          isAdmin
          ?<li><NavLink url={'/users'} text='Users'></NavLink></li>
          :<li></li>
        }
        {
          isLogin
          ?<li><NavLink url={'/profile'} text='Profile'></NavLink></li>
          :<></>
        }
        {
          isLogin
          ?<li><NavLinkBtn onClick={logout} text='Logout'></NavLinkBtn></li>
          :<li><NavLink url={'/login'} text='Login'></NavLink></li>
        }
      </ul>
      <button onClick={(evt)=>setShowMobileNav(prev => !prev)} className="flex-none md:hidden"><FontAwesomeIcon icon={faBars} style={{fontSize: 30, color:'white'}}></FontAwesomeIcon></button>
    </nav>
    <div className="flex-none h-0 relative w-full z-20">
      <div className={showMobileNav?"max-h-screen w-full bg-blue-400 absolute top-0 flex flex-col md:hidden items-end overflow-clip transition-all py-4 rounded-b-xl":"max-h-0 w-full bg-blue-400 absolute top-0 flex flex-col md:hidden items-end overflow-hidden transition-all rounded-b-xl"}>
        <NavLink url={'/'} text='Home'></NavLink>
        {
          isAdmin
          ?<NavLink url={'/users'} text='Users'></NavLink>
          :<></>
        }
        {
          isLogin
          ?<NavLink url={'/profile'} text='Profile'></NavLink>
          :<></>
        }
        {
          isLogin
          ?<NavLinkBtn onClick={logout} text='Logout'></NavLinkBtn>
          :<NavLink url={'/login'} text='Login'></NavLink>
        }
      </div>
    </div>
    </div>
  )
}