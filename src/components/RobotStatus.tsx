
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Activity, Clock } from "lucide-react";
import { useBlockchainUtils } from "@/lib/blockchainUtils";
import { useSearchParams } from "react-router-dom";

export const RobotStatus = () => {
  const [searchParams] = useSearchParams();
  const robotId = searchParams.get("robot") || "robot-1";
  
  // Fixed values to prevent random updates
  const batteryLevel = 85; 
  const connectionStatus = 'online';
  const lastActive = 'Just now';
  const chargeRate = 2.5;
  const uptime = "3h 45m"; 
  
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
                className="h-full bg-orange-500 rounded-full"
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
