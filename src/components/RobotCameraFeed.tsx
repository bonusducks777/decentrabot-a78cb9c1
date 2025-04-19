
import { Card } from "@/components/ui/card";

export const RobotCameraFeed = () => {
  return (
    <Card className="neo-card p-4 mb-6 overflow-hidden">
      <div className="relative aspect-video bg-black/70 rounded-md grid place-items-center overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="text-center space-y-2">
          <div className="font-mono text-cyber-cyan">CAMERA FEED</div>
          <div className="text-2xl font-bold">Robot Camera Offline</div>
          <div className="text-muted-foreground">Connect wallet and stake to access live feed</div>
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs text-red-400">DISCONNECTED</span>
        </div>
      </div>
    </Card>
  );
};
