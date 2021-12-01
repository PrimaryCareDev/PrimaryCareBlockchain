import React from 'react';
import SectionTitle from "../components/SectionTitle";
import {useAuth} from "../useAuth";

const AdminHome = () => {
    const {userData} = useAuth()

    return (
        <SectionTitle>Welcome Admin {userData.email} </SectionTitle>
    );
};

export default AdminHome;
