import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react'
import DefaultAvatar from "../components/DefaultAvatar";
import {XIcon} from "@heroicons/react/outline";
import Button from "../components/Button";
import {CheckCircleIcon, ExclamationCircleIcon} from "@heroicons/react/solid";
import {axiosInstance, requestStatus, userType} from "../constants";
import LoadingSpinner from "../components/LoadingSpinner";

const PatientViewDoctorPopup = (props) => {
    const {data} = props
    const [loading, setLoading] = useState(true)
    const [relationship, setRelationship] = useState()
    const [error, setError] = useState()
    const [confirmRemoval, setConfirmRemoval] = useState(false)
    const [confirmRejection, setConfirmRejection] = useState(false)

    const focusRef = useRef(null)

    function BottomSection() {
        if (relationship === null || relationship.status === requestStatus.REJECTED || relationship.status === requestStatus.DELETED) {
            return <div
                className="bg-gray-50 text-gray-600 text-center mt-3 p-3 max-w-md flex flex-col gap-3 sm:flex-row sm:px-6 items-center sm:text-left rounded-md">

                <span>Do you want to invite this doctor to access your information?</span>

                <Button onClick={sendRequest}
                        className="flex-shrink-0 bg-green-600 hover:bg-green-700 focus:ring-green-500">
                    Send Invitation
                </Button>

            </div>
        } else if (relationship.status === requestStatus.ACCEPTED) {
            return <>
                {
                    confirmRemoval
                        ?
                        <>
                            <div
                                className="w-full bg-yellow-100 text-yellow-700 my-3 p-3 sm:w-auto flex flex-row gap-3 sm:px-6 items-center rounded-md">

                                <ExclamationCircleIcon className="h-12"/>

                                <span>Are you sure you want to revoke this doctor's access to your data?</span>

                            </div>
                            <div className="w-full flex flex-col sm:flex-row-reverse gap-3 justify-center">
                                <Button onClick={sendDeletionRequest}
                                        className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500 sm:w-auto">
                                    Confirm
                                </Button>
                                <Button onClick={() => setConfirmRemoval(false)}
                                        className="w-full bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 sm:w-auto">
                                    Cancel
                                </Button>
                            </div>

                        </>
                        :
                        <>
                            <div
                                className="bg-green-100 text-green-700 my-3 p-3 max-w-md flex gap-3 flex-row sm:px-6 items-center rounded-md">

                                <CheckCircleIcon className="h-12"/>
                                <span>You are connected with this doctor.{` `}
                                    {/*<Link to="/patient/doctorList" className="font-bold text-green-700">View your doctors here.</Link>*/}
                                </span>


                            </div>
                            <Button onClick={() => setConfirmRemoval(true)}
                                    className="flex-shrink-0 bg-red-600 hover:bg-red-700 focus:ring-red-500">
                                Remove Doctor
                            </Button>
                        </>
                }
            </>
        } else if (relationship.status === requestStatus.REQUESTED && relationship.requester === userType.PATIENT) {
            return <>
                <div
                    className="bg-yellow-100 text-yellow-700 my-3 p-3 max-w-md flex gap-3 flex-row sm:px-6 items-center rounded-md">

                    <ExclamationCircleIcon className="h-12"/>
                    <span>Your request has been sent. Please wait for the doctor to accept your invitation.</span>

                </div>
                <Button onClick={sendCancelInvitation}
                        className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500 sm:w-auto">
                    Cancel Invitation
                </Button>
            </>
        } else if (relationship.status === requestStatus.REQUESTED && relationship.requester === userType.DOCTOR) {
            return <>
                {
                    confirmRejection
                        ?
                        <>
                            <div
                                className="w-full bg-yellow-100 text-yellow-700 my-3 p-3 sm:w-auto flex flex-row gap-3 sm:px-6 items-center rounded-md">

                                <ExclamationCircleIcon className="h-12"/>

                                <span>Are you sure you want to reject this doctor's request?</span>

                            </div>
                            <div className="w-full flex flex-col sm:flex-row-reverse gap-3 justify-center">
                                <Button onClick={sendRejectionRequest}
                                        className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500 sm:w-auto">
                                    Confirm
                                </Button>
                                <Button onClick={() => setConfirmRejection(false)}
                                        className="w-full bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 sm:w-auto">
                                    Cancel
                                </Button>
                            </div>

                        </>
                        :
                        <>
                            <div
                                className="bg-yellow-100 text-yellow-700 my-3 p-3 max-w-md flex flex-row gap-3 sm:px-6 items-center rounded-md">

                                <ExclamationCircleIcon className="h-12"/>

                                <span>This doctor has requested to access your data.</span>
                            </div>
                            <div className="w-full flex flex-col sm:flex-row-reverse gap-3 justify-center">

                                <Button onClick={sendAcceptRequest}
                                        className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500 sm:w-auto">
                                    Accept Request
                                </Button>
                                <Button onClick={() => setConfirmRejection(true)}
                                        className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500 sm:w-auto">
                                    Reject Request
                                </Button>
                            </div>
                        </>

                }

            </>
        } else {
            return null
        }
    }

    async function sendRequest() {
        setLoading(true)

        await axiosInstance.post("/patient/inviteDoctor", {
            doctorUid: data.user.uid
        }).catch(function (error) {
            setError(error.response.data)
        })

        await refreshRelationshipStatus()
    }

    async function sendDeletionRequest() {
        setLoading(true)

        await axiosInstance.post("/patient/deleteDoctor", {
            doctorUid: data.user.uid
        }).catch(function (error) {
            setError(error.response.data)
        })

        onCloseSelfAndRefreshParent()
    }

    async function sendAcceptRequest() {
        setLoading(true)

        await axiosInstance.post("/patient/acceptDoctor", {
            doctorUid: data.user.uid
        }).catch(function (error) {
            setError(error.response.data)
        })

        onCloseSelfAndRefreshParent()
    }

    async function sendRejectionRequest() {
        setLoading(true)

        await axiosInstance.post("/patient/rejectDoctor", {
            doctorUid: data.user.uid
        }).catch(function (error) {
            setError(error.response.data)
        })

        onCloseSelfAndRefreshParent()
    }

    async function sendCancelInvitation() {
        setLoading(true)

        await axiosInstance.post("/patient/cancelDoctorInvitation", {
            doctorUid: data.user.uid
        }).catch(function (error) {
            setError(error.response.data)
        })

        onCloseSelfAndRefreshParent()
    }

    async function refreshRelationshipStatus() {
        setLoading(true)
        const res = await axiosInstance.get(`/patient/getDoctorRelationship?doctorUid=${data.user.uid}`)
        setRelationship(res.data)
        setLoading(false)
    }

    function onCloseSelf() {
        setConfirmRemoval(false)
        setConfirmRejection(false)
        props.onClose()
    }

    function onCloseSelfAndRefreshParent() {
        setConfirmRemoval(false)
        setConfirmRejection(false)
        props.onCloseAndRefresh()
    }

    useEffect(() => {
        setLoading(true)
        setRelationship(null)

        refreshRelationshipStatus()
    }, [data])


    return (
        <Transition appear show={props.isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={onCloseSelf}
                initialFocus={focusRef}
            >
                <div className="min-h-screen px-1 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30"/>
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
              &#8203;
            </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            className="inline-block w-full max-w-3xl p-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Button icon={XIcon} layout="outline" aria-label="Close" onClick={onCloseSelf}
                                    className="top-0 right-0"/>
                            <div className="w-full h-full flex items-center justify-center flex-col">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-600 mb-3"

                                >
                                    Doctor Profile
                                </Dialog.Title>

                                <Dialog.Description as="div" className="flex flex-col items-center">
                                    <div>
                                        {data.user.avatarImageUrl ?
                                            <img src={data.user.avatarImageUrl} className="rounded-full w-52 h-52"
                                                 alt="Avatar"/>
                                            :
                                            <DefaultAvatar className="w-52 h-52"/>
                                        }
                                        {/*<img src={data.user.avatarImageUrl}/>*/}
                                    </div>

                                    <div className="my-3">
                                        <h2 className="text-2xl font-semibold text-gray-800">{`Dr. ${data.user.firstName} ${data.user.lastName}`}</h2>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-600">{data.medicalPractice}</h3>
                                    </div>


                                </Dialog.Description>

                                {/*<div className="bg-gray-50 mt-3 p-3 max-w-md flex flex-col sm:flex-row sm:px-6 items-center rounded-md">*/}

                                {/*    <span className="text-gray-600 mb-2 sm:mb-0">Do you want to invite this doctor to access your information?</span>*/}

                                {/*    <Button onClick={sendRequest}*/}
                                {/*            className="basis-1/2 bg-green-600 hover:bg-green-700 focus:ring-green-500">*/}
                                {/*        Send Request*/}
                                {/*    </Button>*/}

                                {/*</div>*/}
                                {loading ?
                                    <LoadingSpinner/>
                                    :
                                    <BottomSection/>}
                                {/*{relationship && <BottomSection/>}*/}

                            </div>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
};

export default PatientViewDoctorPopup;