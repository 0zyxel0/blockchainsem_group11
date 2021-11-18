# bsapp14
## Overview
1. [Prerequisite](#section1)
2. [General information](#section2)
3. [Launch & Deployment](#section3)
4. [Live Demo](#section4)
5. [NFT Contracts](#section5)
6. [Acknowledgment](#section6)


## Prerequisite<a name="section1"></a>
  - **[truffle](https://trufflesuite.com/truffle)**
      (For Migrating the Contract) 
  
  - **[ganache](https://trufflesuite.com/ganache)**
       (Run the test  Ethereum blockchain)
  
  - **[nodejs](https://nodejs.org/en/)**
## General information<a name="section2"></a>
This repository is NFT minter and Auction house to sell and buy [UZHETH](https://gitlab.uzh.ch/luca.ambrosini/go-ethereum/-/wikis/home) ethereum NFT. 

## Launch & Deployment<a name="section3"></a>
### Install dependencies
```bash

$ npm install
```
This command has to be run before starting the application for the first time. It will install further dependencies besides Node.js.

### Run Truffle Migrate
```bash
$ truffle migrate
```
This commmand complies the contract. ganache should be running in backgroup.

### Additional Steps in Ganache or Remix
 Copy the  Contract Address of the Deployed Contracts in the .ENV file for each contract.


### Run the Server for Development
```bash
$ npm run dev
```


### For Production Build
```bash
$ npm run build
$ npm run start
```


This project use nuxtjs, for more details please check out [here](https://nuxtjs.org)

## Live Demo<a name="section4"></a>
Click [here](https://blockchain-proj-bweyis5hma-uc.a.run.app/) for Live demo

## NFT Contracts <a name="section5"></a>
In this project we have  two contracts:
- **[NFT](https://github.com/0zyxel0/blockchainsem_group11/blob/master/contracts/NFT.sol)**:
 Used to mint Token in this contract

- **[NFTAuction](https://github.com/0zyxel0/blockchainsem_group11/blob/master/contracts/NFTAuction.sol)**: 
  For adding the NFT to action, tranfer the NFT and Bidding on NFT.
  
## Acknowledgment <a name="section6"></a>
We thank the Seminar Blockchain Programming Team HS21 for all the support and advice during this course.
