<template>
  <div id="userProfile">
    <NavigationBar
      v-if="userWalletAddress"
      :userWalletAddress="userWalletAddress"
    ></NavigationBar>
    <v-row>
      <v-col>
        <h1>Profile Page</h1>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col>
        <v-card max-width="400" tile>
          <v-img
            height="100%"
            src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
          >
            <v-row align="end" class="fill-height">
              <v-col align-self="start" class="pa-0" cols="12">
                <v-avatar class="profile" color="grey" size="164" tile>
                  <v-img
                    src="https://avatars.dicebear.com/api/adventurer-neutral/your-custom-seed.svg"
                  ></v-img>
                </v-avatar>
              </v-col>
              <v-col class="py-0">
                <v-list-item color="rgba(0, 0, 0, .4)" dark>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      User ID : {{ userWalletAddress }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      >Available ETH :
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Options</v-card-title>
          <v-card-text>
            <v-btn @click="goToUploader()">Create NFT</v-btn>
          </v-card-text>
        </v-card>
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
  components: {
    NavigationBar: NavigationBar,
  },
  middleware: "checkWalletAddress",
  computed: {
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
    }),
  },
  mounted() {},
  methods: {
    async initializeConnection() {},
    goToUploader() {
      this.$router.push("/upload");
    },
  },
};
</script>
