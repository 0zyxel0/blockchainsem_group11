<template>
  <div id="user-owned">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col> 
        <v-card>
          <v-card-title>My NFTs</v-card-title>
          <v-divider></v-divider>
          <v-card-text> NO NFTs</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
import NavigationBar from "@/components/NavigationBar";
import AssetBoxComponent from "@/components/AssetBoxComponent";
export default {
  layout: "default",
  components: {
    NavigationBar: NavigationBar,
    AssetBoxComponent:AssetBoxComponent
  },
  middleware: "checkWalletAddress",
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      biddingNFTAction: (state) => state.modules.marketplace.biddingNFTAction,
    }),
  },
  mounted() {
  },
  
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
