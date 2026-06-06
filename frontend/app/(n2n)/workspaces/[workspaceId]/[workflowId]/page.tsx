
import Topbar from '@/components/Topbar';
import { SubmitButton } from '@/components/Submit';
import { ReactFlowProvider } from '@xyflow/react'
import Flow from '@/components/Flow'

function App() {
    return (
        <div >
            <div className='absolute top-1 right-0 z-50'>
                <Topbar />
            </div>
            <div style={{ width: '100vw', height: '100vh' }}>
                <ReactFlowProvider>
                    <Flow />
                </ReactFlowProvider>
            </div>
        </div>
    );
}

export default App;