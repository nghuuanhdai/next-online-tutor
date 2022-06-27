import '../styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { UserContextWrapper } from '../utils/firebaseClient';
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return (
    <UserContextWrapper>
      <Component {...pageProps} />    
    </UserContextWrapper>
  )
}

export default MyApp
