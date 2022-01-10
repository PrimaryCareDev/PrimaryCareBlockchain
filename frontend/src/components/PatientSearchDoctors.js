import React, {useRef, useState} from 'react';
import classnames from "classnames";
import Button from "./Button";
import {useForm} from "react-hook-form";
import {axiosInstance, getApiUrl} from "../constants";
import PatientViewDoctorPopup from "../pages/PatientViewDoctorPopup";
import PatientDoctorTable from "./PatientDoctorTable";
import SubTitle from "./SubTitle";
import {XIcon} from "@heroicons/react/solid";
import {XCircleIcon} from "@heroicons/react/outline";

const PatientSearchDoctors = () => {

    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState()
    const [showTable, setShowTable] = useState(false)
    const formRef = useRef(null)


    async function onSubmit(data) {
        setLoading(true)
        setError(false)
        setShowTable(false)

        const res = await axiosInstance.get(`/patient/searchDoctors?query=${data.queryStr}`)
            .catch(function (error) {
                setError(error.response.data)
            })

        if (res) {
            setSearchResults(res.data)
            setShowTable(true)
        }
        setLoading(false)
    }

    function clearSearchResults() {
        setShowTable(false)
        reset()
    }

    return (
        <div className="max-w-2xl">
            <form onSubmit={handleSubmit(onSubmit)} method="POST" className="flex flex-col sm:flex-row" ref={formRef}>
                <input
                    type="text"
                    name="query-string"
                    id="query-string"
                    placeholder="Doctor's name, email or medical practice"
                    // className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    className={classnames('focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-96 shadow-sm sm:text-sm border-gray-300 rounded-md',
                        {
                            'border-red-500': error || errors.queryStr
                        }
                    )}
                    {...register("queryStr", {
                        required: "Enter a search term",
                        // pattern: {
                        //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        //     message: "Enter a valid e-mail address"
                        // }
                    })}
                />
                <Button type="submit" className="mt-3 sm:mt-0 sm:ml-3" disabled={loading}>Search Doctors</Button>
            </form>
            <span className="block text-sm font-medium text-red-700 mt-2">{error}</span>
            <span className="block text-sm font-medium text-red-700 mt-2">{errors.queryStr?.message}</span>
            {showTable &&
                <>
                    <div className="flex items-center gap-1">
                        <SubTitle>Search Results</SubTitle>
                        <Button icon={XCircleIcon} layout="link" aria-label="Clear Search" onClick={clearSearchResults}/>
                    </div>
                    <PatientDoctorTable dataTable={searchResults}/>
                </>
            }


        </div>
    );
};

export default PatientSearchDoctors;