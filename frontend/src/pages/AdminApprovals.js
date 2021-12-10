import React, {useEffect, useState} from 'react';
import Table from "../components/Table";
import TableHeader from "../components/TableHeader";
import TableCell from "../components/TableCell";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableFooter from "../components/TableFooter";
import TableContainer from "../components/TableContainer";
import {
    collection,
    endBefore,
    getDocs,
    getFirestore,
    limit,
    limitToLast,
    orderBy,
    query,
    startAfter,
    where
} from "firebase/firestore/lite";
import LoadingDots from "../components/LoadingDots";
import Button from "../components/Button";
import TableNav from "../components/TableNav";
import {Link, useRouteMatch} from "react-router-dom";
import DefaultAvatar from "../components/DefaultAvatar";


const AdminApprovals = () => {

    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [dataTable, setDataTable] = useState(true)
    const db = getFirestore()
    const [isFirstPage, setIsFirstPage] = useState(true)
    const [isLastPage, setIsLastPage] = useState(true)
    const [lastDoc, setLastDoc] = useState(null)
    const [firstDoc, setFirstDoc] = useState(null)
    let {url} = useRouteMatch();


    const resultsPerPage = 5
    const doctorsRef = collection(db, "doctors");
    const firstQuery = query(doctorsRef, where("verified", "==", false), where("submittedForVerification", "==", true), orderBy("lastName"), limit(resultsPerPage + 1));
    const nextQuery = query(doctorsRef, where("verified", "==", false), where("submittedForVerification", "==", true), orderBy("lastName"), limit(resultsPerPage + 1), startAfter(lastDoc));
    const prevQuery = query(doctorsRef, where("verified", "==", false), where("submittedForVerification", "==", true), orderBy("lastName"), limitToLast(resultsPerPage + 1), endBefore(firstDoc));

    async function firstRequest() {

        const querySnapshot = await getDocs(firstQuery);

        // const resultsTable = querySnapshot.docs.map(doc => {doc.data())
        const resultsTable = querySnapshot.docs.map(doc => Object.assign({}, {id: doc.id}, doc.data()))
        if (resultsTable.length > resultsPerPage) {
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 2])
            resultsTable.pop()
            setIsLastPage(false)
        } else {
            setIsLastPage(true)
        }

        setFirstDoc(querySnapshot.docs[0])
        setDataTable(resultsTable)
        console.log(resultsTable[0])


    }

    async function handlePreviousClick() {

        const querySnapshot = await getDocs(prevQuery);

        const resultsTable = querySnapshot.docs.map(doc => Object.assign({}, {id: doc.id}, doc.data()))
        if (resultsTable.length > resultsPerPage) {
            setFirstDoc(querySnapshot.docs[1])
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 2])
            resultsTable.shift()
            setIsFirstPage(false)
        } else {
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
            setIsFirstPage(true)
        }

        setDataTable(resultsTable)
        setIsLastPage(false)
    }

    async function handleNextClick() {


        const querySnapshot = await getDocs(nextQuery);

        const resultsTable = querySnapshot.docs.map(doc => Object.assign({}, {id: doc.id}, doc.data()))
        if (resultsTable.length > resultsPerPage) {
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 2])
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
                                <TableCell>Avatar</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {dataTable.map((user, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        {user.avatarImageUrl ?
                                            <img src={user.avatarImageUrl} className="rounded-full h-12 w-12"/>
                                            :
                                            <DefaultAvatar/>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm">
                                            {/* <Avatar className="hidden mr-3 md:block" src={user.avatar} alt="User avatar" /> */}
                                            <div>
                                                <p className="font-semibold">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.verified ?
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
                                                state: {userId: user.id}
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
                        <TableNav isFirstPage={isFirstPage} isLastPage={isLastPage} onPrevious={handlePreviousClick}
                                  onNext={handleNextClick}/>
                    </TableFooter>
                </TableContainer>
                :
                <LoadingDots/>
            }


        </>

    );
};

export default AdminApprovals;
