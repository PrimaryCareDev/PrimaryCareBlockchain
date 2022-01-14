import React, {useState} from 'react';
import Table from "./Table";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import TableBody from "./TableBody";
import TableRow from "./TableRow";
import DefaultAvatar from "./DefaultAvatar";
import Button from "./Button";
import TableFooter from "./TableFooter";
import TableContainer from "./TableContainer";
import {requestStatus, userType} from "../constants";
import {SearchIcon} from "@heroicons/react/solid";
import PatientViewDoctorPopup from "../pages/PatientViewDoctorPopup";
import Badge from "./Badge";
import DoctorViewPatientPopup from "../pages/DoctorViewPatientPopup";
import RelationshipStatusBadge from "./RelationshipStatusBadge";

const PatientDoctorTable = (props) => {

    const {dataTable, onRefresh} = props
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [patient, setPatient] = useState()

    function openModal(data) {
        setPatient(data)
        setModalIsOpen(true)
    }

    function closeModalAndRefresh() {
        setModalIsOpen(false)
        onRefresh()
    }

    return (
        <>
            <TableContainer className="mb-8 max-w-xl">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableCell>Select</TableCell>
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
                                    <Button onClick={() => openModal(value)} icon={SearchIcon}/>
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
                                    <p className="font-semibold">{`${value.user.email}`}</p>
                                </TableCell>
                                <TableCell>
                                    {value.doctors[0] && <RelationshipStatusBadge relationship={value.doctors[0]} requesterIsSelf={value.doctors[0].requester === userType.DOCTOR}/>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    {/*<Pagination*/}
                    {/*    totalResults={totalResults}*/}
                    {/*    resultsPerPage={resultsPerPage}*/}
                    {/*    onChange={onPageChangeTable}*/}
                    {/*    label="Table navigation"*/}
                    {/*/>*/}
                </TableFooter>
            </TableContainer>
            {patient &&
                <DoctorViewPatientPopup isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} onCloseAndRefresh={closeModalAndRefresh} data={patient}/>}

        </>
    );
};

export default PatientDoctorTable;