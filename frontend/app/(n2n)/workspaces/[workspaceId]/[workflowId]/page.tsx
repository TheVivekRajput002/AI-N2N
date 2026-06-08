
import Topbar from '@/components/Topbar';
import { ReactFlowProvider } from '@xyflow/react'
import Flow from '@/components/Flow'
import { apiGet } from '@/utils/api'


async function App() {
//   const { workflowId } = params

//   const response = await apiGet(`/workflow-version?workflowId=${workflowId}`)
//   console.log(response)

    return (

        <div >
            <div style={{ width: '100vw', height: '100vh', paddingRight: '60px' }}>
                <ReactFlowProvider>
                    <div className='absolute top-1 right-0 z-50'>
                        <Topbar />
                    </div>
                    <Flow />
                </ReactFlowProvider>
            </div>
        </div>
    );
}

export default App;