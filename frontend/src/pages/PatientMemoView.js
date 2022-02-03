import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {axiosInstance, useQuery} from "../constants";
import CommonMemoView from "../components/CommonMemoView";
import LoadingDots from "../components/LoadingDots";

const PatientMemoView = () => {

    const [data, setData] = useState(null)
    const history = useHistory()
    const {memoId} = useParams()
    const query = useQuery();


    async function retrieveMemo() {
        const res = await axiosInstance.get(`/patient/getMemo?memoId=${memoId}`)
        setData(res.data)
    }

    function backToTable() {
        history.push(`/patient/memos`)
    }

    useEffect(() => {
        retrieveMemo()
    }, [])

    return (
        <>
            {!data ?
                <LoadingDots/> :
                <>
                    {query.get("purchased") === "true" &&
                        <div
                            className="shadow rounded-xl max-w-7xl p-4 bg-green-600 lg:flex lg:items-center lg:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-semibold text-white sm:text-xl">
                                    This memo has been successfully purchased</h2>
                            </div>
                        </div>
                    }
                    <CommonMemoView data={data} onBack={backToTable} hasEditAccess={false}/>

                </>
            }
        </>
    );
};

export default PatientMemoView;