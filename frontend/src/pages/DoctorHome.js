import React from 'react';
import SectionTitle from "../components/SectionTitle";
import {useAuth} from "../useAuth";
import DoctorVerificationForm from "./DoctorVerificationForm";

const DoctorHome = () => {
    const {userData} = useAuth()

    return (
        <>
            <SectionTitle>Welcome Doctor {userData.email} </SectionTitle>
            {!userData.verified ? (
                <>
                <div className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4 mb-10"
                     role="alert">
                    <p className="font-bold">
                        Your account has not been verified
                    </p>
                    <p>
                        Please wait for an administrator to verify your account before you begin to use
                        Healthlink
                    </p>

                </div>
                <DoctorVerificationForm /></>) : <>VERIFIED</>}

        </>
    )
}

export default DoctorHome;
