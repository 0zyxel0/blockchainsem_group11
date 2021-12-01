import { ethers } from 'ethers';
const utils = require('ethers').utils;
const hexConverter = require("hex2dec");
const Web3 = require('web3');
const _ = require('lodash');
const provider = new ethers.providers.Web3Provider(window.ethereum);
const NFT_CONTRACT_ABI = require("./../../../build/contracts/NFT.json");
const NFTAUCTION_CONTRACT_ABI = require("./../../../build/contracts/NFTAuction.json");
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
  },
  async GET_MARKETPLACE_ITEMS({ state, commit }) {
    try {
      let contract = new ethers.Contract(this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider);
      let tempList = [];
      let myResult = await contract.getAllNFTItems();
      if (myResult) {
        _.filter(myResult, function (filIterator) {
          let payload = {
            title: filIterator.title,
            description: filIterator.description,
            tokenid: hexConverter.hexToDec(filIterator.tokenId._hex),
            tokenUri: filIterator.tokenUri
          };

          tempList.push(payload);
        });

        commit("SET_AVAILABLE_NFT_LISTS", tempList);
      }
    } catch (err) {
      console.log(err);
    }
  },
  CLEAR_CURRENT_NFT_META({ commit }) {
    commit("CLEAR_NFT_DETAILS");
  },
  async LIKE_NFT_ASSET({ state, commit }, { tokenid, userToken }) {
    try {

      let myResult = await this.$axios.$post("/api/v1/item/like", { tokenid: tokenid }, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (myResult) {
        commit("SET_NFT_CUR_META", myResult.payload);
      }
    } catch (err) {
      console.log(err);
    }
  },
  async GET_NFT_METADATA({ commit }, { tokenid, userToken }) {
    try {
      let myResult = await this.$axios.$post("/api/v1/nft/meta", { tokenid: tokenid }, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (myResult) {
        console.log(myResult);
        commit("SET_NFT_CUR_META", myResult.payload);
      }
    } catch (err) {
      console.log(err);
    }
  },

  async ADD_NFT_COMMENTS({ commit, state }, { tokenid, userToken, comments }) {
    try {
      let payload = { tokenid: tokenid, comment: comments };
      let myResult = await this.$axios.$post("/api/v1/item/comment", payload, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (myResult) {
        console.log(myResult);
        commit("SET_NFT_CUR_META", myResult.payload);
      }
    } catch (err) {
      console.log(err);
    }
  }
};
