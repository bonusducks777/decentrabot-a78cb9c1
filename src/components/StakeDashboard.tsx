
import { useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useContractFunctions } from "@/lib/contractUtils";
import { toast } from "@/components/ui/sonner";

export const StakeDashboard = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [userBalance, setUserBalance] = useState("85.0");
  const [topStake, setTopStake] = useState("125.5");
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const contract = useContractFunctions();

  const handleStake = async () => {
    if (!isConnected || !address) {
      toast("Please connect your wallet first");
      return;
    }
    
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast("Please enter a valid amount");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await contract.stakeTokens(publicClient, stakeAmount);
      if (success) {
        toast.success(`Successfully staked ${stakeAmount} DOT`);
        setStakeAmount("");
        // Update the balance (mock for now)
        setUserBalance((parseFloat(userBalance) + parseFloat(stakeAmount)).toFixed(1));
      } else {
        toast.error("Staking failed");
      }
    } catch (error) {
      toast.error("An error occurred while staking");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !address) {
      toast("Please connect your wallet first");
      return;
    }
    
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast("Please enter a valid amount");
      return;
    }

    if (parseFloat(withdrawAmount) > parseFloat(userBalance)) {
      toast.error("Insufficient balance");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await contract.withdrawTokens(publicClient, withdrawAmount);
      if (success) {
        toast.success(`Successfully withdrawn ${withdrawAmount} DOT`);
        setWithdrawAmount("");
        // Update the balance (mock for now)
        setUserBalance((parseFloat(userBalance) - parseFloat(withdrawAmount)).toFixed(1));
      } else {
        toast.error("Withdrawal failed");
      }
    } catch (error) {
      toast.error("An error occurred while withdrawing");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="neo-card">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Stake Dashboard <span className="text-xs text-orange-400">(Moonbeam)</span></h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="text-muted-foreground">Your Stake:</span>
            <span className="text-xl font-bold text-orange-400">{userBalance} DOT</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="text-muted-foreground">Top Stake:</span>
            <span className="text-xl font-bold text-orange-400">{topStake} DOT</span>
          </div>
          
          <div className="flex justify-between items-center pb-3">
            <span className="text-muted-foreground">Controller:</span>
            <span className="text-sm font-mono text-orange-400">0xd8da...6273</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="neo-button" disabled={!isConnected}>Stake More</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Stake DOT Tokens</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Stake</label>
                  <Input
                    type="number"
                    placeholder="Enter DOT amount"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleStake} 
                  className="w-full neo-button" 
                  disabled={isLoading || !stakeAmount}
                >
                  {isLoading ? "Processing..." : "Confirm Stake"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-orange-400" disabled={!isConnected}>Withdraw</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw DOT Tokens</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Withdraw</label>
                  <Input
                    type="number"
                    placeholder="Enter DOT amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleWithdraw} 
                  className="w-full neo-button" 
                  disabled={isLoading || !withdrawAmount}
                >
                  {isLoading ? "Processing..." : "Confirm Withdrawal"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
};
