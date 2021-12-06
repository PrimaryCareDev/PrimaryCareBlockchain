import React, {useState} from 'react';
import {FormProvider, useForm} from "react-hook-form"
import {getStorage, ref, uploadBytes} from "firebase/storage";
import FileDropzone from "../components/FileDropzone";
import {useAuth} from "../useAuth";
import classnames from 'classnames';
import {doc, getFirestore, updateDoc} from "firebase/firestore/lite";
import Button from "../components/Button";

const DoctorVerificationForm = () => {
    const methods = useForm({mode: "onBlur"});
    const {register, formState: {errors}, handleSubmit} = methods;
    const [submitting, setSubmitting] = useState(false)
    const {user} = useAuth()
    const db = getFirestore();

    const storage = getStorage();
    const storageRef = ref(storage, 'images/identification/' + user.uid);

    // useEffect(() => {
    //     register(idImageName, {required: true});
    //     return () => {
    //         unregister(idImageName);
    //     };
    // }, []);


    // const {getRootProps, getInputProps} = useDropzone({
    //     maxFiles: 1,
    //     accept: 'image/*',
    //     onDrop: acceptedFiles => {
    //         console.log("ACCEPTED FILES ")
    //         const file = acceptedFiles[0]
    //         if (file) {
    //             console.log(URL.createObjectURL(file))
    //             setIdentificationImage(URL.createObjectURL(file))
    //             setValue(idImageName, file, { shouldValidate: true });
    //             // uploadBytes(storageRef, file).then((snapshot) => {
    //             //     console.log(snapshot.ref.fullPath)
    //             //     console.log('Uploaded a blob or file!');
    //             // });
    //         }
    //     }
    // })

    // useEffect(() => () => {
    //     console.log("REVOKING")
    //     // Make sure to revoke the data uris to avoid memory leaks
    //     URL.revokeObjectURL(identificationImage)
    // }, [identificationImage]);


    async function onSubmit(data) {
        console.log(data);
        try {
            setSubmitting(true)
            await uploadBytes(storageRef, data.idImage).then((snapshot) => {
                console.log(snapshot.ref.fullPath)
            });
            const docRef = doc(db, "doctors", user.uid)
            await updateDoc(docRef, {
                submittedForVerification: true,
                firstName: data.firstName
            });
            setSubmitting(false)


        } catch (e) {
            console.log(e.message)
        }

    }

    return (
        <div className="max-w-7xl mt-5 md:mt-0">
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
                                    <p className="block text-sm font-medium text-red-700 mt-3">First name is
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
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Identification</label>
                                    {/*<div {...getRootProps({className: "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"})} >*/}
                                    {/*    /!*<div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">*!/*/}
                                    {/*    <div className="space-y-1 text-center">*/}
                                    {/*        <svg*/}
                                    {/*            className="mx-auto h-12 w-12 text-gray-400"*/}
                                    {/*            stroke="currentColor"*/}
                                    {/*            fill="none"*/}
                                    {/*            viewBox="0 0 48 48"*/}
                                    {/*            aria-hidden="true"*/}
                                    {/*        >*/}
                                    {/*            <path*/}
                                    {/*                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"*/}
                                    {/*                strokeWidth={2}*/}
                                    {/*                strokeLinecap="round"*/}
                                    {/*                strokeLinejoin="round"*/}
                                    {/*            />*/}
                                    {/*        </svg>*/}
                                    {/*        <div className="flex text-sm text-gray-600">*/}
                                    {/*            <label*/}
                                    {/*                htmlFor="file-upload"*/}
                                    {/*                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"*/}
                                    {/*            >*/}
                                    {/*                <span>Upload a file</span>*/}
                                    {/*                /!*<input {...getInputProps()} id="file-upload" name="file-upload" type="file" className="sr-only" />*!/*/}
                                    {/*                <input  id="file-upload" name="idImageName"*/}
                                    {/*                       type="file" className="sr-only" {...getInputProps()} />*/}
                                    {/*            </label>*/}
                                    {/*            <p className="pl-1">or drag and drop</p>*/}
                                    {/*        </div>*/}
                                    {/*        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <FileDropzone accept="image/*" name="idImage"/>
                                    {errors.idImage &&
                                    <p className="block text-sm font-medium text-red-700 mt-3">Identification image is
                                        required</p>}

                                </div>


                                <div className="col-span-6 sm:col-span-4">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        type="text"
                                        name="email-address"
                                        id="email-address"
                                        autoComplete="email"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country-name"
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                </div>

                                <div className="col-span-6">
                                    <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                        Street address
                                    </label>
                                    <input
                                        type="text"
                                        name="street-address"
                                        id="street-address"
                                        autoComplete="street-address"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        autoComplete="address-level2"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                        State / Province
                                    </label>
                                    <input
                                        type="text"
                                        name="region"
                                        id="region"
                                        autoComplete="address-level1"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                                        ZIP / Postal code
                                    </label>
                                    <input
                                        type="text"
                                        name="postal-code"
                                        id="postal-code"
                                        autoComplete="postal-code"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            {/*<button*/}
                            {/*    type="submit"*/}
                            {/*    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"*/}
                            {/*>*/}
                            {/*    Save*/}
                            {/*</button>*/}
                            <Button type="submit" disabled={submitting}>Save</Button>

                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default DoctorVerificationForm;
