import React from 'react';
import Button from "./Button";
import {ChevronLeftIcon, PencilIcon} from "@heroicons/react/solid";
import {formatDateTime} from "../constants";

const CommonMemoView = (props) => {

    const {data, onBack, hasEditAccess, onEditClick} = props
    return (
        <div className="max-w-7xl my-6 bg-white shadow overflow-hidden rounded-lg">
            <div className="border-b border-gray-200 p-4 bg-white flex items-center gap-x-3">
                <div className="border-r border-gray-200">
                    <Button icon={ChevronLeftIcon} size="large" layout="link"
                            onClick={onBack}>Back</Button>
                </div>
                <span className="text-lg leading-6 font-medium text-gray-900">Memo Information</span>
                {hasEditAccess && <Button size="small" layout="outline" icon={PencilIcon}
                                          onClick={() => onEditClick(true)}>Edit</Button>}

            </div>
            <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-2 max-w-sm">
                    <span className="text-sm font-medium text-gray-500">Created by</span>
                    <span
                        className="ml-3 text-sm text-gray-900">Dr. {data.doctor.user.firstName} {data.doctor.user.lastName}</span>
                    <span className="text-sm font-medium text-gray-500">Created On</span>
                    <span className="ml-3 text-sm text-gray-900">{formatDateTime(data.createdAt)}</span>
                    {data.updatedAt &&
                        <>
                    <span className="text-sm font-medium text-gray-500">Last Updated</span>
                    <span className="ml-3 text-sm text-gray-900">{formatDateTime(data.updatedAt)}</span>
                    </>}
                </div>
            </div>
            <div className="p-4 border-b border-gray-200">

                <h3 className="mb-3 text-lg font-medium text-gray-900">Diagnoses</h3>

                {data.diagnoses.map((item, i) => {
                    return (
                        <li key={i} className="flex items-center gap-1 my-3 flex-wrap">
                            <p>{`[${item.code}] ${item.title}`}</p>
                        </li>
                    );
                })}
            </div>

            <div className="p-4 border-b border-gray-200">
                <h3 className="mb-3 text-lg font-medium text-gray-900">Description</h3>
                <p className="whitespace-pre-line">{data.description}</p>
            </div>

            <div className="p-4 border-b border-gray-200">
                <h3 className="mb-3 text-lg font-medium text-gray-900">Prescriptions</h3>
                {data.prescriptions.length === 0 &&
                    <p className="my-3 text-gray-900">No prescriptions</p>}

                {data.prescriptions.map((item, i) => {
                    return (

                        <li key={item.id} className="flex items-center gap-1 my-3 flex-wrap">
                            <div className="grid grid-cols-8 gap-3">

                                <div className="col-span-8 sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Drug Name
                                    </label>
                                    <p>{item.drugName}</p>
                                </div>

                                <div className="col-span-4 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Dosage (Tab/ml/etc.)
                                    </label>
                                    <p>{item.dosage}</p>

                                </div>
                                <div className="col-span-4 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Units per dose
                                    </label>
                                    <p>{item.unitsPerDose}</p>

                                </div>
                                <div className="col-span-4 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Total units
                                    </label>
                                    <p>{item.totalUnits}</p>

                                </div>
                                <div className="col-span-4 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Frequency
                                    </label>
                                    <p>{item.frequency}</p>

                                </div>

                            </div>
                        </li>
                    );
                })}
            </div>


        </div>
    );
};

export default CommonMemoView;