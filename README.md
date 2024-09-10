# Rock Paper Scissors on Aptos Blockchain

This repository contains a decentralized Rock Paper Scissors game built on the Aptos blockchain using move smart contracts. The front-end is powered by React, interacting with the blockchain via the Aptos SDK. 

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Smart Contract Setup](#smart-contract-setup)
6. [Frontend Setup](#frontend-setup)
7. [Game Flow](#game-flow)
8. [Contract Functions](#contract-functions)
9. [Front-end Functions](#front-end-functions)
10. [Contributing](#contributing)
11. [License](#license)

---

## Overview

The game is a simple implementation of Rock Paper Scissors between two players. Players are connected to the Aptos blockchain, where their moves and game results are stored in the smart contract. The game supports playing against another player or the computer.

## Features

- **Keyless Wallet Integration**: No seed phrase is needed to manage accounts.
- **Real-Time Gameplay**: The game allows for two players to play or one player against a computer.
- **Blockchain Storage**: Game results and moves are recorded and stored on-chain.
- **Randomized Choices**: The computer's move is randomly generated.
- **UI with React**: A simple, intuitive UI built with React.

## Tech Stack

### Blockchain (Smart Contracts)
- **Language**: Move
- **Blockchain**: Aptos
- **Client SDK**: Aptos SDK (for interaction with Aptos blockchain)
  
### Frontend
- **Framework**: React and Vite
- **Animations**: Framer Motion
- **CSS**: TailwindCSS
- **Notifications**: react-hot-toast

---

## Prerequisites

Make sure you have the following installed:

- Node.js (v16.x.x or higher)
- bun
- Aptos CLI (for local blockchain and testing)
- A Google account for authentication

---

## Smart Contract Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ovodo/seezus.git
   cd seezus
   cd smart_contract
   cd sources
   - Take a look at the seezus.move file




## Running the dev

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ovodo/seezus.git
   cd seezus
   `bun dev`




