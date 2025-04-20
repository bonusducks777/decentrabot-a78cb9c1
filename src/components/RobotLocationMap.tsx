"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import { useBlockchainUtils } from "@/lib/blockchainUtils"

interface RobotLocationMapProps {
  location: string
  coordinates: {
    x: number
    y: number
  }
}

export function RobotLocationMap({
  location: initialLocation,
  coordinates: initialCoordinates,
}: RobotLocationMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [location, setLocation] = useState(initialLocation)
  const [coordinates, setCoordinates] = useState(initialCoordinates)
  const [isLoading, setIsLoading] = useState(false)
  const { getRobotLocation } = useBlockchainUtils()

  useEffect(() => {
    let isMounted = true

    const fetchLocation = async () => {
      if (isLoading) return

      try {
        setIsLoading(true)
        const robotLocation = await getRobotLocation("robot-1")

        if (isMounted) {
          setCoordinates({
            x: Math.floor(robotLocation.lat * 100) / 100,
            y: Math.floor(robotLocation.lng * 100) / 100,
          })
        }
      } catch (error) {
        console.error("Error fetching location:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchLocation()

    // Set up interval to fetch data periodically (every 30 seconds)
    const interval = setInterval(fetchLocation, 30000)

    // Cleanup function
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    // Draw vertical grid lines
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw robot position
    const robotX = (coordinates.x / 100) * canvas.width
    const robotY = (coordinates.y / 100) * canvas.height

    // Draw pulsing circle
    ctx.beginPath()
    ctx.arc(robotX, robotY, 10, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(249, 115, 22, 0.3)"
    ctx.fill()

    // Draw robot marker
    ctx.beginPath()
    ctx.arc(robotX, robotY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#f97316"
    ctx.fill()
  }, [coordinates])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Robot Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Current Location: <span className="font-medium">{location}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Coordinates:{" "}
          <span className="font-medium">
            X: {coordinates.x}, Y: {coordinates.y}
          </span>
        </div>
        <div className="relative border rounded-md overflow-hidden aspect-video">
          <canvas ref={canvasRef} width={300} height={150} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  )
}

