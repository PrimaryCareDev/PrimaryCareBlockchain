import React, {useState} from 'react';
import Button from "../components/Button";
import {getAuth} from "firebase/auth";
import {axiosInstance} from "../constants";


const TestBackend = () => {

    const [statusMsg, setStatusMsg] = useState("")

    const auth = getAuth()

    async function verifyIdToken() {
        const idToken = await auth.currentUser.getIdToken()
        console.log(idToken)

        const res = await axiosInstance.get("/verifyIdToken")

        // const res = await fetch(getApiUrl() + "/verifyIdToken", {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${idToken}`,
        //     },
        // });

        setStatusMsg(JSON.stringify(await res.data));

    }

    async function createDoctorRecord() {

        const res = await axiosInstance.post("/registerDoctor", {})

        setStatusMsg(JSON.stringify(await res.data));
    }

    async function testDoctorSubmission() {
        const res = await axiosInstance.post("/testPost", {
            firstName: "John",
            lastName: "Doe",
            medicalPractice: "Doe Clinic",
            medicalLicenseNumber: "12345",
            idImageUrl: "http://test.com",
            licenseImageUrl: "http://licensetest.com",
            avatarImageUrl: "",

        })
    }

    return (
        <div>
            <Button onClick={verifyIdToken}>Verify ID Token</Button>
            <Button onClick={createDoctorRecord}>Create Doctor Record</Button>
            <Button onClick={testDoctorSubmission}>Test Doctor Submission</Button>

            <div>{statusMsg}</div>
        </div>
    );
};

export default TestBackend;