// login.js

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Function to handle new user sign-up
export const signUpUser = async (email, password, displayName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Set user's display name
        await updateProfile(user, { displayName: displayName });

        // Save user data in Firestore
        await setDoc(doc(db, "players", user.uid), {
            name: displayName,
            highScore: 0
        });

        console.log('User signed up and data saved in Firestore:', user);
        // Redirect to dashboard or another page
        window.location.href = "home.html";
    } catch (error) {
        console.error('Error signing up:', error.message);
        alert(`Sign up failed: ${error.message}`);
    }
};

// Function to handle Google sign-in
export const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Save user data in Firestore (merge: true to avoid overwriting)
        await setDoc(doc(db, "players", user.uid), {
            name: user.displayName,
            highScore: 0
        }, { merge: true });

        console.log('User signed in with Google:', user);
        // Redirect to dashboard or another page
        window.location.href = "home.html";
    } catch (error) {
        console.error('Error with Google sign-in:', error.message);
        alert(`Google sign-in failed: ${error.message}`);
    }
};

// Function to handle login
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Login successful:', user);

        // Redirect to dashboard or another page
        window.location.href = "home.html";
    } catch (error) {
        console.error('Error logging in:', error.message);
        alert(`Login failed: ${error.message}`);
    }
};
