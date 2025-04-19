
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ControlPanel } from "@/components/ControlPanel";
import { StakeDashboard } from "@/components/StakeDashboard";
import { LiveLogFeed } from "@/components/LiveLogFeed";
import { RobotCameraFeed } from "@/components/RobotCameraFeed";
import { RobotStatus } from "@/components/RobotStatus";
import { ChatSystem } from "@/components/ChatSystem";
import { StakingLeaderboard } from "@/components/StakingLeaderboard";

const AppPage = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 container">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold glow">Bot Control Center</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content area - Camera feed and controls */}
          <div className="lg:col-span-8 space-y-6">
            <RobotCameraFeed />
            {isConnected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ControlPanel />
                <div className="space-y-6">
                  <RobotStatus />
                  <StakingLeaderboard />
                </div>
              </div>
            )}
          </div>
          
          {/* Right sidebar - Stats and chat */}
          <div className="lg:col-span-4 space-y-6">
            <StakeDashboard />
            <LiveLogFeed />
            <ChatSystem />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppPage;
