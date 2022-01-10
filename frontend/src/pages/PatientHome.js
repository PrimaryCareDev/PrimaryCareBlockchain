import React from 'react';
import SectionTitle from "../components/SectionTitle";
import PatientSearchDoctors from "../components/PatientSearchDoctors";
import {useAuth} from "../useAuth";
import {Link} from "react-router-dom";
import SubTitle from "../components/SubTitle";

const PatientHome = () => {
    const {userData} = useAuth()

    return (
        <div>
            {userData.firstName && userData.lastName ?
                <SectionTitle>Welcome to Healthlink {`${userData.firstName} ${userData.lastName}`}</SectionTitle>

                :
                <>
                    <SectionTitle>Welcome to Healthlink</SectionTitle>

                    <div className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4 mb-10"
                         role="alert">
                        <p className="font-bold">
                            You have not provided your name
                        </p>
                        <p>
                            You are strongly recommended to enter your name in <Link
                            to="/patient/accountSettings" className="font-bold">Account Settings</Link> so that doctors
                            can better identify you
                        </p>
                    </div>
                </>}

            {userData.doctors.length === 0 &&
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