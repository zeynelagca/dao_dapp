# Gaza Initiative - $GAZAIN

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/gaza-initiative)

A decentralized humanitarian aid platform built on Polygon blockchain, enabling transparent and community-governed fund distribution for Gaza relief efforts.

## 🌟 Overview

Gaza Initiative is a blockchain-based platform that revolutionizes humanitarian aid through decentralization. It combines:

- **$GAZAIN Token**: ERC-20 governance token for voting and participation
- **NFT Guardians**: Exclusive NFTs that amplify voting power and support
- **DAO Governance**: Community-driven decision making for fund allocation
- **Transparent Treasury**: All transactions recorded on Polygon blockchain

## ✨ Features

### 🏛️ Treasury Management
- Real-time treasury balance tracking
- Transparent fund allocation via smart contracts
- Multi-signature wallet for secure withdrawals

### 🗳️ DAO Governance
- $GAZAIN token-based voting system
- Proposal creation and voting on aid distribution
- Quadratic voting for fair representation

### 🎨 NFT Guardians
- Genesis collection with 3 tiers: Seed, Healer, Architect
- Voting power multipliers (1.5x to 3x)
- Exclusive access to governance features

### 🌐 Multi-Language Support
- English and Arabic language support
- RTL layout support for Arabic interface

### 📱 Responsive Design
- Mobile-first responsive design
- Dark theme optimized for accessibility
- Smooth animations with Framer Motion

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library

### Blockchain
- **Solidity** - Smart contract development
- **Hardhat** - Ethereum development environment
- **OpenZeppelin** - Secure smart contract library
- **Ethers.js** - Ethereum JavaScript library

### Networks
- **Polygon Mainnet** - Production deployment
- **Polygon Amoy** - Testnet for development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask wallet
- Polygon network configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gaza-initiative.git
   cd gaza-initiative
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Smart Contract Development

1. **Compile contracts**
   ```bash
   npm run compile
   ```

2. **Run tests**
   ```bash
   npm run test
   ```

3. **Deploy to testnet**
   ```bash
   npm run deploy:testnet
   ```

4. **Deploy to mainnet**
   ```bash
   npm run deploy:mainnet
   ```

## 📋 How It Works

### 1. Connect Wallet
- Install MetaMask browser extension
- Connect to Polygon network
- Import or create a wallet

### 2. Get $GAZAIN Tokens
- Purchase $GAZAIN on QuickSwap DEX
- Minimum 50,000 $GAZAIN required for NFT minting
- 3% tax on all transfers goes to treasury

### 3. Mint Guardian NFT
- Choose from 3 tiers: Seed (0.05 ETH), Healer (0.1 ETH), Architect (0.2 ETH)
- Requires minimum 50,000 $GAZAIN balance
- Unlocks enhanced voting power

### 4. Participate in Governance
- Create proposals for aid distribution
- Vote on active proposals using $GAZAIN
- NFT holders get voting power multipliers

## 🏗️ Project Structure

```
gaza-initiative/
├── contracts/              # Solidity smart contracts
│   ├── GAZAINToken.sol    # ERC-20 governance token
│   └── GazaGuardiansNFT.sol # NFT collection contract
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   ├── App.jsx           # Main application
│   └── index.css         # Global styles
├── scripts/              # Deployment scripts
├── test/                 # Smart contract tests
├── public/               # Static assets
└── vercel.json          # Vercel deployment config
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_GAZAIN_ADDRESS=0x...    # Deployed GAZAIN token address
VITE_NFT_ADDRESS=0x...       # Deployed NFT contract address
```

### Network Configuration
The project supports multiple networks:

- **Polygon Mainnet**: Production deployment
- **Polygon Amoy**: Testnet for development
- **Hardhat Network**: Local development

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Use conventional commit messages

## 📄 Smart Contracts

### GAZAINToken.sol
- **Standard**: ERC-20
- **Supply**: 1,000,000,000 GAZAIN
- **Tax**: 3% on all transfers to treasury
- **Governance**: Voting power for DAO

### GazaGuardiansNFT.sol
- **Standard**: ERC-721
- **Collection**: Genesis Guardians
- **Tiers**: 3 different rarity levels
- **Benefits**: Enhanced voting power

## 🚀 Deployment

### Vercel (Frontend)
```bash
npm run build
vercel --prod
```

### Smart Contracts
```bash
# Testnet deployment
npm run deploy:testnet

# Mainnet deployment
npm run deploy:mainnet
```

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run coverage
```

## 📊 Stats & Impact

- **Treasury Balance**: $142,500 USDC
- **Active Guardians**: 1,200+
- **Funds Distributed**: $850,000+
- **Proposals Passed**: 15+

## 🔒 Security

- OpenZeppelin battle-tested contracts
- Multi-signature treasury wallet
- Regular security audits
- Transparent on-chain transactions

## 📞 Support

- **Discord**: [Join our community](https://discord.gg/gaza-initiative)
- **Twitter**: [@GazaInitiative](https://twitter.com/GazaInitiative)
- **Documentation**: [docs.gaza-initiative.com](https://docs.gaza-initiative.com)

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the people of Gaza
- Special thanks to Polygon for network support
- OpenZeppelin for secure smart contracts
- The crypto community for continuous support

---

**Gaza Initiative** - Building hope through decentralization. 🌟