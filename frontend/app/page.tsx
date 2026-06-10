import Header from '@/components/landing-page/Header';
import Hero from '@/components/landing-page/Hero';
import WorkflowDetails from '@/components/landing-page/WorkflowDetails';

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-[#F8FAFC] text-[#1E293B] bg-dot-pattern">
      <Header />
      <Hero />
      <WorkflowDetails />
    </div>
  );
}