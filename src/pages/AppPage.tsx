
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AppPage = () => {
  const { isConnected } = useAccount();
  
  const robots = [
    { id: "robot-1", name: "Warehouse Bot Alpha" },
    { id: "robot-2", name: "Garden Maintenance Bot" },
    { id: "robot-3", name: "Security Patrol Bot" },
    { id: "robot-4", name: "Delivery Bot" },
    { id: "robot-5", name: "Assembly Line Bot" },
    { id: "robot-6", name: "Cleaning Bot" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 container">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold glow">Bot Control Center</h1>
          <Select defaultValue="robot-1">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select robot" />
            </SelectTrigger>
            <SelectContent>
              {robots.map(robot => (
                <SelectItem key={robot.id} value={robot.id}>
                  {robot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {isConnected ? (
            <>
              <div className="col-span-8">
                <RobotCameraFeed showBotSelector={false} />
                <div className="mt-6">
                  <ControlPanel />
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <RobotStatus />
                  <StakingLeaderboard />
                </div>
              </div>
              <div className="col-span-4 space-y-6">
                <ChatSystem />
                <StakeDashboard />
                <LiveLogFeed />
              </div>
            </>
          ) : (
            <div className="col-span-12">
              <RobotCameraFeed showBotSelector={false} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppPage;
