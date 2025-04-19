
"use client"

import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { parseEther, formatEther } from "viem"
import { useState, useEffect } from "react"
import { readContract, writeContract, sendTransaction } from "@wagmi/core"
import { config } from "@/components/RainbowKitProvider"

type LeaderboardEntry = {
  address: string;
  stake: string;
  timeRemaining: string;
}

// Contract ABI - This would be generated from your Solidity contract
// This is a simplified version for demonstration
const CONTRACT_ABI = [
  // Read functions
  "function getStakedBalance(address user) view returns (uint256)",
  "function getHighestStaker() view returns (address)",
  "function isController(address user) view returns (bool)",
  "function getBotFee() view returns (uint256)",
  "function getRobotLocation(string robotId) view returns (int256 lat, int256 lng)",
  "function getRobotBatteryLevel(string robotId) view returns (uint256)",
  "function getRobotUptime(string robotId) view returns (uint256)",
  "function getTimeRemaining(address user) view returns (uint256)",
  "function getStakingLeaderboard(uint256 count) view returns (address[] addresses, uint256[] amounts)",
  "function getAllRobotIds() view returns (string[] memory)",

  // Write functions
  "function stakeTokens() payable",
  "function withdrawTokens(uint256 amount)",
  "function sendCommand(string robotId, string command)",
] as const;

// Contract address - Replace with your deployed contract address
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"

export const useBlockchainUtils = () => {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [cachedLeaderboard, setCachedLeaderboard] = useState<LeaderboardEntry[]>([])
  const [cachedRobotIds, setCachedRobotIds] = useState<string[]>([])

  // Fetch robot IDs on component mount
  useEffect(() => {
    if (isConnected && publicClient) {
      fetchRobotIds()
    }
  }, [isConnected, publicClient])

  // Fetch robot IDs from the contract
  const fetchRobotIds = async () => {
    try {
      const robotIds = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getAllRobotIds",
        chainId: config.chains[0].id,
      }) as string[]

      setCachedRobotIds(robotIds)
    } catch (error) {
      console.error("Error fetching robot IDs:", error)
      // Fallback to default robot IDs
      setCachedRobotIds(["robot-1", "robot-2", "robot-3", "robot-4", "robot-5", "robot-6"])
    }
  }

  // ========== STAKING OPERATIONS ==========

  const stakeTokens = async (amount: string) => {
    if (!isConnected || !walletClient) {
      console.error("Wallet not connected")
      return false
    }

    try {
      const amountInWei = parseEther(amount)

      // Send native tokens to the contract
      const tx = await sendTransaction(config, {
        to: CONTRACT_ADDRESS,
        value: amountInWei,
        data: "0x", // Call the receive function
        chainId: config.chains[0].id,
      })

      console.log("Staking transaction:", tx)
      return true
    } catch (error) {
      console.error("Error staking tokens:", error)
      return false
    }
  }

  const withdrawTokens = async (amount: string) => {
    if (!isConnected || !walletClient) {
      console.error("Wallet not connected")
      return false
    }

    try {
      const amountInWei = parseEther(amount)

      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "withdrawTokens",
        args: [amountInWei],
        chainId: config.chains[0].id,
        account: address,
      })

      console.log("Withdrawal transaction:", tx)
      return true
    } catch (error) {
      console.error("Error withdrawing tokens:", error)
      return false
    }
  }

  // ========== BALANCE AND CONTROL CHECKS ==========

  const getUserBalance = async () => {
    if (!isConnected || !address || !publicClient) {
      return "0.0"
    }

    try {
      const balance = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getStakedBalance",
        args: [address],
        chainId: config.chains[0].id,
      }) as bigint

      return formatEther(balance)
    } catch (error) {
      console.error("Error getting user balance:", error)
      return "0.0"
    }
  }

  const getHighestStaker = async () => {
    if (!publicClient) {
      return "0x0000000000000000000000000000000000000000"
    }

    try {
      const highestStaker = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getHighestStaker",
        chainId: config.chains[0].id,
      })

      return highestStaker
    } catch (error) {
      console.error("Error getting highest staker:", error)
      return "0x0000000000000000000000000000000000000000"
    }
  }

  const isController = async () => {
    if (!isConnected || !address || !publicClient) {
      return false
    }

    try {
      const controller = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "isController",
        args: [address],
        chainId: config.chains[0].id,
      }) as boolean

      return controller
    } catch (error) {
      console.error("Error checking controller status:", error)
      return false
    }
  }

  const getBotFee = async () => {
    if (!publicClient) {
      return "2.5"
    }

    try {
      const fee = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getBotFee",
        chainId: config.chains[0].id,
      }) as bigint

      // Convert from wei (1e18) to WND
      return formatEther(fee)
    } catch (error) {
      console.error("Error getting bot fee:", error)
      return "2.5"
    }
  }

  const getRobotLocation = async (robotId: string) => {
    if (!publicClient) {
      // Fallback to default locations
      switch (robotId) {
        case "robot-1":
          return { lat: 40.7128, lng: -74.006 } // New York
        case "robot-2":
          return { lat: 51.5074, lng: -0.1278 } // London
        case "robot-3":
          return { lat: 35.6762, lng: 139.6503 } // Tokyo
        case "robot-4":
          return { lat: -33.8688, lng: 151.2093 } // Sydney
        case "robot-5":
          return { lat: 48.8566, lng: 2.3522 } // Paris
        case "robot-6":
          return { lat: 37.7749, lng: -122.4194 } // San Francisco
        default:
          return { lat: 0, lng: 0 }
      }
    }

    try {
      const location = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getRobotLocation",
        args: [robotId],
        chainId: config.chains[0].id,
      }) as [bigint, bigint]

      return {
        lat: Number(location[0]) / 1e6, // Convert from int256 to decimal degrees
        lng: Number(location[1]) / 1e6,
      }
    } catch (error) {
      console.error(`Error getting location for robot ${robotId}:`, error)
      // Fallback to default locations
      switch (robotId) {
        case "robot-1":
          return { lat: 40.7128, lng: -74.006 } // New York
        case "robot-2":
          return { lat: 51.5074, lng: -0.1278 } // London
        case "robot-3":
          return { lat: 35.6762, lng: 139.6503 } // Tokyo
        case "robot-4":
          return { lat: -33.8688, lng: 151.2093 } // Sydney
        case "robot-5":
          return { lat: 48.8566, lng: 2.3522 } // Paris
        case "robot-6":
          return { lat: 37.7749, lng: -122.4194 } // San Francisco
        default:
          return { lat: 0, lng: 0 }
      }
    }
  }

  const getRobotBatteryLevel = async (robotId: string) => {
    if (!publicClient) {
      return Math.floor(Math.random() * 40) + 60 // Random between 60-100
    }

    try {
      const batteryLevel = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getRobotBatteryLevel",
        args: [robotId],
        chainId: config.chains[0].id,
      }) as bigint

      return Number(batteryLevel)
    } catch (error) {
      console.error(`Error getting battery level for robot ${robotId}:`, error)
      return Math.floor(Math.random() * 40) + 60 // Random between 60-100
    }
  }

  const getRobotUptime = async (robotId: string) => {
    if (!publicClient) {
      const hours = Math.floor(Math.random() * 6)
      const minutes = Math.floor(Math.random() * 60)
      return `${hours}h ${minutes}m`
    }

    try {
      const uptimeSeconds = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getRobotUptime",
        args: [robotId],
        chainId: config.chains[0].id,
      }) as bigint

      // Convert seconds to hours and minutes
      const hours = Math.floor(Number(uptimeSeconds) / 3600)
      const minutes = Math.floor((Number(uptimeSeconds) % 3600) / 60)

      return `${hours}h ${minutes}m`
    } catch (error) {
      console.error(`Error getting uptime for robot ${robotId}:`, error)
      const hours = Math.floor(Math.random() * 6)
      const minutes = Math.floor(Math.random() * 60)
      return `${hours}h ${minutes}m`
    }
  }

  const sendRobotCommand = async (robotId: string, command: string) => {
    if (!isConnected || !walletClient || !address) {
      console.error("Wallet not connected")
      return false
    }

    try {
      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "sendCommand",
        args: [robotId, command],
        chainId: config.chains[0].id,
        account: address,
      })

      console.log(`Command sent to ${robotId}:`, command)
      console.log("Transaction:", tx)
      return true
    } catch (error) {
      console.error(`Error sending command to ${robotId}:`, error)
      return false
    }
  }

  // ========== CONTRACT UTILITIES ==========

  const getTimeRemaining = async (userAddress: string) => {
    if (!publicClient) {
      return "1h 32m"
    }

    try {
      const timeRemainingSeconds = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getTimeRemaining",
        args: [userAddress],
        chainId: config.chains[0].id,
      }) as bigint

      // Convert seconds to hours and minutes
      const hours = Math.floor(Number(timeRemainingSeconds) / 3600)
      const minutes = Math.floor((Number(timeRemainingSeconds) % 3600) / 60)

      return `${hours}h ${minutes}m`
    } catch (error) {
      console.error(`Error getting time remaining for ${userAddress}:`, error)
      return "1h 32m"
    }
  }

  const getLeaderboard = async () => {
    if (!publicClient) {
      return [
        { address: "0xd8da...6273", stake: "125.5", timeRemaining: "1h 32m" },
        { address: "0xab12...9f3d", stake: "85.0", timeRemaining: "4h 15m" },
        { address: "0x7890...def1", stake: "42.3", timeRemaining: "2h 47m" },
        { address: "0x4567...abc8", stake: "28.7", timeRemaining: "3h 22m" },
        { address: "0x1234...789a", stake: "15.2", timeRemaining: "5h 05m" },
      ]
    }

    try {
      const result = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getStakingLeaderboard",
        args: [5], // Get top 5 stakers
        chainId: config.chains[0].id,
      }) as [string[], bigint[]]

      const addresses = result[0]
      const amounts = result[1]

      // Process the leaderboard data
      const leaderboard = await Promise.all(
        addresses.map(async (addr, index) => {
          const timeRemaining = await getTimeRemaining(addr)
          const stake = formatEther(amounts[index])

          // Format address for display
          const displayAddress = `${addr.slice(0, 6)}...${addr.slice(-4)}`

          return {
            address: displayAddress,
            stake: stake,
            timeRemaining: timeRemaining,
          }
        }),
      )

      setCachedLeaderboard(leaderboard)
      return leaderboard
    } catch (error) {
      console.error("Error getting leaderboard:", error)

      // Return cached leaderboard if available, otherwise fallback to default
      if (cachedLeaderboard.length > 0) {
        return cachedLeaderboard
      }

      return [
        { address: "0xd8da...6273", stake: "125.5", timeRemaining: "1h 32m" },
        { address: "0xab12...9f3d", stake: "85.0", timeRemaining: "4h 15m" },
        { address: "0x7890...def1", stake: "42.3", timeRemaining: "2h 47m" },
        { address: "0x4567...abc8", stake: "28.7", timeRemaining: "3h 22m" },
        { address: "0x1234...789a", stake: "15.2", timeRemaining: "5h 05m" },
      ]
    }
  }

  // ========== RETURN ALL FUNCTIONS ==========

  return {
    stakeTokens,
    withdrawTokens,
    getUserBalance,
    getHighestStaker,
    isController,
    getBotFee,
    getRobotLocation,
    getRobotBatteryLevel,
    getRobotUptime,
    sendRobotCommand,
    getTimeRemaining,
    getLeaderboard,
  }
}

export default useBlockchainUtils
