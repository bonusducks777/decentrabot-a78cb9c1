
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const LiveLogFeed = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const logs = [
    { time: "14:32:45", action: "Control verified" },
    { time: "14:31:22", action: "0xab12...9f3d increased stake to 85.0 WND" },
    { time: "14:30:05", action: "New controller: 0xd8da...6273" },
    { time: "14:28:17", action: "Stake withdrawn: 12.5 WND" },
    { time: "14:25:03", action: "0xd8da...6273 is now in control" },
    { time: "14:24:55", action: "0xd8da...6273 increased stake to 125.5 WND" },
    { time: "14:20:11", action: "Stake added: 42.3 WND" },
    { time: "14:18:40", action: "0xab12...9f3d connected" },
  ];

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={setIsExpanded}
      className="w-full transition-all duration-300 ease-in-out mb-4"
    >
      <Card className={`neo-card overflow-hidden transition-all duration-300 ${isExpanded ? "h-auto" : "h-16"}`}>
        <div className={`p-4 ${isExpanded ? "" : "py-1"}`}>
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center cursor-pointer py-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium">Live Activity Log</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-400 hover:text-orange-500 hover:bg-orange-500/10 h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-2">
            <ScrollArea className="h-[200px] rounded-md border">
              <div className="p-2">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`py-2 px-3 ${index % 2 === 0 ? 'bg-background/60' : 'bg-background/30'} 
                      rounded-md mb-1 flex justify-between items-center`}
                  >
                    <span className="text-sm font-mono text-muted-foreground">{log.time}</span>
                    <span className="text-sm">{log.action}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </div>
      </Card>
    </Collapsible>
  );
};
