import React, {useEffect, useState} from 'react'

import DashboardLayout from '../dashboard/layout';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import AdminHome from "./AdminHome";
import {useAuth} from "../useAuth";
import {getAuth} from "@firebase/auth";
import {doc, getDoc, getFirestore} from "firebase/firestore/lite";
import {userType} from "../constants";
import LoadingDots from "../components/LoadingDots";
import AdminApprovals from "./AdminApprovals";
import AdminApprovalDetails from "./AdminApprovalDetails";

const Admin = () => {
    let {path} = useRouteMatch();
    const {userData, setUserData} = useAuth()
    const [loading, setLoading] = useState(true)
    const [isValidRole, setIsValidRole] = useState(false)
    const auth = getAuth()
    const db = getFirestore()

    async function getAdminDetails() {
        try {
            const docRef = doc(db, "admins", auth.currentUser.uid)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData({role: userType.ADMIN, ...docSnap.data()})
                setIsValidRole(true)
                setLoading(false)
            } else {
                setUserData(null)
                setIsValidRole(false)
                setLoading(false)
            }
        } catch {
            console.log("Error getting admin's document from firestore")
        }
    }

    useEffect(() => {
        if (!userData) {
            getAdminDetails()
        } else {
            if (userData.role === userType.ADMIN) {
                setIsValidRole(true)
            }
            else {
                setIsValidRole(false)
            }
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
                <>NOT VALID ROLE</>
            }

        </DashboardLayout>

    )
}

export default Admin
