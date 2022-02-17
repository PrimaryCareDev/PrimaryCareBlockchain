import React, {useState} from 'react';
import SectionTitle from "../components/SectionTitle";
import {useAuth} from "../useAuth";
import DoctorVerificationForm from "./DoctorVerificationForm";
import Button from "../components/Button";

const DoctorHome = (props) => {
    const {userData} = useAuth()
    const [showForm, setShowForm] = useState(false)

    return (
        <>
            {userData.firstName && userData.lastName ?
                <SectionTitle>Welcome to Healthlink Dr. {`${userData.firstName} ${userData.lastName}`}</SectionTitle>
                :
                <SectionTitle>Welcome to Healthlink</SectionTitle>
            }
            {userData.verified ?
                <p> Your account has been fully verified. Please navigate using the links in the sidebar.</p>
                :
                (
                    userData.submittedForVerification ?

                        <>
                            <div className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4 mb-10"
                                 role="alert">
                                <p className="font-bold">
                                    Your application has been received
                                </p>
                                <p>
                                    Please wait for a system administrator to review and verify your account.
                                </p>


                            </div>
                            {!showForm && <Button onClick={()=> setShowForm(true)}>Re-submit Verification Details</Button>}
                            <span className="block text-sm font-medium text-red-700 mt-2">NOTE: Re-submitting details will overwrite previous submission.</span>
                            {showForm && <DoctorVerificationForm onSubmitRegistration={props.onSubmitRegistration}/>}

                        </>
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
