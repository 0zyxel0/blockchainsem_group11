<template>
  <div id="item-box-component">
    <v-card class="mx-1" max-width="250">
      <v-img
        :src="imageUri"
        :lazy-src="imageUri"
        aspect-ratio="1"
        contain
        min-height="150"
        mmin-width="250"
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
        <v-card-title>{{ assetTitle }}</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0"> Price </v-card-subtitle>
      <v-card-text class="text--primary">
        <div>Some Details</div>
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
  name: "AssetBoxComponent",
  props: {
    assetTitle: { type: String },
    imageUri: { type: String, required: true },
  },
};
</script>
