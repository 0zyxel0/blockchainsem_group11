<template>
  <div id="item-box-component">
    <v-card class="mx-1" max-width="400">
      <v-img
        :src="imageUri"
        :lazy-src="imageUri"
        aspect-ratio="1"
        contain
        max-height="200"
        max-width="400"
        class="grey lighten-2"
      >
        <template v-slot:placeholder>
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </template>
        <v-card-title>{{ assetTitle }}</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0"> Last Bid Price </v-card-subtitle>
      <v-card-text class="text--primary">
        <div>NFT Description</div>
      </v-card-text>
      <v-card-actions>
        <slot name="asset-options">
          <v-row>
            <v-col><v-btn color="primary" block> Button </v-btn></v-col>
            <v-col><v-btn color="success" block> Button </v-btn></v-col>
          </v-row>
        </slot>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "AuctionItemComponent",
  props: {
    assetTitle: { type: String },
    imageUri: { type: String, required: true },
  },
};
</script>
