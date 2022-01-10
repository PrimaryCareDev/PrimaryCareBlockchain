import React from 'react';
import DoctorMainPatientTable from "../components/DoctorMainPatientTable";
import SectionTitle from "../components/SectionTitle";

const DoctorPatientList = () => {
    return (
        <>
            {/*<TablePage />*/}
            <SectionTitle> Your Patients</SectionTitle>
            <DoctorMainPatientTable/>
        </>

    );
};

export default DoctorPatientList;
