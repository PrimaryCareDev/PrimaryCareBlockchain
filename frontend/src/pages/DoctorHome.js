import React, {useState, useEffect} from 'react';
import SectionTitle from "../components/SectionTitle";
import {getAuth} from '@firebase/auth';
import {doc, getDoc, getFirestore} from "firebase/firestore/lite";
import LoadingDots from "../components/LoadingDots";
import {useAuth} from "../useAuth";

const DoctorHome = () => {
    const auth = getAuth()
    const db = getFirestore()
    const {userData, setUserData} = useAuth()
    const [loading, setLoading] = useState(true)
    const [isValidRole, setIsValidRole] = useState(false)


    async function getDoctorDetails() {
        try {
            const docRef = doc(db, "doctors", auth.currentUser.uid)
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
            console.log("Error getting doctor's document from firestore")
        }
    }

    useEffect(() => {
        if (!userData) {
            getDoctorDetails()
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
                        <SectionTitle>Welcome Doctor {userData.email} </SectionTitle>
                        {!userData.verified ? (
                            <div className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4"
                                 role="alert">
                                <p className="font-bold">
                                    Your account has not been verified
                                </p>
                                <p>
                                    Please wait for an administrator to verify your account before you begin to use
                                    Healthlink
                                </p>
                            </div>) : null}
                    </>
                    : <>NOT VALID ROLE</>
                ]
            }
        </>


    );
};

export default DoctorHome;
