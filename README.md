# Decentrabot

https://decentrabot-a78cb9c1.vercel.app (taken down post-hackathon)
https://youtu.be/7TJUo0qI28I demo

![Decentrabot Banner](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Our%20vision_pages-to-jpg-0004.jpg-P5vlBG70H5qmo7jk4UuLelSkjgbtBh.jpeg)

## Bridging the Gap Between Blockchain and Physical Reality

Decentrabot is a revolutionary platform that enables users to control real-world robots through a competitive token staking mechanism. By leveraging blockchain technology, specifically Polkadot's Westend testnet, we create a trustless, transparent system where the highest staker gains control of physical robots in real-time.

## The Problem We're Solving

![Problem We Are Solving](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Our%20vision_pages-to-jpg-0003.jpg-ycJ44o8uEEAUtu7saA4PIamiXlhzxc.jpeg)

While blockchain technology has enabled trading of digital assets like tokens, NFTs, and in-game items, there's been minimal crossover into the physical world. Decentrabot bridges this gap by allowing token holders to directly control physical robots and machinery, creating a new paradigm for human-machine interaction powered by decentralized technology.

## Key Features

![Decentrabot Features](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Our%20vision_pages-to-jpg-0005.jpg-dkikthTix65HC9R3JWhp3gBA72nwP7.jpeg)

### 01 - Live Control Robots via Staking
Use WND tokens to gain control of robots or machinery. Only the top staker gets access to the robot control panel, creating a competitive bidding system.

### 02 - Live Streams & Spectator Mode
Every bot has a live video feed where the community can spectate and chat - similar to Twitch, creating an engaging social experience even for non-controllers.

### 03 - Dynamic Stake Auction System
Real-time leaderboard where staking and withdrawal are seamless. Bots switch automatically based on smart contract logic, ensuring fair and transparent transitions.

### 04 - Decentralized & Autonomous
The platform enables machines to understand, interpret, and respond to human language, with all control logic handled by smart contracts.

## Applications

![Decentrabot Applications](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Our%20vision_pages-to-jpg-0006.jpg-mKxD2mwGpjzDgFuBrj4be56rtsqy4R.jpeg)

Decentrabot supports a wide range of robot applications:

- **Vehicles**: Monster truck arena, drone flights, warehouse simulation, forklift control
- **Experiments**: Robots that paint, spray, draw, water gardens, or engage in challenging scenarios
- **Games**: Remote mini-golf, bowling, automated paintball guns
- **Animal Interaction**: Duck feeders, fish food dispensers, animal treat launchers
- **Cameras & Explorations**: 360° livestreams, microscopes, telescopes, underwater ROVs, museum guides, city explorers

## Why Polkadot?

![Using Polkadot](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Our%20vision_pages-to-jpg-0007.jpg-Wyu03y857gvI6l7p91KfaHl5lK86gz.jpeg)

Decentrabot leverages Polkadot's blockchain technology for several critical functions:

### Trustless Access Control
Smart contracts automatically assign control based on staking — no one can cheat, and rules can't be changed arbitrarily.

### Transparent Competition
Everyone sees the current stakes on-chain. The top staker is publicly verifiable, and control is transparently enforced.

### Automated Payments & Fee Draining
Stake automatically drains over time, and the robot transitions to the next staker without human intervention.

### Open Participation
Anyone with a wallet and tokens can participate — no signups, no trust requirements, no permissions. It's open and global.

## Roadmap

![Decentrabot Roadmap](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Our%20vision_pages-to-jpg-0008.jpg-aaHN3vqhojpESzfaiMp2Ap6UrnZdez.jpeg)

Our development roadmap includes:

1. **Core staking logic deployed on testnet (Westend)** - ✅ Completed
2. **Add key features like control panel, viewer mode, dashboard** - ✅ Completed
3. **Add multiple bots with unique experiences**
4. **Set up profile pages for robots and their analytics page**
5. **Add control perks and bonuses for frequent users**
6. **Open platform for creators to onboard their own robots**
7. **Integrate voice or natural language control**

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm
- MetaMask or another Web3 wallet with Westend Asset Hub testnet configured

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/decentrabot.git
   cd decentrabot
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

### Connecting to Westend Asset Hub

To interact with the Decentrabot platform, you'll need to:

1. Configure your wallet to connect to Westend Asset Hub testnet (Chain ID: 420420421)
2. Get some WND tokens from the Westend faucet
3. Connect your wallet to the Decentrabot application
4. Stake your tokens to compete for robot control

## Smart Contract Integration

The platform interacts with the DecentraBotContract deployed on Westend Asset Hub testnet. Key functions include:

- `stakeTokens()`: Stake WND tokens to compete for control
- `withdrawTokens(amount)`: Withdraw your staked tokens
- `getStakedBalance(address)`: Check your current stake
- `getCurrentController()`: Get the address of the current controller
- `sendCommand(robotId, command)`: Send a command to a robot (only callable by controller)

## Project Structure

```
decentrabot/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── config/          # Configuration files
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   └── styles/          # CSS and styling
├── .env.example         # Example environment variables
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## Contributing

We welcome contributions to Decentrabot! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
