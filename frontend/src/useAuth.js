import React, {createContext, useContext, useEffect, useState} from "react";
import {initializeApp} from 'firebase/app';
import {
    confirmPasswordReset, EmailAuthProvider,
    getAuth,
    onAuthStateChanged, reauthenticateWithCredential,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword
} from "firebase/auth";
import {publicAxiosInstance, userType} from "./constants";


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

    // Wrap any Firebase methods we want to use making sure ...
    // ... to save the user to state.
    const signin = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    };

    const registerAccount = async (email, password, userRole) => {


        let apiRegistrationPath = ""
        switch (userRole) {
            case userType.DOCTOR:
                apiRegistrationPath = "/createDoctor"
                break
            case userType.PATIENT:
                apiRegistrationPath = "/createPatient"
                break
            default:
                return
        }

        const res = await publicAxiosInstance.post(apiRegistrationPath, {email, password})
            .catch(async function (error) {
                console.log(error.response.data)
                if (!error.status) {
                    throw new Error(error.response.data)
                } else {
                    throw error
                }
            })

        await signin(email, password)

        return res
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

    async function updateUserPassword(currentPassword, newPassword) {
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        )

        const result = await reauthenticateWithCredential(
            auth.currentUser,
            credential
        )

        return await updatePassword(auth.currentUser, newPassword)
    }

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
        registerAccount,
        signout,
        sendPasswordResetEmail,
        confirmPasswordReset,
        updateUserPassword,
    };
    return (<AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>)
}