import React from 'react'

import DashboardLayout from '../dashboard/layout';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import AdminHome from "./AdminHome";

const Admin = () => {
    let { path } = useRouteMatch();

    return (
        <DashboardLayout>
                <Switch>
                    <Route path={`${path}`} exact={true}>
                        <AdminHome/>
                    </Route>
                    {/*<Route path={`${path}/patients`}>*/}
                    {/*    <DoctorPatientList/>*/}
                    {/*</Route>*/}
                </Switch>
        </DashboardLayout>

    )
}

export default Admin
