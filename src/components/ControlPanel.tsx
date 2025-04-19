
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBlockchainUtils } from "@/lib/blockchainUtils";

export const ControlPanel = () => {
  const { address, isConnected } = useAccount();
  const [isCurrentController, setIsCurrentController] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [selectedRobotId, setSelectedRobotId] = useState("robot-1");
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  const blockchainUtils = useBlockchainUtils();

  useEffect(() => {
    const checkControllerStatus = async () => {
      if (isConnected && address) {
        try {
          const controller = await blockchainUtils.isController();
          setIsCurrentController(false); // Hardcoded to false for now
          if (controller) {
            setShowVerifyDialog(true);
          }
        } catch (error) {
          console.error("Error checking controller status:", error);
        }
      } else {
        setIsCurrentController(false);
        setIsVerified(false);
      }
    };

    checkControllerStatus();
  }, [isConnected, address, blockchainUtils]);

  const handleVerifyControl = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsVerified(true);
      setShowVerifyDialog(false);
      toast.success("Control verified successfully");
    } catch (error) {
      console.error("Error verifying control:", error);
      toast.error("Failed to verify control");
    } finally {
      setLoading(false);
    }
  };

  const handleRobotCommand = async (command) => {
    if (!isVerified) {
      toast.error("You need to verify control first");
      return;
    }
    
    setLoading(true);
    try {
      const success = await blockchainUtils.sendRobotCommand(selectedRobotId, command);
      if (success) {
        toast.success(`Command sent: ${command}`);
        setLastCommand(command);
      } else {
        toast.error("Failed to send command");
      }
    } catch (error) {
      console.error(`Error sending command:`, error);
      toast.error("Error sending command");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="neo-card p-3 mt-4 mb-4 transition-all duration-300 hover:shadow-lg animate-fade-in relative">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">Control Panel</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="h-14 w-14 rounded-full neo-button transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              onClick={() => handleRobotCommand("up")}
              disabled={!isVerified || !isCurrentController || loading}
            >
              ↑
            </Button>
            <Button 
              className="h-14 w-14 rounded-full neo-button transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              onClick={() => handleRobotCommand("left")}
              disabled={!isVerified || !isCurrentController || loading}
            >
              ←
            </Button>
            <Button 
              className="h-14 w-14 rounded-full neo-button transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              onClick={() => handleRobotCommand("down")}
              disabled={!isVerified || !isCurrentController || loading}
            >
              ↓
            </Button>
            <Button 
              className="h-14 w-14 rounded-full neo-button transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              onClick={() => handleRobotCommand("right")}
              disabled={!isVerified || !isCurrentController || loading}
            >
              →
            </Button>
          </div>
        </div>
        
        <div className="lg:w-1/3 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border lg:pl-4 pt-4 lg:pt-0 mt-4 lg:mt-0">
          <div className="space-y-4">
            <div className="text-lg font-semibold">Current Status</div>
            <div className="text-sm text-muted-foreground">
              Controller: <span className={isCurrentController ? "text-green-400" : "text-red-400"}>{isCurrentController ? "You" : "Not you"}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last command: <span className="font-mono">{lastCommand || "None"}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay when not controller */}
      {!isCurrentController && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center p-6">
            <p className="text-lg font-semibold text-muted-foreground">
              You are not the controller
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Increase your stake to gain control
            </p>
          </div>
        </div>
      )}

      {/* Verify Control Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Control</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-center text-muted-foreground mb-4">
              You have the highest stake! Sign to take control of the robot.
            </p>
            <Button 
              onClick={handleVerifyControl}
              className="w-full neo-button"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Sign to Verify Control"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
