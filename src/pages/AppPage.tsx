
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRobot, setSelectedRobot] = useState(searchParams.get("robot") || "robot-1");
  
  useEffect(() => {
    if (selectedRobot) {
      setSearchParams({ robot: selectedRobot });
    }
  }, [selectedRobot, setSearchParams]);
  
  const robots = [
    { id: "robot-1", name: "Warehouse Bot Alpha" },
    { id: "robot-2", name: "Garden Maintenance Bot" },
    { id: "robot-3", name: "Security Patrol Bot" },
    { id: "robot-4", name: "Delivery Bot" },
    { id: "robot-5", name: "Assembly Line Bot" },
    { id: "robot-6", name: "Cleaning Bot" },
  ];

  const handleRobotChange = (value: string) => {
    setSelectedRobot(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-6 container">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">Bot Control Center</h1>
          <Select value={selectedRobot} onValueChange={handleRobotChange}>
            <SelectTrigger className="w-[240px]">
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
        
        {isConnected ? (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8">
              <RobotCameraFeed 
                robotName={robots.find(r => r.id === selectedRobot)?.name} 
                viewerCount={5} // Using the same value as in the RobotFeedCard
              />
              <ControlPanel />
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              <ChatSystem />
              <StakeDashboard />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <RobotStatus />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <StakingLeaderboard />
            </div>
            <div className="col-span-12">
              <LiveLogFeed />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-card rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-center max-w-md mb-6">
              Please connect your wallet to view the robot feed and control panel.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AppPage;
