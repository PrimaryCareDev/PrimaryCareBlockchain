import React, {useState} from 'react'
import {useAuth} from '../useAuth'
import {useHistory} from 'react-router'
import DashboardLayout from '../dashboard/layout';
import DoctorHome from "./DoctorHome";
import {BrowserRouter, Route, Switch, useRouteMatch} from "react-router-dom";
import DoctorPatientList from "./DoctorPatientList";

class DebugRouter extends BrowserRouter {
    constructor(props) {
        super(props);
        console.log('initial history is: ', JSON.stringify(this.history, null, 2))
        this.history.listen((location, action) => {
            console.log(
                `The current URL is ${location.pathname}${location.search}${location.hash}`
            )
            console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null, 2));
        });
    }
}

const Doctor = () => {
    const [error, setError] = useState("")
    const {signout} = useAuth()
    const history = useHistory()
    let { path } = useRouteMatch();

    async function handleLogout() {
        try {
            await signout()
            history.push("/")
        } catch {
            setError("Failed to log out")
        }
    }

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

            {/*<DebugRouter>*/}
            {/*    <Route*/}
            {/*        path="/doctor"*/}
            {/*        render={({ match: { path } }) => (*/}
            {/*            <>*/}
            {/*                <Route path={`${path}/`} component={DoctorHome} exact />*/}
            {/*                <Route path={`${path}/patients`} component={DoctorPatientList} exact />*/}
            {/*            </>*/}
            {/*        )}*/}
            {/*    />*/}
            {/*</DebugRouter>*/}


            <button
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                onClick={handleLogout}>
                Log Out
            </button>


        </DashboardLayout>

    )
}

export default Doctor
