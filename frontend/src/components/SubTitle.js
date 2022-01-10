import React from 'react'
import classNames from 'classnames'

function SubTitle(props, children) {
    return <p className={classNames("my-3 text-xl font-semibold text-gray-700 dark:text-gray-200", props.className)}>{props.children}</p>
}

export default SubTitle