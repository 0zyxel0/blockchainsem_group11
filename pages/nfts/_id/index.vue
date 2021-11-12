<template>
  <div id="nftMeta">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col><h1>NFT Details</h1></v-col>
    </v-row>
    <v-divider> </v-divider>
    <v-row>
      <v-col>
      Details
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
    }),

  },
  mounted() {
  },
  components: {
    NavigationBar: NavigationBar,
  },
  data() {
    return {
    };
  },
  methods: {  
  },
};
</script>
