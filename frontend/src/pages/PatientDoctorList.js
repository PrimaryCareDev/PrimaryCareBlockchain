import React, {useEffect, useState} from 'react';
import SectionTitle from "../components/SectionTitle";
import {axiosInstance, requestStatus, userType} from "../constants";
import PatientDoctorTable from "../components/PatientDoctorTable";
import LoadingDots from "../components/LoadingDots";
import PatientSearchDoctors from "../components/PatientSearchDoctors";

const PatientDoctorList = () => {

    const [loading, setLoading] = useState(true)
    const [pendingDoctorTable, setPendingDoctorTable] = useState()
    const [confirmedTable, setConfirmedTable] = useState()
    const [pendingSelfTable, setPendingSelfTable] = useState()


    async function getAllDoctors() {
        setLoading(true)
        const res = await axiosInstance.get(`/patient/getAllDoctorRelationships`)
        const allDoctors = res.data
        const confirmedDoctors = allDoctors.filter(function (item) {
            return item.patients[0].status === requestStatus.ACCEPTED
        })

        const pendingSelf = allDoctors.filter(function (item) {
            return item.patients[0].status === requestStatus.REQUESTED && item.patients[0].requester === userType.DOCTOR
        })

        const pendingDoctor = allDoctors.filter(function (item) {
            return item.patients[0].status === requestStatus.REQUESTED && item.patients[0].requester === userType.PATIENT
        })

        setConfirmedTable(confirmedDoctors)
        setPendingDoctorTable(pendingDoctor)
        setPendingSelfTable(pendingSelf)
        setLoading(false)
    }


    useEffect(() => {
        async function getData() {
            await getAllDoctors()
        }

        getData()
    }, [])

    return (
        <div>
            {loading ? <LoadingDots/>
                :
                <>
                    <SectionTitle>Add New Doctor</SectionTitle>
                    <p className="mb-3">Add a doctor by entering their <span
                        className="font-bold">name, email or medical practice</span> below.</p>
                    <PatientSearchDoctors/>
                    {confirmedTable.length > 0 &&
                        <>
                            <SectionTitle>Your Doctors</SectionTitle>
                            <PatientDoctorTable dataTable={confirmedTable} onRefresh={getAllDoctors}/>
                        </>
                    }
                    {pendingSelfTable.length > 0 &&
                        <>
                            <SectionTitle>Pending Requests from Doctors</SectionTitle>
                            <PatientDoctorTable dataTable={pendingSelfTable} onRefresh={getAllDoctors}/>
                        </>
                    }
                    {pendingDoctorTable.length > 0 &&
                        <>
                            <SectionTitle>Your Invitations to Doctors</SectionTitle>
                            <p className="mb-3">You have sent an invitation to these doctors and are awaiting their
                                approval.</p>
                            <PatientDoctorTable dataTable={pendingDoctorTable} onRefresh={getAllDoctors}/>
                        </>
                    }
                </>
            }
        </div>
    );
};

export default PatientDoctorList;