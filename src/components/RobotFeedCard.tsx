
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Activity, Battery, Users } from "lucide-react";

interface RobotFeedCardProps {
  id: string;
  title: string;
  isActive?: boolean;
  viewerCount?: number;
  thumbnailUrl?: string;
  batteryLevel?: number;
  uptime?: string;
  operatorCount?: number;
}

export const RobotFeedCard = ({ 
  id, 
  title, 
  isActive = false, 
  viewerCount = 0, 
  thumbnailUrl,
  batteryLevel = 75,
  uptime = "3h 45m",
  operatorCount = 3
}: RobotFeedCardProps) => {
  return (
    <Card className={`overflow-hidden transition-transform hover:scale-[1.02] ${!isActive && 'opacity-60'}`}>
      <Link to={isActive ? "/app" : "#"} className={`block ${!isActive && 'cursor-not-allowed'}`}>
        <div className="aspect-video bg-black/70 relative">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-muted-foreground">No Feed Available</div>
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs font-medium backdrop-blur-sm flex items-center gap-1">
            <Users className="h-3 w-3" />
            {viewerCount} watching
          </div>
          {isActive && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-red-500/80 rounded text-xs font-medium backdrop-blur-sm">
              LIVE
            </div>
          )}
          {!isActive && (
            <div className="absolute inset-0 grid place-items-center bg-black/50 backdrop-blur-sm">
              <div className="text-white font-medium">Coming Soon</div>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm text-cyber-cyan">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isActive ? 'Live Now' : 'Offline'}
          </p>
          
          {/* Metrics section */}
          {isActive && (
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/50">
              <div className="flex flex-col items-center text-xs">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Battery className="h-3 w-3" />
                </div>
                <span className="font-medium">{batteryLevel}%</span>
              </div>
              
              <div className="flex flex-col items-center text-xs">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Activity className="h-3 w-3" />
                </div>
                <span className="font-medium">{uptime}</span>
              </div>
              
              <div className="flex flex-col items-center text-xs">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Users className="h-3 w-3" />
                </div>
                <span className="font-medium">{operatorCount}</span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};
