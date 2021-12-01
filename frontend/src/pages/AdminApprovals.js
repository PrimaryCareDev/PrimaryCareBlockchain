import React, {useEffect, useState} from 'react';
import Table from "../components/Table";
import TableHeader from "../components/TableHeader";
import TableCell from "../components/TableCell";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableFooter from "../components/TableFooter";
import Pagination from "../components/Pagination";
import TableContainer from "../components/TableContainer";
import {getDocs, collection, query, where, getFirestore} from "firebase/firestore/lite";
import LoadingDots from "../components/LoadingDots";
import Button from "../components/Button";


const AdminApprovals = () => {

    const [pageTable, setPageTable] = useState(1)
    const[loading, setLoading] = useState(true)
    const[dataTable, setDataTable] = useState(true)
    const db = getFirestore()



    async function getUnverifiedList() {
        const doctorsRef = collection(db, "doctors");


        const q = query(doctorsRef, where("verified", "==", false));


        const querySnapshot = await getDocs(q);

        setDataTable(querySnapshot.docs.map(doc => doc.data()))
    }


    useEffect(() => {

        getUnverifiedList().then(r => setLoading(false))
    }, []);

    // pagination change control
    function onPageChangeTable(p) {
        setPageTable(p)
    }

    return (
<>
        {!loading ?

        <TableContainer className="mb-8">
            <Table>
                <TableHeader>
                    <tr>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </tr>
                </TableHeader>
                <TableBody>
                    {dataTable.map((user, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className="flex items-center text-sm">
                                    {/* <Avatar className="hidden mr-3 md:block" src={user.avatar} alt="User avatar" /> */}
                                    <div>
                                        <p className="font-semibold">{user.email}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{user.job}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{user.verified.toString()}</span>
                            </TableCell>
                            <TableCell>
                                <Button/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TableFooter>
                <Pagination
                    totalResults={1}
                    resultsPerPage={10}
                    onChange={onPageChangeTable}
                    label="Table navigation"
                />
            </TableFooter>
        </TableContainer>
        :
        <LoadingDots/>}
    </>

    );
};

export default AdminApprovals;
