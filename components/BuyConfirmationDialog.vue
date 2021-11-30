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
          {{  priceConversion(buyBidPrice) }} ETHs</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            Cancel
          </v-btn>
           <v-btn  color="green darken-1" text   v-if="isLoading">
            <v-progress-circular indeterminate color="red"></v-progress-circular
          ></v-btn >
          <v-btn  v-else color="green darken-1" text   @click="buyNow(auctionId, buyBidPrice)">
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
     callbackgetAuction: {
      type: Function,
    },
  },
  data() {
    return {
      dialog: false,
      loading:false,
    };
  },
  methods: {
    async buyNow(auctionId, buyBidPrice) {
      try {
       this.isLoading=true;
        let contract = new ethers.Contract(
          this.$config.NFT_AUCTION_CONTRACT,
          NFTAUCTION_CONTRACT_ABI.abi,
          provider.getSigner()
        );
       
       //TO change the Function as per contract
        let myResult = await contract.BuyNFTNow(auctionId, {
          value: ethers.utils.parseEther(utils.formatEther(buyBidPrice)),
        });
        if (myResult) {
          console.log(myResult);
          this.$toast.success("successful buy NFT");
          this.dialog = false;
          this.callbackgetAuction();
          this.isLoading=false;
        }
        
      } catch (err) {
        console.log(err);
        this.$toast.error(err.data.message);
        this.isLoading=false;
      }
    },
    priceConversion(price) {
      return price/Math.pow(10,18)
    },
  },
};
</script>
