import React, {useState, useEffect} from 'react';
import SectionTitle from "../components/SectionTitle";
import {getAuth} from '@firebase/auth';
import {doc, getDoc, getFirestore} from "firebase/firestore/lite";
import LoadingDots from "../components/LoadingDots";
import {useAuth} from "../useAuth";

const AdminHome = () => {
    const auth = getAuth()
    const db = getFirestore()
    const { userData, setUserData } = useAuth()

    async function getAdminDetails() {
        try {
            const docRef = doc(db, "admin", auth.currentUser.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setUserData(docSnap.data())
                setLoading(false)
            }
        } catch {
            console.log("Error getting admin's document from firestore")
        }
    }

    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!userData) {
            getAdminDetails()
        }
        else {
            setLoading(false)
        }
    }, []);

    return (
        <>
            {loading ?
                <LoadingDots/>
                :
                <>
                    <SectionTitle>Welcome Admin {userData.email} </SectionTitle>
                </>
            }
        </>


    );
};

export default AdminHome;
