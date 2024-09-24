import { db } from './firebaseConfig.js';
import { collection, addDoc, getDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.x/firebase-firestore.js";
import { auth } from './firebaseConfig.js';

// Save player's high score

// const saveHighScore = async (score) => {
//   const user = auth.currentUser;
//   if (user) {
//     const scoreRef = doc(db, "players", user.uid);
//     try {
//       const docSnap = await getDoc(scoreRef);
//       if (docSnap.exists()) {
//         // Update if a higher score is achieved
//         if (docSnap.data().highScore < score) {
//           await updateDoc(scoreRef, { highScore: score });
//         }
//       } else {
//         // Create a new score document
//         await addDoc(collection(db, "players"), {
//           uid: user.uid,
//           highScore: score,
//         });
//       }
//     } catch (error) {
//       console.error('Error saving score:', error);
//     }
//   }
// };


export { saveHighScore };
