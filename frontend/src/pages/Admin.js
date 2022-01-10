import React, {useEffect, useState} from 'react'

import DashboardLayout from '../dashboard/layout';
import {Link, Route, Switch, useRouteMatch} from "react-router-dom";
import AdminHome from "./AdminHome";
import {useAuth} from "../useAuth";
import {axiosInstance, userType} from "../constants";
import LoadingDots from "../components/LoadingDots";
import AdminApprovals from "./AdminApprovals";
import AdminApprovalDetails from "./AdminApprovalDetails";

const Admin = () => {
    let {path} = useRouteMatch();
    const {userData, setUserData} = useAuth()
    const [loading, setLoading] = useState(true)
    const [isValidRole, setIsValidRole] = useState(false)

    async function getAdminDetails() {
        try {
            const res = await axiosInstance.get("/getUserDetails")

            const validRole = res.data.userRoles.filter(function (item) {
                return item.role === userType.ADMIN
            })

            if (validRole.length > 0) {
                setUserData({
                    role: userType.ADMIN,
                    email: res.data.email,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    avatarImageUrl: res.data.avatarImageUrl
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
            getAdminDetails()
        } else {
            setIsValidRole(userData.role === userType.ADMIN)
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
                            <AdminHome/>
                        </Route>
                        <Route exact path={`${path}/pending`}>
                            <AdminApprovals/>
                        </Route>
                        <Route exact path={`${path}/pending/details`}>
                            <AdminApprovalDetails/>
                        </Route>
                    </Switch>
                    :
                    <>Your account does not have Administrator privileges. Please try to login as a <Link to="/doctor"
                                                                                                          className="text-indigo-600">Doctor</Link> or <Link
                        to="/patient" className="text-indigo-600">Patient</Link> instead.</>
            }

        </DashboardLayout>

    )
}

export default Admin
