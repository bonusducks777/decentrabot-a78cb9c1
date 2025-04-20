"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useBlockchainUtils } from "@/lib/blockchainUtils"
import { toast } from "@/components/ui/sonner"

// Use the contract address and ABI for getStakedBalance

export const StakeDashboard = () => {
  const { address, isConnected } = useAccount()
  // Dialog open state
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [userBalance, setUserBalance] = useState("0.0")
  const [topStake, setTopStake] = useState("0.0")
  const [topStaker, setTopStaker] = useState("0x0000...0000")
  const [stakeAmount, setStakeAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { getUserBalance, getHighestStaker, getStakedBalance, stakeTokens, withdrawTokens } = useBlockchainUtils()

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected && address) {
        try {
          // Get user's staked balance
          const balance = await getUserBalance()
          setUserBalance(balance)

          // Get highest staker and their stake
          const highest = await getHighestStaker()
          if (highest) {
            const short = `${highest.slice(0, 6)}...${highest.slice(-4)}`
            setTopStaker(short)
            const stake = await getStakedBalance(highest)
            setTopStake(stake)
          } else {
            setTopStaker("0x0000...0000")
            setTopStake("0.0")
          }
        } catch (error) {
          console.error("Error fetching stake data:", error)
        }
      }
    }

    fetchData()
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, [isConnected, address, getUserBalance, getHighestStaker, getStakedBalance])

  const handleStake = async () => {
    if (!isConnected || !address) {
      toast("Please connect your wallet first")
      return
    }

    if (!stakeAmount || Number.parseFloat(stakeAmount) <= 0) {
      toast("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    try {
      const success = await stakeTokens(stakeAmount)
      if (success) {
        toast.success(`Successfully staked ${stakeAmount} WND`)
        // Optimistically update balances
        setIsStakeDialogOpen(false)
        setStakeAmount("")
        const newBalance = (parseFloat(userBalance) + parseFloat(stakeAmount)).toFixed(4)
        setUserBalance(newBalance)
        // Update top stake if needed
        if (parseFloat(newBalance) > parseFloat(topStake)) {
          const short = `${address?.slice(0,6)}...${address?.slice(-4)}`
          setTopStaker(short)
          setTopStake(newBalance)
        }
      } else {
        toast.error("Staking failed")
      }
    } catch (error) {
      toast.error("An error occurred while staking")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!isConnected || !address) {
      toast("Please connect your wallet first")
      return
    }

    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      toast("Please enter a valid amount")
      return
    }

    if (Number.parseFloat(withdrawAmount) > Number.parseFloat(userBalance)) {
      toast.error("Insufficient balance")
      return
    }

    setIsLoading(true)
    try {
      const success = await withdrawTokens(withdrawAmount)
      if (success) {
        toast.success(`Successfully withdrawn ${withdrawAmount} WND`)
        setWithdrawAmount("")
        setIsWithdrawDialogOpen(false)
        // Optimistically update balances
        const newBalanceW = (parseFloat(userBalance) - parseFloat(withdrawAmount)).toFixed(4)
        setUserBalance(newBalanceW)
        // Update top stake if this user was controller
        const shortAddr = `${address?.slice(0,6)}...${address?.slice(-4)}`
        if (topStaker === shortAddr) {
          setTopStake(newBalanceW)
        }
      } else {
        toast.error("Withdrawal failed")
      }
    } catch (error) {
      toast.error("An error occurred while withdrawing")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="neo-card h-full">
      <div className="p-1 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xs font-bold mb-0.5 flex items-center">
            Stake Dashboard <span className="text-[10px] text-orange-400 ml-1">(Westend)</span>
          </h3>

          <div className="space-y-0.5">
            <div className="flex justify-between items-center border-b border-border pb-0.5">
              <span className="text-[10px] text-muted-foreground">Your Stake:</span>
              <span className="text-xs font-bold text-orange-400">{userBalance} WND</span>
            </div>

            <div className="flex justify-between items-center border-b border-border pb-0.5">
              <span className="text-[10px] text-muted-foreground">Top Stake:</span>
              <span className="text-xs font-bold text-orange-400">{topStake} WND</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground">Controller:</span>
              <span className="text-[10px] font-mono text-orange-400">{topStaker}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 mt-1">
          <Dialog open={isStakeDialogOpen} onOpenChange={setIsStakeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="neo-button h-6 text-[10px] py-0" disabled={!isConnected}>
                Stake More
              </Button>
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
                <Button onClick={handleStake} className="w-full neo-button" disabled={isLoading || !stakeAmount}>
                  {isLoading ? "Processing..." : "Confirm Stake"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-orange-400 h-6 text-[10px] py-0" disabled={!isConnected}>
                Withdraw
              </Button>
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
                <Button onClick={handleWithdraw} className="w-full neo-button" disabled={isLoading || !withdrawAmount}>
                  {isLoading ? "Processing..." : "Confirm Withdrawal"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  )
}
