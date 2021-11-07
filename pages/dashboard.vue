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
import NavigationBar from "@/components/NavigationBar";
export default {
  components: {
    NavigationBar,
  },

  data() {
    return {
      imageData: null,
    };
  },
  mounted(){
  },
  methods: {

  },
};
</script>
