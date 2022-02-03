import React, {Fragment, useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from "react-router-dom";
import LoadingDots from "../components/LoadingDots";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import {ArrowCircleLeftIcon, CheckIcon} from "@heroicons/react/solid";
import {Dialog, Transition} from "@headlessui/react";
import DefaultAvatar from "../components/DefaultAvatar";
import {axiosInstance} from "../constants";
import {getAuth} from "firebase/auth";

const AdminApprovalDetails = () => {

    const [loading, setLoading] = useState(true)
    const [approvalLoading, setApprovalLoading] = useState(false)
    const [idImageLoading, setIdImageLoading] = useState(true)
    const [avatarImageLoading, setAvatarImageLoading] = useState(true)
    const [licenseImageLoading, setLicenseImageLoading] = useState(true)
    const [doctorDetails, setDoctorDetails] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const data = useLocation()
    const history = useHistory();
    const auth = getAuth()

    async function refreshDoctorDetails() {
        try {
            setLoading(true)
            const doctorId = data.state.userId
            const res = await axiosInstance.get(`/admin/getDoctorDetails?doctorUid=${doctorId}`)
            setDoctorDetails(res.data)
            setLoading(false)

        } catch (e) {
            console.log(e.message)
        }
    }

    async function approveApplication() {
        try {
            setApprovalLoading(true)
            const doctorId = doctorDetails.uid
            // const docRef = doc(db, "doctors", doctorId)
            // await updateDoc(docRef, {
            //     verified: true,
            // });

            await axiosInstance.post("/admin/approveDoctor", {
                doctorUid: doctorId
            })
            setApprovalLoading(false)
            closeModal()
            await refreshDoctorDetails()
        } catch (e) {
            console.log(e.message)
        }
    }

    function closeModal() {
        setIsModalOpen(false)
    }

    function openModal() {
        setIsModalOpen(true)
    }

    useEffect(async () => {
        if (data.state) {
            await refreshDoctorDetails()

        } else {
            history.push("/admin/pending")
        }

    }, []);


    return (
        <>
            {
                loading ?
                    <LoadingDots/>
                    :
                    <>

                        {doctorDetails.verified ?
                            <div
                                className="shadow rounded-xl p-5 bg-green-600 my-5 lg:flex lg:items-center lg:justify-between">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-semibold leading-7 text-white sm:text-2xl">
                                        This applicant has been approved</h2>
                                </div>
                                <div className=" mt-4 flex items-center justify-around gap-4 lg:ml-3 lg:mt-0">

                                    <Link to="/admin/pending">
                                        <Button size="large"
                                                iconLeft={ArrowCircleLeftIcon}
                                                className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500">Back</Button>
                                    </Link>
                                </div>
                            </div>
                            :
                            <div
                                className="shadow rounded-xl p-5 bg-indigo-600 my-5 lg:flex lg:items-center lg:justify-between">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-semibold leading-7 text-white sm:text-2xl">
                                        Do you want to approve this applicant?</h2>
                                </div>
                                <div className=" mt-4 flex items-center justify-around gap-4 lg:ml-3 lg:mt-0">

                                    <Link to="/admin/pending">
                                        <Button size="large"
                                                iconLeft={ArrowCircleLeftIcon}
                                                className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500">Back</Button>
                                    </Link>
                                    <Button onClick={openModal} size="large" iconLeft={CheckIcon}
                                            className="bg-green-600 hover:bg-green-700 focus:ring-green-500">
                                        Approve
                                    </Button>

                                </div>
                            </div>
                        }

                        <div className="bg-white shadow sm:rounded-lg my-5">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Applicant Information</h3>
                                {/*<p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and*/}
                                {/*    application.</p>*/}
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Profile Picture</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {doctorDetails.user.avatarImageUrl ?
                                                <>
                                                    {avatarImageLoading && <LoadingSpinner/>}
                                                    <img src={doctorDetails.user.avatarImageUrl}
                                                         onLoad={() => setAvatarImageLoading(false)}
                                                         className="rounded-full" alt="Avatar"/>
                                                </>
                                                : <DefaultAvatar/>
                                            }
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">First name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorDetails.user.firstName}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Last name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorDetails.user.lastName}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorDetails.user.email}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Practice/clinic name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorDetails.medicalPractice}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Medical License Number</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorDetails.medicalLicenseNumber}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Identification Image</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {idImageLoading && <LoadingSpinner/>}
                                            <img src={doctorDetails.idImageUrl}
                                                 onLoad={() => setIdImageLoading(false)}
                                                 className="w-full sm:max-w-xl" alt="Identification"/>
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">License Image</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {licenseImageLoading && <LoadingSpinner/>}
                                            <img src={doctorDetails.licenseImageUrl}
                                                 onLoad={() => setLicenseImageLoading(false)}
                                                 className="w-full sm:max-w-xl" alt="License"/>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <Transition appear show={isModalOpen} as={Fragment}>
                            <Dialog
                                as="div"
                                className="fixed inset-0 z-10 overflow-y-auto"
                                onClose={closeModal}
                            >
                                <div className="min-h-screen px-4 text-center">
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
                                    >&#8203;
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
                                            className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                Confirm Approval
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Are you sure you want to
                                                    approve {`${doctorDetails.user.firstName} ${doctorDetails.user.lastName}`} as
                                                    a Doctor?
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center justify-around">
                                                {approvalLoading ?

                                                    <LoadingSpinner/>
                                                    :
                                                    <>
                                                        <Button onClick={closeModal} size="large"
                                                                className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500">
                                                            Cancel
                                                        </Button>
                                                        <Button disabled={approvalLoading} onClick={approveApplication}
                                                                size="large"
                                                                className="bg-green-600 hover:bg-green-700 focus:ring-green-500">
                                                            Confirm
                                                        </Button>
                                                    </>
                                                }

                                            </div>
                                        </div>
                                    </Transition.Child>
                                </div>
                            </Dialog>
                        </Transition>
                    </>
            }
        </>
    );
};

export default AdminApprovalDetails;
