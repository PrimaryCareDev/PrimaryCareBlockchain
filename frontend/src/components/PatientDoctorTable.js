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
import RelationshipStatusBadge from "./RelationshipStatusBadge";

const PatientDoctorTable = (props) => {

    const {dataTable, onRefresh} = props
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [doctor, setDoctor] = useState()

    function openModal(data) {
        setDoctor(data)
        setModalIsOpen(true)
    }

    function closeModalAndRefresh() {
        setModalIsOpen(false)
        onRefresh()
    }

    function StatusBadge(props) {
        if (props.patients.length === 0) {
            return null
        }

        const patient = props.patients[0]
        if (patient === null || patient.status === requestStatus.REJECTED) {
            return null
        } else if (patient.status === requestStatus.REQUESTED) {
            return <Badge type="warning">pending</Badge>
        } else if (patient.status === requestStatus.ACCEPTED) {
            return <Badge type="success">connected</Badge>
        }

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
                                    <div>
                                        <p className="font-semibold">{`Dr. ${value.user.firstName} ${value.user.lastName}`}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{value.medicalPractice}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {value.patients[0] && <RelationshipStatusBadge relationship={value.patients[0]} requesterIsSelf={value.patients[0].requester === userType.PATIENT}/>}
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
            {doctor &&
                <PatientViewDoctorPopup isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} onCloseAndRefresh={closeModalAndRefresh} data={doctor}/>}

        </>
    );
};

export default PatientDoctorTable;