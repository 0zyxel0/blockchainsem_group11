<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="info" dark v-bind="attrs" v-on="on"> Buy Now </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5"> Buy Now</v-card-title>
        <v-card-text>
          Are you sure do you want to buy NFT for
          {{ buyBidPrice }} ETHs</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text   @click="buyNow(auctionId, buyBidPrice)">
            Buy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { ethers } from "ethers";
const utils = require("ethers").utils;
const NFTAUCTION_CONTRACT_ABI = require("./../build/contracts/NFTAuction.json");
const provider = new ethers.providers.Web3Provider(window.ethereum);

export default {
  props: {
    auctionId: { type: String },
    buyBidPrice: { type: String },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    async buyNow(auctionId, buyBidPrice) {
      try {
       
        let contract = new ethers.Contract(
          this.$config.NFT_AUCTION_CONTRACT,
          NFTAUCTION_CONTRACT_ABI.abi,
          provider.getSigner()
        );
       
       //TO change the Function as per contract
        let myResult = await contract.buyAuctionItem(auctionId, {
          value: ethers.utils.parseEther(utils.formatEther(buyBidPrice)),
        });
        if (myResult) {
          console.log(myResult);
          this.$toast.success("successful buy NFT");
          this.dialog = false;
        }
        
      } catch (err) {
        console.log(err);
        this.$toast.error(err.data.message);
      }
    },
  },
};
</script>
