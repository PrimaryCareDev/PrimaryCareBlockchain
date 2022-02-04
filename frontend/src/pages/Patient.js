import React, {useEffect, useState} from 'react';
import {Link, Route, Switch, useRouteMatch} from "react-router-dom";
import LoadingDots from "../components/LoadingDots";
import DashboardLayout from "../dashboard/layout";
import {useAuth} from "../useAuth";
import PatientHome from "./PatientHome";
import {axiosInstance, userType} from "../constants";
import PatientDoctorList from "./PatientDoctorList";
import PatientAccountSettings from "./PatientAccountSettings";
import PatientMemoList from "./PatientMemoList";
import PatientMemoView from "./PatientMemoView";

const Patient = () => {

    let {path} = useRouteMatch();
    const {userData, setUserData} = useAuth()
    const [loading, setLoading] = useState(true)
    const [isValidRole, setIsValidRole] = useState(false)

    async function getPatientData() {
        try {
            setLoading(true)
            const res = await axiosInstance.get("/getUserDetails")

            if (res.data.patient != null) {
                setUserData({
                    role: userType.PATIENT,
                    email: res.data.email,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    avatarImageUrl: res.data.avatarImageUrl,
                    ...res.data.patient
                })
                setIsValidRole(true)
            } else {
                setUserData(null)
                setIsValidRole(false)
            }
            setLoading(false)

        } catch (e) {
            console.log(e.message)
            setUserData(null)
            setIsValidRole(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!userData) {
            getPatientData()
        } else {
            setIsValidRole(userData.role === userType.PATIENT)
            setLoading(false)
        }
    }, []);


    return (
        <DashboardLayout isValidRole={isValidRole}>
            {loading
                ?
                <LoadingDots/>
                :
                isValidRole
                    ?
                    <Switch>
                        <Route path={`${path}`} exact={true}>
                            <PatientHome onSubmitVerification={getPatientData}/>
                        </Route>
                        <Route path={`${path}/doctorList`}>
                            <PatientDoctorList/>
                        </Route>
                        <Route path={`${path}/accountSettings`}>
                            <PatientAccountSettings/>
                        </Route>
                        <Route exact path={`${path}/memos`}>
                            <PatientMemoList/>
                        </Route>
                        <Route exact path={`${path}/memos/:memoId`}>
                            <PatientMemoView />
                        </Route>
                    </Switch>
                    :
                    <>Your account does not have Patient privileges. Are you perhaps trying to login as a <Link
                        to="/doctor" className="text-indigo-600">Doctor</Link>?</>
            }

        </DashboardLayout>
    );
};

export default Patient;
