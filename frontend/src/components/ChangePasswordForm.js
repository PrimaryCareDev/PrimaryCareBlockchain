import React, {useState} from 'react';
import classnames from "classnames";
import Button from "./Button";
import SmallLoadingSpinner from "./SmallLoadingSpinner";
import {useForm} from "react-hook-form";
import {EmailAuthProvider, getAuth, reauthenticateWithCredential} from "firebase/auth";
import {useAuth} from "../useAuth";
import {toast} from "react-toastify";
import {getMessageFromErrorCode} from "../constants";

const ChangePasswordForm = () => {

    const {register, handleSubmit, formState: {errors}, getValues, reset} = useForm();
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const {updateUserPassword} = useAuth()

    async function onPasswordChangeSubmit(data) {

        setError("")
        setSubmitting(true)

        try {
            await updateUserPassword(data.currentPassword, data.newPassword)
            toast.success("Password successfully updated!")

        }
        catch (e) {
            console.log(e)
            setError(getMessageFromErrorCode(e.code))
            toast.error("Something went wrong! Please try again.", {theme: "colored"});
        }
        
        reset()
        setSubmitting(false)

    }

    return (
        <form onSubmit={handleSubmit(onPasswordChangeSubmit)} className="col-span-2">
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                    <label className="block font-medium text-gray-700">
                        Current Password
                    </label>
                    <input
                        name="current-password"
                        id="current-password"
                        type="password"
                        autoComplete="current-password"
                        className={classnames("mt-1 col-span-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                            {
                                'border-red-500': errors.currentPassword
                            })}
                        {...register("currentPassword", {required: true})}
                    />
                    {errors.currentPassword &&
                        <p className="block text-sm font-medium text-red-700 mt-2">{errors.currentPassword.message}</p>}
                </div>
                <div className=" col-span-2 sm:col-span-1 sm:col-start-1">
                    <label className="block font-medium text-gray-700">
                        New Password
                    </label>
                    <input
                        name="new-password"
                        id="new-password"
                        type="password"
                        className={classnames("mt-1 col-span-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                            {
                                'border-red-500': errors.newPassword
                            })}
                        {...register("newPassword", {
                            required: "A new password is required",
                            minLength:  { value: 6, message: "Minimum password length is 6 characters." }
                        })}
                    />
                    {errors.newPassword &&
                        <p className="block text-sm font-medium text-red-700 mt-2">{errors.newPassword.message}</p>}
                </div>
                <div className="col-span-2 sm:col-span-1">
                    <label className="col-span-1 font-medium text-gray-700">
                        Confirm New Password
                    </label>
                    <input
                        name="confirm-new-password"
                        id="confirm-new-password"
                        type="password"
                        className={classnames("mt-1 col-span-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                            {
                                'border-red-500': errors.confirmNewPassword
                            })}
                        {...register("confirmNewPassword", {
                            required: "Confirmation of new password is required",
                            validate: value => value === getValues().newPassword || "The passwords do not match"
                        })}
                    />
                    {errors.confirmNewPassword &&
                        <p className="block text-sm font-medium text-red-700 mt-2">{errors.confirmNewPassword.message}</p>}
                </div>
                <div className="col-span-2">

                {error && <p className="block text-sm font-medium text-red-700 mt-2">{error}</p>}
                </div>

                <div className="col-start-1">
                    <Button
                        type="submit"
                        disabled={submitting}>{submitting &&
                        <SmallLoadingSpinner className="h-5 w-5 mr-2 -ml-1"/>}Update Password</Button>
                </div>
            </div>
        </form>
    );
};

export default ChangePasswordForm;