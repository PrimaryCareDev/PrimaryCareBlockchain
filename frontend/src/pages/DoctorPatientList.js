import React from 'react';
import DoctorMainPatientTable from "../components/DoctorMainPatientTable";
import SectionTitle from "../components/SectionTitle";
import {useAuth} from "../useAuth";

const DoctorPatientList = () => {
    const {userData} = useAuth()

    return (
        <>
            {userData.verified ?
                <>
                <SectionTitle>Your Patients</SectionTitle>
                <DoctorMainPatientTable/>
                    </>
                :
                <p>None</p>
            }
        </>

    );
};

export default DoctorPatientList;
