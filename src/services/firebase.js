import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { key_area, key_guild, key_region, key_heroes, loadPlayerSave } from "../store/Stores.js"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getDoc, setDoc, doc, getFirestore } from "firebase/firestore";

let env = env_var;
env = env.env;

const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.PROJECT_ID,
    storageBucket: env.STORAGE_BUCKET,
    messagingSenderId: env.MESSAGING_SENDER_ID,
    appId: env.APP_ID,
    measurementId: env.MEASUREMENT_ID
};

console.log("App initialize firestore")
initializeApp(firebaseConfig);
getAnalytics(app);

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const auth = getAuth();
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logOut = () => signOut(auth);

export const db = getFirestore();

export const saveGame = async () => {
    try {
        let data = {
            "area": localStorage.getItem(key_area),
            "guild": localStorage.getItem(key_guild),
            "region": localStorage.getItem(key_region),
            "heroes": localStorage.getItem(key_heroes),
        }
        await setDoc(doc(db, "saves", auth.currentUser.uid), data)
    } catch (e) {
        console.error("Error while saving to firestore: ", e)
    }
}

export const loadGame = async () => {
    try {
        const playerSaveSnap = await getDoc(doc(db, "saves", auth.currentUser.uid))

        if (playerSaveSnap.exists()) {
            const playerSave = playerSaveSnap.data()
            loadPlayerSave(playerSave)
        } else {
            console.error("No such document found for user ", auth.currentUser.uid);
        }
    } catch (e) {
        console.error("Error while loading from firestore: ", e)
    }
}

console.log("App finish firebase file")