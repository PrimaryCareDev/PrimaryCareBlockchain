import React from 'react';
import SectionTitle from "../components/SectionTitle";
import PatientSearchDoctors from "../components/PatientSearchDoctors";
import {useAuth} from "../useAuth";
import {Link} from "react-router-dom";
import SubTitle from "../components/SubTitle";
import PatientVerificationForm from "./PatientVerificationForm";

const PatientHome = (props) => {
    const {userData} = useAuth()

    return (
        <div>
            <SectionTitle>Welcome to Healthlink {userData.firstName} {userData.lastName}</SectionTitle>


            {userData.verified ?
                <p>Your account is fully verified, please navigate using links in the side bar</p>
                :
                <>
                    <PatientVerificationForm onSubmitVerification={props.onSubmitVerification}/>
                </>}

            {userData.verified && userData.doctors.length === 0 &&
                <>
                    <SubTitle>Invite Doctors</SubTitle>
                    <p className="mb-3">You currently do not have any doctors managing your data. Add one by searching
                        for their <span
                            className="font-bold">name, email or medical practice</span> below</p>
                    <PatientSearchDoctors/>
                </>
            }


        </div>
    );
};

export default PatientHome;