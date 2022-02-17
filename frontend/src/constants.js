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

export const publicAxiosInstance = axios.create({
    baseURL: getApiUrl()
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


export function getMessageFromErrorCode(errorCode) {
    const slicedCode = errorCode.slice(5)
    switch (slicedCode) {
        case "ERROR_EMAIL_ALREADY_IN_USE":
        case "account-exists-with-different-credential":
        case "email-already-in-use":
            return "Email already used. Go to login page.";
            break;
        case "ERROR_USER_NOT_FOUND":
        case "user-not-found":
            return "No user found with this email.";
            break;
        case "ERROR_USER_DISABLED":
        case "user-disabled":
            return "User disabled.";
            break;
        case "ERROR_TOO_MANY_REQUESTS":
        case "operation-not-allowed":
            return "Too many requests to log into this account.";
            break;
        case "ERROR_OPERATION_NOT_ALLOWED":
        case "operation-not-allowed":
            return "Server error, please try again later.";
            break;
        case "ERROR_INVALID_EMAIL":
        case "invalid-email":
            return "Email address is invalid.";
            break;
        case "email-already-exists":
            return "A user with that email account already exists.";
            break;
        case "wrong-password":
            return "Incorrect password. Please try again."
        case "too-many-requests":
            return "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. "
        case "weak-password":
            return "The password used is too short. Please use a longer password and combine uppercase/lowercase and special characters for a stronger password."
        default:
            return "Login failed. Please try again.";
            break;
    }
}