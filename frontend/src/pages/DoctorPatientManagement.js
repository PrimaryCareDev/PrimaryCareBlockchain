import React, {useEffect, useState} from 'react';
import {axiosInstance, requestStatus, userType} from "../constants";
import LoadingDots from "../components/LoadingDots";
import SectionTitle from "../components/SectionTitle";
import DoctorManagePatientsTable from "../components/DoctorManagePatientsTable";
import DoctorSearchPatients from "../components/DoctorSearchPatients";

const DoctorPatientManagement = () => {
    const [loading, setLoading] = useState(true)
    const [pendingPatientTable, setPendingPatientTable] = useState()
    const [confirmedTable, setConfirmedTable] = useState()
    const [pendingSelfTable, setPendingSelfTable] = useState()

    async function getAllPatients() {
        setLoading(true)
        const res = await axiosInstance.get(`/doctor/getPatientRelationships`)
        const allPatients = res.data
        const confirmedPatients = allPatients.filter(function (item) {
            return item.doctors[0].status === requestStatus.ACCEPTED
        })

        const pendingSelf = allPatients.filter(function (item) {
            return item.doctors[0].status === requestStatus.REQUESTED && item.doctors[0].requester === userType.PATIENT
        })

        const pendingPatient = allPatients.filter(function (item) {
            return item.doctors[0].status === requestStatus.REQUESTED && item.doctors[0].requester === userType.DOCTOR
        })

        setConfirmedTable(confirmedPatients)
        setPendingPatientTable(pendingPatient)
        setPendingSelfTable(pendingSelf)
        setLoading(false)


    }


    useEffect(() => {
        getAllPatients()
    }, [])
    return (
        <div>
            {loading ? <LoadingDots/>
                :
                <>
                    <SectionTitle>Add New Patient</SectionTitle>
                    <p className="mb-3">Add a patient by entering their email address below.</p>
                    <DoctorSearchPatients/>

                    {confirmedTable.length > 0 &&
                        <>
                            <SectionTitle>Your Patients</SectionTitle>
                            <DoctorManagePatientsTable dataTable={confirmedTable} onRefresh={getAllPatients}/>
                        </>
                    }

                    {pendingSelfTable.length > 0 &&
                        <>
                            <SectionTitle>Pending Requests from Patients</SectionTitle>
                            <DoctorManagePatientsTable dataTable={pendingSelfTable} onRefresh={getAllPatients}/>
                        </>
                    }
                    {pendingPatientTable.length > 0 &&
                        <>
                            <SectionTitle>Your Requests to Patients</SectionTitle>
                            <p className="mb-3">You have sent a request to these patients and are awaiting their
                                approval before you can access their data.</p>
                            <DoctorManagePatientsTable dataTable={pendingPatientTable} onRefresh={getAllPatients}/>
                        </>
                    }
                </>
            }
        </div>
    );
};

export default DoctorPatientManagement;