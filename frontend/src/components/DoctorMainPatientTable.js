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
import {axiosInstance, formatDate, titleCase, userType} from "../constants";
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
                <TableContainer className="mb-8 max-w-7xl">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>Select</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Sex</TableCell>
                                <TableCell>Birth Date</TableCell>
                                    <TableCell>Email</TableCell>
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
                                            <p>{`${value.user.firstName} ${value.user.lastName}`}</p>
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {titleCase(value.sex)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(value.birthDate)}
                                    </TableCell>
                                    <TableCell>
                                        <p>{`${value.user.email}`}</p>
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