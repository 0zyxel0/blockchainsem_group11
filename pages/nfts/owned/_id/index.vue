<template>
  <div id="nftMeta">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col><h1>NFT Details</h1></v-col>
    </v-row>
    <v-row v-if="dataReady">
      <v-col cols="4">
        <v-card>
          <v-card-text>
            <v-img
              max-height="400"
              max-width="800"
              contain
              :src="curNFTMeta.nftUri"
            />
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title
                  >Title : {{ curNFTMeta.title }}</v-list-item-title
                >
                <v-list-item-subtitle>
                  Description : {{ curNFTMeta.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-card-title>NFT Auction Details</v-card-title>

          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-subheader>Auction Start Price</v-subheader>
              </v-col>
              <v-col cols="8">
                <v-text-field label="Price" v-model="offerPrice"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-subheader>Auction Buy Now Price</v-subheader>
              </v-col>
              <v-col cols="8">
                <v-text-field label="Price" v-model="buyPrice"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-subheader>Auction End Time</v-subheader>
              </v-col>
              <v-col cols="8">
                <v-select
                  :items="items"
                  item-text="timeslot"
                  item-value="timeVal"
                  v-model="startOfferTime"
                  label="Set Auction Length"
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block v-if="isLoading">
              <v-progress-circular
                indeterminate
                color="red"
              ></v-progress-circular
            ></v-btn>
            <v-btn
              v-else
              color="red"
              block
              dark
              @click="
                auctionNFT(
                  curNFTMeta.tokenid,
                  offerPrice,
                  buyPrice,
                  startOfferTime
                )
              "
              >Auction Item</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
      </v-col>
      <v-col>
        <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-dialog v-model="auctioningDialogLoading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          <h3>Processing NFT Auction Item</h3>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { mapState } from "vuex";
import NavigationBar from "@/components/NavigationBar";
const provider = new ethers.providers.Web3Provider(window.ethereum);
export default {
  layout: "default",
  middleware: "checkWalletAddress",
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      curNFTMeta: (state) => state.modules.profile.curNFTMeta,
    }),
  },
  mounted() {
    this.clearMetadata();
  },
  created() {
    this.initializeData();
  },
  components: {
    NavigationBar: NavigationBar,
  },
  data() {
    return {
      auctioningDialogLoading: false,
      dataReady: false,
      isLoading: false,
      offerPrice: 0,
      startOfferTime: 0,
      items: [
        { timeslot: "1 HR", timeVal: 3600 },
        { timeslot: "2 HRS", timeVal: 7200 },
        { timeslot: "5 HRS", timeVal: 18000 },
        { timeslot: "10 HRS", timeVal: 36000 },
        { timeslot: "12 HRS", timeVal: 43200 },
        { timeslot: "24 HRS", timeVal: 86400 },
      ],
    };
  },
  methods: {
    clearMetadata() {
      this.$store.dispatch("modules/profile/CLEAR_CURRENT_NFT_META");
    },
    auctionNFT(nftId, offerPrice, buyPrice, bidDuration) {
      try {
        this.auctioningDialogLoading = true;
        this.isLoading = true;
        let payload = {
          nftId: nftId,
          startPrice: offerPrice,
          buyNowPrice: buyPrice,
          bidDuration: bidDuration,
        };
        this.$store
          .dispatch("modules/profile/CREATE_USER_AUCTION_NFT", payload)
          .then((response) => {
            this.isLoading = false;
            this.auctioningDialogLoading = false;
            this.$router.push("/profile");
          });
      } catch (err) {
        console.log(err);
      }
    },
    initializeData() {
      try {
        let payload = this.$route.params.id;
        this.$store
          .dispatch("modules/profile/GET_NFT_METADATA", payload)
          .then((response) => {
            if (this.curNFTMeta) {
              this.dataReady = true;
            }
          });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
