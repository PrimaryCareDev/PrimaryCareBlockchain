import React, {useEffect, useState} from "react";
import {Link, useLocation} from 'react-router-dom';
import {useAuth} from "../../useAuth";
import {doctorNav, adminNav, patientNav} from "./navData";
import {userType} from "../../constants";
import admin from "../../pages/Admin";

const style = {
    title: `font-semibold mx-4 text-sm`,
    active: `bg-gradient-to-r border-r-4 border-blue-500 border-r-4 border-blue-500 from-white to-blue-100 text-blue-500`,
    link: `duration-200 flex font-thin items-center justify-start my-2 p-4 transition-colors text-gray-500 w-full lg:hover:text-blue-500`,
};


const SidenavItems = ({isValidRole}) => {
    const [loading, setLoading] = useState(true)
    const [navData, setNavData] = useState(null)

    const {pathname} = useLocation();
    const {userData} = useAuth()

    useEffect(() => {

        if (userData && isValidRole) {
            if (userData.role === userType.DOCTOR && userData.verified) {
                setNavData(doctorNav)
            }
            else if (userData.role === userType.ADMIN) {
                setNavData(adminNav)
            }
            else if (userData.role === userType.PATIENT) {
                setNavData(patientNav)
            }
            else {
                setNavData([])
            }
            setLoading(false)
        } else {
            setLoading(true)
            setNavData([])
        }

    }, [isValidRole]);

    return (
        <>
            {!loading ?
                <ul>
                    {navData.map((item) => (
                        <li key={item.link}>
                            <Link to={item.link} key={item.title}>
                                <span className={`${style.link} ${item.link === pathname && style.active}`}>
                                  <span>{item.icon}</span>
                                  <span className={style.title}>{item.title}</span>
                                </span>
                            </Link>
                        </li>
                    ))}

                </ul>


                : <></>}
        </>
    )
}

export default SidenavItems
