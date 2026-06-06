"use client"

import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const page = () => {
  // useEffect(() => {
  //   axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth`,
  //     {
  //       withCredentials: true
  //     }
  //   )
  //     .then(response => {
  //       console.log('Auth check successful:', response.data)
  //     })
  //     .catch(error => {
  //       console.error('Auth check failed:', error)
  //     })
  // }, [])

  return (
    <div>
      heyyy, I am the user
    </div>
  )
}

export default page