import React, {useState} from 'react';
import {FormProvider, useForm} from "react-hook-form"
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import FileDropzone from "../components/FileDropzone";
import {useAuth} from "../useAuth";
import classnames from 'classnames';
import {doc, getFirestore, updateDoc} from "firebase/firestore/lite";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingDots from "../components/LoadingDots";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import {ClipboardIcon} from "@heroicons/react/solid";

const DoctorVerificationForm = (props) => {
    const methods = useForm({mode: "onBlur"});
    const {register, formState: {errors}, handleSubmit} = methods;
    const [submitting, setSubmitting] = useState(false)
    const {user} = useAuth()
    const db = getFirestore();
    const storage = getStorage();

    async function onSubmit(data) {
        console.log(data);
        try {
            setSubmitting(true)
            const idStorageRef = ref(storage, 'images/identification/' + user.uid);
            const licenseStorageRef = ref(storage, 'images/licenses/' + user.uid);

            const idImageUpload = await uploadBytes(idStorageRef, data.idImage)
            const idImageURL = await getDownloadURL(idImageUpload.ref)

            const licenseImageUpload = await uploadBytes(licenseStorageRef, data.licenseImage)
            const licenseImageURL = await getDownloadURL(licenseImageUpload.ref)
            const docRef = doc(db, "doctors", user.uid)
            await updateDoc(docRef, {
                submittedForVerification: true,
                firstName: data.firstName,
                lastName: data.lastName,
                medicalPractice: data.medicalPractice,
                medicalLicenseNumber: data.licenseNumber,
                idImageUrl: idImageURL,
                licenseImageUrl: licenseImageURL
            });
            setSubmitting(false)
            props.onSubmitRegistration()

        } catch (e) {
            console.log(e.message)
        }

    }

    return (
        <div className="max-w-6xl mt-5 md:mt-0 justify-self-center">
            <FormProvider {...methods} >
                <form onSubmit={handleSubmit(onSubmit)} method="POST">
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        // className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
                                            {
                                                'border-red-500': errors.firstName
                                            }
                                        )}
                                        {...register("firstName", {required: true})}
                                    />
                                    {errors.firstName &&
                                    <p className="block text-sm font-medium text-red-700 mt-2">First name is
                                        required</p>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
                                            {
                                                'border-red-500': errors.lastName
                                            }
                                        )}
                                        {...register("lastName", {required: true})}
                                    />
                                    {errors.lastName &&
                                    <p className="block text-sm font-medium text-red-700 mt-2">Last name is required</p>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                        Practice/Clinic Name
                                    </label>
                                    <input
                                        type="text"
                                        name="email-address"
                                        id="email-address"
                                        autoComplete="email"
                                        className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
                                            {
                                                'border-red-500': errors.medicalPractice
                                            }
                                        )}
                                        {...register("medicalPractice", {required: true})}
                                    />
                                    {errors.medicalPractice &&
                                    <p className="block text-sm font-medium text-red-700 mt-2">Medical practice is required</p>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                        Medical Registration/License Number (e.g. MCR)
                                    </label>
                                    <input
                                        type="text"
                                        name="email-address"
                                        id="email-address"
                                        autoComplete="email"
                                        className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
                                            {
                                                'border-red-500': errors.licenseNumber
                                            }
                                        )}
                                        {...register("licenseNumber", {required: true})}
                                    />
                                    {errors.licenseNumber &&
                                    <p className="block text-sm font-medium text-red-700 mt-2">License number is required</p>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Identification Image</label>
                                    <FileDropzone accept="image/*" name="idImage"/>
                                    {errors.idImage &&
                                    <p className="block text-sm font-medium text-red-700 mt-3">Identification image is
                                        required</p>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Medical License Image</label>
                                    <FileDropzone accept="image/*" name="licenseImage"/>
                                    {errors.licenseImage &&
                                    <p className="block text-sm font-medium text-red-700 mt-3">Medical license image is
                                        required</p>}
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right flex justify-end items-center gap-3 sm:px-6">

                            <Button type="submit" disabled={submitting}>{submitting && <SmallLoadingSpinner className="h-5 w-5 mr-2 -ml-1"/>}Save</Button>

                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default DoctorVerificationForm;
