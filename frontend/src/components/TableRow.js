import React, {forwardRef} from 'react'

const TableRow = forwardRef((props, ref) => {
    const { className, children, ...other } = props
    
    return (
      <tr className={className} ref={ref} {...other}>
        {children}
      </tr>
    )
  })

export default TableRow
