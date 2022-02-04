import React, {useEffect, useState} from 'react';
import DefaultAvatar from "../components/DefaultAvatar";
import {Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import {axiosInstance, formatDate} from "../constants";
import LoadingDots from "../components/LoadingDots";
import Button from "../components/Button";
import Badge from "../components/Badge";
import {DateTime} from "luxon";
import DoctorMemoForm from "./DoctorMemoForm";
import DoctorMemoTable from "../components/DoctorMemoTable";
import DoctorMemoView from "./DoctorMemoView";
import SectionTitle from "../components/SectionTitle";

const DoctorPatientView = () => {

    const [patient, setPatient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [hasAccess, setHasAccess] = useState(false)
    const {patientUid, memoId} = useParams()
    const {url} = useRouteMatch()
    const history = useHistory()


    async function getPatientDetails() {
        const res = await axiosInstance.get(`/doctor/viewPatientDetails?patientUid=${patientUid}`)
        setPatient(res.data)
        setHasAccess(res.data.hasAccess)
        setLoading(false)
    }

    function calculateAge() {
        const date = DateTime.fromISO(patient.birthDate)
        const diffInYears = DateTime.now().diff(date, "year")
        return (<>{Math.floor(diffInYears.as("years"))}</>)
    }

    function createMemo() {
        history.push(`${url}/createMemo`)
    }

    useEffect(() => {
        if (!patient) {
            getPatientDetails()
        }
    }, [memoId])

    return (
        <div>
            {
                loading ?
                    <LoadingDots/>
                    :
                    <>
                        <div className="flex items-center">
                            {patient.user.avatarImageUrl ?
                                <img src={patient.user.avatarImageUrl}
                                     className="rounded-full w-32 h-32 sm:w-48 sm:h-48"
                                     alt="Avatar"/>
                                :
                                <DefaultAvatar className="w-32 h-32 sm:w-48 sm:h-48"/>
                            }
                            <div className="ml-4">
                                <div className="sm:grid sm:grid-cols-3 gap-2 justify-items-start items-center">
                                    <dt className="text-gray-500 text-sm">First Name</dt>
                                    {patient.user.firstName === null || patient.user.firstName === "" ?
                                        <Badge className="sm:col-span-2" type="warning">not given</Badge>
                                        :
                                        <span className="sm:col-span-2">{patient.user.firstName}</span>
                                    }
                                    <dt className="text-gray-500 text-sm">Last Name</dt>
                                    {patient.user.lastName === null || patient.user.lastName === "" ?
                                        <Badge className="sm:col-span-2" type="warning">not given</Badge>
                                        :
                                        <span className="sm:col-span-2">{patient.user.lastName}</span>
                                    }
                                    <dt className="text-gray-500 text-sm">Age</dt>
                                    <span className="sm:col-span-2">{calculateAge()}</span>
                                    <dt className="text-gray-500 text-sm">Date of Birth</dt>
                                    <span className="sm:col-span-2">{formatDate(patient.birthDate)}</span>
                                    <dt className="text-gray-500 text-sm">E-mail</dt>
                                    <span className="sm:col-span-2">{patient.user.email}</span>
                                </div>
                            </div>

                        </div>
                        {hasAccess ?
                            <>

                                <div>
                                    <Button onClick={createMemo}>Create New Memo</Button>
                                </div>

                                <Switch>
                                    <Route exact path={`${url}`}>
                                        <SectionTitle>Viewing All Memos</SectionTitle>
                                        <DoctorMemoTable patientUid={patient.uid}/>
                                    </Route>
                                    <Route exact path={`${url}/createMemo`}>
                                        <DoctorMemoForm patientUid={patient.uid} onBack={() => history.push(url)}/>
                                    </Route>
                                    <Route exact path={`${url}/:memoId`}>
                                        <DoctorMemoView patientUid={patient.uid}/>
                                    </Route>
                                </Switch>
                            </>

                            :

                            <div className="bg-red-200 border-red-600 text-red-600 border-l-4 p-4" role="alert">
                                <p className="font-bold">
                                    No Access
                                </p>
                                <p>
                                    You do not have permissions to access this patient's data. Please request access first.
                                </p>
                            </div>
                        }


                    </>


            }
        </div>

    );
};

export default DoctorPatientView;