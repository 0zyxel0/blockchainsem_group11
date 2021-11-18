import { ethers } from 'ethers';
export default {
  async GET_AUCTION_HOUSE_BIDDING_NFT({ commit, state }) {
    try {
      let contract = new ethers.Contract(
        this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider
      );
      let myResult = await contract.getAllAuctions();
      if (myResult) {
        commit("SET_AUCTION_HOUSE_BIDDING_NFT", myResult.payload);
      }
    } catch (err) {
      console.log(err);
    }
  }
  };
  