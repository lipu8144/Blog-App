// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5pSWOl_7PF6fy7wUlPUWahkhWG3aoMTc",
  authDomain: "react-blog-website-yt.firebaseapp.com",
  projectId: "react-blog-website-yt",
  storageBucket: "react-blog-website-yt.appspot.com",
  messagingSenderId: "128186344230",
  appId: "1:128186344230:web:cb673a117d4cdad50397e7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () =>{
    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    })
    .catch((err) => {
        console.log(err);
    })

    return user;
}