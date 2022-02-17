import React, {useRef, useState} from 'react'
import {LockClosedIcon} from '@heroicons/react/solid'
import {useAuth} from "../useAuth.js";
import {Link, useHistory, useLocation} from "react-router-dom"
import {getAuth} from "firebase/auth";
import logo from "../healthlink_logo.svg";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import {getMessageFromErrorCode} from "../constants";

const DoctorLogin = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {signin} = useAuth()
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

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

            setError(getMessageFromErrorCode(e.code))
            setLoading(false)

        }

    }

    function onAlertCloseClick() {
        setError("")
    }

    return (
        <div className="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">

                <div>
                    <Link to="/">
                        <img src={logo} className="mx-auto h-12 w-auto" alt="logo"/>
                    </Link>                    <h2
                    className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in as Doctor</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/doctorRegister" className="font-medium text-indigo-600 hover:text-indigo-500">
                            sign up for a Doctor account
                        </Link>
                    </p>
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
                            {loading &&
                                <SmallLoadingSpinner className="h-5 w-5 mr-2 ml-2"/>}
                        </button>
                    </div>
                </form>

                {error &&
                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-600">
                        <span className="inline-block align-middle mr-8">
                            <b className="capitalize">Error:</b> {error}
                        </span>
                        <button onClick={onAlertCloseClick}
                                className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
                            <span>×</span>
                        </button>
                    </div>
                }


            </div>

            <div
                className="max-w-md w-full block text-sm  text-gray-600 bg-gray-500 bg-opacity-10 h-12 flex items-center justify-center p-4 rounded-md mt-10">
                <p>Are you a patient? {' '} <Link to="/patient"
                                                  className="font-medium text-indigo-600 hover:text-indigo-500">Sign in
                    here instead.</Link></p>
            </div>


        </div>
    )


}


export default DoctorLogin
