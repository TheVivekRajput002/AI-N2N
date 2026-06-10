import Header from '@/components/landing-page/Header';
import Hero from '@/components/landing-page/Hero';
import WorkflowDetails from '@/components/landing-page/WorkflowDetails';
import Footer from '@/components/landing-page/Footer';

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-[#F8FAFC] text-[#1E293B] bg-dot-pattern">
      {/* First Fold: Fits exactly 100vh on every laptop screen */}
      <div className="h-screen flex flex-col relative w-full overflow-hidden hero-fold-container">
        <Header />
        <Hero />
      </div>
      <WorkflowDetails />
      <Footer />
    </div>
  );
}