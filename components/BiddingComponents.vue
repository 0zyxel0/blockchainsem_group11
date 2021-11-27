<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-row>
          <v-col>
            <v-btn color="primary" dark v-bind="attrs" v-on="on" >
              Bid Now
            </v-btn>
          </v-col>
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
          <v-btn
            color="blue darken-1"
            text
            @click="bidOnItem(auctionId, bidPrice, highestBid)"
          >
            BID
          </v-btn>
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
  },
  data: () => ({
    dialog: false,
    bidPrice: 0,
    inputErrormessage: "",
  }),
  methods: {
    async bidOnItem(auctionId, bidPrice, highestBid) {
      try {
        //To check if the number is valid
        this.inputErrormessage = "";
        if (isNaN(bidPrice)) {
          this.inputErrormessage = bidPrice + " is Invalid Price";
          return;
        }

        //Check if the bidding amount is gretaer than last bid
        if (parseFloat(bidPrice) <= parseFloat(highestBid)) {
          console.log(`highestBid Price : ${parseFloat(highestBid)}`);
          this.inputErrormessage =
            "Bidding price should be greater than highest Bid " +
            parseFloat(highestBid);
          return;
        }
        let contract = new ethers.Contract(
          this.$config.NFT_AUCTION_CONTRACT,
          NFTAUCTION_CONTRACT_ABI.abi,
          provider.getSigner()
        );
        console.log(
          `Current Bid Price : ${parseFloat(utils.formatEther(bidPrice))}`
        );
        let myResult = await contract.BidOnAuctionItem(auctionId, {
          value: ethers.utils.parseEther(utils.formatEther(bidPrice)),
        });
        if (myResult) {
          console.log(myResult);
          this.$toast.success("Successfully Bidded");
          this.dialog = false;
        }
      } catch (err) {
        console.log(err);
        this.inputErrormessage = err.data.message;
        this.$toast.error(err.data.message);
      }
    },
  },
};
</script>
