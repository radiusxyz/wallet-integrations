# Purpose
The goal is to implement transaction signing in a way that leverages StarkNet wallet extensions (ArgentX, Braavos) to prompt user confirmation through a pop-up. 

# Result
Adhering to the EIP-712 standard is required for this interaction, ensuring the data is structured and typed in a way that wallets can process and display to users meaningfully.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before running, ensure you have the following installed:
- Node.js (v14.x or later recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository to your local machine:
```bash
git clone https://github.com/radiusxyz/wallet-integrations.git
```

2. Navigate to the project directory:
```bash
cd wallet-integrations
```

3. Install the required npm packages:
```bash
npm install
```

4. Run
```bash
npm run dev
```
