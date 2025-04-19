
import { Card } from "@/components/ui/card";

export const RobotLocationMap = () => {
  return (
    <Card className="neo-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Robot Location</h3>
      </div>
      <div className="aspect-video bg-black/20 rounded-md grid place-items-center">
        <p className="text-muted-foreground">Map placeholder - implement actual map here</p>
      </div>
    </Card>
  );
};
