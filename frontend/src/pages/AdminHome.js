import React, {useState, useEffect} from 'react';
import SectionTitle from "../components/SectionTitle";
import {getAuth} from '@firebase/auth';
import {doc, getDoc, getFirestore} from "firebase/firestore/lite";
import LoadingDots from "../components/LoadingDots";
import {useAuth} from "../useAuth";

const AdminHome = () => {
    const auth = getAuth()
    const db = getFirestore()
    const {userData, setUserData} = useAuth()
    const [isValidRole, setIsValidRole] = useState(false)
    const [loading, setLoading] = useState(true)

    async function getAdminDetails() {
        try {
            const docRef = doc(db, "admins", auth.currentUser.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setUserData(docSnap.data())
                setIsValidRole(true)
                setLoading(false)
            } else {
                setUserData(null)
                setIsValidRole(false)
                setLoading(false)
            }
        } catch {
            console.log("Error getting admin's document from firestore")
        }
    }

    useEffect(() => {
        if (!userData) {
            getAdminDetails()
        } else {
            setLoading(false)
        }
    }, []);

    return (
        <>
            {loading ?
                <LoadingDots/>
                :
                [isValidRole ?
                    <>
                        <SectionTitle>Welcome Admin {userData.email} </SectionTitle>
                    </>
                    : <>NOT VALID ROLE</>
                ]

            }
        </>


    );
};

export default AdminHome;
