import React, {useEffect, useState} from 'react'
import DashboardLayout from '../dashboard/layout';
import DoctorHome from "./DoctorHome";
import {Link, Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import DoctorPatientList from "./DoctorPatientList";
import {useAuth} from "../useAuth";
import {axiosInstance, userType} from "../constants";
import LoadingDots from "../components/LoadingDots";
import DoctorPatientManagement from "./DoctorPatientManagement";
import DoctorAccountSettings from "./DoctorAccountSettings";
import DoctorPatientView from "./DoctorPatientView";
import DoctorUnverifiedError from "./DoctorUnverifiedError";

const Doctor = () => {
    let {url} = useRouteMatch();
    const {userData, setUserData} = useAuth()
    const [loading, setLoading] = useState(true)
    const [isValidRole, setIsValidRole] = useState(false)

    async function getDoctorDetails() {
        try {
            setLoading(true)
            const res = await axiosInstance.get("/getUserDetails")

            if (res.data.doctor != null) {
                setUserData({
                    role: userType.DOCTOR,
                    email: res.data.email,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    avatarImageUrl: res.data.avatarImageUrl,
                    ...res.data.doctor
                })
                setIsValidRole(true)
            } else {
                setUserData(null)
                setIsValidRole(false)
            }
            setLoading(false)

        } catch (e) {
            console.log(e)
            setUserData(null)
            setIsValidRole(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!userData) {
            getDoctorDetails()
        } else {
            setIsValidRole(userData.role === userType.DOCTOR)
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
                        <Route path={`${url}`} exact={true}>
                            <DoctorHome onSubmitRegistration={getDoctorDetails}/>
                        </Route>
                        <VerifiedRoute exact path={`${url}/patients`} redirectTo={`${url}/unverified`}>
                            <DoctorPatientList/>
                        </VerifiedRoute>
                        <VerifiedRoute path={`${url}/patients/:patientUid`} redirectTo={`${url}/unverified`}>
                            <DoctorPatientView/>
                        </VerifiedRoute>
                        <VerifiedRoute path={`${url}/managePatients`} redirectTo={`${url}/unverified`}>
                            <DoctorPatientManagement/>
                        </VerifiedRoute>
                        <Route path={`${url}/accountSettings`}>
                            <DoctorAccountSettings/>
                        </Route>
                        <Route path={`${url}/unverified`}>
                            <DoctorUnverifiedError/>
                        </Route>
                    </Switch>
                    :
                    <>Your account does not have Doctor privileges. Are you perhaps trying to login as a <Link
                        to="/patient" className="text-indigo-600">Patient</Link>?</>
            }

        </DashboardLayout>

    )
}

function VerifiedRoute({ redirectTo, children, ...rest }) {
    let { userData } = useAuth();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                userData.verified ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: redirectTo,
                            state: { from: location }
                        }}
                    />
                )

            }
        />
    );
}

export default Doctor
