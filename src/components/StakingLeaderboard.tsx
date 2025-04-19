"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { useAccount } from "wagmi"
import { Trophy, Clock } from "lucide-react"
import { useBlockchainUtils } from "@/lib/blockchainUtils"

export const StakingLeaderboard = () => {
  const { address } = useAccount()
  const blockchainUtils = useBlockchainUtils()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [timeRemaining, setTimeRemaining] = useState({ hours: 2, minutes: 45 })
  const [loading, setLoading] = useState(true)

  // Use a ref to track if the component is mounted
  // Using a ref instead of state to avoid re-renders
  useEffect(() => {
    let mounted = true
    const blockchainUtilsRef = blockchainUtils // Create a stable reference

    const fetchLeaderboard = async () => {
      if (!mounted) return

      try {
        setLoading(true)
        const data = await blockchainUtilsRef.getLeaderboard()

        if (!mounted) return

        // Convert leaderboard data to the format we need
        const formattedData = data.map((entry, index) => ({
          position: index + 1,
          address: entry.address,
          stake: Number.parseFloat(entry.stake),
          isCurrentUser: address && entry.address.toLowerCase().includes(address.slice(2, 6).toLowerCase()),
          timeRemaining: entry.timeRemaining,
        }))

        setLeaderboardData(formattedData)

        // Set time remaining for current session
        if (formattedData.length > 0) {
          const topTime = formattedData[0].timeRemaining.split("h ")
          setTimeRemaining({
            hours: Number.parseInt(topTime[0]),
            minutes: Number.parseInt(topTime[1].replace("m", "")),
          })
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Initial fetch
    fetchLeaderboard()

    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)

    // Cleanup function
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [address]) // Only depend on address

  return (
    <Card className="neo-card p-4">
      <div className="mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Staking Leaderboard
        </h3>
      </div>

      <div className="max-h-[200px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Stake</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((entry) => (
              <TableRow key={entry.position} className={entry.isCurrentUser ? "bg-orange-500/10" : ""}>
                <TableCell className="font-medium">{entry.position}</TableCell>
                <TableCell className={entry.isCurrentUser ? "text-orange-400" : ""}>
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
      </div>

      <div className="mt-2 p-2 bg-background/50 rounded-md border border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-orange-400" />
          Session ends:
        </div>
        <div className="font-mono text-orange-400">
          {timeRemaining.hours}h {timeRemaining.minutes}m
        </div>
      </div>
    </Card>
  )
}
