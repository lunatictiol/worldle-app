import { initializeApp } from 'firebase/app';
import{getFirestore} from'firebase/firestore'
// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.AAPIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId:process.env.MESSAGINGSENDID ,
  appId: process.env.APPID,

};

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app)