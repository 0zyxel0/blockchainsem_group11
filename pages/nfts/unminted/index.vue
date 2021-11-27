<template>
  <div id="user-unminted">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>My Unminted Items</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <AssetBoxComponent
                v-for="n in userNFTUnminted"
                :key="n._id"
                :assetTitle="n.meta.title"
                :assetDesc="n.meta.description"
                :imageUri="n.nftUri"
              >
                <template v-slot:asset-options>
                  <v-row>
                    <v-col
                      ><v-btn
                        @click="goToUnmintedAsset(n._id)"
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
  components: {
    NavigationBar: NavigationBar,
    AssetBoxComponent: AssetBoxComponent,
  },
  middleware: "checkWalletAddress",
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      userNFTUnminted: (state) => state.modules.profile.userNFTUnminted,
    }),
  },
  mounted() {
    this.getUnmintedItems();
  },
  data() {
    return {};
  },
  methods: {
    getUnmintedItems() {
      this.$store.dispatch("modules/profile/GET_ALL_UNMINTED_NFT");
    },
    goToUnmintedAsset(payload) {
      this.$router.push(`/nfts/unminted/${payload}`);
    },
  },
};
</script>
