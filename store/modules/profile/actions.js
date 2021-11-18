import { ethers } from 'ethers';
const Web3 = require('web3');
import jwt_decode from "jwt-decode";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const NFT_CONTRACT_ABI = require("./../../../build/contracts/NFT.json");
const NFTAUCTION_CONTRACT_ABI = require("./../../../build/contracts/NFTAuction.json");
export default {
  async LOGIN_USER_WALLET({ commit }) {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddr = await signer.getAddress();
    if (!walletAddr) {
      console.log("No Accounts Found");
      return;
    } else {

      let myResult = await this.$axios.$post("/api/v1/auth/nonce", { walletAddr: walletAddr });
      if (myResult) {
        const signature = await signer.signMessage(myResult.payload.nonce);
        const payload = {
          walletAddr: walletAddr,
          userNonce: myResult.payload.nonce,
          userSignature: signature
        };
        let myVerification = await this.$axios.$post("/api/v1/auth/verification", payload);
        if (myVerification) {
          commit("SET_USER_DATA", jwt_decode(myVerification.payload.token));
          commit("SET_USER_TOKEN", myVerification.payload.token);
          commit("SET_USER_WALLETADDRESS", walletAddr);
          this.$router.push('/marketplace');
        }


      }
    }
  },
  async GET_NFT_DETAILS({ commit, state }, nftid) {
    try {
      let myResult = await this.$axios.$post("/api/v1/item/detail", { nftid: nftid }, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (myResult) {
        console.log(myResult);
        commit("SET_NFT_DETAILS", myResult.payload);
      }
    } catch (err) {
      console.error(err);
    }

  },
  async GET_USER_CREDITS({ commit }) {
    let currentBlock = await provider.getBlockNumber();
    console.log(currentBlock);
  },
  // This Function will be retrieving data to list all recent unminted NFTs of the user limited to 5
  async GET_RECENT_UNMINTED_NFT({ commit, state }) {
    try {
      let myResult = await this.$axios.$get(`/api/v1/user/unminted/recent`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      commit("SET_USER_RECENT_UNMINTED_NFT", myResult.payload);
    } catch (err) {
      console.log(err);
    }
  },
  // This Function will be retrieving data to list all unminted NFTs of the user
  async GET_ALL_UNMINTED_NFT({ commit, state }) {
    try {
      let myResult = await this.$axios.$get(`/api/v1/user/unminted`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      commit("SET_USER_UNMINTED_NFT", myResult.payload);
    } catch (err) {
      console.log(err);
    }
  },
  SIGNOUT_USER_WALLETADDRESS({ commit }) {
    window.userWalletAddress = null;
    commit("CLEAR_USER_WALLETADDRESS");
    this.$router.push('/');
  },
  UPDATE_DISPLAY_NAME({ commit }, { displayName }) {
    commit("SET_USER_DISPLAY_NAME", displayName);
  },
  async MINT_USER_ASSET({ state }, { nftid, userFileURI , nftTitle, nftDescription}) {
    try {
      let contract = new ethers.Contract(
        this.$config.NFT_MINTING_CONTRACT,
        NFT_CONTRACT_ABI.abi,
        provider.getSigner()
      );
      let myResult = await contract.mintToken(userFileURI);
      if (myResult) {
        console.log("Minted Results");
        console.log(myResult);
        await provider.waitForTransaction(myResult.hash);
        const receipt = await provider.getTransactionReceipt(myResult.hash);
        let lastTokenId = Web3.utils.hexToNumber(receipt.logs[0].topics[3]);
        let platformItem = new ethers.Contract(this.$config.NFT_AUCTION_CONTRACT, NFTAUCTION_CONTRACT_ABI.abi, provider.getSigner());
        let platformResult = await platformItem.createItem(myResult.to, lastTokenId, nftTitle, nftDescription);
        if (platformResult) {
          // Update Backend Unminted Record
          console.log("Creating Platform Asset");
          console.log(platformResult);
          let backendResult = await this.$axios.$put(
            "/api/v1/item/mint",
            { nftid: nftid, tokenid: lastTokenId },
            {
              headers: {
                Authorization: `Bearer ${state.token}`,
              },
            }
          );
          if (backendResult) {
            return "Success";
          }
          this.$router.push("/profile");
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  CLEAR_CURRENT_NFT_META({ commit }) {
    commit("CLEAR_NFT_DETAILS");
  },
   // This Function will be retrieving data to list all recent minted NFTs of the user limited to 5
  async GET_RECENT_MINTED_NFT({ commit, state }) {
    try {
      let myResult = await this.$axios.$get("/api/v1/user/minted/recent", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      if (myResult) {
        commit("SET_USER_RECENT_MINTED_NFT", myResult.payload);
      }
    } catch (err) {
      console.log(err);
    }
  },

   // This Function will be retrieving data to list all minted NFTs of the user
  async GET_ALL_MINTED_NFT({ commit, state }) {
    try {
      let myResult = await this.$axios.$get("/api/v1/user/minted", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      if (myResult) {
        commit("SET_USER_MINTED_NFT", myResult.payload);
      }
    } catch (err) {
      console.log(err);
    }
  },

  async TEST_CHAIN({ commit, state }) {
    try{
      let contract = new ethers.Contract(
        this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider
      );
      let myResult = await contract.getNFTItems();
      if(myResult){
        console.log("ALL NFTS");
        console.log(myResult);
      }

    }catch(err){
      console.log(err);
    }
  }
};
