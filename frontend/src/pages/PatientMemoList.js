import React, {useEffect, useState} from 'react';
import LoadingSpinner from "../components/LoadingSpinner";
import TableContainer from "../components/TableContainer";
import Table from "../components/Table";
import TableHeader from "../components/TableHeader";
import TableCell from "../components/TableCell";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import Button from "../components/Button";
import {SearchIcon, ShoppingCartIcon} from "@heroicons/react/solid";
import {axiosInstance, formatDateTime} from "../constants";
import TableFooter from "../components/TableFooter";
import Pagination from "../components/Pagination";
import {useHistory} from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

const PatientMemoList = () => {

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(-1)
    const [dataTable, setDataTable] = useState()
    const [pageTable, setPageTable] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const history = useHistory();

    const resultsPerPage = 10

    function onPageChangeTable(p) {
        setPageTable(p)
    }

    async function getMemos() {
        const res = await axiosInstance.get(`/patient/getAllMemos?pageNum=${pageTable}&perPage=${resultsPerPage}`)
        setDataTable(res.data.results)
        setTotalResults(res.data.totalCount)
        setLoading(false)
    }

    function viewMemo(memoId) {
        history.push(`/patient/memos/${memoId}`)
    }

    async function buyMemo(memoId) {
        setSubmitting(memoId)
        const purchase = await axiosInstance.post("/patient/purchaseMemo", {memoId: memoId})
        window.location.href = purchase.data.url
    }

    useEffect(() => {
        getMemos()
    }, [pageTable])

    return (
        <div>
            <SectionTitle>Viewing All Memos</SectionTitle>
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
                                        {value.patientHasAccess ?
                                            <Button disabled={submitting > -1} onClick={() => viewMemo(value.id)}
                                                    icon={SearchIcon}>View</Button>
                                            :
                                            <Button disabled={submitting > -1} onClick={() => buyMemo(value.id)}
                                                    icon={ShoppingCartIcon} layout="submit">
                                                {submitting === value.id ?
                                                    <SmallLoadingSpinner className="h-5 w-5 mr-2 ml-1"/>
                                                    :
                                                    <>USD$5</>
                                                }
                                            </Button>
                                        }
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

export default PatientMemoList;