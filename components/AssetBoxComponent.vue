<template>
  <div id="itemBoxComponent">
    <v-card class="mx-auto" max-width="250">
      <v-img
        class="white--text align-end"
        height="200px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      >
        <v-card-title>Product Title</v-card-title>
      </v-img>
      <v-card-subtitle class="pb-0"> Price </v-card-subtitle>
      <v-card-text class="text--primary">
        <div>Some Details</div>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col><v-btn color="primary" block> View </v-btn></v-col>
          <v-col><v-btn color="success" block> Buy </v-btn></v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {};
</script>
