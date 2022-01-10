import React from 'react';
import {UserCircleIcon} from "@heroicons/react/solid";
import classNames from "classnames";

const DefaultAvatar = (props) => {
    return (
        <UserCircleIcon className={classNames("text-gray-600 h-12 w-12", props.className)} />
    );
};

export default DefaultAvatar;