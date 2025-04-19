
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const StakeDashboard = () => {
  return (
    <Card className="neo-card">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Stake Dashboard</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="text-muted-foreground">Your Stake:</span>
            <span className="text-xl font-bold text-cyber-cyan">85.0 DOT</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="text-muted-foreground">Top Stake:</span>
            <span className="text-xl font-bold text-cyber-cyan">125.5 DOT</span>
          </div>
          
          <div className="flex justify-between items-center pb-3">
            <span className="text-muted-foreground">Controller:</span>
            <span className="text-sm font-mono text-cyber-cyan">0xd8da...6273</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button className="neo-button">Stake More</Button>
          <Button variant="outline" className="border-cyber-blue">Withdraw</Button>
        </div>
      </div>
    </Card>
  );
};
