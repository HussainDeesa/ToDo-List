import React from 'react'

export const Alert = (props) => {
  return (
  
    <div className='alert'>
      {props.alert&&<div className='alert'>{props.alert.message}</div>}

    </div>
  )
}
