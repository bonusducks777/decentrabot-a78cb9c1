"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBlockchainUtils } from "@/lib/blockchainUtils"
import { useState, useEffect } from "react"
import { useAccount } from "wagmi"

interface StakingLeaderboardProps {
  robotId: string
}

interface LeaderboardEntry {
  address: string
  stake: string
  timeRemaining: string
  isCurrentUser?: boolean
}

export function StakingLeaderboard({ robotId }: StakingLeaderboardProps) {
  const { getLeaderboard, getUserBalance, stakeTokens, withdrawTokens } = useBlockchainUtils()
  const [stakeAmount, setStakeAmount] = useState("")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userStake, setUserStake] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()

  useEffect(() => {
    let isMounted = true

    const fetchLeaderboard = async () => {
      if (isLoading) return

      try {
        setIsLoading(true)
        const data = await getLeaderboard()

        if (isMounted && data) {
          setLeaderboard(data)
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchLeaderboard()

    // Set up interval to fetch data periodically (every 30 seconds)
    const interval = setInterval(fetchLeaderboard, 30000)

    // Cleanup function
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [robotId])

  // Fetch user stake separately
  useEffect(() => {
    if (!address) return

    const fetchUserBalance = async () => {
      try {
        const balanceStr = await getUserBalance()
        setUserStake(Number(parseFloat(balanceStr)))
      } catch (error) {
        console.error("Error fetching user balance:", error)
      }
    }

    fetchUserBalance()

    // Set up interval to fetch user balance periodically
    const interval = setInterval(fetchUserBalance, 30000)

    return () => clearInterval(interval)
  }, [address, getUserBalance])

  const handleStake = async () => {
    const amount = Number.parseFloat(stakeAmount)
    if (isNaN(amount) || amount <= 0) return

    try {
      await stakeTokens(stakeAmount)
      setStakeAmount("")

      // Refresh leaderboard and user stake after staking
      const data = await getLeaderboard()
      setLeaderboard(data)

      if (address) {
        const balanceStr = await getUserBalance()
        setUserStake(Number(parseFloat(balanceStr)))
      }
    } catch (error) {
      console.error("Error staking tokens:", error)
    }
  }

  const handleUnstake = async () => {
    try {
      await withdrawTokens(userStake.toString())

      // Refresh leaderboard and user stake after unstaking
      const data = await getLeaderboard()
      setLeaderboard(data)

      if (address) {
        const balanceStr = await getUserBalance()
        setUserStake(Number(parseFloat(balanceStr)))
      }
    } catch (error) {
      console.error("Error unstaking tokens:", error)
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Staking Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
        {leaderboard.map((stake, index) => {
          const isCurrentUser = address && stake.address.toLowerCase().includes(address.toLowerCase().slice(2, 6))
          const timeRemaining = stake.timeRemaining

          return (
            <div
              key={stake.address}
              className={`flex justify-between items-center p-2 rounded-md ${
                index === 0 ? "bg-orange-100 dark:bg-orange-900/30" : ""
              } ${isCurrentUser ? "border border-orange-500" : ""}`}
            >
              <div className="flex items-center gap-2">
                <div className="font-bold">{index + 1}</div>
                <div className="flex flex-col">
                  <span className={`font-medium ${index === 0 ? "text-orange-500" : ""}`}>
                    {stake.address}
                    {index === 0 && " (Controller)"}
                    {isCurrentUser && " (You)"}
                  </span>
                  {index === 0 && timeRemaining && (
                    <span className="text-xs text-muted-foreground">Time remaining: {timeRemaining}</span>
                  )}
                </div>
              </div>
              <div className="font-medium">{stake.stake} DOT</div>
            </div>
          )
        })}

        {leaderboard.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">No stakes yet. Be the first to stake!</div>
        )}

        {isLoading && leaderboard.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">Loading leaderboard...</div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col p-3 gap-2">
        <div className="text-sm mb-1">
          Your stake: <span className="font-medium">{userStake.toFixed(2)} DOT</span>
        </div>
        <div className="flex gap-2 w-full">
          <Input
            type="number"
            placeholder="Amount to stake"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleStake} className="bg-orange-500 hover:bg-orange-600">
            Stake
          </Button>
        </div>
        {userStake > 0 && (
          <Button variant="outline" onClick={handleUnstake} className="w-full">
            Unstake All
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
