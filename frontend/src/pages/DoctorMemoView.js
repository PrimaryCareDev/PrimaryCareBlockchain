import React, {useEffect, useState} from 'react';
import {axiosInstance} from "../constants";
import LoadingSpinner from "../components/LoadingSpinner";
import {useHistory, useParams} from "react-router-dom";
import DoctorMemoForm from "./DoctorMemoForm";
import CommonMemoView from "../components/CommonMemoView";

const DoctorMemoView = (props) => {

    const {patientUid} = props
    const [data, setData] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const [hasEditAccess, setHasEditAccess] = useState(false)
    const history = useHistory()
    const {memoId} = useParams()

    async function retrieveMemo() {
        const res = await axiosInstance.get(`/doctor/getMemo?memoId=${memoId}`)
        setHasEditAccess(res.data.hasEditAccess)
        setData(res.data)
    }

    function backToTable() {
        history.push(`/doctor/patients/${patientUid}`)
    }

    function onBackFromEdit(toRefresh) {
        setShowEdit(false)
        if (toRefresh) {
            setData(null)
            retrieveMemo()
        }
    }

    useEffect(() => {
        retrieveMemo()
    }, [])

    return (
        <>
            {!data ?

                <LoadingSpinner/>
                :
                <>
                    {!showEdit ?
                        <CommonMemoView data={data} onBack={backToTable} hasEditAccess={hasEditAccess} onEditClick={setShowEdit}/>
                        :
                        <DoctorMemoForm patientUid={patientUid} data={data} onBack={onBackFromEdit}/>
                    }
                </>
            }
        </>


    );
}


export default DoctorMemoView;