<template>
  <div id="nftMeta">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col><h1>NFT Details</h1></v-col>
    </v-row>
    <v-row>
      <v-col>
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
                <v-list-item-title>Title : {{nftDetails.meta.title}}</v-list-item-title>
                <v-list-item-subtitle>
                  {{nftDetails.meta.description}}
                </v-list-item-subtitle>             
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-text>
            <div>Owner : {{ userWalletAddress }}</div>
            <v-btn color="success">Mint</v-btn>
          </v-card-text>
        </v-card>
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
      nftDetails: (state) => state.modules.profile.nftDetails
    }),
  },
  mounted() {
    this.initializeData();
  },
  components: {
    NavigationBar: NavigationBar,
  },
  data() {
    return {};
  },
  methods: {
    initializeData() {
      let payload = this.$route.params.id;
      this.$store.dispatch("modules/profile/GET_NFT_DETAILS", payload);
    },
  },
};
</script>
