import { ethers } from "ethers";
const utils = require("ethers").utils;
const hexConverter = require("hex2dec");
const Web3 = require("web3");
const _ = require("lodash");
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
      let myResult = await this.$axios.$post("/api/v1/auth/nonce", {
        walletAddr: walletAddr,
      });
      if (myResult) {
        const signature = await signer.signMessage(myResult.payload.nonce);
        const payload = {
          walletAddr: walletAddr,
          userNonce: myResult.payload.nonce,
          userSignature: signature,
        };
        let myVerification = await this.$axios.$post(
          "/api/v1/auth/verification",
          payload
        );
        if (myVerification) {
          commit("SET_USER_DATA", jwt_decode(myVerification.payload.token));
          commit("SET_USER_TOKEN", myVerification.payload.token);
          commit("SET_USER_WALLETADDRESS", walletAddr);
          this.$router.push("/marketplace");
        }
      }
    }
  },
  async GET_NFT_DETAILS({ commit, state }, nftid) {
    try {
      let myResult = await this.$axios.$post(
        "/api/v1/item/detail",
        { nftid: nftid },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      if (myResult) {
        console.log(myResult);
        commit("SET_NFT_DETAILS", myResult.payload);
      }
    } catch (err) {
      console.error(err);
    }
  },

  async GET_NFT_METADATA({ commit, state }, tokenid) {
    try {
      let myResult = await this.$axios.$post(
        "/api/v1/nft/meta",
        { tokenid: tokenid },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      if (myResult) {
        console.log(myResult);
        commit("SET_NFT_CUR_META", myResult.payload);
      }
    } catch (err) {
      console.log(err);
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
    this.$router.push("/");
  },
  UPDATE_DISPLAY_NAME({ commit }, { displayName }) {
    commit("SET_USER_DISPLAY_NAME", displayName);
  },
  async MINT_USER_ASSET(
    { state },
    { nftid, userFileURI, nftTitle, nftDescription }
  ) {
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
        let platformItem = new ethers.Contract(
          this.$config.NFT_AUCTION_CONTRACT,
          NFTAUCTION_CONTRACT_ABI.abi,
          provider.getSigner()
        );
        console.log(myResult.to);
        let platformResult = await platformItem.createItem(
          myResult.to,
          lastTokenId,
          nftTitle,
          nftDescription,
          userFileURI
        );
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

  async UPDATE_USER_DISPLAY_NAME({ commit, state }) {
    try {
    } catch (err) {
      console.log(err);
    }
  },

  async GET_USER_OWNED_NFT({ commit, state }) {
    try {
      let contract = new ethers.Contract(
        this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider.getSigner()
      );
      let tempList = [];
      let myResult = await contract.getAllNFTOwned();
      console.log("GET_USER_OWNED_NFT");

      if (myResult) {
        _.filter(myResult, function (filIterator) {
          let payload = {
            title: filIterator.title,
            description: filIterator.description,
            tokenid: hexConverter.hexToDec(filIterator.tokenId._hex),
            tokenUri: filIterator.tokenUri,
          };
          tempList.push(payload);
        });
        commit("SET_USER_OWNED_NFT", tempList);
      }
    } catch (err) {
      console.log(err);
    }
  },

  async CREATE_USER_AUCTION_NFT(
    { state, commit },
    { nftId, startPrice, buyNowPrice, bidDuration }
  ) {
    try {
      let contractViewer = new ethers.Contract(
        this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider.getSigner()
      );

      let contractPayer = new ethers.Contract(
        this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider.getSigner()
      );

      let viewResult = await contractViewer.getAuctionPrice();
      if (viewResult) {
        console.log(
          `Current Auction Price : ${parseFloat(
            utils.formatEther(viewResult._hex)
          )}`
        );
        let contractOptions = {
          value: ethers.utils.parseEther(utils.formatEther(viewResult._hex)),
        };
        let weiPrice = utils.parseEther(startPrice);
        let weiBuyNowPrice = utils.parseEther(buyNowPrice);
        let payContract = await contractPayer.createAuction(
          nftId,
          weiPrice,
          weiBuyNowPrice,
          bidDuration,
          contractOptions
        );
        if (payContract) {
          this.$toast.success("Successfully Auctioned NFT");
          this.$router.push("/profile");
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  async GET_USER_AUCTIONED_NFT({ commit, state }) {
    try {
      let contract = new ethers.Contract(
        this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider.getSigner()
      );
      let tempList = [];
      let myResult = await contract.getAllAuctionsOwned();
      if (myResult) {
        console.log("Res");
        console.log(myResult);
        _.filter(myResult, function (filIterator) {
          if (filIterator.ended == false) {
            let payload = {
              title: filIterator.nft.title,
              description: filIterator.nft.description,
              tokenid: hexConverter.hexToDec(filIterator.nft.tokenId._hex),
              tokenUri: filIterator.nft.tokenUri,
              auctionid: hexConverter.hexToDec(filIterator.auctionId._hex),
              auctionEndTime: hexConverter.hexToDec(filIterator.auctionEndTime._hex),
              bidCount: hexConverter.hexToDec(filIterator.bids._hex),
              startPrice: hexConverter.hexToDec(filIterator.startPrice._hex),
              highestBid: hexConverter.hexToDec(filIterator.highestBid._hex),
            };
            tempList.push(payload);
          }
        });
        commit("SET_USER_AUCTIONED_LIST", tempList);
        return tempList;
      }
    } catch (err) {
      console.log(err);
    }
  },
  async GET_USER_AUCTIONED_DETAILS({ commit, state }) {
    try {
      let contract = new ethers.Contract(
        this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider.getSigner()
      );
      let myResult = await contract.getAllAuctionsOwned();
      if (myResult) {
        let payload = {
          title: myResult[0].nft.title,
          description: myResult[0].nft.description,
          tokenid: hexConverter.hexToDec(myResult[0].nft.tokenId._hex),
          auctionid: hexConverter.hexToDec(myResult[0].auctionId._hex),
          auctionEndTime: hexConverter.hexToDec(myResult[0].auctionEndTime._hex),
          bidCount: hexConverter.hexToDec(myResult[0].bids._hex),
          startPrice: hexConverter.hexToDec(myResult[0].startPrice._hex),
          highestBid: hexConverter.hexToDec(myResult[0].highestBid._hex),
        };
        commit("SET_CUR_NFT_AUCTIONED", payload);
        return payload;
      }
    } catch (err) {
      console.log(err);
    }
  },
  async GET_USER_WON_AUCTION({ commit, state }, { userWalletAddr }) {
    try {
      let contract = new ethers.Contract(
        this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider.getSigner()
      );
      let tempList = [];
      let myResult = await contract.getAllAuctionHighestBidder();
      if (myResult) {
        console.log(myResult);
        _.filter(myResult, function (filIterator) {
          if (filIterator.ended == false) {
            let payload = {
              auctionid: hexConverter.hexToDec(filIterator.auctionId._hex),
              title: filIterator.nft.title,
              description: filIterator.nft.description,
              highestBidder: filIterator.highestBidder,
              tokenid: hexConverter.hexToDec(filIterator.nft.tokenId._hex),
              tokenUri: filIterator.nft.tokenUri
            };
            tempList.push(payload);
          }
        });
        commit("SET_USER_WON_AUCTION", tempList);
      }
    } catch (err) {
      console.log(err);
    }
  },
  async CLAIM_WINNING_AUCTIONED_NFT({ commit, state }, { auctionid }) {
    try {

      console.log(auctionid);
      let contract = new ethers.Contract(
        this.$config.NFT_AUCTION_CONTRACT,
        NFTAUCTION_CONTRACT_ABI.abi,
        provider.getSigner()
      );
      let myResult = await contract.transferNFTandFunds(auctionid);
      if (myResult) {
        console.log(myResult);
      //   let tempList = [];
      //   _.filter(myResult, function (filIterator) {
      //     if (filIterator.auctionid !== auctionid) {
      //       tempList.push(filIterator);
      //     }
      //   })
      //   commit("SET_USER_WON_AUCTION", tempList);
      }
    } catch (err) {
      console.log(err);
    }
  },
  async UPDATE_USER_THEME({ commit, state }, { themeOption }) {
    try {
      let myResult = await this.$axios.$post("/api/v1/user/theme", { isDark: themeOption }, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      if (myResult) {
        commit("SET_USER_THEME", myResult.payload.isDark);
      }
    } catch (err) {
      console.log(err);
    }
  }
};
