
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RobotStatusProps {
  batteryLevel?: number;
  connectionStatus?: 'online' | 'offline';
  lastActive?: string;
}

export const RobotStatus = ({ 
  batteryLevel = 85, 
  connectionStatus = 'offline',
  lastActive = '2 minutes ago'
}: RobotStatusProps) => {
  return (
    <Card className="neo-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Robot Status</h3>
        <Badge 
          variant={connectionStatus === 'online' ? "default" : "secondary"}
          className={connectionStatus === 'online' ? "bg-green-500" : "bg-gray-500"}
        >
          {connectionStatus === 'online' ? 'ONLINE' : 'OFFLINE'}
        </Badge>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Battery Level</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
            <span className="text-sm">{batteryLevel}%</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Last Active</span>
          <span className="text-sm">{lastActive}</span>
        </div>
      </div>
    </Card>
  );
};
