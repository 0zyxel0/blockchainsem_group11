<template>
  <div id="marketplace-nft">
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
            <v-card-actions>
              <v-btn block>Add More Likes</v-btn>
            </v-card-actions>
          </v-card-text>
          
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Details</v-card-title>

              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Title</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-subheader>{{ curNFTMeta.title }}</v-subheader>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Description</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-subheader>{{ curNFTMeta.description }}</v-subheader>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Likes Count</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-subheader>{{ curNFTMeta.likes }}</v-subheader>
                  </v-col>
                  <v-divider></v-divider>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <v-card-title>
                  <v-row>
                    <v-col>Comments</v-col>
                    <v-spacer></v-spacer>
                    <v-col align="right"><v-btn color="primary">Add Comment</v-btn></v-col>
                  </v-row>
                </v-card-title>
                <v-divider></v-divider>
              </v-card-text>
              
            </v-card>
          </v-col>
        </v-row>
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
    auctionNFT(nftId, offerPrice, bidDuration) {
      try {
        this.isLoading = true;
        let payload = {
          nftId: nftId,
          startPrice: parseInt(offerPrice),
          bidDuration: bidDuration,
        };
        this.$store
          .dispatch("modules/profile/CREATE_USER_AUCTION_NFT", payload)
          .then((response) => {
            this.isLoading = false;
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
