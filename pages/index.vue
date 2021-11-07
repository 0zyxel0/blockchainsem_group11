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
      <v-card flat>
        <v-card-text>
          <v-btn @click="loginMetaMask()" x-large>
            <v-avatar size="50px" left class="px-2">
              <img src="/metamask.svg" />
            </v-avatar>
            Login With MetaMask
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
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
    checkMetaMask() {
      if (typeof window.ethereum !== "undefined") {        
        return;
      } else {
        alert("Please Install MetaMask Extension");
      }
    },
    async loginMetaMask() {
      this.$store.dispatch("modules/profile/GET_USER_WALLETADDRESS");     

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
