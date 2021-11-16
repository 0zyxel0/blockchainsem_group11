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
              :src="nftDetails.nftUri"
            />
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title
                  >Title : {{ nftDetails.meta.title }}</v-list-item-title
                >
                <v-list-item-subtitle>
                  {{ nftDetails.meta.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-card-title>Owner : {{ userWalletAddress }}</v-card-title>
          <v-card-actions>
            <v-btn
              color="success"
              block
              @click="mintUserNFT(nftDetails._id, nftDetails.nftUri)"
              >Mint NFT</v-btn
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
      nftDetails: (state) => state.modules.profile.nftDetails,
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
    };
  },
  methods: {
    clearMetadata() {
      this.$store.dispatch("modules/profile/CLEAR_CURRENT_NFT_META");
    },
    mintUserNFT(nftid, tokenUri) {
      console.log(nftid, tokenUri);
      this.$store
        .dispatch("modules/profile/MINT_USER_ASSET", {
          nftid: nftid,
          userFileURI: tokenUri,
        })
        .then((response) => {
          this.$router.push("/profile");
        });
    },
    initializeData() {
      try {
        let payload = this.$route.params.id;
        this.$store
          .dispatch("modules/profile/GET_NFT_DETAILS", payload)
          .then((response) => {
            if (this.nftDetails) {
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
