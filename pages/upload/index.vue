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
                <v-file-input
                  v-model="imageData"
                  :rules="rules"
                  show-size
                  hint="Recommended Image Size 2MB"
                  accept="image/jpg, image/jpeg, image/png, image/PNG, image/gif"
                  label="Choose your Image"
                />
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
                  <v-col>
                    <v-row
                      ><v-col>
                        <v-card flat>
                          <v-card-title>Options</v-card-title>
                          <v-card-text>
                            <v-row v-if="!uploadedSuccessfully"
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

                                <!-- <v-btn
                                  v-else
                                  block
                                  color="primary"
                                  @click="uploadToPinata(imageData)"
                                  >Upload</v-btn> -->
                              </v-col> </v-row
                            ><v-row v-if="uploadedSuccessfully">
                              <v-col>
                                <v-btn
                                  color="primary"
                                  block
                                  v-if="isMintLoading"
                                >
                                  <v-progress-circular
                                    indeterminate
                                    color="red"
                                  ></v-progress-circular
                                ></v-btn>

                                <v-btn
                                  v-else
                                  block
                                  color="success"
                                  @click="
                                    mintUserNFT(
                                      currentMetadata.id,
                                      currentMetadata.nftUri,
                                      currentMetadata.meta.title,
                                      currentMetadata.meta.description
                                    )
                                  "
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
import { ethers } from "ethers";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const FormData = require("form-data");
import NavigationBar from "@/components/NavigationBar";
import { mapState } from "vuex";
export default {
  components: {
    NavigationBar: NavigationBar,
  },
  middleware: "checkWalletAddress",
  data() {
    return {
      rules: [
        (v) =>
          !v || v.size > 2_097_152 || "Image size should be less than 2 MB",
      ],
      imageData: null,
      isLoading: false,
      isMintLoading: false,
      uploadedSuccessfully: false,
      currentMetadata: {},
      imageUploadDetails: {
        title: null,
        desciption: null,
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
          let payloadVal = {
            title: this.imageUploadDetails.title,
            description: this.imageUploadDetails.description,

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
            this.$toast.success("Successfully Uploaded File");
            this.isLoading = false;
            this.uploadedSuccessfully = true;
            this.currentMetadata = userItem.payload;
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async uploadToPinata(payload) {
      this.isLoading = true;
      let formData = new FormData();
      formData.append("file", payload);
      try {
        let myResults = await this.$axios.$post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.$config.PINATA_IPFS_TOKEN}`,
            },
          }
        );
        if (myResults) {
          let payloadVal = {
            title: this.imageUploadDetails.title,
            description: this.imageUploadDetails.description,
            filename: this.imageData.name,
            ipfsVal: myResults,
            IpfsHash: myResults.ipfsHash,
          };
          console.log("RAW INPUT");
          console.log(payloadVal);
          let app = this;
          let userItem = await this.$axios.$post(
            `/v1/item/pinata/save`,
            payloadVal,
            {
              headers: {
                Authorization: `Bearer ${app.userToken}`,
              },
            }
          );
          if (userItem) {
            console.log("returns");
            console.log(userItem.payload);
            this.$toast.success("Successfully Uploaded File");
            this.isLoading = false;
            this.uploadedSuccessfully = true;
            this.currentMetadata = userItem.payload;
          }
        }
      } catch (err) {
        console.log(err);
        this.$toast.error(err.message);
      }
    },

    async mintUserNFT(nftid, userFileURI, nftTitle, nftDescription) {
      this.isMintLoading = true;
      this.$store
        .dispatch("modules/profile/MINT_USER_ASSET", {
          nftid,
          userFileURI,
          nftTitle,
          nftDescription,
        })
        .then((response) => {
          this.isMintLoading = false;
          this.$router.push("/profile");
        });
    },
  },
};
</script>
