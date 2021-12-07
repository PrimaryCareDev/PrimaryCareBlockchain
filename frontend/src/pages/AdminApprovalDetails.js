import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from "react-router-dom";
import {doc, getDoc, getFirestore} from "firebase/firestore/lite";
import LoadingDots from "../components/LoadingDots";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import {CheckIcon} from "@heroicons/react/solid";


const AdminApprovalDetails = () => {

    const [loading, setLoading] = useState(true)
    const [idImageLoading, setIdImageLoading] = useState(true)
    const [details, setDetails] = useState(null)
    const [imageUrl, setImageUrl] = useState("")
    const db = getFirestore()
    const data = useLocation()
    const storage = getStorage();
    const history = useHistory();


    async function getDoctorDetails() {
        try {
            const doctorId = data.state.userId
            const docRef = doc(db, "doctors", doctorId)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setDetails(docSnap.data())
            } else {
                console.log("doctor id not found")
                //TODO: doctor id not found in DB
            }

            const storageRef = ref(storage, 'images/identification/' + doctorId);
            setImageUrl(await getDownloadURL(storageRef))
            setLoading(false)


        } catch {
            console.log("Error getting doctor's document from firestore")
        }
    }

    useEffect(() => {
        if (data.state) {
            getDoctorDetails()
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
                    // <div>
                    //     <Link to="/admin/pending">
                    //         <Button>Back</Button>
                    //     </Link>
                    //     {details.firstName}
                    //     {idImageLoading && <LoadingSpinner/>}
                    //     <img src={imageUrl} onLoad={() => setIdImageLoading(false)} />
                    // </div>
                    <>


                        <div className="shadow rounded-xl p-4 bg-indigo-600 my-5 lg:flex lg:items-center lg:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-semibold leading-7 text-white sm:text-2xl sm:truncate">Do
                                    you want to approve Dr. {details.firstName}?</h2>
                            </div>
                            <div className="flex items-center justify-around gap-4">

                                {/*<span className="sm:ml-3">*/}
                                    <Link to="/admin/pending">
                                        <Button size="large" className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500">Back</Button>
                                    </Link>
                                  <Button size="large" iconLeft={CheckIcon}
                                          className="bg-green-600 hover:bg-green-700 focus:ring-green-500">
                                    {/*<CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/>*/}
                                      Approve
                                  </Button>
                                {/*</span>*/}

                            </div>
                        </div>

                        <div className="bg-white shadow sm:rounded-lg my-5">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Applicant Information</h3>
                                {/*<p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and*/}
                                {/*    application.</p>*/}
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{details.firstName}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Application for</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Doctor
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{details.email}</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Identification Image</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {idImageLoading && <LoadingSpinner/>}
                                            <img src={imageUrl}
                                                 onLoad={() => setIdImageLoading(false)}
                                                 className="max-w-xl w-full"/>
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">About</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt
                                            cillum
                                            culpa consequat. Excepteur
                                            qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea
                                            officia proident. Irure nostrud
                                            pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </>
            }
        </>
    );
};

export default AdminApprovalDetails;
