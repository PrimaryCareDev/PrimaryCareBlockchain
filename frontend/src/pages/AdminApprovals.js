import React, {useEffect, useState} from 'react';
import Table from "../components/Table";
import TableHeader from "../components/TableHeader";
import TableCell from "../components/TableCell";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableFooter from "../components/TableFooter";
import Pagination from "../components/Pagination";
import TableContainer from "../components/TableContainer";
import {getDocs, collection, query, where, getFirestore,orderBy, limit, limitToLast, startAfter, endBefore, endAt} from "firebase/firestore/lite";
import LoadingDots from "../components/LoadingDots";
import Button from "../components/Button";
import TableNav from "../components/TableNav";


const AdminApprovals = () => {

    const [pageTable, setPageTable] = useState(1)
    const[loading, setLoading] = useState(true)
    const[dataTable, setDataTable] = useState(true)
    const db = getFirestore()
    const[isFirstPage, setIsFirstPage] = useState(true)
    const[isLastPage, setIsLastPage] = useState(true)
    const[lastDoc, setLastDoc] = useState(null)
    const[firstDoc, setFirstDoc] = useState(null)

    const resultsPerPage = 5
    const doctorsRef = collection(db, "doctors");
    const firstQuery = query(doctorsRef, where("verified", "==", false), orderBy("email"), limit(resultsPerPage + 1));
    const nextQuery = query(doctorsRef, where("verified", "==", false), orderBy("email"), limit(resultsPerPage + 1), startAfter(lastDoc));
    const prevQuery = query(doctorsRef, where("verified", "==", false), orderBy("email"), limitToLast(resultsPerPage + 1), endBefore(firstDoc));

    async function firstRequest() {

        const querySnapshot = await getDocs(firstQuery);

        const resultsTable = querySnapshot.docs.map(doc => doc.data())
        if (resultsTable.length > resultsPerPage) {
            setLastDoc( querySnapshot.docs[querySnapshot.docs.length-2])
            resultsTable.pop()
            setIsLastPage(false)
        } else {
            setIsLastPage(true)
        }

        setFirstDoc(querySnapshot.docs[0])
        setDataTable(resultsTable)

    }

    async function handlePreviousClick() {

        const querySnapshot = await getDocs(prevQuery);

        const resultsTable = querySnapshot.docs.map(doc => doc.data())
        if (resultsTable.length > resultsPerPage) {
            setFirstDoc( querySnapshot.docs[1])
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length-2])
            resultsTable.shift()
            setIsFirstPage(false)
        } else {
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length-1])
            setIsFirstPage(true)
        }

        setDataTable(resultsTable)
        setIsLastPage(false)
    }

    async function handleNextClick() {


        const querySnapshot = await getDocs(nextQuery);

        const resultsTable = querySnapshot.docs.map(doc => doc.data())
        if (resultsTable.length > resultsPerPage) {
            setLastDoc( querySnapshot.docs[querySnapshot.docs.length-2])
            resultsTable.pop()
            setIsLastPage(false)
        } else {
            setIsLastPage(true)
        }
        setFirstDoc(querySnapshot.docs[0])
        setDataTable(resultsTable)
        setIsFirstPage(false)
    }


    useEffect(() => {

        firstRequest().then(r => setLoading(false))
    }, []);

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
                <TableNav isFirstPage={isFirstPage} isLastPage={isLastPage} onPrevious={handlePreviousClick} onNext={handleNextClick}/>
            </TableFooter>
        </TableContainer>
        :
        <LoadingDots/>}
    </>

    );
};

export default AdminApprovals;
