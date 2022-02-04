import axios from "axios";
import {getAuth} from "firebase/auth";
import {DateTime} from "luxon";
import React from "react";
import {useLocation} from "react-router-dom";

export const userType = {
    DOCTOR: "DOCTOR",
    PATIENT: "PATIENT",
    ADMIN: "ADMIN"
}

export const requestStatus = {
    REQUESTED: "REQUESTED",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    BLOCKED: "BLOCKED",
    DELETED: "DELETED"
}

export function getApiUrl() {
    if (process.env.REACT_APP_API_IS_PROD === "true") {
        return process.env.REACT_APP_PROD_API_URL
    }
    else {
        console.log("Connecting to local API")
        return process.env.REACT_APP_LOCAL_API_URL
    }
}

export const axiosInstance = axios.create({
    baseURL: getApiUrl() + '/auth'
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${await getAuth().currentUser.getIdToken()}`
    // },
});

export function formatDateTime(dateTimeStr) {
    const date = DateTime.fromISO(dateTimeStr)
    return date.toLocaleString(DateTime.DATETIME_MED)
}

export function formatDate(dateStr) {
    const date = DateTime.fromISO(dateStr)
    return date.toLocaleString(DateTime.DATE_MED)
}

axiosInstance.interceptors.request.use(async config => {
    const token = await getAuth().currentUser.getIdToken()
    if (token) {
        config.headers.Authorization = "Bearer " + token
        config.headers.post['Content-Type'] ='application/json'
    }
    return config
})

export function titleCase(string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

// A custom hook that builds on useLocation to parse
// the query string for you.
export function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}
