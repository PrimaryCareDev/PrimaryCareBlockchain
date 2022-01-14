import React, {useEffect, useState} from 'react';
import Table from "./Table";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import TableBody from "./TableBody";
import TableRow from "./TableRow";
import Button from "./Button";
import {SearchIcon} from "@heroicons/react/solid";
import DefaultAvatar from "./DefaultAvatar";
import Badge from "./Badge";
import RelationshipStatusBadge from "./RelationshipStatusBadge";
import {axiosInstance, userType} from "../constants";
import TableFooter from "./TableFooter";
import TableContainer from "./TableContainer";
import LoadingDots from "./LoadingDots";
import Pagination from "./Pagination";
import {Link, useRouteMatch} from "react-router-dom";

const DoctorMainPatientTable = () => {

    const [loading, setLoading] = useState(true)
    const [dataTable, setDataTable] = useState()
    const [pageTable, setPageTable] = useState()
    const [totalResults, setTotalResults] = useState(0)
    const { url } = useRouteMatch();


    const resultsPerPage = 10

    async function getMyPatients() {
        const res = await axiosInstance.get(`/doctor/getPatients`)
        setDataTable(res.data)
        setTotalResults(res.data.length)
        setLoading(false)

    }

    useEffect(() => {
        setLoading(true)
        getMyPatients()
    }, [])

    function onPageChangeTable(p) {
        setPageTable(p)
    }

    return (
        <div>
            {loading ?
                <LoadingDots/>
                :
                <TableContainer className="mb-8 max-w-xl">
                    <Table>
                        <TableHeader>
                            <tr>
                                {/*<TableCell>Select</TableCell>*/}
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Status</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {dataTable.map((value, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        {/*<Link to={`${url}/${value.user.uid}`}>*/}
                                        <Link to={{
                                            pathname: `${url}/${value.user.uid}`,
                                            state: {value}
                                        }}>
                                            <Button icon={SearchIcon}/>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {value.user.avatarImageUrl ?
                                            <img src={value.user.avatarImageUrl} className="rounded-full h-12 w-12"
                                                 alt="Avatar"/>
                                            :
                                            <DefaultAvatar/>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {(!value.user.firstName && !value.user.lastName) ?
                                            <Badge type="neutral">no name</Badge>
                                            :
                                            <p className="font-semibold">{`${value.user.firstName} ${value.user.lastName}`}</p>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {/*<StatusBadge doctors={value.doctors}/>*/}
                                        <p className="font-semibold">{`${value.user.email}`}</p>
                                    </TableCell>
                                    <TableCell>
                                        {value.doctors[0] && <RelationshipStatusBadge relationship={value.doctors[0]}
                                                                                      requesterIsSelf={value.doctors[0].requester === userType.DOCTOR}/>}
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

export default DoctorMainPatientTable;