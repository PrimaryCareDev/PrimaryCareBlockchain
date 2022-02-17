import React, {useRef, useState} from 'react'
import {LockClosedIcon} from '@heroicons/react/solid'
import {useAuth} from "../useAuth.js";
import {Link, useHistory} from "react-router-dom"
import logo from "../healthlink_logo.svg";
import {userType} from "../constants";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

const PatientRegister = () => {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const {registerAccount} = useAuth()
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        try {
            setError("")
            setLoading(true)
            await registerAccount(emailRef.current.value, passwordRef.current.value, userType.PATIENT)
            history.replace("/")
            history.push("/patient")
        } catch (e) {
            setError(e.message)
        }

        setLoading(false)
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
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up as a Patient</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/patientLogin" className="font-medium text-indigo-600 hover:text-indigo-500">
                            login with an existing account
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
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <label htmlFor="passwordConfirm" className="sr-only">
                                Password
                            </label>
                            <input
                                ref={passwordConfirmRef}
                                id="passwordConfirm"
                                name="passwordConfirm"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                            />
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
                            Sign Up
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

        </div>
    )
}

export default PatientRegister
