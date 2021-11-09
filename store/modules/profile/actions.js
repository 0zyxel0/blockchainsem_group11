import { ethers } from 'ethers';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const { uuid } = require('uuidv4');
export default {
  async LOGIN_USER_WALLET({ commit }) {

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddr = await signer.getAddress();
    if (!walletAddr) {
      console.log("No Accounts Found");
      return;
    } else {
      console.log("My Wallet: ", walletAddr);

      let myResult = await this.$axios.$post("/api/v1/auth/nonce", { walletAddr: walletAddr });
      if (myResult) {
        console.log(myResult);
        const signature = await signer.signMessage(`Sign Your One Time Token : ${myResult.payload.nonce}`);
        console.log(`signature: `, signature);
        commit("SET_USER_WALLETADDRESS", walletAddr);
        this.$router.push('/marketplace');
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
  }
};
