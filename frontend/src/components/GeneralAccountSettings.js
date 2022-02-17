import React, {useRef, useState} from 'react';
import {useAuth} from "../useAuth";
import DefaultAvatar from "./DefaultAvatar";
import {useForm} from "react-hook-form";
import SectionTitle from "./SectionTitle";
import Button from "./Button";
import AvatarEditor from "react-avatar-editor";
import {ZoomInIcon, ZoomOutIcon} from "@heroicons/react/solid";
import Slider from "rc-slider";
import {getDownloadURL, getStorage, ref, uploadString} from "firebase/storage";
import {axiosInstance} from "../constants";
import SmallLoadingSpinner from "./SmallLoadingSpinner";
import classnames from "classnames";
import {getAuth, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
import ChangePasswordForm from "./ChangePasswordForm";

const GeneralAccountSettings = () => {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const [submitting, setSubmitting] = useState(false)
    const {user, userData} = useAuth()
    const [avatarImage, setAvatarImage] = useState()
    const [avatarImageScale, setAvatarImageScale] = useState(1.2)
    const avatarImageInput = useRef(null)
    const storage = getStorage();

    const avatarImageEditor = useRef(null)

    function onScaleChange(value) {
        setAvatarImageScale(value)
    }

    async function uploadAvatarImage() {
        setSubmitting(true)
        const avatarStorageRef = ref(storage, 'images/avatars/' + user.uid);
        let avatarImageUrl = ""
        if (avatarImageEditor.current) {
            const avatarDataUrl = avatarImageEditor.current.getImageScaledToCanvas().toDataURL()
            const avatarImageUpload = await uploadString(avatarStorageRef, avatarDataUrl, 'data_url')

            avatarImageUrl = await getDownloadURL(avatarImageUpload.ref)
            console.log(avatarImageUrl)

            await axiosInstance.post("/updateAvatarImage", {
                avatarImageUrl: avatarImageUrl
            })

            setAvatarImage(null)
            setSubmitting(false)
            window.location.reload();

        } else {
            return null
        }
    }

    async function onNameSubmit(data) {
        setSubmitting(true)
        await axiosInstance.post("/updateName", {
            firstName: data.firstName,
            lastName: data.lastName
        })
        setSubmitting(false)
        window.location.reload();
    }

    return (
        <div>
            <SectionTitle>Account Settings</SectionTitle>

            <div className="gap-3">
                <div className="mb-3">
                    {
                        !avatarImage ?

                            userData.avatarImageUrl ?
                                <img src={userData.avatarImageUrl}
                                     className="rounded-full w-48 h-48 col-span-3"
                                     alt="Avatar"/>
                                :
                                <DefaultAvatar className="w-48 h-48"/>

                            :
                            <>
                                <AvatarEditor
                                    ref={avatarImageEditor}
                                    className="justify-self-center w-full"
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={avatarImageScale}
                                    rotate={0}
                                    image={avatarImage}/>
                                <div className="flex items-center mt-2 w-[250px]">
                                    <ZoomOutIcon className="h-5 w-5 text-gray-600 "/>
                                    <Slider className="mx-3" min={1} max={2} step={0.01}
                                            defaultValue={1.2}
                                            onChange={onScaleChange}/>
                                    <ZoomInIcon className="h-5 w-5 text-gray-600"/>
                                </div>
                            </>

                    }
                    <div className="mt-3 space-x-5">

                        {avatarImage ?
                            <>
                                <Button onClick={() => setAvatarImage(null)}
                                        layout="neutral">Cancel</Button>
                                <Button onClick={uploadAvatarImage}
                                        layout="submit"
                                        disabled={submitting}>{submitting &&
                                    <SmallLoadingSpinner className="h-5 w-5 mr-2 -ml-1"/>}Save</Button>

                            </>
                            :
                            <>
                                <Button
                                    onClick={() => avatarImageInput.current.click()}>Change Picture</Button>
                                <input type="file" accept="image/*" className="hidden"
                                       ref={avatarImageInput}
                                       onChange={(e) => setAvatarImage(e.target.files[0])}/>
                            </>
                        }
                    </div>


                </div>
                <div className="py-5 border-y-2 border-gray-400 col-span-3 grid grid-cols-2 gap-y-3 items-center">
                    <div className="col-span-2">
                        <label className="block font-medium text-gray-700">
                            Email
                        </label>
                        <span className="col-span-1">{userData.email}</span>
                    </div>
                    <form onSubmit={handleSubmit(onNameSubmit)} className="col-span-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block font-medium text-gray-700">
                                    First Name
                                </label>
                                {/*<span className="col-span-1">{userData.firstName}</span>*/}
                                <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    className={classnames("mt-1 col-span-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                                        {
                                            'border-red-500': errors.firstName
                                        })} defaultValue={userData.firstName}
                                    {...register("firstName", {required: true})}
                                />
                                {errors.firstName &&
                                    <p className="block text-sm font-medium text-red-700 mt-2">First name is
                                        required</p>}
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="col-span-1 font-medium text-gray-700">
                                    Last Name
                                </label>
                                {/*<span className="col-span-1">{userData.lastName}</span>*/}
                                <input
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    className={classnames("mt-1 col-span-1 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md",
                                        {
                                            'border-red-500': errors.lastName
                                        })}
                                    defaultValue={userData.lastName}
                                    {...register("lastName", {required: true})}
                                />
                                {errors.lastName &&
                                    <p className="block text-sm font-medium text-red-700 mt-2">Last name is
                                        required</p>}
                            </div>

                            <div className="col-start-1">
                                <Button
                                    type="submit"
                                    layout="submit"
                                    disabled={submitting}>{submitting &&
                                    <SmallLoadingSpinner className="h-5 w-5 mr-2 -ml-1"/>}Update Name</Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="py-5 border-b-2 border-gray-400 col-span-3 grid grid-cols-2 gap-y-3 items-center">
                    <span className="block font-semibold text-lg text-gray-700">Change password</span>
                    <ChangePasswordForm/>
                </div>
            </div>
        </div>
    );
};

export default GeneralAccountSettings;