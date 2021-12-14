import logo from './logo.svg';
import React from "react";
import './App.css';
import './index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Doctor from './pages/Doctor';
import DoctorLogin from './pages/DoctorLogin';
import Admin from "./pages/Admin";
import { AuthProvider, useAuth } from "./useAuth.js";
import DoctorRegister from './pages/DoctorRegister';
import DashboardProvider from './dashboard/provider/context'
import AdminLogin from "./pages/AdminLogin";
import Patient from "./pages/Patient";
import PasswordReset from "./pages/PasswordReset";

function App() {

    return (
        <AuthProvider>
            <Router>

                <DashboardProvider>
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        {/*<Route path="/admin/calendar" exact={true}>*/}
                        {/*    <CalendarPage/>*/}
                        {/*</Route>*/}
                        <PrivateRoute redirectTo="/adminLogin" path="/admin">
                            <Admin />
                        </PrivateRoute>
                        <Route exact path="/adminLogin">
                            <AdminLogin/>
                        </Route>
                        <PrivateRoute redirectTo="/doctorLogin" path="/doctor">
                            <Doctor />
                        </PrivateRoute>
                        <Route exact path="/doctorLogin">
                            <DoctorLogin />
                        </Route>
                        <Route exact path="/doctorRegister">
                            <DoctorRegister />
                        </Route>
                        <Route path="/patient">
                            <Patient/>
                        </Route>
                        <Route exact path="/passwordReset">
                            <PasswordReset />
                        </Route>

                    </Switch>
                </DashboardProvider>
            </Router>

        </AuthProvider>
    );
}


// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ redirectTo, children, ...rest }) {
    let { user } = useAuth();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                user ? (
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

export default App;
