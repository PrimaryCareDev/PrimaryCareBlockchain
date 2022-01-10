import React, {useRef, useState} from 'react'
import {Link} from "react-router-dom"
import {getAuth, sendPasswordResetEmail} from "firebase/auth";

const PasswordReset = () => {
    const emailRef = useRef()
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [emailAddress, setEmailAddress] = useState("")
    const auth = getAuth()


    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setLoading(true)
            setEmailSent(false)
            setEmailAddress(emailRef.current.value)

            await sendPasswordResetEmail(auth, emailRef.current.value)


        } catch (e) {
        }

        setEmailSent(true)
        setLoading(false)

    }

    return (
        <div className="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">

                <div>
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Password Reset</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your email address to reset your password

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
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    <div>
                        <button disabled={loading}
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            </span>
                            Reset Password
                        </button>
                    </div>
                </form>

                {emailSent &&
                    <div className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4" role="alert">
                        <p className="font-bold mb-2">
                            Password reset email sent
                        </p>
                        <p>
                            If a matching account was found, an email was sent to <b>{emailAddress}</b> to allow you to
                            reset your
                            password.
                        </p>
                    </div>
                }

            </div>

            <div
                className="max-w-md w-full block text-sm text-gray-600 flex items-center justify-center mt-10">
                <p><Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">Back to homepage</Link>
                </p>

            </div>

        </div>
    )


}


export default PasswordReset
