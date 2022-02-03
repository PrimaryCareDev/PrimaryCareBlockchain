import React, {useRef, useState} from 'react';
import {FormProvider, useForm} from "react-hook-form";
import AvatarEditor from "react-avatar-editor";
import {ZoomInIcon, ZoomOutIcon} from "@heroicons/react/solid";
import Slider from "rc-slider";
import DefaultAvatar from "../components/DefaultAvatar";
import Button from "../components/Button";
import classnames from "classnames";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import {getDownloadURL, getStorage, ref, uploadString} from "firebase/storage";
import {axiosInstance} from "../constants";
import {useAuth} from "../useAuth";
import { DateTime } from "luxon";
import SubTitle from "../components/SubTitle";



const PatientVerificationForm = (props) => {
    const methods = useForm({mode: "onBlur"});
    const {register, formState: {errors}, handleSubmit} = methods;
    const [submitting, setSubmitting] = useState(false)
    const [avatarImage, setAvatarImage] = useState()
    const [avatarImageScale, setAvatarImageScale] = useState(1.2)
    const [birthDateError, setBirthDateError] = useState(false)
    const avatarImageInput = useRef(null)
    const avatarImageEditor = useRef(null)
    const {user} = useAuth()
    const storage = getStorage();

    async function onSubmit(data) {
        try {

            const userBirthDate = DateTime.fromObject({ year: data.birthDateYear, month: data.birthDateMonth, day: data.birthDateDay });

            if (!userBirthDate.isValid) {
                setBirthDateError(true)
                return
            }
            else {
                setBirthDateError(false)
            }

            setSubmitting(true)

            const avatarStorageRef = ref(storage, 'images/avatars/' + user.uid);

            let avatarImageURL = "";
            let avatarDataUrl;
            if (avatarImageEditor.current) {
                avatarDataUrl = avatarImageEditor.current.getImageScaledToCanvas().toDataURL()
            }

            if (avatarDataUrl) {
                const avatarImageUpload = await uploadString(avatarStorageRef, avatarDataUrl, 'data_url')

                avatarImageURL = await getDownloadURL(avatarImageUpload.ref)

            }


            await axiosInstance.post("/patient/verifyPatient", {
                firstName: data.firstName,
                lastName: data.lastName,
                avatarImageUrl: avatarImageURL,
                birthDate: userBirthDate.toSQLDate(),
                sex: data.sex
            }).catch(function (error) {
                console.log(error.message)
            })

            props.onSubmitVerification()
            setSubmitting(false)


        } catch (e) {
            console.log(e)
        }

    }

    function onScaleChange(value) {
        setAvatarImageScale(value)
    }

    return (<div className="max-w-6xl mt-5 md:mt-0 justify-self-center">

            <FormProvider {...methods} >
                <form onSubmit={handleSubmit(onSubmit)} method="POST">
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                            <SubTitle>Personal Details</SubTitle>
                            <p className="mb-6 text-sm text-gray-600">Please fill in your details before continuing to use Healthlink</p>
                            <div className="grid grid-cols-6 gap-6">



                                <div className="col-span-6 grid grid-cols-4">
                                    <div className="col-span-4 sm:col-span-1 grid">
                                        <label className="block text-md font-medium text-gray-700">
                                            Profile Picture
                                        </label>
                                        <div>

                                            {avatarImage ? <>
                                                <AvatarEditor
                                                    ref={avatarImageEditor}
                                                    className="justify-self-center"
                                                    color={[0, 0, 0, 0.6]} // RGBA
                                                    scale={avatarImageScale}
                                                    rotate={0}
                                                    image={avatarImage}/>

                                                <div className="flex items-center mt-2">
                                                    <ZoomOutIcon className="h-5 w-5 text-gray-600 "/>
                                                    <Slider className="mx-3" min={1} max={2} step={0.01}
                                                            defaultValue={1.2}
                                                            onChange={onScaleChange}/>
                                                    <ZoomInIcon className="h-5 w-5 text-gray-600"/>
                                                </div>
                                            </> : <DefaultAvatar/>}
                                            <Button className="my-2 justify-self-start"
                                                    onClick={() => avatarImageInput.current.click()}>Browse</Button>
                                            <input type="file" accept="image/*" className="hidden"
                                                   ref={avatarImageInput}
                                                   onChange={(e) => setAvatarImage(e.target.files[0])}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        aria-invalid={errors.firstName ? "true" : "false"}
                                        className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md', {
                                            'border-red-500': errors.firstName
                                        })}
                                        {...register("firstName", {maxLength: 255})}
                                    />
                                    {errors.firstName && errors.firstName.type === "maxLength" &&
                                        <p className="block text-sm font-medium text-red-700 mt-2">Input is too
                                            long</p>}
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
                                        aria-invalid={errors.lastName ? "true" : "false"}
                                        className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md', {
                                            'border-red-500': errors.lastName
                                        })}
                                        {...register("lastName", {maxLength: 255})}
                                    />
                                    {errors.lastName && errors.lastName.type === "maxLength" &&
                                        <p className="block text-sm font-medium text-red-700 mt-2">Input is too
                                            long</p>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                                        Sex*
                                    </label>
                                    <select name="sex"
                                            className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md', {
                                                'border-red-500': errors.sex
                                            })}
                                            {...register("sex",{required: "Please select one"})}>
                                        <option value=""/>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                    {errors.sex &&
                                        <p className="block text-sm font-medium text-red-700 mt-2">{errors.sex.message}</p>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700">
                                        What is your date of birth?*
                                    </label>
                                    <div className="grid grid-cols-3 gap-x-6">
                                        <div className="col-span-1">
                                            <label htmlFor="birthDateDay"
                                                   className="block text-sm font-medium text-gray-700">
                                                Day
                                            </label>
                                            <input
                                                type="text"
                                                name="birthDateDay"
                                                id="birthDateDay"
                                                placeholder="DD"
                                                maxLength="2"
                                                className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md', {
                                                    'border-red-500': errors.birthDateDay || birthDateError
                                                })}
                                                {...register("birthDateDay", {required: true, pattern: /^[0-9]*$/, min: 1, max: 31, onChange: ()=>setBirthDateError(false)})}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label htmlFor="birthDateMonth"
                                                   className="block text-sm font-medium text-gray-700">
                                                Month
                                            </label>
                                            <input
                                                type="text"
                                                name="birthDateMonth"
                                                id="birthDateMonth"
                                                placeholder="MM"
                                                maxLength="2"
                                                onChange={() => setBirthDateError(false)}
                                                inputMode="numeric"
                                                className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md', {
                                                    'border-red-500': errors.birthDateMonth || birthDateError
                                                })}
                                                {...register("birthDateMonth", {required: true, pattern: /^[0-9]*$/, min: 1, max: 12, onChange: ()=>setBirthDateError(false)})}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label htmlFor="birthDateYear"
                                                   className="block text-sm font-medium text-gray-700">
                                                Year
                                            </label>
                                            <input
                                                type="text"
                                                name="birthDateYear"
                                                id="birthDateYear"
                                                placeholder="YYYY"
                                                maxLength="4"
                                                onChange={() => setBirthDateError(false)}
                                                className={classnames('mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md', {
                                                    'border-red-500': errors.birthDateYear || birthDateError
                                                })}
                                                {...register("birthDateYear", {required: true, pattern: /^[0-9]*$/, min: 1900, max: 2022, onChange: ()=>setBirthDateError(false)})}
                                            />
                                        </div>

                                    </div>
                                    {(errors.birthDateYear || errors.birthDateMonth || errors.birthDateDay || birthDateError) &&
                                        <p className="block text-sm font-medium text-red-700 mt-2">Please check your birth date</p>}
                                </div>

                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right flex justify-end items-center gap-3 sm:px-6">

                            <Button type="submit" disabled={submitting}>{submitting &&
                                <SmallLoadingSpinner className="h-5 w-5 mr-2 -ml-1"/>}Save</Button>

                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>);
};

export default PatientVerificationForm;