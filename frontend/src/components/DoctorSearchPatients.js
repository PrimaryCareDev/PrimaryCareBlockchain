import React, {useRef, useState} from 'react';
import classnames from "classnames";
import Button from "./Button";
import {useForm} from "react-hook-form";
import {axiosInstance, getApiUrl} from "../constants";
import PatientViewDoctorPopup from "../pages/PatientViewDoctorPopup";
import PatientDoctorTable from "./PatientDoctorTable";
import DoctorManagePatientsTable from "./DoctorManagePatientsTable";
import DoctorViewPatientPopup from "../pages/DoctorViewPatientPopup";

const DoctorSearchPatients = () => {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchResult, setSearchResult] = useState()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const formRef = useRef(null)


    async function onSubmit(data) {
        setLoading(true)
        setError(false)

        const res = await axiosInstance.post("/doctor/searchPatients", {
            query: data.queryStr
        }).catch(function (error) {
            setError(error.response.data)
        })

        if (res) {
            setSearchResult(res.data)
            setModalIsOpen(true)
        }
        setLoading(false)

    }

    return (
        <div className="flex-col">
            <form onSubmit={handleSubmit(onSubmit)} method="POST" className="flex flex-col sm:flex-row" ref={formRef}>
                <input
                    type="text"
                    name="query-string"
                    id="query-string"
                    placeholder="Patient's Email"
                    // className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    className={classnames('focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-sm border-gray-300 rounded-md',
                        {
                            'border-red-500': error || errors.queryStr
                        }
                    )}
                    {...register("queryStr", {
                        required: "Enter a search term",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: "Enter a valid e-mail address"
                        }
                    })}
                />
                <Button type="submit" className="mt-3 sm:mt-0 sm:ml-3" disabled={loading}>Search</Button>
            </form>
            <span className="block text-sm font-medium text-red-700 mt-2">{error}</span>
            <span className="block text-sm font-medium text-red-700 mt-2">{errors.queryStr?.message}</span>
            {/*<Button onClick={() => setModalIsOpen(true)}>Test</Button>*/}
            {searchResult &&
                <DoctorViewPatientPopup isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} data={searchResult}/>}

        </div>
    );
};

export default DoctorSearchPatients;