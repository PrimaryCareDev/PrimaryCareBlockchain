import React, {useEffect, useState} from 'react';
import Table from "../components/Table";
import TableHeader from "../components/TableHeader";
import TableCell from "../components/TableCell";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableFooter from "../components/TableFooter";
import TableContainer from "../components/TableContainer";
import LoadingDots from "../components/LoadingDots";
import Button from "../components/Button";
import {Link, useRouteMatch} from "react-router-dom";
import DefaultAvatar from "../components/DefaultAvatar";
import Pagination from "../components/Pagination";
import {axiosInstance} from "../constants";
import SectionTitle from "../components/SectionTitle";

const AdminApprovals = () => {

    const [loading, setLoading] = useState(true)
    const [dataTable, setDataTable] = useState(true)
    const [pageTable, setPageTable] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    let {url} = useRouteMatch();

    const resultsPerPage = 10

    function onPageChangeTable(p) {
        setPageTable(p)
    }

    // on page change, load new sliced data
    // here you would make another server request for new data
    useEffect(async () => {

        const res = await axiosInstance.get(`/admin/getApprovalsList?pageNum=${pageTable}&perPage=${resultsPerPage}`)
        setDataTable(res.data.results)
        setTotalResults(res.data.totalCount)
        setLoading(false)


    }, [pageTable])

    return (
        <>
            <SectionTitle>List of Doctors Awaiting Verification</SectionTitle>
            {!loading ?

                <TableContainer className="mb-8">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>Avatar</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {dataTable.map((value, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        {value.user.avatarImageUrl ?
                                            <img src={value.user.avatarImageUrl} className="rounded-full h-12 w-12"
                                                 alt="Avatar"/>
                                            :
                                            <DefaultAvatar/>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-semibold">{`${value.user.firstName} ${value.user.lastName}`}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm">
                                            {/* <Avatar className="hidden mr-3 md:block" src={user.avatar} alt="User avatar" /> */}
                                            <div>
                                                <p className="font-semibold">{value.user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {value.verified ?
                                            <span
                                                className="px-3 py-1  text-sm rounded-full text-green-600  bg-green-200">
                                            Verified
                                            </span>
                                            :
                                            <span
                                                className="px-3 py-1  text-sm rounded-full text-yellow-600  bg-yellow-200">
                                            Pending Verification
                                            </span>
                                        }

                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            to={{
                                                pathname: `${url}/details`,
                                                state: {userId: value.uid}
                                            }}
                                        >
                                            <Button> View </Button>
                                        </Link>
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
                :
                <LoadingDots/>
            }
        </>

    );
};

export default AdminApprovals;
