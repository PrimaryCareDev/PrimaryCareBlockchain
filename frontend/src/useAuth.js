import React, {useState, useEffect, useContext, createContext} from "react";
import {initializeApp} from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    confirmPasswordReset
} from "firebase/auth";

import {getFirestore, doc, setDoc} from "firebase/firestore/lite";


// Add your Firebase credentials
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

initializeApp(firebaseConfig);

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};


// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function AuthProvider({children}) {

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);


    const auth = getAuth();
    const db = getFirestore();

    // Wrap any Firebase methods we want to use making sure ...
    // ... to save the user to state.
    const signin = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    };

    const doctorSignUp = async (email, password) => {

        return await createUserWithEmailAndPassword(auth, email, password)
            .then(async (value) => {

                const docRef = doc(db, "doctors", value.user.uid)
                await setDoc(docRef, {
                    email: value.user.email,
                    verified: false,
                    submittedForVerification: false
                });
                console.log("Document written with ID: ", docRef.id);

            })

    };

    const signout = () => {
        return signOut(auth)
    };

    const sendResetEmail = (email) => {
        return sendPasswordResetEmail(auth, email)
    };

    const confirmReset = (code, password) => {
        return confirmPasswordReset(auth, code, password)
    };

    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user)
            if (!user) {
                setUserData(null)
            }
            setLoading(false)

        });

        // Cleanup subscription on unmount
        return unsubscribe
    }, []);

    // Return the user object and auth methods
    const value = {
        user,
        setUser,
        userData,
        setUserData,
        signin,
        doctorSignUp,
        signout,
        sendPasswordResetEmail,
        confirmPasswordReset,
    };
    return (<AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>)
}