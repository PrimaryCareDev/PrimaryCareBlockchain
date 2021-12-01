import React, {useEffect, useState} from "react";
import {Link, useLocation} from 'react-router-dom';
import data from './data';
import {useAuth} from "../../useAuth";
import doctorNav from "./doctorNav";
import adminNav from "./adminNav";
import {userType} from "../../constants";

const style = {
    title: `font-semibold mx-4 text-sm`,
    active: `bg-gradient-to-r border-r-4 border-blue-500 border-r-4 border-blue-500 from-white to-blue-100 text-blue-500`,
    link: `duration-200 flex font-thin items-center justify-start my-2 p-4 transition-colors text-gray-500 w-full lg:hover:text-blue-500`,
};


const SidenavItems = () => {
    const [loading, setLoading] = useState(true)
    const [navData, setNavData] = useState(null)

    const {pathname} = useLocation();
    const {userData} = useAuth()

    useEffect(() => {

            console.log("ERKLEJRKJSDLF " + userData)
            if (userData) {
                switch (userData.role) {
                    case userType.DOCTOR:
                        setNavData(doctorNav)
                        break
                    case userType.ADMIN:
                        setNavData(adminNav)
                        break
                }
                setLoading(false)
            } else {
                setLoading(true)
                setNavData(null)
            }

    }, [userData]);

    return (
        <>
            {!loading ?
                <ul>
                    <li>
                        {navData.map((item) => (
                            <Link to={item.link} key={item.title}>
            <span className={`${style.link} ${item.link === pathname && style.active}`}>
              <span>{item.icon}</span>
              <span className={style.title}>{item.title}</span>
            </span>
                            </Link>
                        ))}
                    </li>
                </ul>


                : <> NOTHING</>}
        </>
    )
}

export default SidenavItems
