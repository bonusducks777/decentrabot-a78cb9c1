import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBlockchainUtils } from "@/lib/blockchainUtils";
import { toast } from "@/components/ui/sonner";

export const StakeDashboard = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [userBalance, setUserBalance] = useState("0.0");
  const [topStake, setTopStake] = useState("0.0");
  const [topStaker, setTopStaker] = useState("0x0000...0000");
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const blockchainUtils = useBlockchainUtils();

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected && address) {
        try {
          const balance = await blockchainUtils.getUserBalance();
          setUserBalance(balance);
          
          const highestStaker = await blockchainUtils.getHighestStaker() as string;
          setTopStaker(highestStaker ? `${highestStaker.slice(0, 6)}...${highestStaker.slice(-4)}` : "0x0000...0000");
          
          setTopStake("125.5");
        } catch (error) {
          console.error("Error fetching stake data:", error);
        }
      }
    };
    
    fetchData();
  }, [isConnected, address, blockchainUtils]);

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
      const success = await blockchainUtils.stakeTokens(stakeAmount);
      if (success) {
        toast.success(`Successfully staked ${stakeAmount} WND`);
        setStakeAmount("");
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
      const success = await blockchainUtils.withdrawTokens(withdrawAmount);
      if (success) {
        toast.success(`Successfully withdrawn ${withdrawAmount} WND`);
        setWithdrawAmount("");
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
      <div className="p-2">
        <h3 className="text-base font-bold mb-2">Stake Dashboard <span className="text-xs text-orange-400">(Westend)</span></h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center border-b border-border pb-1">
            <span className="text-sm text-muted-foreground">Your Stake:</span>
            <span className="text-base font-bold text-orange-400">{userBalance} WND</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-border pb-1">
            <span className="text-sm text-muted-foreground">Top Stake:</span>
            <span className="text-base font-bold text-orange-400">{topStake} WND</span>
          </div>
          
          <div className="flex justify-between items-center pb-1">
            <span className="text-sm text-muted-foreground">Controller:</span>
            <span className="text-xs font-mono text-orange-400">{topStaker}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="neo-button h-8 text-xs" disabled={!isConnected}>Stake More</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Stake WND Tokens</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Stake</label>
                  <Input
                    type="number"
                    placeholder="Enter WND amount"
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
              <Button variant="outline" className="border-orange-400 h-8 text-xs" disabled={!isConnected}>Withdraw</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw WND Tokens</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Withdraw</label>
                  <Input
                    type="number"
                    placeholder="Enter WND amount"
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
