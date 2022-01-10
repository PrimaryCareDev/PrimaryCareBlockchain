import React, {useRef, useState} from 'react'
import {LockClosedIcon} from '@heroicons/react/solid'
import {useAuth} from "../useAuth.js";
import {Link, useHistory, useLocation} from "react-router-dom"
import logo from "../healthlink_logo.svg";

const DoctorLogin = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {signin} = useAuth()
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    let location = useLocation();

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)

            await signin(emailRef.current.value, passwordRef.current.value)
            let {from} = location.state || {from: {pathname: "/"}}
            history.replace(from)

            //don't need to manually navigate to logged in page here, because handled by PrivateRoute
        } catch (e) {

            setError(e.message)
            setLoading(false)
        }
    }

    function onAlertCloseClick() {
        setError("")
    }

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">

                <div>
                    <Link to="/">
                        <img src={logo} className="mx-auto h-12 w-auto" alt="logo"/>
                    </Link>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Sign In</h2>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6" action="#" method="POST">
                    <input type="hidden" name="remember" defaultValue="true"/>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                ref={emailRef}
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                ref={passwordRef}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">

                        <div className="text-sm">
                            <Link to="/passwordReset" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button disabled={loading}
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                                aria-hidden="true"/>
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>

                {error &&
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-600">
                        <span className="text-xl inline-block mr-5 align-middle">
                            <i className="fas fa-bell"/>
                        </span>
                        <span className="inline-block align-middle mr-8">
                            <b className="capitalize">Error</b> {error}
                        </span>
                        <button onClick={onAlertCloseClick}
                                className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
                            <span>×</span>
                        </button>
                    </div>
                }
            </div>

        </div>
    )


}


export default DoctorLogin
