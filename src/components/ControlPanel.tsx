
import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useContractFunctions } from "@/lib/contractUtils";

export const ControlPanel = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [isCurrentController, setIsCurrentController] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastCommand, setLastCommand] = useState("");

  const contract = useContractFunctions();

  useEffect(() => {
    const checkControllerStatus = async () => {
      if (isConnected && address) {
        try {
          const controller = await contract.isController(publicClient, address);
          setIsCurrentController(controller);
        } catch (error) {
          console.error("Error checking controller status:", error);
        }
      } else {
        setIsCurrentController(false);
        setIsVerified(false);
      }
    };

    checkControllerStatus();
  }, [isConnected, address, publicClient]);

  const handleVerifyControl = async () => {
    setLoading(true);
    try {
      // In a real app, this would be a signature verification
      // For now, we'll just mock it
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsVerified(true);
      toast.success("Control verified successfully");
    } catch (error) {
      console.error("Error verifying control:", error);
      toast.error("Failed to verify control");
    } finally {
      setLoading(false);
    }
  };

  const handleRobotCommand = (command: string) => {
    if (!isVerified) {
      toast.error("You need to verify control first");
      return;
    }
    
    // This would send the command to the robot in a real application
    toast.success(`Command sent: ${command}`);
    console.log(`Robot command: ${command}`);
    setLastCommand(command);
  };

  if (!isConnected) {
    return (
      <Card className="neo-card p-4 text-center animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl text-muted-foreground">
            🔒 Connect your Moonbeam wallet to interact with the robot
          </p>
        </div>
      </Card>
    );
  }

  if (!isCurrentController) {
    return (
      <Card className="neo-card p-4 text-center animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl text-muted-foreground">
            🔒 Only the current controller can issue commands. Increase your stake to gain control.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="neo-card p-4 mt-4 transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">Control Panel</h3>
            <Button 
              variant={isVerified ? "outline" : "default"}
              className={`transition-all duration-300 ${isVerified ? 'bg-orange-500/20' : 'glow-border hover:scale-105'}`}
              onClick={handleVerifyControl}
              disabled={isVerified || loading}
            >
              {loading ? "Verifying..." : isVerified ? "✓ Control Verified" : "Sign to Verify Control"}
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Button 
              className="h-16 w-16 rounded-full neo-button transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              onClick={() => handleRobotCommand("up")}
              disabled={!isVerified}
            >
              ↑
            </Button>
            <Button 
              className="h-16 w-16 rounded-full neo-button transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              onClick={() => handleRobotCommand("left")}
              disabled={!isVerified}
            >
              ←
            </Button>
            <Button 
              className="h-16 w-16 rounded-full neo-button transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              onClick={() => handleRobotCommand("down")}
              disabled={!isVerified}
            >
              ↓
            </Button>
            <Button 
              className="h-16 w-16 rounded-full neo-button transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              onClick={() => handleRobotCommand("right")}
              disabled={!isVerified}
            >
              →
            </Button>
          </div>
        </div>
        
        <div className="lg:w-1/3 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border lg:pl-4 pt-4 lg:pt-0 mt-4 lg:mt-0">
          <div className="space-y-4">
            <div className="text-lg font-semibold">Current Status</div>
            <div className="text-sm text-muted-foreground">
              Control verified: <span className={isVerified ? "text-green-400" : "text-red-400"}>{isVerified ? "Yes" : "No"}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last command: <span className="font-mono">{lastCommand || "None"}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
