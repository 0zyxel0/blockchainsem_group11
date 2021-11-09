<template>
  <v-row>
    <v-col
      cols="12"
      lg="7"
      xl="6"
      class="primary d-none d-md-flex align-center justify-center"
    >
      <v-container>
        <div class="pa-10">
          <v-row justify="center">
            <v-col cols="8" xl="5">
              <div>
                <h2 class="display-1 white--text font-weight-medium">
                  Blockchain Seminar - Group 14
                </h2>
                <h6
                  class="subtitle-1 mt-4 white--text op-5 font-weight-regular"
                >
                  Minting NFTs and NFT Marketplace
                </h6>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>

    <v-col cols="12" lg="5" xl="6" class="d-flex align-center">
      <v-container>
        <div class="pa-7 pa-sm-12">
           <v-row justify="center">
            <v-col cols="12" lg="9" xl="6">
              <v-btn @click="loginMetaMask()" x-large>
                <v-avatar size="50px" left class="px-2">
                  <img src="/metamask.svg" />
                </v-avatar>
                Login With MetaMask
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
import { ethers } from "ethers";
import { mapState } from "vuex";
export default {
  layout: "blank",
  computed: {
    showUserWallet() {
      return this.userWalletAddress;
    },
    loginCheckStatus() {
      if (this.metamaskStatus) {
        return "Login with MetaMask";
      } else {
        return "Please Install MetaMask";
      }
    },
  },
  mounted() {
    this.checkMetaMask();
  },
  methods: {
    async checkMetaMask() {
      if (!window.ethereum) {
        alert("Please Install MetaMask Extension");
        return;
      }
    },
    async loginMetaMask() {
      this.$store.dispatch("modules/profile/LOGIN_USER_WALLET");
    },

    logoutMetaMask() {
      this.userWalletAddress = null;
      window.userWalletAddress = null;
      this.metamaskLoggedIn = false;
    },
  },
  data() {
    return {
      metamaskStatus: false,
      metamaskLoggedIn: false,
      userWalletAddress: null,
    };
  },
};
</script>
