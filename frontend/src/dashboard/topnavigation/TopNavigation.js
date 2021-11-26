import React, {Fragment} from 'react';
import {useToggle} from '../provider/context';
import {Menu, Transition} from '@headlessui/react'
import classNames from "classnames";
import {MenuIcon, UserCircleIcon} from "@heroicons/react/solid";
import {useAuth} from "../../useAuth";
import {useHistory} from "react-router-dom";

export default function TopNavigation() {
    const {toggle} = useToggle();

    const {signout} = useAuth()
    const history = useHistory()

    async function handleLogout(e) {
        e.preventDefault()

        try {
            await signout()
            history.push("/")
        } catch {
            console.log("Failed to log out")
        }
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
                                className=" flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">Open user menu</span>
                                {/*<img*/}
                                {/*    className="h-12 w-12 rounded-full"*/}
                                {/*    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"*/}
                                {/*    alt=""*/}
                                {/*/>*/}
                                <UserCircleIcon className="h-10 w-10 rounded-full"/>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
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
