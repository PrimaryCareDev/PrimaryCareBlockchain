import React, {forwardRef} from 'react'
import classNames from 'classnames'

const Badge = forwardRef(function Badge(props, ref) {
    const { className, children, type = 'primary', ...other } = props

    const badge = {
        base: 'inline-flex px-2 text-sm font-medium leading-5 rounded-full items-center',
            success: 'text-green-700 bg-green-200 dark:bg-green-700 dark:text-green-100',
            danger: 'text-red-700 bg-red-200 dark:text-red-100 dark:bg-red-700',
            warning: 'text-orange-700 bg-orange-200 dark:text-white dark:bg-orange-600',
            neutral: 'text-gray-700 bg-gray-200 dark:text-gray-100 dark:bg-gray-700',
            primary: 'text-purple-700 bg-purple-200 dark:text-white dark:bg-purple-600',
    }

    const baseStyle = badge.base
    const typeStyle = {
        success: badge.success,
        danger: badge.danger,
        warning: badge.warning,
        neutral: badge.neutral,
        primary: badge.primary,
    }

    const cls = classNames(baseStyle, typeStyle[type], className)

    return (
        <span className={cls} ref={ref} {...other}>
      {children}
    </span>
    )
})

export default Badge
