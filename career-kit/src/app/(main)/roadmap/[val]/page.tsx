"use client"

import React from 'react'

import { useParams } from 'next/navigation'

const pageValue = () => {


    const { val } = useParams()

  return (
    <div> value : {val}</div>
  )
}

export default pageValue