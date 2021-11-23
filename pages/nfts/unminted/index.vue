<template>
  <div id="user-unminted">
    <NavigationBar></NavigationBar>
     <v-row>
      <v-col> 
        <v-card>
          <v-card-title>My Unminted Items</v-card-title>
          <v-divider></v-divider>
          <v-card-text> NO Unminted Items</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
import NavigationBar from "@/components/NavigationBar";
export default {
  layout: "default",
  components: {
    NavigationBar: NavigationBar
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
