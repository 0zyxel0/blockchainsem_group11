<template>
  <div id="item-box-component">
    <v-card class="mx-1 my-1" min-height="250" max-width="250">
      <v-img
        :src="imageUri"
        :lazy-src="imageUri"
        aspect-ratio="1"
        contain
        min-height="150"
        min-width="250"
        max-height="150"
        max-width="250"
        class="grey lighten-2"
      >
        <template v-slot:placeholder>
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </template>
      </v-img>

  
        <v-card-title  class="justify-center"> {{ assetTitle }} </v-card-title>
   
      <v-card-actions>
        <v-col>
          <slot name="asset-options">
            <v-btn color="primary" block> Button </v-btn>
            <v-btn color="success" block> Button </v-btn>
          </slot>
        </v-col>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "AssetBoxComponent",
  props: {
    assetTitle: { type: String },
    assetDesc: { type: String },
    imageUri: { type: String, required: true },
  },
  methods: {
    likeNFT(tokenid) {
      try {
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
