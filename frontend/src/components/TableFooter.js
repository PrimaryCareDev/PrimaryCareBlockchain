import React, { forwardRef } from 'react'
import classNames from 'classnames'

const style = {
    base: 'px-4 py-3 border-t dark:border-gray-700 bg-gray-50 text-gray-500 dark:text-gray-400 dark:bg-gray-800',

};

const TableFooter = forwardRef((props, ref) => {
    const { className, children, ...other } = props

    const cls = classNames(style.base, className)

    return (
        <div className={cls} ref={ref} {...other}>
            {children}
        </div>
    )
})

export default TableFooter
