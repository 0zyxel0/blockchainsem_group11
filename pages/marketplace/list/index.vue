<template>
  <div id="nft-available">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Platform NFTs</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap v-if="availableNFTItems">
              <AssetBoxComponent
                v-for="n in availableNFTItems"
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
      availableNFTItems: (state) => state.modules.marketplace.availableNFTItems,
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
      this.$store.dispatch("modules/marketplace/GET_ALL_MARKETPLACE_ITEMS");
    },
    goToAssetProfile(payload) {
      this.$router.push(`/marketplace/view/${payload}`);
    },
  },
};
</script>
