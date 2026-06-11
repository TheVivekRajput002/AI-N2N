import { apiGet } from "@/utils/api"
import WorkspacePage from "./WorkspacePage"
import { auth } from '@clerk/nextjs/server'
import { WorkspacesResponse } from "@/utils/store";

const Page = async () => {

  const { getToken } = await auth()
  const token = await getToken()
  const response = await apiGet<any>('/workspaces', token)

  return (
    <div>
      <WorkspacePage 
        initialWorkspaces={response.workspaces} 
        initialHasSeenWelcome={response.hasSeenWelcome} 
      />
    </div>
  )
}

export default Page
