"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Battery, Signal } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { useBlockchainUtils } from "@/lib/blockchainUtils"

interface RobotStatusProps {
  batteryLevel: number
  connectionStatus: "Connected" | "Disconnected"
  lastActive: string
}

export function RobotStatus({
  batteryLevel: initialBatteryLevel,
  connectionStatus: initialConnectionStatus,
  lastActive: initialLastActive,
}: RobotStatusProps) {
  const [batteryLevel, setBatteryLevel] = useState(initialBatteryLevel)
  const [connectionStatus, setConnectionStatus] = useState(initialConnectionStatus)
  const [lastActive, setLastActive] = useState(initialLastActive)
  const [botFee, setBotFee] = useState("0.5")
  const [isLoading, setIsLoading] = useState(false)
  const { getRobotBatteryLevel, getRobotUptime, getBotFee } = useBlockchainUtils()

  const formattedLastActive = new Date(lastActive).toLocaleString()

  useEffect(() => {
    let isMounted = true

    const fetchRobotStatus = async () => {
      if (isLoading) return

      try {
        setIsLoading(true)

        // Only update state if component is still mounted
        const batteryLevel = await getRobotBatteryLevel("robot-1")
        if (isMounted) setBatteryLevel(batteryLevel)

        const uptime = await getRobotUptime("robot-1")
        if (isMounted) setLastActive(uptime)

        const fee = await getBotFee()
        if (isMounted) setBotFee(fee)
      } catch (error) {
        console.error("Error fetching robot status:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchRobotStatus()

    // Set up interval to fetch data periodically (every 30 seconds)
    const interval = setInterval(fetchRobotStatus, 30000)

    // Cleanup function
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, []) // Empty dependency array to run only once on mount

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Robot Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Battery Level</span>
            <span className="text-sm font-medium">{batteryLevel}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={batteryLevel} className="h-2" />
            <Battery className={`h-4 w-4 ${batteryLevel < 20 ? "text-red-500" : "text-green-500"}`} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Connection Status</span>
            <Badge
              variant="outline"
              className={
                connectionStatus === "Connected" ? "text-green-500 border-green-500" : "text-red-500 border-red-500"
              }
            >
              <Signal className="h-3 w-3 mr-1" />
              {connectionStatus}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Active</span>
            <span className="text-sm font-medium">{formattedLastActive}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Fee Rate</span>
            <span className="text-sm font-medium">{botFee} DOT/min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
