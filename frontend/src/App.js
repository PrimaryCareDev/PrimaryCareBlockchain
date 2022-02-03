import React from "react";
import './App.css';
import './index.css';
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Doctor from './pages/Doctor';
import DoctorLogin from './pages/DoctorLogin';
import Admin from "./pages/Admin";
import {AuthProvider, useAuth} from "./useAuth.js";
import DoctorRegister from './pages/DoctorRegister';
import DashboardProvider from './dashboard/provider/context'
import AdminLogin from "./pages/AdminLogin";
import Patient from "./pages/Patient";
import PasswordReset from "./pages/PasswordReset";
import TestBackend from "./pages/TestBackend";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import 'react-toastify/dist/ReactToastify.css';
import './css/custom.css'
import {ToastContainer} from "react-toastify";

function App() {

    return (
        <AuthProvider>
            <Router>
                <DashboardProvider>
                    <Switch>
                        <Route exact path="/">
                            <HomePage/>
                        </Route>
                        {/*<Route path="/admin/calendar" exact={true}>*/}
                        {/*    <CalendarPage/>*/}
                        {/*</Route>*/}
                        <PrivateRoute redirectTo="/adminLogin" path="/admin">
                            <Admin/>
                        </PrivateRoute>
                        <Route exact path="/adminLogin">
                            <AdminLogin/>
                        </Route>
                        <PrivateRoute redirectTo="/doctorLogin" path="/doctor">
                            <Doctor/>
                        </PrivateRoute>
                        <Route exact path="/doctorLogin">
                            <DoctorLogin/>
                        </Route>
                        <Route exact path="/doctorRegister">
                            <DoctorRegister/>
                        </Route>
                        <PrivateRoute redirectTo="/patientLogin" path="/patient">
                            <Patient/>
                        </PrivateRoute>
                        <Route exact path="/patientLogin">
                            <PatientLogin/>
                        </Route>
                        <Route exact path="/patientRegister">
                            <PatientRegister/>
                        </Route>
                        <Route exact path="/passwordReset">
                            <PasswordReset/>
                        </Route>
                        <Route exact path="/testBackend">
                            <TestBackend/>
                        </Route>

                    </Switch>
                </DashboardProvider>
            </Router>
            <ToastContainer position="bottom-right"/>
        </AuthProvider>
    );
}


// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({redirectTo, children, ...rest}) {
    let {user} = useAuth();

    return (
        <Route
            {...rest}
            render={({location}) =>
                user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: redirectTo,
                            state: {from: location}
                        }}
                    />
                )

            }
        />
    );
}

export default App;
