<template>
  <div id="item-box-component">
    <v-card class="mx-1" max-width="400">
      <v-img
        :src="imageUri"
        :lazy-src="imageUri"
        aspect-ratio="1"
        contain
        max-height="200"
        max-width="400"
        class="grey lighten-2"
      >
        <template v-slot:placeholder>
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </template>
        <v-card-title>{{ auctionTitle }}</v-card-title>
      </v-img>
      <v-card-subtitle class="pb-0"> </v-card-subtitle>
      <v-card-text class="text--primary">
        <div>
          <no-ssr>
            <flip-countdown
              :deadline="getEndDate()"
              :showDays="false"
            ></flip-countdown>
          </no-ssr>
        </div>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr>
                <td>Total number of Bid</td>
                <td>{{ bids }}</td>
              </tr>
              <tr>
                <td>Start Price: {{ startPrice }}</td>
                <td>Last Bid Price: {{ highestBid }}</td>
              </tr>
              <tr v-if="!ended">
                <td>Auction EndTime</td>
                <td>{{ getEndDate() }}</td>
              </tr>
              <tr v-if="ended">
                <td>Winnner</td>
                <td>{{ winner }}</td>
              </tr>
              <tr v-if="!ended && checkValidAddress(highestBidder)">
                <td>Highest Bidder</td>
                <td>{{ highestBidder }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <slot name="asset-options">
          <v-row>
            <v-col><v-btn color="primary" block> Button </v-btn></v-col>
            <v-col><v-btn color="success" block> Button </v-btn></v-col>
          </v-row>
        </slot>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
const Web3 = require("web3");
import moment from "moment";
import FlipCountdown from "vue2-flip-countdown";
export default {
  name: "AuctionItemComponent",
  components: { FlipCountdown },
  props: {
    imageUri: { type: String },
    auctionTitle: { type: String },
    highestBidder: { type: String },
    highestBid: { type: String },
    startPrice: { type: String },
    auctionEndTime: { type: String },
    winner: { type: String },
    bids: { type: String },
    ended: { type: Boolean },
  },
  methods: {
    checkValidAddress(address) {
      let result = Web3.utils.isAddress(address) && address / 1 != 0;

      return result;
    },
    getEndDate() {
      var date = new Date(this.auctionEndTime * 1000);
      return moment(String(date)).format("YYYY-MM-DD hh:mm:ss");
    },
  },
};
</script>
