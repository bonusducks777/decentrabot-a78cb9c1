"use client"

import { useAccount } from "wagmi"
import { ethers } from "ethers"
import { useState, useEffect } from "react"

// RPC endpoint and contract configuration
const RPC_URL = "https://westend-asset-hub-rpc.polkadot.io"
const CONTRACT_ADDRESS = "0xB3f57e8fc33f61Ce464a9c287f34EF3FD422B1ae"
const ABI = [
  "function stakeTokens() payable",
  "function withdrawTokens(uint256 amount)",
  "function getStakedBalance(address user) view returns (uint256)",
  "function getHighestStaker() view returns (address)",
  "function isController(address user) view returns (bool)",
  "function getBotFee() view returns (uint256)",
  "function getRobotLocation(string robotId) view returns (int256 lat, int256 lng)",
  "function getRobotBatteryLevel(string robotId) view returns (uint256)",
  "function getRobotUptime(string robotId) view returns (uint256)",
  "function getTimeRemaining(address user) view returns (uint256)",
  "function getStakingLeaderboard(uint256 count) view returns (address[] addresses, uint256[] amounts)",
  "function forceFeeCollection()",
  "function currentController() view returns (address)",
  "function sendCommand(string robotId, string command)"
]

export const useBlockchainUtils = () => {
  const { address, isConnected } = useAccount()
  // Local state for cached leaderboard
  const [cachedLeaderboard, setCachedLeaderboard] = useState<any[]>([])

  // Instantiate read-only provider
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

  // Helper to get signer for write operations
  const getSigner = () => {
    if (typeof window !== "undefined" && (window as any).ethereum && isConnected) {
      const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum)
      return web3Provider.getSigner()
    }
    return null
  }

  // ========== STAKING OPERATIONS ==========

  const stakeTokens = async (amount: string) => {
    if (!isConnected) {
      console.error("Wallet not connected")
      return false
    }

    try {
      const signer = getSigner()
      if (!signer) throw new Error("No signer available")
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer as ethers.Signer)
      const tx = await contract.stakeTokens({ value: ethers.utils.parseEther(amount) })
      await tx.wait()
      console.log("Staking transaction:", tx.hash)
      return true
    } catch (error) {
      console.error("Error staking tokens:", error)
      return false
    }
  }

  const withdrawTokens = async (amount: string) => {
    if (!isConnected) {
      console.error("Wallet not connected")
      return false
    }

    try {
      const signer = getSigner()
      if (!signer) throw new Error("No signer available")
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer as ethers.Signer)
       
      const tx = await contract.withdrawTokens(ethers.utils.parseEther(amount))
      await tx.wait()
      console.log("Withdrawal transaction:", tx.hash)
      return true
    } catch (error) {
      console.error("Error withdrawing tokens:", error)
      return false
    }
  }

  // ========== BALANCE AND CONTROL CHECKS ==========

  const getUserBalance = async () => {
    if (!isConnected || !address) {
      return "0.0"
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
      const balanceBN = await contract.getStakedBalance(address)
      return ethers.utils.formatEther(balanceBN)
    } catch (error) {
      console.error("Error getting user balance:", error)
      return "0.0"
    }
  }

  // ========== LEADERBOARD ==========

  const getLeaderboard = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
      const [addresses, amounts] = await contract.getStakingLeaderboard(5)
      const leaderboard = await Promise.all(
        addresses.map(async (addr: string, i: number) => {
          const amount = ethers.utils.formatEther(amounts[i])
          const timeMinutes = Number(await contract.getTimeRemaining(addr))
          const hours = Math.floor(timeMinutes / 60)
          const mins = timeMinutes % 60
          return {
            address: addr,
            stake: amount,
            timeRemaining: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
          }
        })
      )
      setCachedLeaderboard(leaderboard)
      return leaderboard
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      return cachedLeaderboard
    }
  }

  // ========== TOP STAKER & BALANCE ==========

  const getHighestStaker = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
      return await contract.getHighestStaker()
    } catch (error) {
      console.error("Error getting highest staker:", error)
      return ethers.constants.AddressZero
    }
  }

  const getStakedBalance = async (userAddress: string) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
      const balanceBN = await contract.getStakedBalance(userAddress)
      return ethers.utils.formatEther(balanceBN)
    } catch (error) {
      console.error("Error getting staked balance:", error)
      return "0.0"
    }
  }

  // ========== CONTROLLER & COMMAND ==========

  // Poll the current controller
  const getCurrentController = async () => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
      return await contract.currentController()
    } catch (error) {
      console.error("Error fetching current controller:", error)
      return ethers.constants.AddressZero
    }
  }

  // Send a command to a robot
  const sendRobotCommand = async (robotId: string, command: string) => {
    if (!isConnected) {
      console.error("Wallet not connected for command")
      return false
    }
    try {
      const signer = getSigner()
      if (!signer) throw new Error("No signer for sendCommand")
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer as ethers.Signer)
      const tx = await contract.sendCommand(robotId, command)
      await tx.wait()
      console.log("Command sent:", command)
      return true
    } catch (error) {
      console.error("Error sending robot command:", error)
      return false
    }
  }

  // ========== RETURN ALL FUNCTIONS ==========

  return {
    stakeTokens,
    withdrawTokens,
    getUserBalance,
    getLeaderboard,
    getHighestStaker,
    getStakedBalance,
    getCurrentController,
    sendRobotCommand
  }

}

export default useBlockchainUtils
