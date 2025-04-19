
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Activity, Clock } from "lucide-react";
import { useBlockchainUtils } from "@/lib/blockchainUtils";
import { useSearchParams } from "react-router-dom";

export const RobotStatus = () => {
  const [searchParams] = useSearchParams();
  const robotId = searchParams.get("robot") || "robot-1";
  const [batteryLevel] = useState(85); // Fixed battery level
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [lastActive, setLastActive] = useState('Just now');
  const [chargeRate, setChargeRate] = useState(2.5);
  const [uptime] = useState("3h 45m"); // Fixed uptime
  
  const { getBotFee } = useBlockchainUtils();
  
  useEffect(() => {
    const fetchRobotStatus = async () => {
      try {
        // Get charge rate
        const fee = await getBotFee();
        setChargeRate(parseFloat(fee));
        
        // Update last active status
        setLastActive('Just now');
        
        // Set connection status based on battery level (just a mock logic)
        setConnectionStatus('online');
      } catch (error) {
        console.error("Error fetching robot status:", error);
      }
    };
    
    fetchRobotStatus();
  }, [robotId, getBotFee]);
  
  return (
    <Card className="neo-card p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Robot Status</h3>
        <Badge 
          variant={connectionStatus === 'online' ? "default" : "secondary"}
          className={connectionStatus === 'online' ? "bg-green-500" : "bg-gray-500"}
        >
          {connectionStatus === 'online' ? 'ONLINE' : 'OFFLINE'}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2">
            <Battery className="text-muted-foreground h-4 w-4" />
            Battery Level
          </span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
            <span className="text-sm">{batteryLevel}%</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2">
            <Activity className="text-muted-foreground h-4 w-4" />
            Charge Rate
          </span>
          <span className="text-sm text-orange-400">{chargeRate} WND/hr</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            Uptime
          </span>
          <span className="text-sm">{uptime}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            Last Active
          </span>
          <span className="text-sm">{lastActive}</span>
        </div>
      </div>
    </Card>
  );
};
