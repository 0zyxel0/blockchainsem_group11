<template>
  <div id="upload-page">
    <NavigationBar></NavigationBar>
    <v-row>
      <v-col>
        <v-row
          ><v-col
            ><v-card>
              <v-card-title>Preview Image</v-card-title>
              <v-card-text>
                <v-img
                  max-height="400"
                  max-width="600"
                  v-if="!imagePreviewUrl"
                  src="https://via.placeholder.com/400x600"
                />
                <v-img
                  max-height="400"
                  max-width="600"
                  :src="imagePreviewUrl"
                />
              </v-card-text> </v-card></v-col
        ></v-row>
        <v-row
          ><v-col>
            <v-card>
              <v-card-title>Options</v-card-title>
              <v-card-text>
                <v-row
                  ><v-col
                    ><v-btn
                      block
                      color="primary"
                      @click="uploadFileToIPFS(imageData)"
                      >Upload</v-btn
                    ></v-col
                  ></v-row
                >
              </v-card-text>
            </v-card></v-col
          ></v-row
        >
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Create an NFT</v-card-title>
              <v-card-text>
                <v-file-input v-model="imageData" label="Choose your Image" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>NFT Details</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Title</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Description</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Amount To Sell</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn block color="success" @click="getCurrentAccount()"
                      >Get Account</v-btn
                    >
                    <v-btn block color="success" @click="minfUserNFT()"
                      >Mint NFT</v-btn
                    ></v-col
                  ></v-row
                >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
var Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
const FormData = require("form-data");
const Contract = require("web3-eth-contract");
const NFTMinterABI = require("../../build/contracts/NFTFactory.json");
import NavigationBar from "@/components/NavigationBar";
import { mapState } from "vuex";
export default {
  components: {
    NavigationBar: NavigationBar,
  },
  data() {
    return {
      imageData: null,
    };
  },
  computed: {
    imagePreviewUrl() {
      if (!this.imageData) return;
      return URL.createObjectURL(this.imageData);
    },
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
    }),
  },
  methods: {
    async uploadFileToIPFS(payload) {
      let formData = new FormData();
      formData.append("file", payload);
      try {
        let myResults = await this.$axios.$post(
          "https://api.nft.storage/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.$config.nftTokenKey}`,
            },
          }
        );
        if (myResults) {
          // Save State
          // Save To Temporary Database
          // Remove When Minted
          console.log(myResults.data);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getCurrentAccount() {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log(`User Address ${accounts[0]}`);
      return accounts[0];
    },
    async minfUserNFT() {

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log(`Calling Contract`);
      let mintContract = new Contract(NFTMinterABI.abi,"0x3cD64490d27306F758d70D75c19394e598F5C746");
      
      mintContract.setProvider(web3.currentProvider);
      console.log(mintContract);
      mintContract.methods
        .createToken("tdbtgdfgbdgfbb")
        .send({ from: accounts[0] })
        .then((response) => {
          console.log(response);
        });
    },
  },
};
</script>
