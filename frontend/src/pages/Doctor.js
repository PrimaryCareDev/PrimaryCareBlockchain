import React, {useEffect, useState} from 'react'

import DashboardLayout from '../dashboard/layout';
import DoctorHome from "./DoctorHome";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import DoctorPatientList from "./DoctorPatientList";
import {useAuth} from "../useAuth";
import {doc, getDoc, getFirestore} from "firebase/firestore/lite";
import {userType} from "../constants";
import {getAuth} from "firebase/auth";
import LoadingDots from "../components/LoadingDots";

const Doctor = () => {
    let {path} = useRouteMatch();
    const {userData, setUserData} = useAuth()
    const [loading, setLoading] = useState(true)
    const [isValidRole, setIsValidRole] = useState(false)
    const auth = getAuth()
    const db = getFirestore()

    async function getDoctorDetails() {
        try {
            const docRef = doc(db, "doctors", auth.currentUser.uid)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData({role: userType.DOCTOR, ...docSnap.data()})
                setIsValidRole(true)
                setLoading(false)
            } else {
                setUserData(null)
                setIsValidRole(false)
                setLoading(false)
            }
        } catch {
            console.log("Error getting doctor's document from firestore")
        }
    }

    useEffect(() => {
        if (!userData) {
            getDoctorDetails()
        } else {
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
                        <DoctorHome onSubmitRegistration={getDoctorDetails}/>
                    </Route>
                    <Route path={`${path}/patients`}>
                        <DoctorPatientList/>
                    </Route>
                </Switch>
                :
                <>NOT VALID ROLE</>
            }

        </DashboardLayout>

    )
}

export default Doctor
