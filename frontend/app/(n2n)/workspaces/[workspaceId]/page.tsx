import { apiGet } from "@/utils/api"
import WorkflowPage from "./WorkflowPage"
import { auth } from '@clerk/nextjs/server'
import { WorkflowType } from "@/utils/store";

const Page = async ({ params }: any) => {

  const { workspaceId } = await params;

  const { getToken } = await auth()
  const token = await getToken()
  
  const response = await apiGet<{ workflows: WorkflowType[] }>(`/workflows/${workspaceId}`, token)

  return (
    <div>
      <WorkflowPage initialWorkflows={response.workflows} />
    </div>
  )
}

export default Page

