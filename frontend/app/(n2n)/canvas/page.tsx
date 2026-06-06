
import Topbar from '@/components/Topbar';
import { PipelineUI } from '@/components/ui';
import { SubmitButton } from '@/components/Submit';

function App() {
    return (
        <div >
            <div className='absolute top-1 right-0 z-50'>
                <Topbar />
            </div>
            <PipelineUI />
            <SubmitButton />
        </div>
    );
}

export default App;