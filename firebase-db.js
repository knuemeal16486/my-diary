import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// TODO: Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
let auth = null;
let currentUserUid = null;
let isOfflineMode = false;

window.firebaseInitPromise = (async () => {
  try {
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      throw new Error("Firebase config is not set. Running in offline/memory mode.");
    }

    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Sign in anonymously
    const userCredential = await signInAnonymously(auth);
    currentUserUid = userCredential.user.uid;
    console.log("Firebase initialized. User UID:", currentUserUid);
    
  } catch (error) {
    console.warn("Firebase initialization failed:", error.message);
    isOfflineMode = true;
  }
})();

window.fbLoadState = async () => {
  await window.firebaseInitPromise;
  if (isOfflineMode || !currentUserUid || !db) return null;

  try {
    const docRef = doc(db, "users", currentUserUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error loading state from Firebase:", e);
    return null;
  }
};

window.fbSaveState = async (appState) => {
  await window.firebaseInitPromise;
  if (isOfflineMode || !currentUserUid || !db) return;

  try {
    const docRef = doc(db, "users", currentUserUid);
    await setDoc(docRef, appState, { merge: true });
    console.log("State successfully synced to Firebase.");
  } catch (e) {
    console.error("Error saving state to Firebase:", e);
  }
};
