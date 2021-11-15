import { ethers } from 'ethers';
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
    // let currentBlock = await provider.getBalance("ethers.eth")
    // console.log("Current Block: ", currentBlock);

  },
  async GET_USER_UNMINTED({ commit, state }) {
    try {
      let myResult = await this.$axios.$get(`/api/v1/user/unminted`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      commit("SET_USER_NFT_UNMINTED", myResult.payload);
    } catch (err) {
      console.log(err);
    }
  },
  async GET_USER_MINTED({ commit, state }) {
    try {
      let myResult = await this.$axios.$get(`/api/v1/user/minted`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      commit("SET_USER_NFT_MINTED", myResult.payload);
    } catch (err) {
      console.log(err);
    }
  },
  SIGNOUT_USER_WALLETADDRESS({ commit }) {
    window.userWalletAddress = null;
    console.log("Signing out...");
    commit("CLEAR_USER_WALLETADDRESS");
    this.$router.push('/');
  },
  UPDATE_DISPLAY_NAME({ commit }, { displayName }) {
    commit("SET_USER_DISPLAY_NAME", displayName);
  },
  async MINT_USER_ASSET({ state }, { nftid, userFileURI }) {
    try {
      console.log(nftid, userFileURI);
      let contract = new ethers.Contract(
        this.$config.NFT_MINTING_CONTRACT,
        NFT_CONTRACT_ABI.abi,
        provider.getSigner()
      );
      let mintContract = await contract.mintToken(userFileURI);
      mintContract.then(response => {
        console.log(response);
        this.$axios.$put(
          "/api/v1/item/mint",
          { nftid: nftid },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  },
};
