import React from 'react';
import GeneralAccountSettings from "../components/GeneralAccountSettings";
import {useAuth} from "../useAuth";

const DoctorAccountSettings = () => {
    const {user, userData} = useAuth()

    return (
        <div className="max-w-xl">
            <GeneralAccountSettings/>
            <div className="grid grid-cols-2 py-3">
                <div className="col-span-2 sm:col-span-1">
                    <label className="block font-medium text-gray-700">
                        Medical Practice
                    </label>
                    <span className="col-span-1">{userData.medicalPractice}</span>
                </div>
                <div className="grid grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block font-medium text-gray-700">
                            Medical License
                        </label>
                        <span className="col-span-1">{userData.medicalLicenseNumber}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DoctorAccountSettings;