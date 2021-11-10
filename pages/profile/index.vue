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
              <v-card-subtitle>NFT Owned</v-card-subtitle>
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
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Options</v-card-title>
              <v-card-text>
                <v-btn @click="goToUploader()" x-large>Create NFT</v-btn>
                <v-btn x-large>Change Name</v-btn>
                <v-btn x-large>Change Avatar</v-btn>
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
            >Unminted Assets
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
          <v-card-title>
            Owned NFT
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

    <v-row>
      <v-col>
        <v-card>
          <v-card-title
            >NFT Sold
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
export default {
  layout: "default",
  components: {
    NavigationBar: NavigationBar,
    UserProfileBox: UserProfileBox,
  },
  middleware: "checkWalletAddress",
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      userAvatar: (state) => state.modules.profile.user.sub.displayImg,
      userDisplayName: (state) => state.modules.profile.user.sub.displayName,
      userTheme: (state) => state.modules.profile.user.sub.isDark,
    }),
  },
  mounted() {
  },
  methods: {
    async initializeAssets() {

    },
    goToUploader() {
      this.$router.push("/upload");
    },

  },
};
</script>
