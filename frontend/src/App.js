import logo from './logo.svg';
import React, { useContext, createContext, useState } from "react";
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
                        <AdminPrivateRoute path="/admin">
                            <Admin />
                        </AdminPrivateRoute>
                        <Route exact path="/adminLogin">
                            <AdminLogin/>
                        </Route>
                        <PrivateRoute path="/doctor">
                            <Doctor />
                        </PrivateRoute>
                        <Route exact path="/doctorLogin">
                            <DoctorLogin />
                        </Route>
                        <Route exact path="/doctorRegister">
                            <DoctorRegister />
                        </Route>

                    </Switch>
                </DashboardProvider>
            </Router>

        </AuthProvider>
    );
}


// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    let { userData } = useAuth();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                userData ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/doctorLogin",
                            state: { from: location }
                        }}
                    />
                )

            }
        />
    );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function AdminPrivateRoute({ children, ...rest }) {
    let { userData } = useAuth();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                userData ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/adminLogin",
                            state: { from: location }
                        }}
                    />
                )

            }
        />
    );
}

export default App;
