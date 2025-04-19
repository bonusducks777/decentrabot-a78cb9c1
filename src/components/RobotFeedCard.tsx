
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface RobotFeedCardProps {
  id: string;
  title: string;
  isActive?: boolean;
  viewerCount?: number;
  thumbnailUrl?: string;
}

export const RobotFeedCard = ({ id, title, isActive = false, viewerCount = 0, thumbnailUrl }: RobotFeedCardProps) => {
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
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/80 rounded text-xs font-medium backdrop-blur-sm">
            {viewerCount} watching
          </div>
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
        </div>
      </Link>
    </Card>
  );
};

