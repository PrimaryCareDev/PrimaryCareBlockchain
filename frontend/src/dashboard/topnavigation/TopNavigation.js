import React, {Fragment, useEffect, useState} from 'react';
import {useToggle} from '../provider/context';
import {Menu, Transition} from '@headlessui/react'
import classNames from "classnames";
import {MenuIcon} from "@heroicons/react/solid";
import {useAuth} from "../../useAuth";
import {useHistory, useRouteMatch} from "react-router-dom";
import DefaultAvatar from "../../components/DefaultAvatar";
import {userType} from "../../constants";
import {Link} from "react-router-dom";


export default function TopNavigation() {
    const {toggle} = useToggle();
    const [avatarImageUrl, setAvatarImageUrl] = useState("")
    const [avatarLoading, setAvatarLoading] = useState(true)

    const {signout, user} = useAuth()
    const history = useHistory()
    const {userData} = useAuth()
    let {url, path} = useRouteMatch();

    useEffect(() => {

        if (userData) {
            setAvatarImageUrl(userData.avatarImageUrl)
        }

    }, [userData]);

    async function handleLogout(e) {
        e.preventDefault()

        try {
            await signout()
            history.push("/")
        } catch {
            console.log("Failed to log out")
        }
    }

    function getAccountSettingsPath() {
        // console.log(path + " " + url)
        // if (userData) {
        //     switch (userData.role) {
        //         case userType.DOCTOR:
        //             return "/doctor/accountSettings"
        //         case userType.PATIENT:
        //             return "/patient/accountSettings"
        //         case userType.ADMIN:
        //             return "/admin/accountSettings"
        //     }
        // }
        return path + "/accountSettings"
    }

    return (
        <header className="bg-white h-16 items-center relative shadow w-full z-0 md:h-20">
            <div className="flex h-full justify-center mx-auto px-5 relative">
                <div className="flex items-center pl-1 relative w-full sm:pr-2 sm:ml-0 lg:max-w-68">
                    <div className="flex h-full left-0 relative w-3/4">
                        <div className="flex items-center justify-center h-full relative w-12">
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    aria-expanded="false"*/}
                            {/*    aria-label="Toggle sidenav"*/}
                            {/*    className="text-4xl text-gray-500 focus:outline-none"*/}
                            {/*    onClick={toggle}*/}
                            {/*>*/}
                            {/*    &#8801;*/}
                            {/*</button>*/}
                            <button onClick={toggle}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="sr-only">Open main menu</span>
                                <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Menu as="div" className="ml-3 relative">

                        <div>
                            <Menu.Button
                                className=" flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-700 focus:ring-white">
                                {/*<span className="sr-only">Open user menu</span>*/}
                                {avatarImageUrl ?
                                    <>
                                        {avatarLoading && <DefaultAvatar/>}
                                            <img
                                                src={avatarImageUrl}
                                                onLoad={() => setAvatarLoading(false)}
                                                className={classNames(avatarLoading && "hidden", "h-12 w-12 rounded-full")}
                                                alt="Avatar"
                                            />
                                            </>

                                    :
                                    <DefaultAvatar/>

                                }


                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >

                            <Menu.Items
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg divide-y divide-gray-100 py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-4 py-3">
                                    <p className="text-sm leading-5">Signed in as</p>
                                    <p className="text-sm font-medium leading-5 text-gray-900 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to={getAccountSettingsPath()}
                                                className={`${
                                                    active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700"
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                            >
                                                Account settings
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </div>
                                <Menu.Item>
                                    {({active}) => (
                                        <a
                                            href='/'
                                            onClick={handleLogout}
                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                        >
                                            Sign out
                                        </a>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>

            </div>
        </header>
    );
}
