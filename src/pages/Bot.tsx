
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ControlPanel } from "@/components/ControlPanel";
import { StakeDashboard } from "@/components/StakeDashboard";
import { LiveLogFeed } from "@/components/LiveLogFeed";

const Bot = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 container">
        <h1 className="text-4xl font-bold mb-8 glow">Bot Control Center</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ControlPanel />
          </div>
          <div className="space-y-6">
            <StakeDashboard />
            <LiveLogFeed />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bot;
