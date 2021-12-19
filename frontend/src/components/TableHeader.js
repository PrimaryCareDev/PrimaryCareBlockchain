import React, {forwardRef} from 'react'
import classNames from 'classnames'

const style = {
    base:
        'text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800',
}

const TableHeader = forwardRef((props, ref) => {
    const { className, children, ...other } = props

    const cls = classNames(style.base, className)

    return (
        <thead className={cls} ref={ref} {...other}>
            {children}
        </thead>
    )
})

export default TableHeader
