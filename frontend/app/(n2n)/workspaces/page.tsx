import { apiGet } from "@/utils/api"
import WorkspacePage from "./WorkspacePage"
import { auth } from '@clerk/nextjs/server'
import { WorkspacesResponse } from "@/utils/store";

const Page = async () => {

  const { getToken } = await auth()
  const token = await getToken()
  const response = await apiGet<WorkspacesResponse>('/workspaces', token)

  return (
    <div>
      <WorkspacePage initialWorkspaces={response.workspaces} />
    </div>
  )
}

export default Page
