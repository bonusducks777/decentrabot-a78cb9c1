
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ControlPanel } from "@/components/ControlPanel";
import { StakeDashboard } from "@/components/StakeDashboard";
import { LiveLogFeed } from "@/components/LiveLogFeed";
import { RobotCameraFeed } from "@/components/RobotCameraFeed";
import { ChatSystem } from "@/components/ChatSystem";
import { Badge } from "@/components/ui/badge";

const Bot = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 container">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-4xl font-bold glow">Bot Control Center</h1>
          <Badge variant="outline" className="border-cyber-cyan text-cyber-cyan">
            {isConnected ? "Wallet Connected" : "Not Connected"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RobotCameraFeed />
            <ControlPanel />
          </div>
          <div className="space-y-6">
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

export default Bot;
