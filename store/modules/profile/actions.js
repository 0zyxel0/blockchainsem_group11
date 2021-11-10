import { ethers } from 'ethers';
import jwt_decode from "jwt-decode";
const provider = new ethers.providers.Web3Provider(window.ethereum);
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
  async GET_USER_CREDITS({ commit }) {
    let currentBlock = await provider.getBlockNumber();
    console.log(currentBlock);
    // let currentBlock = await provider.getBalance("ethers.eth")
    // console.log("Current Block: ", currentBlock);

  },
  SIGNOUT_USER_WALLETADDRESS({ commit }) {
    window.userWalletAddress = null;
    console.log("Signing out...");
    commit("CLEAR_USER_WALLETADDRESS");
    this.$router.push('/');
  },
};
