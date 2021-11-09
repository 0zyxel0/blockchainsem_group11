<template>
  <div id="marketPlace">
    <NavigationBar
      v-if="userWalletAddress"
      :userWalletAddress="userWalletAddress"
    ></NavigationBar>
    <v-row>
      <v-col><h1>Marketplace</h1></v-col>
    </v-row>
    <v-divider> </v-divider>
    <v-row>
      <v-col>Current Block Count : {{ latestBlock }}</v-col>
    </v-row>
    <v-row>
      <v-col>
        <AssetBoxComponent></AssetBoxComponent>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { mapState } from "vuex";
import NavigationBar from "@/components/NavigationBar";
import AssetBoxComponent from "@/components/AssetBoxComponent";
const provider = new ethers.providers.Web3Provider(window.ethereum);
export default {
  layout: "default",
  middleware: "checkWalletAddress",
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
    }),

    latestBlock() {
      return this.curBlockCount;
    },
  },
  mounted() {
    this.getBlockCount();
  },
  components: {
    NavigationBar: NavigationBar,
    AssetBoxComponent: AssetBoxComponent,
  },
  data() {
    return {
      curBlockCount: 0,
    };
  },
  methods: {
    async getBlockCount() {
      let currentBlock = await provider.getBlockNumber();
      if (currentBlock) {
        this.curBlockCount = currentBlock;
      }
    },
  },
};
</script>
