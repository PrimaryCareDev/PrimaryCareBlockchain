import React, {forwardRef} from 'react'
import classNames from 'classnames'

const style = {
    base: 'bg-white divide-y dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400',
};

const TableBody = forwardRef((props, ref) => {
    const { className, children, ...other } = props
    const cls = classNames(style.base, className)


    return (
        <tbody className={cls} ref={ref} {...other}>
            {children}
        </tbody>
    )
})

export default TableBody
