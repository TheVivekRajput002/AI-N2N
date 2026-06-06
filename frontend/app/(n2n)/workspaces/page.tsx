import { apiGet } from "@/utils/api"
import WorkspacePage from "./WorkspacePage"
import { auth } from '@clerk/nextjs/server'

interface WorkspacesResponse {
  workspaces: any[]
}

const Page = async () => {
  const { getToken } = await auth()
  const token = await getToken()

  const response = await apiGet<WorkspacesResponse>('/workspaces', token)


  // const workspaces = [
  //   {
  //     id: 'dev-sandbox',
  //     name: 'Development Sandbox',
  //     description: 'Playground for testing custom integrations, prompt engineering experiments, and playground models.',
  //     createdAt: '2026-06-01T10:00:00.000Z',
  //     color: 'blue',
  //     workflows: [{}, {}, {}],
  //   },
  //   {
  //     id: 'support-agent',
  //     name: 'Customer Support Flow',
  //     description: 'Automated ticket routing, categorization, and draft responses using Gemini models.',
  //     createdAt: '2026-05-18T14:30:00.000Z',
  //     color: 'green',
  //     workflows: [{}, {}, {}, {}, {}],
  //   },
  //   {
  //     id: 'lead-enrich',
  //     name: 'Lead Enrichment Pipeline',
  //     description: 'Extract leads from web scrapers, enrich company profiles, and queue customized cold drafts.',
  //     createdAt: '2026-04-20T09:15:00.000Z',
  //     color: 'purple',
  //     workflows: [{}, {}],
  //   },
  //   {
  //     id: 'content-gen',
  //     name: 'Social Media Automation',
  //     description: 'Weekly blog summaries parsed into tweets, newsletter copy, and LinkedIn updates.',
  //     createdAt: '2026-03-12T11:00:00.000Z',
  //     color: 'orange',
  //     workflows: [{}],
  //   },
  //   {
  //     id: 'finance-analyst',
  //     name: 'Financial Analysis Engine',
  //     description: 'Scrape quarterly earnings, extract balance sheet metrics, and summarize visual trend metrics.',
  //     createdAt: '2026-01-05T16:45:00.000Z',
  //     color: 'red',
  //     workflows: [{}, {}, {}, {}],
  //   },
  // ];

  return (
    <div>
      <WorkspacePage workspaces={response.workspaces} />
    </div>
  )
}

export default Page
