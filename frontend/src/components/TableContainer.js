import React, {forwardRef} from 'react'
import classNames from 'classnames'

const style = {
    base: 'w-full overflow-hidden rounded-lg ring-1 ring-black ring-opacity-5'
};

const TableContainer = forwardRef((props, ref) => {
    const { className, children, ...other } = props
    const cls = classNames(style.base, className)
  
    return (
      <div className={cls} ref={ref} {...other}>
        {children}
      </div>
    )
  })

export default TableContainer
