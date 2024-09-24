 
  // Import the functions you need from the SDKs you need
// Import Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

// Import Firebase Authentication (getAuth)
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Import Firebase Firestore (getFirestore)
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDQszGTi8lcuay8QOA48q65U8LzVT54s_0",
    authDomain: "rps-game-ef8ba.firebaseapp.com",
    projectId: "rps-game-ef8ba",
    storageBucket: "rps-game-ef8ba.appspot.com",
    messagingSenderId: "55691251095",
    appId: "1:55691251095:web:5bcd66d332bbf6781d48d2"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
 
  