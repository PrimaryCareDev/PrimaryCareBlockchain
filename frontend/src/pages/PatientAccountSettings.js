import React from 'react';
import GeneralAccountSettings from "../components/GeneralAccountSettings";
import {useAuth} from "../useAuth";
import {DateTime} from "luxon";

const PatientAccountSettings = () => {

    const {userData} = useAuth()

    function formatBirthDate() {
        const date = DateTime.fromISO(userData.birthDate)
        const formatted = date.toLocaleString(DateTime.DATE_MED)
        return (<>{formatted}</>)
    }
    return (
        <div className="max-w-xl">
            <GeneralAccountSettings/>
            <div className="grid grid-cols-2 py-3">
                <div className="col-span-2 sm:col-span-1">
                    <label className="block font-medium text-gray-700">
                        Sex
                    </label>
                    <span className="col-span-1">{userData.sex}</span>
                </div>
                <div className="grid grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block font-medium text-gray-700">
                            Birth Date
                        </label>
                        <span className="col-span-1">{formatBirthDate()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAccountSettings;