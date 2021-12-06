import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from "react-router-dom";
import {collection, doc, getDoc, getFirestore} from "firebase/firestore/lite";
import LoadingDots from "../components/LoadingDots";
import {getStorage, ref, getDownloadURL} from "firebase/storage";
import Button from "../components/Button";


const AdminApprovalDetails = () => {

    const [loading, setLoading] = useState(true)
    const [details, setDetails] = useState(null)
    const [imageUrl, setImageUrl] = useState("")
    const db = getFirestore()
    const data = useLocation()
    const storage = getStorage();
    const history = useHistory();



    async function getDoctorDetails() {
        try {
            const doctorId = data.state.userId
            console.log(doctorId)
            const docRef = doc(db, "doctors", doctorId)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setDetails(docSnap.data())
            } else {
                console.log("doctor id not found")
                //TODO: doctor id not found in DB
            }

            const storageRef = ref(storage, 'images/identification/' + doctorId);
            setImageUrl(await getDownloadURL(storageRef))
            setLoading(false)


        } catch {
            console.log("Error getting doctor's document from firestore")
        }
    }

    useEffect(() => {
        if (data.state) {
            getDoctorDetails()
        }
        else {
            history.push("/admin/pending")
        }

    }, []);


    return (
        <>
            {
                loading ?
                    <LoadingDots/>
                    :
                    <div>
                        <Link to="/admin/pending">
                            <Button>Back</Button>
                        </Link>
                        {details.firstName}
                        <img src={imageUrl} />
                    </div>
            }
        </>
    );
};

export default AdminApprovalDetails;
