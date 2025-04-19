
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAccount } from "wagmi";
import { Trophy, Clock } from "lucide-react";

interface LeaderboardEntry {
  position: number;
  address: string;
  stake: number;
  isCurrentUser: boolean;
}

export const StakingLeaderboard = () => {
  const { address } = useAccount();
  const shortAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
  
  // Placeholder data for the leaderboard
  const leaderboardData: LeaderboardEntry[] = [
    { position: 1, address: "0xd8da...6273", stake: 125.5, isCurrentUser: false },
    { position: 2, address: shortAddress || "0xab12...9f3d", stake: 85.0, isCurrentUser: !!address },
    { position: 3, address: "0x742a...e851", stake: 65.2, isCurrentUser: false },
    { position: 4, address: "0x983f...4c21", stake: 42.8, isCurrentUser: false },
    { position: 5, address: "0xf012...a734", stake: 30.1, isCurrentUser: false },
  ];
  
  // Calculate time remaining for current session (placeholder)
  const timeRemaining = {
    hours: 2,
    minutes: 45
  };
  
  return (
    <Card className="neo-card p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Staking Leaderboard
        </h3>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Stake (DOT)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((entry) => (
            <TableRow key={entry.position} className={entry.isCurrentUser ? "bg-cyber-blue/10" : ""}>
              <TableCell className="font-medium">{entry.position}</TableCell>
              <TableCell className={entry.isCurrentUser ? "text-cyber-cyan" : ""}>
                {entry.address}
                {entry.position === 1 && (
                  <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded-full">
                    Controller
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">{entry.stake}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-4 p-3 bg-background/50 rounded-md border border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-cyber-cyan" />
          Current session ends in:
        </div>
        <div className="font-mono text-cyber-cyan">
          {timeRemaining.hours}h {timeRemaining.minutes}m
        </div>
      </div>
    </Card>
  );
};
