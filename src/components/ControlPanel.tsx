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
  };

  if (!isConnected) {
    return (
      <Card className="neo-card p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl text-muted-foreground">
            🔒 Connect your wallet to interact with the robot
          </p>
        </div>
      </Card>
    );
  }

  if (!isCurrentController) {
    return (
      <Card className="neo-card p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl text-muted-foreground">
            🔒 Only the current controller can issue commands. Increase your stake to gain control.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="neo-card p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-cyan bg-clip-text text-transparent">Control Panel</h3>
          <Button 
            variant="outline" 
            className={`${isVerified ? 'bg-cyber-blue/20' : 'glow-border'}`}
            onClick={handleVerifyControl}
            disabled={isVerified || loading}
          >
            {loading ? "Verifying..." : isVerified ? "Control Verified" : "Sign to Verify Control"}
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-6 py-8">
          <div className="col-span-3 flex justify-center">
            <Button 
              className="h-16 w-16 rounded-full neo-button"
              onClick={() => handleRobotCommand("up")}
              disabled={!isVerified}
            >
              ↑
            </Button>
          </div>
          <div className="flex justify-end">
            <Button 
              className="h-16 w-16 rounded-full neo-button"
              onClick={() => handleRobotCommand("left")}
              disabled={!isVerified}
            >
              ←
            </Button>
          </div>
          <div className="flex justify-center">
            <Button 
              className="h-16 w-16 rounded-full neo-button"
              onClick={() => handleRobotCommand("down")}
              disabled={!isVerified}
            >
              ↓
            </Button>
          </div>
          <div className="flex justify-start">
            <Button 
              className="h-16 w-16 rounded-full neo-button"
              onClick={() => handleRobotCommand("right")}
              disabled={!isVerified}
            >
              →
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Commands are sent in real-time to the connected robot
        </div>
      </div>
    </Card>
  );
};
