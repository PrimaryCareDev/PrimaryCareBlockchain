import React from 'react';
import SectionTitle from "../components/SectionTitle";
import {useAuth} from "../useAuth";
import DoctorVerificationForm from "./DoctorVerificationForm";

const DoctorHome = (props) => {
    const {userData} = useAuth()

    return (
        <>
            <SectionTitle>Welcome to Healthlink</SectionTitle>
            {userData.verified ?
                <>VERIFIED</>
                :
                (
                    userData.submittedForVerification ?
                        <div className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4"
                             role="alert">
                            <p className="font-bold">
                                Your application has been received
                            </p>
                            <p>
                                Please wait for a system administrator to review and verify your account.
                            </p>

                        </div>
                        :
                        <>
                            <div className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4 mb-10"
                                 role="alert">
                                <p className="font-bold">
                                    Please fill in the form below.
                                </p>
                                <p>
                                    You will receive full access to Healthlink after a system administrator approves
                                    your application.

                                </p>

                            </div>
                            <DoctorVerificationForm onSubmitRegistration={props.onSubmitRegistration}/>
                        </>
                )
            }

        </>
    )
}

export default DoctorHome;
