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
                <v-row>
                  <v-col>
                    <v-img
                      max-height="400"
                      max-width="800"
                      v-if="!imagePreviewUrl"
                      contain
                      src="https://via.placeholder.com/800x400"
                    />
                    <v-img
                      max-height="400"
                      max-width="800"
                      contain
                      :src="imagePreviewUrl"
                    /> </v-col
                ></v-row>
              </v-card-text> </v-card></v-col
        ></v-row>
        <v-row v-if="uploadedSuccessfully">
          <v-col>
            <v-card>
              <v-card-subtitle>Metadata To Be Minted</v-card-subtitle>
              <v-card-text>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title
                      >Title :
                      {{ currentMetadata.meta.title }}</v-list-item-title
                    >
                    <v-list-item-subtitle>
                      Description : {{ currentMetadata.meta.description }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      File URI : {{ currentMetadata.nftUri }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
                    <v-text-field
                      v-model="imageUploadDetails.title"
                      :rules="titleRules"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Description</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      :rules="descriptionRules"
                      v-model="imageUploadDetails.description"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-subheader>Price To Sell</v-subheader>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      v-model="imageUploadDetails.price"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-row
                      ><v-col>
                        <v-card flat>
                          <v-card-title>Options</v-card-title>
                          <v-card-text>
                            <v-row
                              ><v-col>
                                <v-btn color="primary" block v-if="isLoading">
                                  <v-progress-circular
                                    indeterminate
                                    color="red"
                                  ></v-progress-circular
                                ></v-btn>

                                <v-btn
                                  v-else
                                  block
                                  color="primary"
                                  @click="uploadFileToIPFS(imageData)"
                                  >Upload</v-btn
                                >
                              </v-col> </v-row
                            ><v-row v-if="uploadedSuccessfully">
                              <v-col>
                                <v-btn
                                  block
                                  color="success"
                                  @click="minfUserNFT()"
                                  >Mint NFT</v-btn
                                ></v-col
                              ></v-row
                            >
                          </v-card-text>
                        </v-card></v-col
                      ></v-row
                    >
                  </v-col></v-row
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
const FormData = require("form-data");
const Contract = require("web3-eth-contract");
const NFTMinterABI = require("../../build/contracts/NFTFactory.json");
import NavigationBar from "@/components/NavigationBar";
import { mapState } from "vuex";
export default {
  components: {
    NavigationBar: NavigationBar,
  },
  middleware: "checkWalletAddress",
  data() {
    return {
      imageData: null,
      isLoading: false,
      uploadedSuccessfully: false,
      currentMetadata: {},
      imageUploadDetails: {
        title: null,
        desciption: null,
        price: 0,
      },
      titleRules: [(v) => !!v || "Title is required"],
      descriptionRules: [(v) => !!v || "Description is required"],
    };
  },
  computed: {
    imagePreviewUrl() {
      if (!this.imageData) return;
      return URL.createObjectURL(this.imageData);
    },
    ...mapState({
      userWalletAddress: (state) => state.modules.profile.userWalletAddress,
      userToken: (state) => state.modules.profile.token,
    }),
  },
  methods: {
    async uploadFileToIPFS(payload) {
      this.isLoading = true;
      let formData = new FormData();
      formData.append("file", payload);
      try {
        let myResults = await this.$axios.$post(
          "https://api.nft.storage/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.$config.NTF_IPFS_TOKEN}`,
            },
          }
        );
        if (myResults) {
          console.log("IPFS upload completed");
          let payloadVal = {
            title: this.imageUploadDetails.title,
            description: this.imageUploadDetails.description,
            price: this.imageUploadDetails.price,
            filename: this.imageData.name,
            ipfsVal: myResults,
          };
          let app = this;
          let userItem = await this.$axios.$post(
            `/api/v1/item/save`,
            payloadVal,
            {
              headers: {
                Authorization: `Bearer ${app.userToken}`,
              },
            }
          );
          if (userItem) {
            console.log(userItem);
            this.$toast.success("Successfully Uploaded File").goAway(2000);
            this.isLoading = false;
            this.uploadedSuccessfully = true;
            this.currentMetadata = userItem.payload;
          }
          // Save State
          // Save To Temporary Database
          // Remove When Minted
        }
      } catch (err) {
        console.log(err);
      }
    },
    async mintUserNFT(userFileURI) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log(`Calling Contract`);
      let mintContract = new Contract(
        NFTMinterABI.abi,
        toString(this.$config.NTF_IPFS_TOKEN)
      );

      mintContract.setProvider(web3.currentProvider);
      console.log(mintContract);
      mintContract.methods
        .mintToken(userFileURI)
        .send({ from: accounts[0] })
        .then((response) => {
          console.log(response);
        });
    },
  },
};
</script>
