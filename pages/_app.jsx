import '../styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { UserContextWrapper } from '../utils/firebaseClient';
import { Cloudinary } from '../utils/cloudinary-ctx';
import { FirebaseProvider } from '../utils/firebaseClient';
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return (
    <FirebaseProvider>
      <UserContextWrapper>
        <Cloudinary>
          <Component {...pageProps} />
        </Cloudinary>
      </UserContextWrapper>
    </FirebaseProvider>
  )
}

export default MyApp
