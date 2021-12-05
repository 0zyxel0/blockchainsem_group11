<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-row>
          <v-col align="center" justify="center">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              Bid Now
            </v-btn>
          </v-col>
          <v-col> </v-col>
        </v-row>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Please Enter Bidding Price in ETHs</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  label="Price ETHs*"
                  v-model="bidPrice"
                  hint="Please enter bidding amount"
                  outlined
                  clearable
                  required
                  :error-messages="inputErrormessage"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn  color="blue darken-1"   v-if="isLoading">
            <v-progress-circular indeterminate color="red"></v-progress-circular
          ></v-btn>

          <v-btn
            v-else
            text
            color="blue darken-1"
          @click="bidOnItem(auctionId, bidPrice, highestBid)"
            >BID</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { ethers } from "ethers";
const utils = require("ethers").utils;
const Web3 = require("web3");
const NFTAUCTION_CONTRACT_ABI = require("./../build/contracts/NFTAuction.json");
const provider = new ethers.providers.Web3Provider(window.ethereum);

export default {
  props: {
    auctionId: { type: String },
    highestBid: { type: String },
    startPrice: { type: String },
    callbackgetAuction: {
      type: Function,
    },
  },
  data: () => ({
    dialog: false,
    bidPrice: 0,
    inputErrormessage: "",
     isLoading: false,
  }),
  methods: {
    async bidOnItem(auctionId, bidPrice, highestBid) {
      try {
        //To check if the number is valid
        this.inputErrormessage = "";
        this.isLoading=true;
        if (isNaN(bidPrice)) {
          this.inputErrormessage = bidPrice + " is Invalid Price";
            this.isLoading=false;
          return;
        }
        let checkValue =
          this.highestBid / Math.pow(10, 18) != 0
            ? this.highestBid / Math.pow(10, 18)
            : this.startPrice / Math.pow(10, 18);
        console.log(`checkValue Price : ` + checkValue);
        //Check if the bidding amount is gretaer than last bid
        if (parseFloat(bidPrice) < checkValue) {
          console.log(`highestBid Price : ${parseFloat(checkValue)}`);
          this.inputErrormessage =
            "Bidding price should be greater than highest Bid " + checkValue;
              this.isLoading=false;
          return;
        }
        let contract = new ethers.Contract(
          this.$config.NFT_AUCTION_CONTRACT,
          NFTAUCTION_CONTRACT_ABI.abi,
          provider.getSigner()
        );
        console.log(
          `Current Bid Price : ${ethers.utils.parseUnits(bidPrice, "ether")}`
        );
        let myResult = await contract.BidOnAuctionItem(auctionId, {
          value: ethers.utils.parseUnits(bidPrice, "ether"),
        });
        if (myResult) {
          await myResult.wait();
          console.log(myResult);
          this.$toast.success("Successfully Bidded");
          this.callbackgetAuction();
          this.dialog = false;
          this.isLoading=false;
        }
      } catch (err) {
        console.log(err);
        this.inputErrormessage = err.data!=undefined?err.data.message:'';
        this.isLoading=false;
      }
    },
  },
};
</script>
