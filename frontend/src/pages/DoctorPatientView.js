import React, {useEffect, useState} from 'react';
import DefaultAvatar from "../components/DefaultAvatar";
import {useParams} from "react-router-dom";
import {axiosInstance} from "../constants";
import LoadingDots from "../components/LoadingDots";
import Button from "../components/Button";
import Badge from "../components/Badge";

const DoctorPatientView = () => {

    const [patient, setPatient] = useState()
    const [loading, setLoading] = useState(true)
    const {id} = useParams()

    async function getPatientDetails() {
        const res = await axiosInstance.get(`/doctor/viewPatientDetails?patientUid=${id}`)
        setPatient(res.data)
        setLoading(false)

    }

    useEffect(() => {
        getPatientDetails()
    }, [])

    return (
        <>
            {
                loading ?
                    <LoadingDots/>
                    :
                    <div>
                        <div className="flex items-center">
                            {patient.user.avatarImageUrl ?
                                <img src={patient.user.avatarImageUrl} className="rounded-full w-52 h-52"
                                     alt="Avatar"/>
                                :
                                <DefaultAvatar className="w-48 h-48"/>
                            }
                            <div className="ml-4 space-y-2">
                                {(!patient.user.firstName && !patient.user.lastName) ?
                                    <Badge type="warning">no name</Badge>
                                    :
                                    <div
                                        className="font-semibold text-lg">{`${patient.user.firstName} ${patient.user.lastName}`}</div>
                                }
                                <div>{patient.user.email}</div>
                                {/*<p>{patient.hasAccess.toString()}</p>*/}
                            </div>

                        </div>

                        <div>
                            <Button>Create New Memo</Button>
                        </div>
                    </div>


            }
        </>

    );
};

export default DoctorPatientView;