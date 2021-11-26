import React from 'react'

import DashboardLayout from '../dashboard/layout';
import DoctorHome from "./DoctorHome";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import DoctorPatientList from "./DoctorPatientList";

const Doctor = () => {
    let { path } = useRouteMatch();

    return (
        <DashboardLayout>
                <Switch>
                    <Route path={`${path}`} exact={true}>
                        <DoctorHome/>
                    </Route>
                    <Route path={`${path}/patients`}>
                        <DoctorPatientList/>
                    </Route>
                </Switch>
        </DashboardLayout>

    )
}

export default Doctor
