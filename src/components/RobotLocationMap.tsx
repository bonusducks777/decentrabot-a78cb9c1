"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Map } from "lucide-react"
import { useBlockchainUtils } from "@/lib/blockchainUtils"
import { useSearchParams } from "react-router-dom"

export const RobotLocationMap = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 })
  const [searchParams] = useSearchParams()
  const robotId = searchParams.get("robot") || "robot-1"
  const { getRobotLocation } = useBlockchainUtils()

  // Memoize the getRobotLocation function to prevent it from changing on every render
  const memoizedGetLocation = useCallback((id: string) => {
    return getRobotLocation(id)
  }, []) // Empty dependency array ensures stable function reference

  // Fetch robot location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const robotLocation = await memoizedGetLocation(robotId)
        setLocation(robotLocation)
      } catch (error) {
        console.error("Failed to fetch robot location:", error)
      }
    }

    fetchLocation()
    const interval = setInterval(fetchLocation, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [robotId, memoizedGetLocation]) // Only depend on robotId and the memoized function

  // Initialize and update map
  useEffect(() => {
    if (!mapRef.current) return

    // In a real implementation, this would use a mapping library like Leaflet or Mapbox
    // For this demo, we'll just show a static representation
    const mapContainer = mapRef.current
    const robotMarker = document.createElement("div")
    robotMarker.className =
      "absolute w-4 h-4 bg-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-md pulse-marker"

    // Calculate position based on coordinates (simplified)
    const x = ((location.lng + 180) / 360) * 100
    const y = ((90 - location.lat) / 180) * 100

    robotMarker.style.left = `${x}%`
    robotMarker.style.top = `${y}%`

    // Clear previous markers
    mapContainer.innerHTML = ""
    mapContainer.appendChild(robotMarker)
  }, [location])

  return (
    <Card className="neo-card p-3 mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-orange-400" />
          <h3 className="text-lg font-semibold">Robot Location</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
      </div>
      <div className="aspect-video bg-slate-800 rounded-md relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 grid grid-cols-8 grid-rows-4">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="border border-white/10"></div>
          ))}
        </div>
        <div ref={mapRef} className="absolute inset-0">
          {/* Robot marker will be inserted here by useEffect */}
        </div>
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs">
          Live Location
        </div>
      </div>
      <style>
        {`
        @keyframes pulse-marker {
          0% { box-shadow: 0 0 0 0 rgba(243, 145, 65, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(243, 145, 65, 0); }
          100% { box-shadow: 0 0 0 0 rgba(243, 145, 65, 0); }
        }
        .pulse-marker {
          animation: pulse-marker 2s infinite;
        }
        `}
      </style>
    </Card>
  )
}
