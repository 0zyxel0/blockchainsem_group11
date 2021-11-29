<template>
  <div id="item-box-component">
    <v-card class="mx-1" max-width="400">
      <v-img
        :src="nftUri"
        :lazy-src="nftUri"
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
        <div v-if="ended">
          <no-ssr>
            <flip-countdown
              countdownSize="25px"
              labelSize="15px"
              :deadline="getEndDate()"
              :showDays="false"
            ></flip-countdown>
          </no-ssr>
        </div>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr>
                <td>Total number of Bids {{ bids }}</td>
                <td>Buy now at {{ priceConversion(buyBidPrice) }}</td>
              </tr>
              <tr>
                <td>Starting Price: {{ priceConversion(startPrice) }}</td>
                <td>Highest Price: {{ priceConversion(highestBid) }}</td>
              </tr>
              <tr>
                <td>Auction EndTime</td>
                <td>{{ getLocalEndDate() }}</td>
              </tr>
              <tr v-if="ended">
                <td>Winnner Address</td>
                <td>
                  <span :title="winner" class="v-truncate">{{ winner }}</span>
                </td>
              </tr>
              <tr v-if="!ended && checkValidAddress(highestBidder)">
                <td>Highest Bidder Address</td>
                <td>
                  <span :title="highestBidder" class="v-truncate">{{
                    highestBidder
                  }}</span>
                </td>
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
    tokenID: { type: Object },
    buyBidPrice: { type: String },
  },
  mounted() {
    this.getImageURL(this.tokenID);
  },
  data() {
    return {
      nftUri: "",
    };
  },
  methods: {
    checkValidAddress(address) {
      let result = Web3.utils.isAddress(address) && address / 1 != 0;

      return result;
    },
    getEndDate() {
      var date = new Date(this.auctionEndTime * 1000);
      return moment(String(date)).format("YYYY-MM-DD HH:mm:ss");
    },
    getLocalEndDate() {
      var date = new Date(this.auctionEndTime * 1000);
      return moment(String(date)).format("lll");
    },
    priceConversion(price) {
      return price / Math.pow(10, 18);
    },
    async getImageURL(tokenID) {
      let token = this.$nuxt.$store.app.store.state.modules.profile.token;

      let myResult = await this.$axios.$post(
        "/api/v1/nft/meta",
        { tokenid: Web3.utils.hexToNumber(tokenID._hex) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(myResult);
      if (myResult.payload) {
        this.nftUri = myResult.payload.nftUri;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.v-truncate {
  width: 150px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
