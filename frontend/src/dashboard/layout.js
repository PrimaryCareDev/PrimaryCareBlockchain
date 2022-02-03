import Main from './main';
import Overlay from './provider/overlay';
import TopNavigation from './topnavigation/TopNavigation';
import SideNavigation from './sidenavigation';
import { useToggle } from './provider/context';
import {useEffect, useState} from "react";
import {axiosInstance} from "../constants";
import {toast, ToastContainer} from "react-toastify";

const style = {
  open: 'lg:w-full',
  close: ' lg:w-99',
  mainContainer: `flex flex-col w-full h-screen pl-0 lg:space-y-4 overflow-auto`,
  container: `bg-gray-100 h-screen overflow-hidden relative`,
  main: `h-screen container mx-auto px-2 pb-36 pt-4 md:pb-8 lg:pt-8 lg:px-8`,
};

export default function DashboardLayout({ isValidRole, children }) {
  const { open } = useToggle();

  useEffect(() => {
    axiosInstance.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      toast.error("Something went wrong! Please try again.", {theme: "colored"});
      return Promise.reject(error);
    });
  }, []);


  return (
    <div className={style.container}>
      <div className="flex items-start">
        <Overlay />
        <SideNavigation isValidRole={isValidRole} mobilePosition="left" />
        <div
          className={`${style.mainContainer} 
          ${open ? style.open : style.close}`}
        >
          <TopNavigation />
          <Main className={style.main}>{children}</Main>
        </div>
      </div>
    </div>
  );
}
