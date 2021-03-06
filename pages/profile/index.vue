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
                  <!-- <v-col
                    ><v-btn x-large block color="error">Change Avatar</v-btn>
                  </v-col> -->
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
            <v-btn color="primary" @click="goToAllUnminted()">See All</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap v-if="userRecentNFTUnminted">
              <AssetBoxComponent
                v-for="n in userRecentNFTUnminted"
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

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            My NFTs
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="goToAllOwned()">See All</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap v-if="userOwnedNFT">
              <AssetBoxComponent
                v-for="n in userOwnedNFT"
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

    <v-row>
      <v-col>
        <v-card>
          <v-card-title
            >NFT in Auction
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="goToAllAuctioned()">See All</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap v-if="userAuctionedList">
              <AssetBoxComponent
                v-for="n in userAuctionedList"
                :key="n.auctionid"
                :assetTitle="n.title"
                :assetDesc="n.description"
                :imageUri="n.tokenUri"
              >
                <template v-slot:asset-options>
                  <v-row>
                    <v-col>
                      <v-btn
                        @click="goToAuctionDetails(n.tokenid)"
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
          <v-card-title
            >NFT Winning Bids
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="goToAllNFTClaim()">See All</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row row wrap v-if="userToClaimAuction">
              <AssetBoxComponent
                v-for="n in userToClaimAuction"
                :key="n.auctionid"
                :assetTitle="n.title"
                :assetDesc="n.description"
                :imageUri="n.tokenUri"
              >
                <template v-slot:asset-options>
                  <v-row>
                    <v-col>
                      <v-btn
                        v-if="checkClaimButton(n.auctionEndTime)"
                        @click="goToAllNFTClaim(n.auctionid)"
                        color="primary"
                        block
                        dark
                      >
                        View
                      </v-btn>
                      <v-btn v-else disabled block>ON GOING</v-btn>
                      
                      </v-col
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
import moment from "moment";
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
      userRecentNFTUnminted: (state) =>
        state.modules.profile.userRecentUnminted,
      userOwnedNFT: (state) => state.modules.profile.userOwnedNFT,
      userAuctionedNFT: (state) => state.modules.profile.userNFTInAuction,
      userToClaimAuction: (state) => state.modules.profile.userNFTWonAuction,
      userAuctionedList: (state) => state.modules.profile.userAuctionedList,
    }),
  },
  mounted() {
    this.initializeAssets();
  },
  methods: {
    async initializeAssets() {
      this.$store.dispatch("modules/profile/GET_RECENT_UNMINTED_NFT");
      this.$store.dispatch("modules/profile/GET_USER_OWNED_NFT");
      this.$store
        .dispatch("modules/profile/GET_USER_AUCTIONED_NFT")
        .then((response) => {
          console.log("Auctioned  List")
          console.log(response);
        });
      this.$store.dispatch("modules/profile/GET_USER_WON_AUCTION", {
        userWalletAddr: this.userWalletAddress,
      });
    },
    goToAssetProfile(payload) {
      this.$router.push(`/nfts/owned/view/${payload}`);
    },
    goToUnmintedAsset(payload) {
      this.$router.push(`/nfts/unminted/${payload}`);
    },
    goToUploader() {
      this.$router.push("/upload");
    },
    goToAllUnminted() {
      this.$router.push("/nfts/unminted");
    },
    goToAllOwned() {
      this.$router.push("/nfts/owned");
    },
    goToAllAuctioned() {
      this.$router.push("/nfts/auctioned");
    },
    goToAuctionDetails(payload) {
      console.log(payload);
      this.$router.push(`/nfts/auctioned/${payload}`);
    },
    goToAllNFTClaim(payload) {
    this.$router.push("/nfts/claim");
    },
    checkClaimButton(payload){      
      let auction_time = new Date(payload*1000);     
      let cur_time = new Date();      
      let check = moment(cur_time).isAfter(auction_time);
      console.log("Claim Check");
      console.log(auction_time, cur_time)
      console.log(check);
      return check;
    }
  },
};
</script>
