<template>
  <div id="user-owned">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>My NFT in Auction</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap v-if="userAuctionedList">
              <AssetBoxComponent
                v-for="n in userAuctionedList"
                :key="n._id"
                :assetTitle="n.title"
                :assetDesc="n.description"
                :imageUri="n.tokenUri"
              >
                <template v-slot:asset-options>
                  <v-row>
                    <v-col
                      ><v-btn
                        @click="goToAssetProfile(n.tokenid)"
                        color="primary"
                        block
                      >
                        View
                      </v-btn></v-col
                    >
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
      userAuctionedList: (state) => state.modules.profile.userAuctionedList,
    }),
  },
  mounted() {
    this.initializeData();
  },

  data() {
    return {};
  },
  methods: {
    initializeData() {
      this.$store
        .dispatch("modules/profile/GET_USER_AUCTIONED_NFT")
        .then((response) => {
          console.log("Auctioned  List");
          console.log(response);
        });
    },
    goToAssetProfile(payload) {
      this.$router.push(`/nfts/auctioned/${payload}`);
    },
  },
};
</script>
