<template>
  <div id="userProfile">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col>
        <h1>Profile Page</h1>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <UserProfileBox
          :displayName="userDisplayName"
          :displayAvatar="userAvatar"
          :walletAddr="userWalletAddress"
        ></UserProfileBox>
      </v-col>
      <v-col cols="8">
        <!-- <v-row>
          <v-col>
            <v-card>
              <v-card-subtitle>Minted Owned</v-card-subtitle>
              <v-card-text></v-card-text> </v-card
          ></v-col>
          <v-col>
            <v-card>
              <v-card-subtitle>NFT Being Sold</v-card-subtitle>
              <v-card-text></v-card-text> </v-card
          ></v-col>
          <v-col>
            <v-card>
              <v-card-subtitle>Not Minted</v-card-subtitle>
              <v-card-text></v-card-text> </v-card
          ></v-col>
          <v-col>
            <v-card>
              <v-card-subtitle>Sold</v-card-subtitle>
              <v-card-text></v-card-text> </v-card
          ></v-col>
        </v-row> -->
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Options</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-btn @click="goToUploader()" x-large block color="success"
                      >Create NFT</v-btn
                    ></v-col
                  >
                  <v-col>
                    <ProfileDisplayNameBox></ProfileDisplayNameBox
                  ></v-col>
                  <v-col
                    ><v-btn x-large block color="error">Change Avatar</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card></v-col
          >
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title
            >Recent Unminted Assets
            <v-spacer></v-spacer>
            <v-btn color="primary">See All</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap v-if="userNFTUnminted.length > 0">
              <AssetBoxComponent
                v-for="n in userNFTUnminted"
                :key="n._id"
                :assetTitle="n.title"
                :imageUri="n.nftUri"
              >
                <template v-slot:asset-options>
                  <v-row>
                    <v-col
                      ><v-btn
                        @click="goToAssetProfile(n._id)"
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

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Minted Assets
            <v-spacer></v-spacer>
            <v-btn color="primary">See All</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
             
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Owned Assets
            <v-spacer></v-spacer>
            <v-btn color="primary">See All</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text></v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title
            >NFT in Marketplace
            <v-spacer></v-spacer>
            <v-btn color="primary">See All</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text></v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from "vuex";
import NavigationBar from "@/components/NavigationBar";
import UserProfileBox from "@/components/UserProfileBox";
import ProfileDisplayNameBox from "@/components/ProfileDisplayNameBox";
import AssetBoxComponent from "@/components/AssetBoxComponent";
export default {
  layout: "default",
  components: {
    NavigationBar: NavigationBar,
    UserProfileBox: UserProfileBox,
    ProfileDisplayNameBox: ProfileDisplayNameBox,
    AssetBoxComponent: AssetBoxComponent,
  },
  middleware: "checkWalletAddress",
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      userAvatar: (state) => state.modules.profile.user.sub.displayImg,
      userDisplayName: (state) => state.modules.profile.user.sub.displayName,
      userTheme: (state) => state.modules.profile.user.sub.isDark,
      userNFTUnminted: (state) => state.modules.profile.userNFTUnminted,
      userNFTMinted: (state) => state.modules.profile.user.userNFTMinted,
    }),
  },
  mounted() {
    this.initializeAssets();
  },
  methods: {
    async initializeAssets() {
      this.$store.dispatch("modules/profile/GET_USER_UNMINTED");
      this.$store.dispatch("modules/profile/GET_USER_MINTED");
    },
    goToAssetProfile(payload) {
      this.$router.push(`/nfts/${payload}`);
      console.log(payload);
    },
    goToUploader() {
      this.$router.push("/upload");
    },
  },
};
</script>
