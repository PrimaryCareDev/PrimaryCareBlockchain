import React, {forwardRef} from 'react'
import classNames from 'classnames'

const style = {
    base: 'px-4 py-3',
};

const TableCell = forwardRef((props, ref) => {
    const { className, children, ...other } = props

    const cls = classNames(style.base, className)

    return (
        <td className={cls} ref={ref} {...other}>
            {children}
        </td>
    )
})

export default TableCell
