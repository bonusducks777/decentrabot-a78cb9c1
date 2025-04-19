
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LiveLogFeed = () => {
  // Sample log data
  const logs = [
    { time: "14:32:45", action: "Robot moved forward" },
    { time: "14:31:22", action: "0xab12...9f3d increased stake to 85.0 DOT" },
    { time: "14:30:05", action: "Robot turned right" },
    { time: "14:28:17", action: "Robot turned left" },
    { time: "14:25:03", action: "0xd8da...6273 is now in control" },
    { time: "14:24:55", action: "0xd8da...6273 increased stake to 125.5 DOT" },
    { time: "14:20:11", action: "Robot moved backward" },
    { time: "14:18:40", action: "0xab12...9f3d connected" },
  ];

  return (
    <Card className="neo-card">
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">Live Activity Log</h3>
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-2">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`py-2 px-3 ${index % 2 === 0 ? 'bg-background/60' : 'bg-background/30'} 
                  rounded-md mb-1 flex justify-between ${index === 0 ? 'border-l-2 border-orange-400' : ''}`}
              >
                <span className="text-sm font-mono">{log.time}</span>
                <span className="text-sm">{log.action}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
