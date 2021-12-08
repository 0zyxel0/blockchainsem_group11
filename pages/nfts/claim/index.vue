<template>
  <div id="user-claming">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col>
        <v-dialog
          v-model="claimDialogLoading"
          hide-overlay
          persistent
          width="300"
        >
          <v-card color="primary" dark>
            <v-card-text>
              <h3>Processing NFT Claim</h3>
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-card>
          <v-card-title>NFTs For Claiming</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap v-if="userNFTWonAuction">
              <AssetBoxComponent
                v-for="n in userNFTWonAuction"
                :key="n._id"
                :assetTitle="n.title"
                :assetDesc="n.description"
                :imageUri="n.tokenUri"
              >
                <template v-slot:asset-options>
                  <v-row>
                    <v-col>
                      <v-btn
                        v-if="checkClaimButton(n.auctionEndTime)"
                        @click="claimNftAsset(n.auctionid)"
                        color="success"
                        block
                        dark
                      >
                        Claim
                      </v-btn>
                      <v-btn v-else disabled block>ON GOING</v-btn>
                    </v-col>
                  </v-row>
                </template>
              </AssetBoxComponent>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import moment from "moment";
import { mapState } from "vuex";
import NavigationBar from "@/components/NavigationBar";
import AssetBoxComponent from "@/components/AssetBoxComponent";
export default {
  layout: "default",
  components: {
    NavigationBar: NavigationBar,
    AssetBoxComponent: AssetBoxComponent,
  },
  middleware: "checkWalletAddress",
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      userNFTWonAuction: (state) => state.modules.profile.userNFTWonAuction,
    }),
  },
  mounted() {
    this.initializeData();
  },

  data() {
    return {
      claimDialogLoading: false,
    };
  },
  methods: {
    initializeData() {
      this.$store.dispatch("modules/profile/GET_USER_WON_AUCTION", {
        userWalletAddr: this.userWalletAddress,
      });
    },
    claimNftAsset(payload) {
      this.claimDialogLoading = true;
      this.$store
        .dispatch("modules/profile/CLAIM_WINNING_AUCTIONED_NFT", {
          auctionid: payload,
        })
        .then(() => {
          this.claimDialogLoading = false;
          this.$toast.success("Successfully Claimed NFT");
          this.$router.push("/profile");
        });
    },
    checkClaimButton(payload) {
      let auction_time = new Date(payload * 1000);
      let cur_time = new Date();
      let check = moment(cur_time).isAfter(auction_time);
      console.log("Claim Check");
      console.log(auction_time, cur_time);
      console.log(check);
      return check;
    },
  },
};
</script>
