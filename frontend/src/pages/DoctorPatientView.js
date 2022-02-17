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
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

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
                        <div className="grid grid-cols-3 max-w-6xl">
                            <div className="flex items-center col-span-3 sm:col-span-2">
                                <div className="flex-none">
                                    {patient.user.avatarImageUrl ?
                                        <img src={patient.user.avatarImageUrl}
                                             className="rounded-full w-28 h-28 md:w-44 md:h-44"
                                             alt="Avatar"/>
                                        :
                                        <DefaultAvatar className="w-28 h-28 md:w-44 md:h-44"/>
                                    }
                                </div>
                                <div
                                    className="sm:grid sm:grid-cols-4 gap-y-2 gap-x-3 justify-items-start items-center max-w-full ml-4">
                                    <dt className="text-gray-500 text-sm">First Name</dt>
                                    {patient.user.firstName === null || patient.user.firstName === "" ?
                                        <Badge className="sm:col-span-3" type="warning">not given</Badge>
                                        :
                                        <span className="sm:col-span-3">{patient.user.firstName}</span>
                                    }
                                    <dt className="text-gray-500 text-sm">Last Name</dt>
                                    {patient.user.lastName === null || patient.user.lastName === "" ?
                                        <Badge className="sm:col-span-3" type="warning">not given</Badge>
                                        :
                                        <span className="sm:col-span-3">{patient.user.lastName}</span>
                                    }
                                    <dt className="text-gray-500 text-sm">Age</dt>
                                    <span className="sm:col-span-3">{calculateAge()}</span>
                                    <dt className="text-gray-500 text-sm">Date of Birth</dt>
                                    <span className="sm:col-span-3">{formatDate(patient.birthDate)}</span>
                                    <dt className="text-gray-500 text-sm">E-mail</dt>
                                    <p className="sm:col-span-3 break-all">{patient.user.email}</p>
                                </div>

                            </div>
                            {hasAccess &&
                                <div className="col-span-3 sm:col-span-1 flex items-center justify-center py-3">
                                    <Button className="w-full sm:w-auto" onClick={createMemo}>Create New Memo</Button>
                                </div>
                            }
                        </div>
                        {hasAccess ?
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

                            :

                            <div className="bg-red-200 border-red-600 text-red-600 border-l-4 p-4 mt-3" role="alert">
                                <p className="font-bold">
                                    No Access
                                </p>
                                <p>
                                    You do not have permissions to access this patient's data. Please request access
                                    first.
                                </p>
                            </div>
                        }


                    </>


            }
        </div>

    );
};

export default DoctorPatientView;