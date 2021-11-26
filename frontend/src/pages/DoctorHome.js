import React, {useState, useEffect} from 'react';
import SectionTitle from "../components/SectionTitle";
import {getAuth} from '@firebase/auth';
import {doc, getDoc, getFirestore} from "firebase/firestore/lite";
import LoadingDots from "../components/LoadingDots";

const DoctorHome = () => {
    const [info, setInfo] = useState([])
    const auth = getAuth()
    const db = getFirestore()


    async function getDoctorDetails() {
        try {
            const docRef = doc(db, "doctors", auth.currentUser.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setInfo(docSnap.data())
                setLoading(false)
            }
        } catch {
            console.log("Error getting doctor's document from firestore")
        }
    }

    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getDoctorDetails()
    }, []);

    return (
        <>
            {loading ?
                <LoadingDots/>
                :
                <>
                    <SectionTitle>Welcome Doctor {info.email} </SectionTitle>
                    {!info.verified ? (
                    <div className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4" role="alert">
                        <p className="font-bold">
                            Your account has not been verified
                        </p>
                        <p>
                            Please wait for an administrator to verify your account before you begin to use Healthlink
                        </p>
                    </div>) : null}
                </>
            }
        </>


    );
};

export default DoctorHome;
