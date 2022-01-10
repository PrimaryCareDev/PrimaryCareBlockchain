import axios from "axios";
import {getAuth} from "firebase/auth";

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
    baseURL: getApiUrl()
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${await getAuth().currentUser.getIdToken()}`
    // },
});

axiosInstance.interceptors.request.use(async config => {
    const token = await getAuth().currentUser.getIdToken()
    if (token) {
        config.headers.Authorization = "Bearer " + token
        config.headers.post['Content-Type'] ='application/json'
    }
    return config
})