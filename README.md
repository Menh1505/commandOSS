# CommandOSS ⚔️

CommandOSS is a blockchain-based game built on the Sui network where players can engage in PvE (Player vs Environment) and PvP (Player vs Player) battles. The game leverages the Sui blockchain for battle state management and transactions.

![Game Preview](/public/maps/twillight-forest.png)

## Features

- **PvE Battles**: Challenge AI opponents with various skills
- **PvP Battles**: Create rooms and battle against other players
- **Hero Selection**: Choose from different heroes with unique abilities
- **Skill System**: Strategic combat with cooldown-based skills
- **Blockchain Integration**: All game states stored on Sui blockchain

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: TailwindCSS
- **Blockchain**: Sui Network
- **Smart Contracts**: Move programming language
- **Game Engine**: Phaser.js
- **Wallet Integration**: @mysten/dapp-kit, Sui wallet

## Project Structure

```
|-- public/            # Static assets (icons, avatars, etc.)
|-- scontract/         # Smart contracts written in Move
|   |-- sources/       # Contract source files
|   |-- build/         # Compiled contracts
|-- src/
|   |-- app/           # Next.js app router pages
|   |-- components/    # React components
|   |   |-- game/      # Game-specific components (Canvas, SkillPanel, etc.)
|   |-- services/      # Services for interacting with blockchain
|   |-- types/         # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Sui CLI (for smart contract deployment)
- A Sui wallet (like Sui Wallet browser extension)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/commandoss.git
   cd commandoss
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Smart Contract Deployment

To deploy the smart contracts to the Sui testnet:

1. Navigate to the scontract directory:

   ```bash
   cd scontract
   ```

2. Compile the contracts:

   ```bash
   sui move build
   ```

3. Deploy the compiled package:

   ```bash
   sui client publish --gas-budget 10000000
   ```

4. Update the package address in `src/services/sui.services.ts` with your newly deployed contract address.

## Game Mechanics

### Battle System

The battle system is turn-based with the following mechanics:

- Players and opponents have HP (Health Points), ATK (Attack), and DEF (Defense) stats
- Each turn, the player can use one of their skills
- Skills have different power multipliers and cooldown periods
- Combat calculations include damage formula considering ATK, DEF, and random critical hits

### PvP System

- Players can create PvP rooms that others can join
- PvP battles are asynchronous and transactions are verified on the blockchain
- When a player joins a room, they are assigned as Player 2
- Both players take turns executing attacks until one player's HP reaches zero

## Development

### Adding New Skills

To add new skills, modify the `SkillPanel.tsx` component:

```tsx
// Add a new skill to the defaultSkills array
{
    name: "NewSkill",
    type: "attack", // or "defense"
    powerMultiplier: 1.2,
    icon: "/icons/new-skill.png",
    cooldown: 3,
    description: "Description of the new skill",
    isOnCooldown: false,
    remainingCooldown: 0
}
```

### Modifying Smart Contracts

The game logic is implemented in Move smart contracts in the `scontract/sources/` directory:

- `scontract.move`: Contains PvE battle logic
- `pvp.move`: Contains PvP battle logic

After modifying contracts, rebuild and redeploy them to the testnet.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Smart contracts built with [Sui Move](https://docs.sui.io/)
- Game rendering powered by [Phaser.js](https://phaser.io/)
- Wallet integration via [@mysten/dapp-kit](https://github.com/MystenLabs/sui/tree/main/sdk/dapp-kit)
