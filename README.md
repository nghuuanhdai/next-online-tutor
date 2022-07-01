<h1 align="center">
    Online Tutor
</h1>
<p align="center">
  <img width="200" src="https://user-images.githubusercontent.com/24937352/175797809-493b719c-e306-43f2-a012-8756c5169bae.png" alt="Online tutor logo">
  <br/>
  <h4 align="center">A web application made with Nextjs, mongoose, firebase auth, and some other 3rd party services for online course management.</h4>
</p>

## Demo
### Live demo: https://nnhhaadd-online-tutor.herokuapp.com/
Demo credential
  - **User account:** email: user@demo.com, password: i0sX3W$neb;P=xZn4(uB  
  - **Lecturer account:** email: admin@demo.com, password: yj8#eS2W(-XJ0*naw9}k  

*These are dummy emails since this application doesn't provide email verification*

### Deploy it yourself
  - **Clone this repo:** `git clone git@github.com:nghuuanhdai/online_tutor_ejs.git`
  - **Setup environment variable:** This application uses Firebase, MongoAtlas, VimeoSDK, and Cloudinary. To deploy the application yourself, make sure to populate all the environment variables in the following table.


| Key | Value |
|---|---|
| NEXT_PUBLIC_FB_API_KEY          | Firebase public API key |
| NEXT_PUBLIC_DB_AUTH_DOMAIN      | Firebase auth domain |
| NEXT_PUBLIC_PROJECT_ID          | Firebase project id |
| NEXT_PUBLIC_STORAGE_BUCKET      | Firebase Storage bucket |
| NEXT_PUBLIC_MESSAGING_SENDER_ID | Firebase Messaging sender id |
| NEXT_PUBLIC_APP_ID              | Firebase Public App id |
| FB_ADMIN_TYPE                   | Firebase admin type: service_account |
| FB_ADMIN_PROJECT_ID             | Firebase admin project id |
| FB_ADMIN_PRIVATE_KEY_ID         | Firebase admin private key id |
| FB_ADMIN_PRIVATE_KEY            | Firebase private id with new line escaped as \n |
| FB_ADMIN_CLIENT_EMAIL           | Firebase client email |
| FB_ADMIN_CLIENT_ID              | Firebase admin client id |
| FB_ADMIN_AUTH_URI               | Firebase admin auth uri|
| FB_ADMIN_TOKEN_URI              | Firebase admin token uri |
| FB_ADMIN_AUTH_PROVIDER_X509_CERT_URL| Firebase admin auth provider url |
| FB_ADMIN_CLIENT_X509_CERT_URL   | Firebase admin cert url |
| FIREBASE_DATABASE_URL       | Firebase realtime database URL |
| MONGODB_URI                 | MongoDB connection URI |
| VIMEO_CLI_ID                | Vimeo client id |
| VIMEO_CLI_SECR              | Vimeo client secret |
| VIMEO_ACC_TOKEN             | Vimeo account token |
| CLOUDINARY_CLOUD_NAME       | Cloudinary cloud name |
| CLOUDINARY_UPLOAD_PRESET    | Cloudinayr upload preset. Make sure this preset is unsigned otherwise we can't upload the image to Cloudinary |

  - **Start the server with**  `npm run start` 
  - **Create Lecturer account:** a *lecturer account* or *admin account* is the same as a *normal/student account*, except for a additional property **admin** set to **true**. You can find these documents in the profiles collection. **Notice:** you should create your account first before making it an *admin account* otherwise this collection may not exist.  
       ![image](https://user-images.githubusercontent.com/24937352/175797774-1f25a4c8-6c82-4f10-a7e4-2c6f38f76cdd.png)
       
## Features
### Account authentication/authorization
This application uses Firebase Authentication service to provide login, register, and password reset via email.  
**Notice!** Because of the default email namespace provided by Firebase. Reset password email may end up in your spam emails.

### Student access
*Student account* is the default account when a user register to the website.
|Feature|Preview|
|---|---|
|By default users can only review existing courses but can not see the lectures.<br>The only way to gain access to a course is to get in contact with an admin and request it.|*All existing courses on the home page*<br>![image](https://user-images.githubusercontent.com/24937352/176819870-b1051fb2-f86c-41b2-871e-4f7d058ac17a.png)<br>*Course detail page with description and lecture list*<br>![image]![image](https://user-images.githubusercontent.com/24937352/176820283-2d3dc654-eaf5-431c-b3b9-25898c48d0a4.png)<br>*User without access to a course will see the lecture links to be grayed out*<br>![image](https://user-images.githubusercontent.com/24937352/176820405-b3f9cf24-d3eb-41bd-9490-0ef08cc63108.png)|
| Users with access to a course could start seeing the lecture content, and milestone list so they could track their progression.|*Lecture page with lecture video*<br>![image](https://user-images.githubusercontent.com/24937352/176820695-3009ad6d-88fa-4972-b67c-226789f86020.png)|

### Lecturer courses management
Users with *Lecturer account* will have some additional sections available to them.
|Feature|Preview|
|---|---|
|**Home Page**<br>New/Delete course, Update course's title/thumbnail|![image](https://user-images.githubusercontent.com/24937352/176820863-06ee49cc-3cd5-4a65-816f-32c79d5333d2.png)|
|**Course Detail Page**<br>Update course overview content with a rich text editor (*Quilljs*)|![image](https://user-images.githubusercontent.com/24937352/176820979-3fe791fe-7036-4784-883e-ec56ac38ed78.png)|
|**Course Detail Page**<br>Update thumbnail with cloudinary|![image](https://user-images.githubusercontent.com/24937352/176821028-2ea4af2f-818c-42a8-9953-cf2d8c38593f.png)|
|**Course Detail Page**<br>New/Detele lecture, Udpate lecture's title|![image](https://user-images.githubusercontent.com/24937352/176821144-99962842-6bb3-4302-a2a4-6f450fbfd704.png)|
|**Lecture Detail Page**<br>Update lecture description with a rich text editor (*Quilljs*)|![image](https://user-images.githubusercontent.com/24937352/176821194-183ef773-9add-4785-9766-c597ab2155d0.png)|
|**Lecture Detail Page**<br>Upload video to Vimeo|![image](https://user-images.githubusercontent.com/24937352/176821321-d16adc54-eaba-4af4-b0ca-5120c24263f8.png)|
|**Users Page**<br>Create new account for student|![image](https://user-images.githubusercontent.com/24937352/176821375-5aeb5e87-1efd-4442-9a02-4f69f8642b25.png)|
|**User Detail Page**.<br>Access by using the edit user form in Users Page<br>Edit student's available courses|*find user by email*<br>![image](https://user-images.githubusercontent.com/24937352/176821503-b8a1fe90-c0fe-4435-96ba-05bbb62685bc.png)<br>*edit user courses and admin status*<br>![image](https://user-images.githubusercontent.com/24937352/176821581-2cfe587e-fa7b-48cc-b943-0fbf137343ec.png)|

### Responsive design with bootstrap
| Desktop | Tablet | Mobile |
|---|---|---|
|![image](https://user-images.githubusercontent.com/24937352/176821627-b1aad43f-ded4-4a91-9d3e-690cefae07bd.png)|![image](https://user-images.githubusercontent.com/24937352/176821699-bab8b98a-1135-44a3-b5fa-0807d94a639b.png)|![image](https://user-images.githubusercontent.com/24937352/176821728-317827d4-3a10-4b7d-a660-4d7ab7f87458.png)|
