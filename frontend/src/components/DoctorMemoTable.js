import React, {useEffect, useState} from 'react';
import Table from "./Table";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import TableBody from "./TableBody";
import TableRow from "./TableRow";
import {useHistory} from "react-router-dom";
import Button from "./Button";
import {SearchIcon} from "@heroicons/react/solid";
import TableFooter from "./TableFooter";
import Pagination from "./Pagination";
import TableContainer from "./TableContainer";
import LoadingSpinner from "./LoadingSpinner";
import {axiosInstance, formatDateTime} from "../constants";

const DoctorMemoTable = (props) => {

    const [loading, setLoading] = useState(true)
    const [dataTable, setDataTable] = useState()
    const [pageTable, setPageTable] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const {patientUid} = props
    const history = useHistory();

    const resultsPerPage = 10

    function onPageChangeTable(p) {
        setPageTable(p)
    }

    async function getPatientMemos() {
        const res = await axiosInstance.get(`/doctor/getAllMemos?patientUid=${patientUid}&pageNum=${pageTable}&perPage=${resultsPerPage}`)
        console.log(res.data.results)
        setDataTable(res.data.results)
        setTotalResults(res.data.totalCount)
        setLoading(false)
    }

    function viewMemo(memoId) {
        history.push(`/doctor/patients/${patientUid}/${memoId}`)
    }


    useEffect(() => {
        getPatientMemos()
    }, [pageTable])

    return (
        <div>
            {loading ?
                <LoadingSpinner/>
                :
                <TableContainer className="mb-8 max-w-6xl">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>Select</TableCell>
                                <TableCell>Doctor</TableCell>
                                <TableCell>Diagnoses</TableCell>
                                <TableCell>Date Created</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {dataTable.map((value, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                            <Button onClick={()=>viewMemo(value.id)} icon={SearchIcon}/>
                                    </TableCell>
                                    <TableCell>
                                        <span>{`Dr. ${value.doctor.user.firstName} ${value.doctor.user.lastName}`}</span>
                                    </TableCell>
                                    <TableCell>
                                        {value.diagnoses.map((v, j) => (
                                            <li key={j}>{`[${v.code}] ${v.title}`}</li>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <span>{formatDateTime(value.createdAt)}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TableFooter>
                        <Pagination
                            totalResults={totalResults}
                            resultsPerPage={resultsPerPage}
                            onChange={onPageChangeTable}
                            label="Table navigation"
                        />
                    </TableFooter>
                </TableContainer>
            }
        </div>
    );
};

export default DoctorMemoTable;