import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { apiGet } from '@/utils/api'
import DashboardClient from './DashboardClient'

const Page = async () => {
  const { getToken } = await auth()
  const token = await getToken()

  let data = null
  let error = null

  try {
    data = await apiGet<any>('/executions/dashboard/stats', token)
  } catch (err: any) {
    console.error("Error fetching dashboard statistics:", err)
    error = err?.message || String(err)
  }

  return (
    <DashboardClient initialData={data} error={error} />
  )
}

export default Page