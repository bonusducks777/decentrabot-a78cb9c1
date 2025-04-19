
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const ControlPanel = () => {
  // This would be connected to the actual control logic
  const isCurrentController = true;

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
          <Button variant="outline" className="glow-border">
            Sign to Verify Control
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-6 py-8">
          <div className="col-span-3 flex justify-center">
            <Button className="h-16 w-16 rounded-full neo-button">↑</Button>
          </div>
          <div className="flex justify-end">
            <Button className="h-16 w-16 rounded-full neo-button">←</Button>
          </div>
          <div className="flex justify-center">
            <Button className="h-16 w-16 rounded-full neo-button">↓</Button>
          </div>
          <div className="flex justify-start">
            <Button className="h-16 w-16 rounded-full neo-button">→</Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Commands are sent in real-time to the connected robot
        </div>
      </div>
    </Card>
  );
};
