<template>
  <div id="dashboardPage">
    <h1>Dashboard</h1>
    <NavigationBar></NavigationBar>
    <v-row>
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
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Preview Image</v-card-title>
          <v-card-text>
            <v-img
              max-height="400"
              max-width="600"
              v-if="!imagePreviewUrl"
              src="https://via.placeholder.com/400"
            />
            <v-img max-height="400" max-width="600" :src="imagePreviewUrl" />
          </v-card-text>
        </v-card>

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
            <v-row
              ><v-col
                ><v-btn block color="success">Mint NFT</v-btn></v-col
              ></v-row
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
const FormData = require("form-data");
import NavigationBar from "@/components/NavigationBar";
import Web3 from "web3";
export default {
  layout: "default",
  components: {
    NavigationBarL: NavigationBar,
  },
  computed: {
    imagePreviewUrl() {
      if (!this.imageData) return;
      return URL.createObjectURL(this.imageData);
    },
  },
  data() {
    return {
      imageData: null,
    };
  },
  mounted(){
    this.createWeb3Object();
  },
  methods: {
    createWeb3Object() {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    },
    async uploadFileToIPFS(fileVal) {
      let formData = new FormData();
      formData.append("file", fileVal);

      console.log(formData);
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
          console.log(myResults.data);
        }
      } catch (err) {
        console.log(err);
      }
    },

    // chooseImage() {
    //   this.$refs.fileInput.click();
    // },
    // onFileSelected() {
    //   const input = this.$refs.fileInput;
    //   const files = input.files;
    //   if (files && files[0]) {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //       this.imageData = e.target.result;
    //     };
    //     reader.readAsDataURL(files[0]);
    //     this.$emit("input", files[0]);
    //   }
    // },
  },
};
</script>
