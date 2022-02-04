import React, {useCallback, useEffect, useState} from 'react';
import {useFieldArray, useForm} from "react-hook-form";
import Button from "../components/Button";
import * as ECT from "@whoicd/icd11ect"
import '@whoicd/icd11ect/style.css';
import {axiosInstance, formatDateTime} from "../constants";
import {ChevronLeftIcon, XIcon} from "@heroicons/react/solid";
import classnames from "classnames";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

const style = {
    prescriptionInput: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
};

const DoctorMemoForm = (props) => {
    const {register, control, formState: {errors}, handleSubmit, reset} = useForm();
    const {patientUid, data, onBack} = props
    const [editMode, setEditMode] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const {
        fields: diagnosesFields,
        append: diagnosesAppend,
        remove: diagnosesRemove,
    } = useFieldArray({
        control,
        name: "diagnoses"
    });

    const {
        fields: prescriptionsFields,
        append: prescriptionsAppend,
        remove: prescriptionsRemove,
    } = useFieldArray({
        control,
        name: "prescriptions"
    });


    async function onSubmit(data) {

        setSubmitting(true)
        if (!editMode) {
            await axiosInstance.post("/doctor/createMemo", {
                patientUid: patientUid,
                diagnoses: data.diagnoses,
                description: data.description,
                prescriptions: data.prescriptions
            })
        } else {
            const newDiagnoses = data.diagnoses.map(({id, memoId, ...keepAttrs}) => keepAttrs)
            const newPrescriptions = data.prescriptions.map(({id, memoId, ...keepAttrs}) => keepAttrs)

            await axiosInstance.post("/doctor/editMemo", {
                id: data.id,
                diagnoses: newDiagnoses,
                description: data.description,
                prescriptions: newPrescriptions
            })

        }
        onBack(true)

    }

    function addCode(value) {
        diagnosesAppend({code: value.code, title: value.title});
    }

    function addPrescription() {
        prescriptionsAppend({drugName: "", dosage: "", unitsPerDose: "", totalUnits: "", frequency: ""})
    }

    const initIcdTool = useCallback(() => {
        const mySettings = {
            apiServerUrl: "https://id.who.int",
            apiSecured: true,
            autoBind: false,
            popupMode: true
        };

        const myCallbacks = {
            selectedEntityFunction: (selectedEntity) => {
                console.log(selectedEntity)
                addCode(selectedEntity)
                ECT.Handler.clear("1")
            },
            getNewTokenFunction: async () => {

                const res = await axiosInstance.get("/doctor/getIcdToken")

                return res.data.access_token
            },
            searchStartedFunction: () => {
                //this callback is called when searching is started.
                console.log("Search started!");
            },
            searchEndedFunction: () => {
                //this callback is called when search ends.
                console.log("Search ended!");
            }
        };

        ECT.Handler.configure(mySettings, myCallbacks);
        ECT.Handler.bind("1");
    }, [])

    useEffect(() => {
        initIcdTool()
        if (data) {
            reset(data)
            setEditMode(true)
            console.log(data)
        }
    }, [initIcdTool])

    return (
        <div className="max-w-7xl my-3 bg-white shadow sm:rounded-md sm:overflow-hidden">
            <div className="border-b border-gray-200 p-4 bg-white flex items-center gap-x-3">
                <div className="border-r border-gray-200">
                    <Button icon={ChevronLeftIcon} size="large" layout="link" onClick={() => onBack(false)}>Back</Button>
                </div>
                {editMode ?

                    <span className="text-lg leading-6 font-medium text-gray-900">Editing memo</span>
                    :
                    <span className="text-lg leading-6 font-medium text-gray-900">Creating new memo</span>
                }
            </div>
            {editMode &&
                <div className="p-4 border-b border-gray-200">
                    <div className="grid grid-cols-2 max-w-sm">
                        <span className="text-sm font-medium text-gray-500">Created by</span>
                        <span
                            className="ml-3 text-sm text-gray-900">Dr. {data.doctor.user.firstName} {data.doctor.user.lastName}</span>
                        <span className="text-sm font-medium text-gray-500">Created On</span>
                        <span className="ml-3 text-sm text-gray-900">{formatDateTime(data.createdAt)}</span>
                        <span className="text-sm font-medium text-gray-500">Last Updated</span>
                        <span className="ml-3 text-sm text-gray-900">{formatDateTime(data.updatedAt)}</span>
                    </div>
                </div>
            }
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="border-b border-gray-200 p-4">

                    <h3 className="mb-3 text-lg font-medium text-gray-900">Diagnoses</h3>
                    <input type="text"
                           className="ctw-input mb-3 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                           autoComplete="off" placeholder="Search for diagnosis here" data-ctw-ino="1"/>
                    <div className="ctw-window w-full" data-ctw-ino="1"/>

                    <label className="block font-medium text-gray-700">
                        Current diagnoses:
                    </label>
                    {diagnosesFields.length === 0 ?
                        <p className="block text-sm font-medium text-red-700 mt-2">Please add at least one
                            diagnosis.</p>
                        :
                        <ul>
                            {diagnosesFields.map((item, index) => {
                                return (
                                    <li key={item.id} className="flex items-center gap-1 my-3 flex-wrap">
                                        <input
                                            className="w-32 bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm border-gray-300 rounded-md"
                                            type="text" disabled={true} {...register(`diagnoses.${index}.code`)} />

                                        <div><input
                                            className="bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm border-gray-300 rounded-md"
                                            type="text" disabled={true} {...register(`diagnoses.${index}.title`)} />

                                            {/*<Controller*/}
                                            {/*    render={({ field }) => <input {...field}  />}*/}
                                            {/*    name={`diagnoses.${index}.code`}*/}
                                            {/*    control={control}*/}
                                            {/*/>*/}
                                            <Button className="ml-3" icon={XIcon} layout="outline"
                                                    onClick={() => diagnosesRemove(index)}/>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    }
                </div>

                <div className="border-b border-gray-200 p-4">
                    <h3 className="mb-3 text-lg font-medium text-gray-900">Description</h3>
                    <textarea
                        id="description"
                        name="description"
                        rows={7}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        defaultValue={''}
                        {...register("description")}

                    />
                </div>

                <div className="border-b border-gray-200 p-4">
                    <h3 className="mb-3 text-lg font-medium text-gray-900">Prescriptions</h3>
                    {prescriptionsFields.length === 0 && <p className="my-3 text-gray-900">No prescriptions</p>}

                    <Button layout="submit" onClick={() => addPrescription()}>Add prescription</Button>
                    {prescriptionsFields.map((item, index) => {
                        return (

                            <li key={item.id} className="flex items-center gap-1 my-3 flex-wrap">
                                <div className="grid grid-cols-8 gap-3">

                                    <div className="col-span-8 sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Drug Name
                                        </label>
                                        <input
                                            className={classnames(style.prescriptionInput, {
                                                'border-red-500': errors.prescriptions?.[index]?.drugName
                                            })}
                                            type="text" {...register(`prescriptions.${index}.drugName`, {required: true})} />
                                    </div>

                                    <div className="col-span-4 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Dosage (Tab/ml/etc.)
                                        </label>
                                        <input
                                            className={classnames(style.prescriptionInput, {
                                                'border-red-500': errors.prescriptions?.[index]?.dosage
                                            })}
                                            type="text" {...register(`prescriptions.${index}.dosage`, {required: true})} />

                                    </div>
                                    <div className="col-span-4 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Units per dose
                                        </label>
                                        <input
                                            className={classnames(style.prescriptionInput, {
                                                'border-red-500': errors.prescriptions?.[index]?.unitsPerDose
                                            })}
                                            type="text" {...register(`prescriptions.${index}.unitsPerDose`, {required: true})} />

                                    </div>
                                    <div className="col-span-4 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Total units
                                        </label>
                                        <input
                                            className={classnames(style.prescriptionInput, {
                                                'border-red-500': errors.prescriptions?.[index]?.totalUnits
                                            })}
                                            type="text" {...register(`prescriptions.${index}.totalUnits`, {required: true})} />

                                    </div>
                                    <div className="col-span-4 sm:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Frequency
                                        </label>
                                        <input
                                            className={classnames(style.prescriptionInput, {
                                                'border-red-500': errors.prescriptions?.[index]?.frequency
                                            })}
                                            type="text" {...register(`prescriptions.${index}.frequency`, {required: true})} />

                                    </div>
                                    <Button layout="danger"
                                            className="col-span-4 sm:col-span-1 align-self-end self-end"
                                            onClick={() => prescriptionsRemove(index)}>Remove</Button>


                                </div>
                                {errors.prescriptions?.[index] &&
                                    <p className="block text-sm font-medium text-red-700 mt-2">Please check this
                                        prescription and fill in all fields</p>}

                            </li>
                        );
                    })}
                </div>

                <div className="border-b border-gray-200 p-4">
                    <Button className="mt-3" type="submit" disabled={submitting}>{submitting &&
                        <SmallLoadingSpinner className="h-5 w-5 mr-2 -ml-1"/>}Save Memo</Button>
                </div>

            </form>
        </div>
    );
};

export default DoctorMemoForm;